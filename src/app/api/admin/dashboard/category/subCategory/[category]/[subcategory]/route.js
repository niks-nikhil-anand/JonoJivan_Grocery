import connectDB from "@/lib/dbConnect";
import categoryModels from "@/models/categoryModels";
import productModels from "@/models/productModels"; // Assuming you have a product model
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { category, subcategory } = params; // Getting both category and subcategory from params

  // Debugging: Log the entire params object
  console.log('Request Params:', params);
  // Log the category ID
  console.log('Category ID:', category);
  // Log the subcategory ID
  console.log('Subcategory ID:', subcategory);

  try {
    // Connect to the database
    console.log('Connecting to the database...');
    await connectDB();
    console.log('Database connection established.');
    
    // Fetch products matching both category and subcategory
    const products = await productModels.find({
      category: category,         // Match category ID
      subCategory: subcategory     // Match subcategory ID
    });

    if (products.length === 0) {
      console.log('No products found for category:', category, 'and subcategory:', subcategory);
      return NextResponse.json({ msg: "No products found for this category and subcategory" }, { status: 404 });
    }

    console.log('Found products:', products);
    return NextResponse.json(products, {
      status: 200
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ msg: "Error fetching products", error: error.message }, {
      status: 500
    });
  }
};
