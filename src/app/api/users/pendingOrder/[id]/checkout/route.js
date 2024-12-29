import connectDB from "@/lib/dbConnect";
import addressModels from "@/models/addressModels";
import cartModels from "@/models/cartModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const POST = async (request, { params }) => {
  try {
    // Database Connection
    await connectDB();
    console.log("Database connected.");

    // Extract user ID from params
    const { id } = params;
    if (!id) {
      return NextResponse.json({ msg: "User ID is required." }, { status: 400 });
    }

    // Parse request body
    const body = await request.json();
    const {
      email,
      firstName,
      lastName,
      address,
      apartment,
      mobileNumber,
      state,
      landmark,
      city,
      pinCode,
      subscribeChecked,
      cart,
    } = body;

    // Validate required fields
    if (
      !email ||
      !firstName ||
      !lastName ||
      !address ||
      !mobileNumber ||
      !state ||
      !city ||
      !pinCode ||
      !cart
    ) {
      return NextResponse.json(
        { msg: "Please provide all the required fields." },
        { status: 400 }
      );
    }

    // Create a new cart
    console.log("Creating a new cart.");
    const newCart = new cartModels({
      userId: id,
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price || 0,
      })),
    });
    await newCart.save();

    // Create a new address
    console.log("Creating new address.");
    const newAddress = new addressModels({
      firstName,
      lastName,
      address,
      apartment,
      landmark,
      city,
      state,
      pinCode,
      email,
      mobileNumber,
      user: id,
    });
    await newAddress.save();

    // Update User Address Reference
    await userModels.findByIdAndUpdate(id, { $push: { address: newAddress._id } });

    // Generate JWT Token
    const token = generateToken({
      cartId: newCart._id,
      addressId: newAddress._id,
      userId: id,
    });

    // Set JWT Token as Cookie
    const response = NextResponse.json({
      msg: "Cart and address updated successfully.",
      token,
    });
    response.cookies.set("cartAndAddress", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { msg: "Error processing request", error: error.message },
      { status: 500 }
    );
  }
};

// Helper Function to Generate JWT Token
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1w" });
}
