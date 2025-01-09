import connectDB from "@/lib/dbConnect";
import subCategoryModels from "@/models/subCategoryModels";
import categoryModels from "@/models/categoryModels";
import { NextResponse } from "next/server";
import uploadImage from "@/lib/uploadImages";

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
    const subCategoryCount = formData.getAll("subCategories[0][name]").length;
    console.log("Subcategory Count:", subCategoryCount);

    for (let i = 0; i < subCategoryCount; i++) {
      const name = formData.get(`subCategories[${i}][name]`);
      const image = formData.get(`subCategories[${i}][image]`);

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
