import connectDB from "@/lib/dbConnect";
import cartModels from "@/models/cartModels";
import orderModels from "@/models/orderModels";
import pendingOrder from "@/models/pendingOrder";
import userModels from "@/models/userModels";
import addressModels from "@/models/addressModels"; // Import the address model
import jwt from "jsonwebtoken"; // Ensure you have jwt imported
import { NextResponse } from "next/server";

export const POST = async (req) => {
    try {
        console.log("Connecting to the database...");
        await connectDB();

        const {
            orderId,
            cartId,
            addressId,
            paymentMethod,
            rememberMe,
            contactInfo,
            products,
            totalAmount,
            razorpay_order_id,
            razorpay_payment_id,
        } = await req.json();

        console.log("Request data:", {
            orderId,
            cartId,
            addressId,
            paymentMethod,
            rememberMe,
            contactInfo,
            products,
            totalAmount,
            razorpay_order_id,
            razorpay_payment_id,
        });

        // Find the user based on provided contact info or create a new user if not found
        let user = await userModels.findOne({ email: contactInfo.email });

        console.log("Found user:", user);

        if (!user) {
            console.log("Creating a new user...");
            user = new userModels({
                fullName: contactInfo.name,
                email: contactInfo.email,
                mobileNumber: contactInfo.mobileNumber,
                password: null, // Use null or a hashed default password if required
            });
            await user.save();
            console.log("New user created:", user);
        }

        // Generate a JWT token for the user
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: rememberMe ? '30d' : '7d' });
        console.log("Generated JWT token:", token);

        // Create a response and set the cookie
        const response = NextResponse.json({ msg: "Order placed successfully" }, { status: 200 });
        response.cookies.set('userAuthToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7,
            path: '/'
        });

        // Fetch the existing cart and update the userId
        let cart = await cartModels.findById(cartId);
        console.log("Fetched cart:", cart);

        if (cart) {
            cart.userId = user._id; // Update userId to the current user
            await cart.save();
            console.log("Updated existing cart with userId:", cart);
        } else {
            // Create a new cart if it doesn't exist
            console.log("Creating a new cart...");
            cart = new cartModels({
                userId: user._id,
                items: products.map(product => ({
                    productId: product.productId, // Ensure this field is available in the product object
                    quantity: product.quantity,
                    price: product.price,
                }))
            });
            await cart.save();
            console.log("New cart created:", cart);
        }

        // Fetch the existing address and update the User field
        let address = await addressModels.findById(addressId);
        console.log("Fetched address:", address);

        if (address) {
            // Update existing address
            address.User = user._id; // Update User field with the current user's ID
            await address.save();
            console.log("Updated existing address with User ID:", address);
        } else {
            // Create a new address if it doesn't exist
            console.log("Creating a new address...");
            address = new addressModels({
                firstName: contactInfo.firstName,
                lastName: contactInfo.lastName,
                address: contactInfo.address,
                apartment: contactInfo.apartment,
                email: contactInfo.email,
                mobileNumber: contactInfo.mobileNumber,
                state: contactInfo.state,
                city: contactInfo.city,
                landmark: contactInfo.landmark,
                typeOfAddress: contactInfo.typeOfAddress || 'Home',
                User: user._id,
            });
            await address.save();
            console.log("New address created:", address);
        }

        // Create the new order with `isPaid` set to true
        console.log("Creating a new order...");
        const newOrder = new orderModels({
            user: user._id,
            contactInfo,
            totalAmount,
            cart: cart._id,
            address: address._id,
            paymentMethod,
            isPaid: true, 
            razorpay_order_id,
            razorpay_payment_id,

        });
        await newOrder.save();
        console.log("New order created:", newOrder);

        

        return response;

    } catch (error) {
        console.error('Error processing order:', error);
        return NextResponse.json({ msg: "Error processing order", error: error.message || error }, { status: 500 });
    }
};
