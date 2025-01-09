import connectDB from "@/lib/dbConnect";
import categoryModels from "@/models/categoryModels";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const id = params.id; // Use the correct parameter key
  console.log("Request Params:", params);
  console.log("ID:", id);

  try {
    await connectDB();

    // Find the category by ID and populate subcategories
    const category = await categoryModels.findById(id);

    if (!category) {
      return NextResponse.json({ msg: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { msg: "Error fetching category", error: error.message },
      { status: 500 }
    );
  }
};

export const DELETE = async (request, { params }) => {
  const id = params.id; // Use the correct parameter key

  console.log("Request Params:", params);
  console.log("ID:", id);

  try {
    await connectDB();

    const category = await categoryModels.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json({ msg: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ msg: "Category deleted successfully" }, {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { msg: "Error deleting category", error: error.message },
      { status: 500 },
    );
  }
};
