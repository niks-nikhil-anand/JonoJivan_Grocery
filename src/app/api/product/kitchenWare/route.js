import connectDB from "@/lib/dbConnect";
import productModels from "@/models/productModels";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();

    // Fetch products with category name "Kitchenware"
    const kitchenwareProducts = await productModels
      .find()
      .populate({
        path: "category",
        match: { name: "Kitchenware" }, // Match category name for Kitchenware
        select: "name", // Only fetch the name field from the category
      });

    // Filter products that have the matched category populated
    const filteredProducts = kitchenwareProducts.filter(
      (product) => product.category && product.category.name === "Kitchenware"
    );

    if (filteredProducts.length === 0) {
      return NextResponse.json(
        { msg: "No products found in the Kitchenware category." },
        { status: 404 }
      );
    }

    return NextResponse.json({ products: filteredProducts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Kitchenware products:", error);
    return NextResponse.json(
      { msg: "Error fetching products", error: error.message },
      { status: 500 }
    );
  }
};
