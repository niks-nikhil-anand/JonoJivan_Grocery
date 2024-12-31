import connectDB from "@/lib/dbConnect";
import orderModels from "@/models/orderModels";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ msg: "ID parameter is required" }, { status: 400 });
  }

  try {
    await connectDB();

    // Find the order by ID and populate cart and address fields
    const Order = await orderModels.findById(id);

    if (!Order) {
      return NextResponse.json({ msg: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(Order, { status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { msg: "Error fetching order", error: error.message },
      { status: 500 }
    );
  }
};

export const PATCH = async (request, { params }) => {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ msg: "ID parameter is required" }, { status: 400 });
  }

  try {
    await connectDB();

    const body = await request.json();

    // Validate that the body contains updates
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ msg: "No data provided to update" }, { status: 400 });
    }

    // Find and update the order
    const updatedOrder = await orderModels.findByIdAndUpdate(id, body, {
      new: true, // Return the updated document
      runValidators: true, // Validate before saving
    });

    if (!updatedOrder) {
      return NextResponse.json({ msg: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { msg: "Error updating order", error: error.message },
      { status: 500 }
    );
  }
};

