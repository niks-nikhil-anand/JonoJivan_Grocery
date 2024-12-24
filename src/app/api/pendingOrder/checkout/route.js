import connectDB from "@/lib/dbConnect";
import addressModels from "@/models/addressModels";
import cartModels from "@/models/cartModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export const POST = async (req) => {
  try {
    await connectDB();

    const body = await req.json();
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
      cart,
    } = body;

    // Validate required fields
    if (!email || !firstName || !lastName || !address || !mobileNumber || !state || !city || !pinCode || !cart) {
      return NextResponse.json({ msg: "Please provide all the required fields." }, { status: 400 });
    }

    // Check if the user exists
    const existingUser = await userModels.findOne({ email });

    if (existingUser) {
      console.log("User already exists with this email. Sign in to place the order.");
      return NextResponse.json({ 
        msg: "User already found with this email ID. Please sign in to place the order." 
      }, { status: 400 });
    }

    // Validate cart length
    if (cart.length === 0) {
      return NextResponse.json({ msg: "Cart cannot be empty." }, { status: 400 });
    }

    // Create new cart
    const newCart = new cartModels({
      items: cart.map(item => ({
        productId: item.id, // Update this line to match your schema
        quantity: item.quantity,
        price: item.price || 0, // Assuming price is included in the cart item, or set it to 0 if not
      })),
    });
    await newCart.save();

    // Create new address
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
    });
    await newAddress.save();

    // Generate JWT token
    const token = generateToken({   
      cartId: newCart._id,
      addressId: newAddress._id,
    });

    // Set the cookie with the token
    const response = NextResponse.json({ 
      msg: "Order processed successfully.", 
      cartId: newCart._id,
      addressId: newAddress._id,
    }, { status: 200 });
    response.cookies.set('cartAndAddress', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, 
      path: '/'
    });

    return response;
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ msg: "Error processing request", error: error.message }, { status: 500 });
  }
};

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1w' });
}
