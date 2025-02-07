import connectDB from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    await connectDB();

    // Extract search params properly from URL
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    console.log("Search Query:", query);

    return NextResponse.json({ status: 200, query });
  } catch (error) {
    console.error("Error fetching Home Care products:", error);
    return NextResponse.json(
      { msg: "Error fetching products", error: error.message },
      { status: 500 }
    );
  }
};
