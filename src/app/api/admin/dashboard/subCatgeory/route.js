import connectDB from "@/lib/dbConnect";
import uploadImage from "@/lib/uploadImages";
import categoryModels from "@/models/categoryModels";
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

    console.log("Parsed form data:", { name, image });

    if (!name || !image) {
      console.error("Missing required fields.");
      return NextResponse.json({ msg: "Please provide all the required fields." }, { status: 400 });
    }

    const imageResult = await uploadImage(image, "categoryImages");
    console.log("Image upload result:", imageResult);

    if (!imageResult.secure_url) {
      console.error("Image upload failed.");
      return NextResponse.json({ msg: "Image upload failed." }, { status: 500 });
    }

    const imageUrl = imageResult.secure_url;
    console.log("Image URL:", imageUrl);

    const categoryData = {
      name,
      image: imageUrl,
    };

    console.log("Category data to be saved:", categoryData);

    await categoryModels.create(categoryData);
    console.log("Category added successfully.");
    return NextResponse.json({ msg: "Category added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json({ msg: "Error adding category", error: error.message }, { status: 500 });
  }
};

export const GET = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    const categories = await categoryModels.find();
    console.log("Fetched categories:", categories);
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ msg: "Error fetching categories", error: error.message }, { status: 500 });
  }
};
