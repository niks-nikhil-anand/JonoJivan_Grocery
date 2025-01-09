import connectDB from "@/lib/dbConnect";
import uploadImage from "@/lib/uploadImages";
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