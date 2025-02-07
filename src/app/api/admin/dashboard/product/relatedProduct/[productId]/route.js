import connectDB from "@/lib/dbConnect";
import productModels from "@/models/productModels";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { productId } = params;
  const id = productId
  if (!productId) {
    console.log("ID parameter is missing");
    return NextResponse.json({ msg: "ID parameter is required" }, { status: 400 });
  }

  try {
    await connectDB();
    console.log("Database connected successfully");

    // Find the original product first
    const originalProduct = await productModels.findById(id);
    if (!originalProduct) {
      console.log(`Product with ID ${id} not found`);
      return NextResponse.json({ msg: "Product not found" }, { status: 404 });
    }

    console.log("Original Product:", originalProduct);

    const { category, subCategory, subSubCategory } = originalProduct;
    let products = [];

    if (category) {
      console.log(`Searching for products in the same category: ${category}`);
      products = await productModels.find({ _id: { $ne: id }, category }).populate('category');
      console.log(`Found ${products.length} products in the same category`);
    }

    if (products.length === 0 && subCategory) {
      console.log(`No products found in category. Searching in subCategory: ${subCategory}`);
      products = await productModels.find({ _id: { $ne: id }, subCategory }).populate('subCategory');
      console.log(`Found ${products.length} products in the same subCategory`);
    }

    if (products.length === 0 && subSubCategory) {
      console.log(`No products found in subCategory. Searching in subSubCategory: ${subSubCategory}`);
      products = await productModels.find({ _id: { $ne: id }, subSubCategory }).populate('subSubCategory');
      console.log(`Found ${products.length} products in the same subSubCategory`);
    }

    if (products.length === 0) {
      console.log("No products found in category, subCategory, or subSubCategory. Fetching all other products.");
      products = await productModels.find({ _id: { $ne: id } });
      console.log(`Found ${products.length} products as fallback`);
    }

    console.log(`Returning ${products.length} products`);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    if (error.name === 'CastError') {
      console.log("Invalid product ID format:", id);
      return NextResponse.json({ msg: "Invalid product ID format" }, { status: 400 });
    }
    return NextResponse.json({ msg: "Error fetching products", error: error.message }, { status: 500 });
  }
};
