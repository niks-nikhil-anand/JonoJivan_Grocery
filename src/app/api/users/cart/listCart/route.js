export const dynamic = "force-dynamic";

import connectDB from "@/lib/dbConnect";
import cartModels from "@/models/cartModels";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';

export const GET = async (request) => {
    try {
      await connectDB();
      console.log('Database connected.');
  
      const cookieStore = cookies();
      const authToken = cookieStore.get("userAuthToken");
      console.log('Auth token:', authToken);
  
      if (!authToken) {
        throw new Error("User authentication token is missing.");
      }
  
      const decodedToken = jwt.decode(authToken.value);
      console.log("Decoded token:", decodedToken);
  
      if (!decodedToken || !decodedToken.id) {
        throw new Error("Invalid token.");
      }
  
      const userId = decodedToken.id;
      console.log('User ID from token:', userId);
  
      // Find the cart by userId
      const cart = await cartModels.findOne({ userId });
      console.log('Fetched cart for user:', cart);
  
      if (!cart) {
        return NextResponse.json({ msg: "Cart not found", items: [], totalPrice: 0 }, { status: 404 });
      }
  
      // If the cart is found, return its items and total price
      return NextResponse.json({ msg: "Cart retrieved successfully", items: cart.items, totalPrice: cart.totalPrice }, { status: 200 });
    } catch (error) {
      console.error('Error retrieving cart:', error);
      return NextResponse.json({ msg: "Error retrieving cart", error: error.message }, { status: 500 });
    }
  };