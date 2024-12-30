import connectDB from "@/lib/dbConnect";
import productModels from "@/models/productModels";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();

    // Fetch products with category name "Home Care"
    const homeCareProducts = await productModels
      .find()
      .populate({
        path: "category",
        match: { name: "Home Care" }, // Match category name
        select: "name", // Only fetch the name field from the category
      });

    // Filter products that have the matched category populated
    const filteredProducts = homeCareProducts.filter(
      (product) => product.category && product.category.name === "Home Care"
    );

    if (filteredProducts.length === 0) {
      return NextResponse.json(
        { msg: "No products found in the Home Care category." },
        { status: 404 }
      );
    }

    return NextResponse.json({ products: filteredProducts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Home Care products:", error);
    return NextResponse.json(
      { msg: "Error fetching products", error: error.message },
      { status: 500 }
    );
  }
};
