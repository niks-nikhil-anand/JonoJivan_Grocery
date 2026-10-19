import ShopView from "@/components/shop/ShopView";
import { listCategories, parseShopParams, queryProducts } from "@/lib/productQuery";

export const metadata = {
  title: "Shop All Products — Groceries & Daily Needs | JonoJivan",
  description:
    "Browse fruits, vegetables, staples and daily household needs at JonoJivan. Filter by category, price and offers, and order with cash on delivery or secure online payment.",
  alternates: { canonical: "/product/shopAllProducts" },
};

// Filters live in the URL (?q=&category=&price=&onSale=1&inStock=1&sort=&page=),
// so results are rendered on the server and every view is shareable.
export default async function ShopAllProductsPage({ searchParams }) {
  const params = parseShopParams(searchParams || {});
  const [result, categories] = await Promise.all([queryProducts(params), listCategories()]);
  return <ShopView result={result} categories={categories} params={params} />;
}
