import connectDB from "@/lib/dbConnect";
import addressModels from "@/models/addressModels";
import cartModels from "@/models/cartModels";
import orderModels from "@/models/orderModels";
import { NextResponse } from "next/server";


export const GET = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    // Fetch all orders and populate related fields
    const orders = await orderModels
      .find()
      .populate("user") 


      const ordersWithCartAndAddress = await Promise.all(orders.map(async (order) => {
        // Find the related cart and address using their IDs
        const cart = await cartModels.findById(order.cart);
        const address = await addressModels.findById(order.address);
  
        // Attach the cart and address data to the order object
        orders.cartDetails = cart;
        orders.addressDetails = address;
  
        return orders; // Return the updated order object
      }));

      console.log(orders)


 

    console.log("Fetched orders with populated fields:", orders);

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { msg: "Error fetching orders", error: error.message },
      { status: 500 }
    );
  }
};
