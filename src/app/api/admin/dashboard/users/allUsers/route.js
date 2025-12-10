import connectDB from "@/lib/dbConnect";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

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
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const users = await userModels.find(query, { password: 0 })
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await userModels.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }, { status: 200 });

  } catch (error) {
    console.log("Error fetching users:", error.message);
    return NextResponse.json({ success: false, msg: "Error fetching users", error: error.message }, { status: 500 });
  }
};
