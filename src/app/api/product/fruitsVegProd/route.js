import connectDB from "@/lib/dbConnect";
import productModels from "@/models/productModels";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();

    // Fetch products with category name "Fruits & Vegetables"
    const fruitsAndVegetablesProducts = await productModels
      .find()
      .populate({
        path: "category",
        match: { name: "Fruits & Vegetables" }, // Match category name
        select: "name", // Only fetch the name field from the category
      })

    // Filter products that have the matched category populated
    const filteredProducts = fruitsAndVegetablesProducts.filter(
      (product) => product.category !== null
    );

    if (filteredProducts.length === 0) {
      return NextResponse.json(
        { msg: "No products found in the Fruits & Vegetables category." },
        { status: 404 }
      );
    }

    return NextResponse.json({ products: filteredProducts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Fruits & Vegetables products:", error);
    return NextResponse.json(
      { msg: "Error fetching products", error: error.message },
      { status: 500 }
    );
  }
};
