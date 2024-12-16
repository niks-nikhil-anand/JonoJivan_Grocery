import connectDB from "@/lib/dbConnect";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";


export const GET = async () => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    // Fetch all users, excluding the password field
    const users = await userModels.find({}, { password: 0 });
    console.log("Users fetched successfully:", users);

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.log("Error fetching users:", error.message);
    return NextResponse.json({ msg: "Error fetching users", error: error.message }, { status: 500 });
  }
};
