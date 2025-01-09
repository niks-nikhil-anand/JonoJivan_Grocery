import connectDB from "@/lib/dbConnect";
import subCategoryModels from "@/models/subCategoryModels";
import { NextResponse } from "next/server";

// GET SubCategory by ID
export const GET = async (request, { params }) => {
  const { id } = params;

  console.log("Request Params:", params);
  console.log("ID:", id);

  if (!id) {
    return NextResponse.json({ msg: "SubCategory ID is required" }, { status: 400 });
  }

  try {
    await connectDB();

    const subCategory = await subCategoryModels.findById(id).populate("subSubcategory");

    if (!subCategory) {
      return NextResponse.json({ msg: "SubCategory not found" }, { status: 404 });
    }

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
  const { id } = params;

  console.log("Request Params:", params);
  console.log("ID:", id);

  if (!id) {
    return NextResponse.json({ msg: "SubCategory ID is required" }, { status: 400 });
  }

  try {
    await connectDB();

    const subCategory = await subCategoryModels.findByIdAndDelete(id);

    if (!subCategory) {
      return NextResponse.json({ msg: "SubCategory not found" }, { status: 404 });
    }

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
