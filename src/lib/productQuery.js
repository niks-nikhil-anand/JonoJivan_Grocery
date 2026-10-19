// Public, read-only product queries for the storefront.
// Used by the shop page (server component) and the public /api/products routes.
// Only returns fields a shopper needs — never user data.
import mongoose from "mongoose";
import connectDB from "@/lib/dbConnect";
import productModels from "@/models/productModels";
import categoryModels from "@/models/categoryModels";
import { PAGE_SIZE, PRICE_RANGES } from "@/lib/shopOptions";

export const PUBLIC_FIELDS = {
  name: 1,
  salePrice: 1,
  originalPrice: 1,
  featuredImage: 1,
  weight: 1,
  status: 1,
  isOnSale: 1,
  isHotDeal: 1,
  category: 1,
  ratings: 1,
  createdAt: 1,
};

export { PAGE_SIZE, PRICE_RANGES };

const SORT_STAGES = {
  newest: { createdAt: -1 },
  "price-asc": { salePrice: 1, createdAt: -1 },
  "price-desc": { salePrice: -1, createdAt: -1 },
  discount: { discountPct: -1, createdAt: -1 },
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const toPlain = (v) => JSON.parse(JSON.stringify(v));

/** Normalise raw search params (strings) into a safe filter object. */
export function parseShopParams(sp = {}) {
  const get = (k) => (typeof sp.get === "function" ? sp.get(k) : sp[k]) ?? "";
  const page = Math.max(1, parseInt(get("page"), 10) || 1);
  const limit = Math.min(48, Math.max(1, parseInt(get("limit"), 10) || PAGE_SIZE));
  const sort = SORT_STAGES[get("sort")] ? get("sort") : "newest";
  const q = String(get("q")).trim().slice(0, 60);
  const category = mongoose.isValidObjectId(get("category")) ? String(get("category")) : "";
  const price = PRICE_RANGES.some((r) => r.id === get("price")) ? String(get("price")) : "";
  const onSale = get("onSale") === "1";
  const inStock = get("inStock") === "1";
  return { page, limit, sort, q, category, price, onSale, inStock };
}

function buildMatch({ q, category, price, onSale, inStock }) {
  const match = { status: { $nin: ["Inactive"] } };
  if (inStock) match.status = { $nin: ["Inactive", "Out of stock"] };
  if (category) match.category = new mongoose.Types.ObjectId(category);
  if (onSale) match.$or = [{ isOnSale: true }, { isHotDeal: true }, { $expr: { $gt: ["$originalPrice", "$salePrice"] } }];
  if (q) {
    const rx = new RegExp(escapeRegex(q), "i");
    const textOr = [{ name: rx }, { tags: rx }];
    match.$and = [...(match.$and || []), { $or: textOr }];
  }
  if (price) {
    const r = PRICE_RANGES.find((x) => x.id === price);
    match.salePrice = r.max == null ? { $gte: r.min } : { $gte: r.min, $lt: r.max };
  }
  return match;
}

/** Aggregation pipeline for a shop query (exported for testing). */
export function buildPipeline(params) {
  const { page, limit, sort } = params;
  return [
      { $match: buildMatch(params) },
      {
        $addFields: {
          discountPct: {
            $cond: [
              { $gt: ["$originalPrice", 0] },
              { $divide: [{ $subtract: ["$originalPrice", "$salePrice"] }, "$originalPrice"] },
              0,
            ],
          },
        },
      },
      { $sort: SORT_STAGES[sort] },
      {
        $facet: {
          items: [{ $skip: (page - 1) * limit }, { $limit: limit }, { $project: PUBLIC_FIELDS }],
          total: [{ $count: "n" }],
        },
      },
  ];
}

/** Paginated, filtered, sorted product list. Never throws; returns an empty result on failure. */
export async function queryProducts(params) {
  const { page, limit } = params;
  try {
    await connectDB();
    const [result] = await productModels.aggregate(buildPipeline(params));
    const total = result?.total?.[0]?.n || 0;
    return { products: toPlain(result?.items || []), total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
  } catch (error) {
    console.error("[productQuery] queryProducts failed:", error?.message || error);
    return { products: [], total: 0, page, limit, totalPages: 1, error: true };
  }
}

/** Products by id, in the order requested. Missing ids are simply absent. */
export async function productsByIds(ids = []) {
  const valid = [...new Set(ids)].filter((id) => mongoose.isValidObjectId(id)).slice(0, 100);
  if (!valid.length) return [];
  await connectDB();
  const docs = await productModels.find({ _id: { $in: valid } }, PUBLIC_FIELDS).lean();
  return toPlain(docs);
}

export async function listCategories() {
  try {
    await connectDB();
    return toPlain(await categoryModels.find({}, "name image").sort({ createdAt: 1 }).lean());
  } catch (error) {
    console.error("[productQuery] listCategories failed:", error?.message || error);
    return [];
  }
}
