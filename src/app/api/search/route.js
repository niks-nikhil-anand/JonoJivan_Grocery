import connectDB from "@/lib/dbConnect";
import productModels from "@/models/productModels";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  // Extract search params properly from URL
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  console.log("Search Query:", query);

  try {
    await connectDB();
    console.log("Database connected successfully");

    // Split the query into individual words
    const queryWords = query.split(/\s+/).filter(word => word.length > 0);

    // Create a regex pattern that matches any of the words in the query
    const regexPattern = queryWords.map(word => `(?=.*\\b${word}\\b)`).join('');

    // Search for products whose name matches any word in the query
    const nameMatches = await productModels.find({
      name: { $regex: new RegExp(regexPattern, "i") },
    });
    console.log(`Found ${nameMatches.length} products matching the name`);

    // Search for products whose tags match any word in the query
    const tagMatches = await productModels.find({
      tags: { $regex: new RegExp(regexPattern, "i") },
    });
    console.log(`Found ${tagMatches.length} products matching tags`);

    // Combine all results into a single array
    const allMatches = [...nameMatches, ...tagMatches];

    // Remove duplicates (products that match multiple criteria)
    const uniqueMatches = allMatches.filter(
      (product, index, self) =>
        index === self.findIndex((p) => p._id.toString() === product._id.toString())
    );
    console.log(`Total unique products found: ${uniqueMatches.length}`);

    // Return the combined and unique results
    return NextResponse.json(uniqueMatches, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    if (error.name === 'CastError') {
      console.log("Invalid product ID format:", error.value);
      return NextResponse.json({ msg: "Invalid product ID format" }, { status: 400 });
    }
    return NextResponse.json({ msg: "Error fetching products", error: error.message }, { status: 500 });
  }
};