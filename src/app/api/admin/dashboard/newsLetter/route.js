import { NextResponse } from 'next/server';
import connectDB from "@/lib/dbConnect";
import { Resend } from "resend";
import NewsLetterEmail from '@/emails/NewsLetterEmail';

export async function POST(req) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email subscriptions are temporarily unavailable." }, { status: 503 });
    }
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    // Parse incoming request data
    const { name, email } = await req.json();

    // Validate the request data
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Check if the email already exists in the database to avoid duplicate subscriptions
    const existingSubscription = await NewsLetter.findOne({ email });
    if (existingSubscription) {
      return NextResponse.json({ error: 'Email is already subscribed.' }, { status: 409 });
    }

    // Create a new subscription document and save it to the database
    const newSubscription = new NewsLetter({ name, email });
    await newSubscription.save();


    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'no-reply@cleanveda.com',
      to: email,
      subject: 'Welcome to JonoJivan - Enjoy 15% Off Your First Order!',
      react: (
        <NewsLetterEmail fullName={name} />
      ),
    });
    console.log("Welcome email sent to:", email);

    return NextResponse.json({ message: 'Subscription successful!' }, { status: 200 });
  } catch (error) {
    console.error('Error processing subscription:', error);
    return NextResponse.json({ error: 'An error occurred while processing your subscription' }, { status: 500 });
  }
}
