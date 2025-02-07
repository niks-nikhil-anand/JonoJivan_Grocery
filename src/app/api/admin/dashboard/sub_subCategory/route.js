import connectDB from "@/lib/dbConnect";
import uploadImage from "@/lib/uploadImages";
import productModels from "@/models/productModels";
import sub_subCategoryModels from "@/models/sub_subCategoryModels";
import subCategoryModels from "@/models/subCategoryModels";
import { NextResponse } from "next/server";


export const POST = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    const formData = await req.formData();
    console.log("Form data received.");

    const name = formData.get("name");
    const image = formData.get("image");
    const category = formData.get("category");
    const subCategory = formData.get("subCategory");

    console.log("Parsed form data:", { name, image, category, subCategory });

    // Validation for required fields
    if (!name || !image || !category || !subCategory) {
      console.error("Missing required fields.");
      return NextResponse.json({ msg: "Please provide all the required fields." }, { status: 400 });
    }

    // Uploading the image
    const imageResult = await uploadImage(image, "categoryImages");
    console.log("Image upload result:", imageResult);

    if (!imageResult.secure_url) {
      console.error("Image upload failed.");
      return NextResponse.json({ msg: "Image upload failed." }, { status: 500 });
    }

    const imageUrl = imageResult.secure_url;
    console.log("Image URL:", imageUrl);

    // Creating a new subSubCategory
    const subSubCategory = {
      name,
      image: imageUrl,
    };

    const createdSubSubCategory = await sub_subCategoryModels.create(subSubCategory);
    console.log("subSubCategory added successfully:", createdSubSubCategory);

    // Finding the associated subCategory
    console.log("Fetching subCategory with ID:", subCategory);
    const foundSubCategory = await subCategoryModels.findById(subCategory);
    if (!foundSubCategory) {
      console.error("SubCategory not found.");
      return NextResponse.json({ msg: "SubCategory not found." }, { status: 404 });
    }

    // Adding subSubCategory to the subCategory
    foundSubCategory.subSubcategory.push(createdSubSubCategory._id);
    await foundSubCategory.save();
    console.log("subSubCategory added to subCategory:", foundSubCategory);

    return NextResponse.json({ msg: "SubSubCategory added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding subSubCategory:", error);
    return NextResponse.json({ msg: "Error adding subSubCategory", error: error.message }, { status: 500 });
  }
};


export const GET = async (req) => {
  console.log("Incoming GET request received");

  // Log the query to check its structure
  console.log("GET Request URL:", req.url); // Check the full URL

  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const name = searchParams.get('name'); // Extract 'name' from query params

  console.log("Extracted Name:", name); // Log the extracted name to check

  // Validate input
  if (!name) {
    console.log("Validation Error: No Name provided in GET request");
    return NextResponse.json(
      { msg: "SubCategory Name is required" },
      { status: 400 }
    );
  }

  try {
    console.log("Attempting to connect to the database...");
    await connectDB();
    console.log("Database connection successful");

    // Construct query based on Name
    const query = { name };
    console.log("Building query to fetch SubCategory by Name:", query);

    // Fetch SubCategory from the database
    const subCategory = await sub_subCategoryModels.findOne(query);

    if (!subCategory) {
      console.log("SubCategory not found for Name:", name);
      return NextResponse.json(
        { msg: "SubCategory not found" },
        { status: 404 }
      );
    }

    console.log("SubCategory fetched successfully:", subCategory);

    // Fetch all products associated with the subSubCategory
    const products = await productModels.find({ subSubCategory: subCategory._id });

    console.log("Products fetched successfully:", products);

    // Return both the subCategory and the associated products
    return NextResponse.json(
      { subCategory, products },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during SubCategory or Products fetch:", error);
    return NextResponse.json(
      {
        msg: "Error fetching SubCategory or Products",
        error: error.message,
      },
      { status: 500 }
    );
  }
};