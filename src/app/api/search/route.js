import prisma from "@/lib/prisma";
import { present } from "@/lib/prismaModel";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const words = (new URL(request.url).searchParams.get("query") || "").trim().slice(0, 120).split(/\s+/).filter(Boolean);
  if (!words.length) return NextResponse.json([]);
  try {
    const clauses = words.map(word => ({ name: { contains: word, mode: "insensitive" } }));
    const products = await prisma.product.findMany({
      where: { OR: [{ AND: clauses }, { tags: { hasSome: words } }] },
      take: 100,
    });
    return NextResponse.json(products.map(product => present("Product", product)));
  } catch (error) {
    console.error("Error searching products:", error.message);
    return NextResponse.json({ msg: "Error fetching products" }, { status: 500 });
  }
}
