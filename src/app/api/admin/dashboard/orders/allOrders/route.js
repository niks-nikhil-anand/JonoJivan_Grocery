import connectDB from "@/lib/dbConnect";
import orderModels from "@/models/orderModels";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    const query = {};
    if (search) {
      query.$or = [
        { invoiceNo: { $regex: search, $options: 'i' } },
        { orderStatus: { $regex: search, $options: 'i' } },
        { paymentMethod: { $regex: search, $options: 'i' } },
        { paymentStatus: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const orders = await orderModels.find(query)
      .populate('user', 'fullName email mobileNumber')
      .populate('address')
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const total = await orderModels.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, msg: "Error fetching orders", error: error.message },
      { status: 500 }
    );
  }
};
