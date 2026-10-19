import { NextResponse } from "next/server";
import { productsByIds } from "@/lib/productQuery";

// Public: fetch several products at once (used by the cart). Body: { ids: string[] }
export const POST = async (req) => {
  try {
    const body = await req.json().catch(() => ({}));
    const ids = Array.isArray(body?.ids) ? body.ids.map(String) : [];
    const products = await productsByIds(ids);
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("[api/products/by-ids]", error?.message || error);
    return NextResponse.json({ msg: "Could not load products" }, { status: 500 });
  }
};
