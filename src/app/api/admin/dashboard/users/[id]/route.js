import connectDB from "@/lib/dbConnect";
import productModels from "@/models/productModels";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { id } = params;
  

  if (!id) {
    return NextResponse.json({ msg: "ID parameter is required" }, { status: 400 });
  }

  try {
    await connectDB();

    const product = await productModels.findById(id);
    console.log(product)
    
    if (!product) {
      return NextResponse.json({ msg: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ msg: "Error fetching product", error: error.message }, { status: 500 });
  }
};
