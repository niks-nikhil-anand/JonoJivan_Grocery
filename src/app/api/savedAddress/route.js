export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import User from '@/models/userModels'; // Import the User model
import Address from '@/models/addressModels'; 
import connectDB from '@/lib/dbConnect';

export async function GET(req) {
  try {
    // Attempt to connect to the database
    await connectDB();
    console.log("Database connected successfully for GET request");

    // Retrieve the authentication token from cookies
    const cookieStore = cookies();
    const authToken = cookieStore.get('userAuthToken');
    console.log('Auth Token:', authToken);

    // Check if token is present
    if (!authToken) {
      console.log('No authentication token found.');
      return NextResponse.json({ message: 'User not logged in' }, { status: 400 });
    }

    // Decode the token
    const decodedToken = jwt.decode(authToken.value);
    console.log('Decoded Token:', decodedToken);

    if (!decodedToken || !decodedToken.id) {
      console.log('Invalid token or token does not contain user ID:', decodedToken);
      throw new Error("Invalid token.");
    }

    // Extract user ID from the decoded token
    const userId = decodedToken.id;
    console.log('Decoded Token ID:', userId);

    // Fetch the user by ID and populate the addresses
    const user = await User.findById(userId).populate('address'); // Populate address field with details
    console.log('User with Populated Addresses:', user);

    if (!user) {
      console.log('User not found.');
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return the populated addresses
    return NextResponse.json(user.address);
  } catch (error) {
    // Log the error details for debugging
    console.error('Error retrieving saved addresses:', error);
    return NextResponse.json(
      { message: 'Address retrieval failed', error: error.message },
      { status: 500 }
    );
  }
}
