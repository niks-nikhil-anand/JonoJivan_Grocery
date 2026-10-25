import { NextResponse } from 'next/server';
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import connectDB from "@/lib/dbConnect";
import userModels from '@/models/userModels';

export const GET = async (req) => {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("userAuthToken");
    if (process.env.AUTH_DATABASE === "postgresql") {
      const { getCurrentUserFromCookie } = await import("@/lib/authSession");
      const user = await getCurrentUserFromCookie(authToken?.value);
      return NextResponse.json(user, { status: 200 });
    }

    await connectDB();
    if (!authToken) throw new Error("User authentication token is missing.");
    let decodedToken;
    try {
      decodedToken = jwt.verify(authToken.value, process.env.JWT_SECRET);
    } catch {
      throw new Error("Invalid token.");
    }
    if (!decodedToken || !decodedToken.email) throw new Error("Invalid token.");
    const user = await userModels.findOne({ email: decodedToken.email });
    if (!user) return NextResponse.json({ msg: "User not found" }, { status: 404 });
    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    const status = process.env.AUTH_DATABASE === "postgresql" && Number.isInteger(error?.status) ? error.status : 500;
    return NextResponse.json({ msg: "Error retrieving User", error: error.message }, { status });
  }
};
