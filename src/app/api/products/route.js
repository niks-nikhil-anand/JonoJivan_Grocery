import { NextResponse } from "next/server";
import { parseShopParams, queryProducts } from "@/lib/productQuery";

// Public storefront product list: /api/products?page=&limit=&sort=&q=&category=&price=&onSale=1&inStock=1
export const dynamic = "force-dynamic";

export const GET = async (req) => {
  const params = parseShopParams(new URL(req.url).searchParams);
  const result = await queryProducts(params);
  return NextResponse.json(result, { status: result.error ? 500 : 200 });
};
