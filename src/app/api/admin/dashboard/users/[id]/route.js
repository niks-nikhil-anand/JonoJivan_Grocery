import connectDB from "@/lib/dbConnect";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { id } = params;
  

  if (!id) {
    return NextResponse.json({ msg: "ID parameter is required" }, { status: 400 });
  }

  try {
    await connectDB();

    const User = await userModels.findById(id);
    console.log(User)
    
    if (!User) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    return NextResponse.json(User, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ msg: "Error fetching user", error: error.message }, { status: 500 });
  }
};
