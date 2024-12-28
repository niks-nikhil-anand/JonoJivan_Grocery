import connectDB from "@/lib/dbConnect";
import cartModels from "@/models/cartModels";
import orderModels from "@/models/orderModels";
import addressModels from "@/models/addressModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();

    // Parse JSON from the request
    const body = await req.json();
    const {
      userId, // Pass userId directly from the request body or headers
      cartId,
      addressId,
      paymentMethod,
      contactInfo,
      products,
      totalAmount,
    } = body;

    console.log("Received request data:", {
      userId,
      cartId,
      addressId,
      paymentMethod,
      contactInfo,
      products,
      totalAmount,
    });

    // Validate required fields
    if (!userId || !cartId || !addressId || !paymentMethod || !contactInfo || !products || !totalAmount) {
      return NextResponse.json(
        { msg: "Please provide all required fields." },
        { status: 400 }
      );
    }

    // Fetch the user
    const user = await userModels.findById(userId);
    if (!user) {
      return NextResponse.json({ msg: "User not found." }, { status: 404 });
    }
    console.log("User found:", user);

    // Fetch the cart
    const cart = await cartModels.findById(cartId);
    if (!cart) {
      return NextResponse.json(
        { msg: "Cart not found. Please ensure the cartId is valid." },
        { status: 404 }
      );
    }
    console.log("Cart found:", cart);

    // Fetch the address
    const address = await addressModels.findById(addressId);
    if (!address) {
      return NextResponse.json(
        { msg: "Address not found. Please ensure the addressId is valid." },
        { status: 404 }
      );
    }
    console.log("Address found:", address);

    // Create a new order
    const newOrder = new orderModels({
      user: user._id,
      contactInfo,
      totalAmount,
      cart: cart._id,
      address: address._id,
      paymentMethod,
      paymentStatus: "Pending", // Update as needed
    });
    await newOrder.save();
    console.log("New order created:", newOrder);

    return NextResponse.json(
      { msg: "Order created successfully.", order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      { msg: "Error processing order", error: error.message || error },
      { status: 500 }
    );
  }
};
