import connectDB from "@/lib/dbConnect";
import sub_subCategoryModels from "@/models/sub_subCategoryModels";
import { NextResponse } from "next/server";

// GET SubSubCategory by ID
export const GET = async (request, { params }) => {
  const { id } = params; // Correctly destructure id

  console.log("GET Request Params:", params);
  console.log("GET Request ID:", id);

  if (!id) {
    console.log("No ID provided in GET request");
    return NextResponse.json({ msg: "SubSubCategory ID is required" }, { status: 400 });
  }

  try {
    console.log("Connecting to database...");
    await connectDB();

    console.log("Fetching SubSubCategory with ID:", id);
    const subSubCategory = await sub_subCategoryModels.findById(id); // Use id to find SubSubCategory

    if (!subSubCategory) {
      console.log("SubSubCategory not found for ID:", id);
      return NextResponse.json({ msg: "SubSubCategory not found" }, { status: 404 });
    }

    console.log("SubSubCategory found:", subSubCategory);
    return NextResponse.json(subSubCategory, { status: 200 });
  } catch (error) {
    console.error("Error fetching SubSubCategory:", error);
    return NextResponse.json(
      { msg: "Error fetching SubSubCategory", error: error.message },
      { status: 500 }
    );
  }
};

// DELETE SubSubCategory by ID
export const DELETE = async (request, { params }) => {
  const { id } = params; // Correctly match variable name for consistency

  console.log("DELETE Request Params:", params);
  console.log("DELETE Request ID:", id);

  if (!id) {
    console.log("No ID provided in DELETE request");
    return NextResponse.json({ msg: "SubSubCategory ID is required" }, { status: 400 });
  }

  try {
    console.log("Connecting to database...");
    await connectDB();

    console.log("Deleting SubSubCategory with ID:", id);
    const subSubCategory = await subSubCategoryModels.findByIdAndDelete(id); // Use id to delete SubSubCategory

    if (!subSubCategory) {
      console.log("SubSubCategory not found for ID:", id);
      return NextResponse.json({ msg: "SubSubCategory not found" }, { status: 404 });
    }

    console.log("SubSubCategory deleted successfully:", subSubCategory);
    return NextResponse.json(
      { msg: "SubSubCategory deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting SubSubCategory:", error);
    return NextResponse.json(
      { msg: "Error deleting SubSubCategory", error: error.message },
      { status: 500 }
    );
  }
};
