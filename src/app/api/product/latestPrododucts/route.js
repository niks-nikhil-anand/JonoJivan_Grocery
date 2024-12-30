import connectDB from "@/lib/dbConnect";
import productModels from "@/models/productModels";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();

    // Fetch the latest added products
    const latestProducts = await productModels.find().sort({ createdAt: -1 }).limit(10);

    if (latestProducts.length === 0) {
      return NextResponse.json({ msg: "No products found." }, { status: 404 });
    }

    return NextResponse.json({ products: latestProducts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching latest products:", error);
    return NextResponse.json({ msg: "Error fetching products", error: error.message }, { status: 500 });
  }
};
