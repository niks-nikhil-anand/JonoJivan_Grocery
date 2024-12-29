import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import connectDB from "@/lib/dbConnect";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const GET = async (req) => {
  try {
    await connectDB();

    // Get token from NextAuth (if available)
    const token = await getToken({ req });

    const cookieStore = cookies();
    const authToken = cookieStore.get("userAuthToken");

    // Check if either token from NextAuth or cookie exists
    const tokenToUse = token || (authToken && authToken.value ? jwt.decode(authToken.value) : null);

    if (!tokenToUse || !tokenToUse.id) {
      throw new Error("Authentication token or ID is missing.");
    }

    const id = tokenToUse.id;

    const user = await userModels.findById(id);

    if (!user) {
      throw new Error("User not found.");
    }

    return NextResponse.json(user, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ msg: "Error retrieving user", error: error.message }, {
      status: 500,
    });
  }
};
