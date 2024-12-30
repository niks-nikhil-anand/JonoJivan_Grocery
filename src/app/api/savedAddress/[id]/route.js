import connectDB from "@/lib/dbConnect";
import addressModels from "@/models/addressModels";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { id } = params;
  

  if (!id) {
    return NextResponse.json({ msg: "ID parameter is required" }, { status: 400 });
  }

  try {
    await connectDB();

    const Address = await addressModels.findById(id);
    console.log(Address)
    
    if (!Address) {
      return NextResponse.json({ msg: "Address not found" }, { status: 404 });
    }

    return NextResponse.json(Address, { status: 200 });
  } catch (error) {
    console.error('Error fetching address:', error);
    return NextResponse.json({ msg: "Error fetching address", error: error.message }, { status: 500 });
  }
};
