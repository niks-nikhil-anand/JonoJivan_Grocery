// Server-side data for the homepage.
// Fetched directly from MongoDB inside the Server Component so the HTML ships
// with real content (no client spinners, better SEO and LCP).
// Every function fails soft: if the DB is unreachable the section just hides.
import connectDB from "@/lib/dbConnect";
import productModels from "@/models/productModels";
import categoryModels from "@/models/categoryModels";

const PRODUCT_FIELDS =
  "name salePrice originalPrice featuredImage weight status isOnSale isHotDeal isFeaturedSale ratings createdAt";

// Hide products the admin has switched off.
const VISIBLE = { status: { $nin: ["Inactive"] } };

const toPlain = (docs) => JSON.parse(JSON.stringify(docs));

async function safe(label, fn) {
  try {
    await connectDB();
    return toPlain(await fn());
  } catch (error) {
    console.error(`[homeData] ${label} failed:`, error?.message || error);
    return [];
  }
}

export function getCategories() {
  return safe("categories", () =>
    categoryModels.find({}, "name image").sort({ createdAt: 1 }).limit(12).lean()
  );
}

export function getDeals(limit = 10) {
  return safe("deals", () =>
    productModels
      .find({ ...VISIBLE, $or: [{ isOnSale: true }, { isHotDeal: true }] }, PRODUCT_FIELDS)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean()
  );
}

export function getJustAdded(limit = 10) {
  return safe("justAdded", () =>
    productModels.find(VISIBLE, PRODUCT_FIELDS).sort({ createdAt: -1 }).limit(limit).lean()
  );
}
