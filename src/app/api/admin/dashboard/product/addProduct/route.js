import uploadImage from "@/lib/uploadImages";
import productModels from "@/models/productModels";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import userModels from "@/models/userModels";
import connectDB from "@/lib/dbConnect";





export const POST = async (req) => {
  try {
    await connectDB();

    const formData = await req.formData();
    const token = await getToken({ req });

    // Helper function to safely get and trim values
    const getTrimmedValue = (key) => {
      const value = formData.get(key);
      return value ? value.trim().replace(/^"|"$/g, "") : ""; // Remove extra quotes
    };

    const name = getTrimmedValue("name");
    const description = getTrimmedValue("description");
    const salePrice = parseFloat(getTrimmedValue("salePrice")) || 0;
    const originalPrice = parseFloat(getTrimmedValue("originalPrice")) || 0;
    const category = getTrimmedValue("category");
    const subCategory = getTrimmedValue("subcategories"); // Fixed
    const subSubCategory = getTrimmedValue("subSubcategories"); // Fixed
    const stock = parseInt(getTrimmedValue("stock"), 10) || 0;
    const tags = getTrimmedValue("tags");
    const isOnSale = formData.get("isOnSale") === "true";
    const isFeaturedSale = formData.get("isFeaturedSale") === "true";
    const isClearance = formData.get("isClearance") === "true";
    const isHotDeal = formData.get("isHotDeal") === "true";
    const weight = parseFloat(getTrimmedValue("weight")) || 0;
    const unit = getTrimmedValue("unit");

    if (!name || !category) {
      return NextResponse.json(
        { msg: "Please provide all the required fields." },
        { status: 400 }
      );
    }

    const images = formData.getAll("images") || [];
    const featuredImage = formData.get("featuredImage");

    console.log("Uploading images...");

    // Upload product images
    const imageUploads = await Promise.all(
      images.map(async (image) => {
        const result = await uploadImage(image, "productImages");
        if (!result.secure_url) {
          throw new Error("Image upload failed.");
        }
        return result.secure_url;
      })
    );

    // Upload featured image
    let featuredImageUrl = null;
    if (featuredImage) {
      const featuredImageResult = await uploadImage(
        featuredImage,
        "featuredImage"
      );
      if (!featuredImageResult.secure_url) {
        return NextResponse.json(
          { msg: "Featured image upload failed." },
          { status: 500 }
        );
      }
      featuredImageUrl = featuredImageResult.secure_url;
    }

    const cookieStore = cookies();
    const authToken = cookieStore.get("adminAuthToken");
    console.log("Cookie authToken:", authToken);

    // Check if either token from NextAuth or cookie exists
    const tokenToUse =
      token || (authToken?.value ? jwt.decode(authToken.value) : null);
    console.log("Token to use:", tokenToUse);

    if (!tokenToUse || !tokenToUse.id) {
      console.error("Authentication token or ID is missing.");
      return NextResponse.json(
        { msg: "Authentication required." },
        { status: 401 }
      );
    }

    const id = tokenToUse.id;
    console.log("User ID:", id);

    const user = await userModels.findById(id);
    console.log("Retrieved user:", user);

    if (!user) {
      console.error("User not found.");
      return NextResponse.json({ msg: "User not found." }, { status: 404 });
    }

    // Check if the user has the correct role and status
    if (user.role !== "SuperAdmin") {
      return NextResponse.json(
        { msg: "Only vendors are allowed to add products." },
        { status: 403 }
      );
    }

    if (user.status !== "Active") {
      return NextResponse.json(
        { msg: "Your account is not active." },
        { status: 403 }
      );
    }

    // Construct product data
    const productData = {
      name,
      description,
      salePrice,
      originalPrice,
      category,
      subCategory,
      subSubCategory, // Fixed
      stock,
      isOnSale,
      isFeaturedSale,
      isClearance,
      isHotDeal,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      images: imageUploads,
      featuredImage: featuredImageUrl,
      weight: {
        value: weight,
        unit: unit,
      },
      users: tokenToUse.id,
    };
    console.log("Product data:", productData);

    const newProduct = await productModels.create(productData);

    return NextResponse.json(
      { msg: "Product added successfully", product: newProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { msg: "Error adding product", error: error.message },
      { status: 500 }
    );
  }
};




export const GET = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    // Fetch all products and populate the 'category' field
    const products = await productModels
      .find()
      .populate("category", "name")
      .populate("users") // This will populate the entire user object        
      .exec();

    console.log("Fetched products with populated categories:", products);

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { msg: "Error fetching products", error: error.message },
      { status: 500 }
    );
  }
};

