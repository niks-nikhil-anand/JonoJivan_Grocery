import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import connectDB from "@/lib/dbConnect";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const GET = async (req) => {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("userAuthToken");
    let user;
    if (process.env.AUTH_DATABASE === "postgresql") {
      const { getCurrentUserFromCookie } = await import("@/lib/authSession");
      user = await getCurrentUserFromCookie(authToken?.value);
    } else {
      await connectDB();
      const token = await getToken({ req });
      const tokenToUse = token || (authToken && authToken.value ? jwt.decode(authToken.value) : null);
      if (!tokenToUse || !tokenToUse.id) throw new Error("Authentication token or ID is missing.");
      user = await userModels.findById(tokenToUse.id);
      if (!user) throw new Error("User not found.");
    }

    return NextResponse.json(user, {
      status: 200,
    });
  } catch (error) {
    const status = process.env.AUTH_DATABASE === "postgresql" && Number.isInteger(error?.status) ? error.status : 500;
    return NextResponse.json({ msg: "Error retrieving user", error: error.message }, {
      status,
    });
  }
};
