import connectDB from "@/lib/dbConnect";
import subCategoryModels from "@/models/subCategoryModels";
import { NextResponse } from "next/server";

// GET SubCategory by ID or Name
export const GET = async (request, { params }) => {
  const { id, name } = params; // Support ID or Name

  console.log("GET Request Params:", params);

  if (!id && !name) {
    console.log("No ID or Name provided in GET request");
    return NextResponse.json(
      { msg: "SubCategory ID or Name is required" },
      { status: 400 }
    );
  }

  try {
    console.log("Connecting to database...");
    await connectDB();

    console.log("Fetching SubCategory with ID or Name:", { id, name });

    const query = id ? { _id: id } : { name }; // Query by ID or Name
    const subCategory = await subCategoryModels.findOne(query);

    if (!subCategory) {
      console.log("SubCategory not found for:", { id, name });
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

// DELETE SubCategory by ID or Name
export const DELETE = async (request, { params }) => {
  const { id, name } = params; // Support ID or Name

  console.log("DELETE Request Params:", params);

  if (!id && !name) {
    console.log("No ID or Name provided in DELETE request");
    return NextResponse.json(
      { msg: "SubCategory ID or Name is required" },
      { status: 400 }
    );
  }

  try {
    console.log("Connecting to database...");
    await connectDB();

    console.log("Deleting SubCategory with ID or Name:", { id, name });

    const query = id ? { _id: id } : { name }; // Query by ID or Name
    const subCategory = await subCategoryModels.findOneAndDelete(query);

    if (!subCategory) {
      console.log("SubCategory not found for:", { id, name });
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
