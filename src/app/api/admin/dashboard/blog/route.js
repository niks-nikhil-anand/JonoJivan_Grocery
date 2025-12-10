import connectDB from "@/lib/dbConnect";
import uploadImage from "@/lib/uploadImages";
import { Blog } from "@/models/blogModels";
import { NextResponse } from "next/server";


export const POST = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    const formData = await req.formData();
    console.log("Form data received.");

    const title = formData.get("title");
    const content = formData.get("content");
    const subtitle = formData.get("subtitle");
    const category = formData.get("category");
    const author = formData.get("author");
    const featuredImage = formData.get("featuredImage");

    console.log("Parsed form data:", { title, content, subtitle, category, author });

    if (!title || !content || !subtitle || !category || !author || !featuredImage) {
      console.error("Missing required fields.");
      return NextResponse.json({ msg: "Please provide all the required fields." }, { status: 400 });
    }

    const featuredImageResult = await uploadImage(featuredImage, "blogImages");
    console.log("Image upload result:", featuredImageResult);

    if (!featuredImageResult.secure_url) {
      console.error("Image upload failed.");
      return NextResponse.json({ msg: "Image upload failed." }, { status: 500 });
    }

    const imageUrl = featuredImageResult.secure_url;
    console.log("Image URL:", imageUrl);

    const blogData = {
      title,
      content,
      subtitle,
      category,
      author,
      featuredImage: imageUrl,
    };

    console.log("Blog data to be saved:");

    await Blog.create(blogData);
    console.log("Blog added successfully.");
    return NextResponse.json({ msg: "Blog added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding blog:", error);
    return NextResponse.json({ msg: "Error adding blog", error: error.message }, { status: 500 });
  }
};

export const GET = async (req) => {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const blogs = await Blog.find(query)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Blog.countDocuments(query);

    return NextResponse.json({
        success: true,
        data: blogs,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ success: false, msg: "Error fetching blogs", error: error.message }, { status: 500 });
  }
};
