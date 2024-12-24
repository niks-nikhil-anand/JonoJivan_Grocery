import connectDB from "@/lib/dbConnect";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Database connection successful.");

    const cookieStore = cookies();
    const cartAndAddress = cookieStore.get("cartAndAddress");
    console.log("Retrieved cookies:", cookieStore);

    if (!cartAndAddress) {
      console.error("User authentication token is missing.");
      throw new Error("User authentication token is missing.");
    }

    console.log("Pending order cookie found:", cartAndAddress.value);

    const decodedToken = jwt.decode(cartAndAddress.value); // Use cartAndAddress instead of pendingOrder
    console.log("Decoded token:", decodedToken);

    if (!decodedToken || !decodedToken.cartId || !decodedToken.addressId) {
      console.error("Invalid token. No order ID found.");
      throw new Error("Invalid token.");
    }

    return NextResponse.json(decodedToken, {
      status: 200,
    });
    
  } catch (error) {
    console.error("Error retrieving Partner:", error);
    return NextResponse.json({ msg: "Error retrieving Partner", error: error.message }, {
      status: 500,
    });
  }
};
