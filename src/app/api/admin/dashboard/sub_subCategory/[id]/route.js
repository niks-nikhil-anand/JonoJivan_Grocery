import connectDB from "@/lib/dbConnect";
import subCategoryModels from "@/models/subCategoryModels";
import { NextResponse } from "next/server";

// GET SubCategory by ID
export const GET = async (request, { params }) => {
  const { id } = params; // Correctly destructure id

  console.log("GET Request Params:", params);
  console.log("GET Request ID:", id);

  if (!id) {
    console.log("No ID provided in GET request");
    return NextResponse.json({ msg: "SubCategory ID is required" }, { status: 400 });
  }

  try {
    console.log("Connecting to database...");
    await connectDB();

    console.log("Fetching SubCategory with ID:", id);
    const subCategory = await subCategoryModels.findById(id); // Use id

    if (!subCategory) {
      console.log("SubCategory not found for ID:", id);
      return NextResponse.json({ msg: "SubCategory not found" }, { status: 404 });
    }

    console.log("SubCategory found:", subCategory);
    return NextResponse.json(subCategory, { status: 200 });
  } catch (error) {
    console.error("Error fetching SubCategory:", error);
    return NextResponse.json(
      { msg: "Error fetching SubCategory", error: error.message },
      { status: 500 }
    );
  }
};

// DELETE SubCategory by ID
export const DELETE = async (request, { params }) => {
  const { id } = params; // Match variable name for consistency

  console.log("DELETE Request Params:", params);
  console.log("DELETE Request ID:", id);

  if (!id) {
    console.log("No ID provided in DELETE request");
    return NextResponse.json({ msg: "SubCategory ID is required" }, { status: 400 });
  }

  try {
    console.log("Connecting to database...");
    await connectDB();

    console.log("Deleting SubCategory with ID:", id);
    const subCategory = await subCategoryModels.findByIdAndDelete(id); // Use id

    if (!subCategory) {
      console.log("SubCategory not found for ID:", id);
      return NextResponse.json({ msg: "SubCategory not found" }, { status: 404 });
    }

    console.log("SubCategory deleted successfully:", subCategory);
    return NextResponse.json(
      { msg: "SubCategory deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting SubCategory:", error);
    return NextResponse.json(
      { msg: "Error deleting SubCategory", error: error.message },
      { status: 500 }
    );
  }
};
