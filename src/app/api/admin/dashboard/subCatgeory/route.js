import connectDB from "@/lib/dbConnect";
import uploadImage from "@/lib/uploadImages";
import categoryModels from "@/models/categoryModels";
import subCategoryModels from "@/models/subCategoryModels";
import { NextResponse } from "next/server";


// POST request to create new SubCategories
export const POST = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    const formData = await req.formData();
    console.log("Form data received:", formData);

    const category = formData.get("category"); // category identifier

    // Validate required category field
    if (!category) {
      console.error("Missing category field.");
      return NextResponse.json({ msg: "Please provide a category." }, { status: 400 });
    }

    // Parse subcategories
    const subCategoriesData = [];

    // Log the whole formData to inspect its structure
    for (let [key, value] of formData.entries()) {
      console.log(`Key: ${key}, Value: ${value}`);
    }

    // Get the count of subcategories
    const subCategoryCount = formData.getAll("name").length;
    console.log("Subcategory Count:", subCategoryCount);

    for (let i = 0; i < subCategoryCount; i++) {
      const name = formData.getAll("name")[i];
      const image = formData.getAll("image")[i];

      if (!name || !image) {
        console.error(`Missing fields for subcategory ${i + 1}.`);
        return NextResponse.json({ msg: "Please provide all required fields for subcategories." }, { status: 400 });
      }

      // Handle image upload
      console.log(`Starting image upload for subcategory ${i + 1}...`);
      const imageResult = await uploadImage(image, "subcategoryImages"); // Assuming uploadImage function exists
      console.log(`Image upload result for subcategory ${i + 1}:`, imageResult);

      if (!imageResult.secure_url) {
        console.error(`Image upload failed for subcategory ${i + 1}.`);
        return NextResponse.json({ msg: "Image upload failed." }, { status: 500 });
      }

      subCategoriesData.push({
        name,
        image: imageResult.secure_url,
      });
    }

    console.log("SubCategories data to be saved:", subCategoriesData);

    // Create subcategories in the database
    const createdSubCategories = await subCategoryModels.insertMany(subCategoriesData);
    console.log("SubCategories added successfully:", createdSubCategories);

    // Find the category by the category name or id
    console.log("Fetching category with ID:", category);
    const foundCategory = await categoryModels.findOne({ _id: category });
    if (!foundCategory) {
      console.error("Category not found.");
      return NextResponse.json({ msg: "Category not found." }, { status: 404 });
    }

    console.log("Found Category:", foundCategory);

    // Update the category to include the new subcategory IDs
    foundCategory.subcategory.push(...createdSubCategories.map(subCat => subCat._id));
    await foundCategory.save();
    console.log("SubCategory IDs added to Category:", foundCategory);

    return NextResponse.json({ msg: "SubCategories added and linked to category successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding subcategories:", error);
    return NextResponse.json({ msg: "Error adding subcategories", error: error.message }, { status: 500 });
  }
};



// GET request to fetch SubCategory by Name
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
    const subCategory = await subCategoryModels.findOne(query);

    if (!subCategory) {
      console.log("SubCategory not found for Name:", name);
      return NextResponse.json(
        { msg: "SubCategory not found" },
        { status: 404 }
      );
    }

    console.log("SubCategory fetched successfully:", subCategory);
    return NextResponse.json(subCategory, { status: 200 });
  } catch (error) {
    console.error("Error during SubCategory fetch:", error);
    return NextResponse.json(
      {
        msg: "Error fetching SubCategory",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

