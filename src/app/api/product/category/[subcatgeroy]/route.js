import connectDB from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { id, subcategoryId } = params; // Extract the 'id' for Category and 'subcategoryId' for Subcategory

  if (!id || !subcategoryId) {
    return NextResponse.json({ msg: "Category ID and Subcategory ID are required" }, { status: 400 });
  }

  try {
    await connectDB();

    // Find the Category by ID and populate the subcategories array
    const category = await Category.findById(id).populate({
      path: 'subcategories.name', // Populate product field in subcategories
      select: 'name image' // Optionally select specific fields from the product
    });

    if (!category) {
      return NextResponse.json({ msg: "Category not found" }, { status: 404 });
    }

    // Find the specific subcategory within the category's subcategories array
    const subcategory = category.subcategories.find(sub => sub._id.toString() === subcategoryId);

    if (!subcategory) {
      return NextResponse.json({ msg: "Subcategory not found" }, { status: 404 });
    }

    return NextResponse.json(subcategory, { status: 200 });
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    return NextResponse.json(
      { msg: "Error fetching subcategory", error: error.message },
      { status: 500 }
    );
  }
};
