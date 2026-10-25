// Public storefront queries backed by Neon PostgreSQL.
import prisma from "@/lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { present } from "@/lib/prismaModel";
import { PAGE_SIZE, PRICE_RANGES } from "@/lib/shopOptions";

export { PAGE_SIZE, PRICE_RANGES };
const SORTS = { newest: { createdAt: "desc" }, "price-asc": { salePrice: "asc" }, "price-desc": { salePrice: "desc" }, discount: { createdAt: "desc" } };
const validId = value => typeof value === "string" && /^[a-zA-Z0-9_-]{1,128}$/.test(value);
export function parseShopParams(sp = {}) {
  const get = k => (typeof sp.get === "function" ? sp.get(k) : sp[k]) ?? "";
  return {
    page: Math.max(1, parseInt(get("page"), 10) || 1),
    limit: Math.min(48, Math.max(1, parseInt(get("limit"), 10) || PAGE_SIZE)),
    sort: Object.hasOwn(SORTS, get("sort")) ? get("sort") : "newest",
    q: String(get("q")).trim().slice(0, 60),
    category: validId(get("category")) ? get("category") : "",
    price: PRICE_RANGES.some(r => r.id === get("price")) ? get("price") : "",
    onSale: get("onSale") === "1", inStock: get("inStock") === "1",
  };
}
export function buildWhere({ q, category, price, onSale, inStock }) {
  const where = { status: { notIn: inStock ? ["INACTIVE", "OUT_OF_STOCK"] : ["INACTIVE"] } };
  if (category) where.categoryId = category;
  if (q) where.AND = [{ OR: [{ name: { contains: q, mode: "insensitive" } }, { tags: { has: q } }] }];
  if (onSale) where.OR = [{ isOnSale: true }, { isHotDeal: true }, { originalPrice: { gt: prisma.product.fields.salePrice } }];
  const range = PRICE_RANGES.find(r => r.id === price);
  if (range) where.salePrice = { gte: range.min, ...(range.max == null ? {} : { lt: range.max }) };
  return where;
}
export async function queryProducts(params) {
  const { page, limit } = params;
  try {
    const where = buildWhere(params);
    const total = await prisma.product.count({ where });
    let rows;
    if (params.sort === "discount") {
      const conditions = [Prisma.sql`"status" <> 'INACTIVE'`];
      if (params.inStock) conditions.push(Prisma.sql`"status" <> 'OUT_OF_STOCK'`);
      if (params.category) conditions.push(Prisma.sql`"categoryId" = ${params.category}`);
      if (params.q) conditions.push(Prisma.sql`(strpos(lower("name"), lower(${params.q})) > 0 OR ${params.q} = ANY("tags"))`);
      if (params.onSale) conditions.push(Prisma.sql`("isOnSale" OR "isHotDeal" OR "originalPrice" > "salePrice")`);
      const range = PRICE_RANGES.find(r => r.id === params.price);
      if (range) { conditions.push(Prisma.sql`"salePrice" >= ${range.min}`); if (range.max != null) conditions.push(Prisma.sql`"salePrice" < ${range.max}`); }
      rows = await prisma.$queryRaw(Prisma.sql`SELECT * FROM "Product" WHERE ${Prisma.join(conditions, " AND ")} ORDER BY CASE WHEN "originalPrice" > 0 THEN ("originalPrice" - "salePrice") / "originalPrice" ELSE 0 END DESC, "createdAt" DESC, "id" ASC LIMIT ${limit} OFFSET ${(page - 1) * limit}`);
    } else rows = await prisma.product.findMany({ where, orderBy: [SORTS[params.sort] || SORTS.newest, { id: "asc" }], skip: (page - 1) * limit, take: limit });
    return { products: rows.map(row => present("Product", row)), total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
  } catch (error) {
    console.error("[productQuery] queryProducts failed:", error?.message || error);
    return { products: [], total: 0, page, limit, totalPages: 1, error: true };
  }
}
export async function productsByIds(ids = []) {
  const valid = [...new Set(ids)].filter(validId).slice(0, 100);
  if (!valid.length) return [];
  const rows = await prisma.product.findMany({ where: { id: { in: valid } } });
  const byId = new Map(rows.map(row => [row.id, present("Product", row)]));
  return valid.map(id => byId.get(id)).filter(Boolean);
}
export async function listCategories() {
  try { return (await prisma.category.findMany({ orderBy: { createdAt: "asc" } })).map(row => present("Category", row)); }
  catch (error) { console.error("[productQuery] listCategories failed:", error?.message || error); return []; }
}
