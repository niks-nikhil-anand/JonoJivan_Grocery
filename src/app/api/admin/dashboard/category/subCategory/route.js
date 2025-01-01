import connectDB from "@/lib/dbConnect";
import uploadImage from "@/lib/uploadImages";
import categoryModels from "@/models/categoryModels";
import subCategoryModels from "@/models/subCategoryModels";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    console.log("Connecting to database...");
    await connectDB();

    const formData = await req.formData();

    // Helper function to safely get and trim values
    const getTrimmedValue = (key) => {
      const value = formData.get(key);
      return value ? value.trim() : '';
    };

    const categoryId = getTrimmedValue("category"); // Should be category ID if updating
    const categoryName = getTrimmedValue("name");
    const categoryImage = formData.get("image");

    // Upload category image if provided
    const categoryImageUrl = categoryImage ? await uploadImage(categoryImage, "categoryImages") : null;

    // Parsing and creating/updating subcategories
    const newSubCategories = [];
    let subCategoryCount = 0;
    while (formData.has(`subCategories[${subCategoryCount}][name]`)) {
      const subCategoryName = formData.get(`subCategories[${subCategoryCount}][name]`);
      const subCategoryImage = formData.get(`subCategories[${subCategoryCount}][image]`);

      if (subCategoryName) {
        console.log(`Processing subcategory ${subCategoryCount}:`, subCategoryName);

        // Upload subcategory image if provided
        const subCategoryImageUrl = subCategoryImage
          ? await uploadImage(subCategoryImage, "subCategoryImages")
          : null;

        // Create a new subcategory document
        const subCategoryDoc = new subCategoryModels({
          name: subCategoryName,
          image: subCategoryImageUrl?.secure_url || null,
        });
        await subCategoryDoc.save();

        console.log(`Subcategory ${subCategoryCount} created with ID:`, subCategoryDoc._id);
        newSubCategories.push(subCategoryDoc._id); // Push the ObjectId of the created subcategory
      }
      subCategoryCount++;
    }

    console.log("Parsed subcategories:", newSubCategories);

    if (categoryId) {
      // Find the existing category and update it
      const existingCategory = await categoryModels.findById(categoryId);
      console.log("Existing category found:", existingCategory);

      if (existingCategory) {
        console.log("Updating existing category...");
        existingCategory.subcategory = [...existingCategory.subcategory, ...newSubCategories]; // Append new subcategories
        if (categoryName) existingCategory.name = categoryName;
        if (categoryImageUrl) existingCategory.image = categoryImageUrl.secure_url;

        await existingCategory.save();
        return NextResponse.json({ msg: "Category updated successfully" }, { status: 200 });
      } else {
        return NextResponse.json({ msg: "Category not found" }, { status: 404 });
      }
    } else {
      // Create a new category if categoryId is not provided
      console.log("Creating new category...");
      const newCategory = new categoryModels({
        name: categoryName,
        image: categoryImageUrl?.secure_url || null,
        subcategory: newSubCategories,
      });
      await newCategory.save();
      return NextResponse.json({ msg: "Category created successfully" }, { status: 201 });
    }
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json({ msg: "Error adding category", error: error.message }, { status: 500 });
  }
};
