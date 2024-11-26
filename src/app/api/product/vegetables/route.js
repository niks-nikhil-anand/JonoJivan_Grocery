import connectDB from "@/lib/dbConnect";
import productModels from "@/models/productModels";
import { NextResponse } from "next/server";


export const GET = async () => {
  try {
    await connectDB();

    // Fetch products where isOnSale is true
    const onSaleProducts = await productModels.find({ isOnSale: true });

    if (onSaleProducts.length === 0) {
      return NextResponse.json({ msg: "No products on sale found." }, { status: 404 });
    }

    return NextResponse.json({ products: onSaleProducts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching on-sale products:", error);
    return NextResponse.json({ msg: "Error fetching products", error: error.message }, { status: 500 });
  }
};
