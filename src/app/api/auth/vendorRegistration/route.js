import connectDB from "@/lib/dbConnect";
import uploadImage from "@/lib/uploadImages";
import userModels from "@/models/userModels";
import vendorModels from "@/models/vendorModels";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    const formData = await req.formData();
    console.log("Form data received:", formData);

    const fullName = formData.get("fullName");
    const email = formData.get("email");
    let mobileNumber = formData.get("mobileNumber");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const dob = formData.get("dob");
    const gender = formData.get("gender");
    const businessName = formData.get("businessName");
    const noOfEmployee = formData.get("noOfEmployee");
    const businessAddress = formData.get("businessAddress");
    const adhaarCard = formData.get("adhaarCard");
    const panCard = formData.get("panCard");
    const bankPassbook = formData.get("bankPassbook");
    const msmsCertificate = formData.get("msmsCertificate");
    const gstCertificate = formData.get("gstCertificate");
    const tradeLicence = formData.get("tradeLicence");
    const shopPhoto = formData.get("shopPhoto");

    console.log("Received values:", {
      fullName,
      email,
      mobileNumber,
      password,
      confirmPassword,
      dob,
      gender,
      businessName,
      noOfEmployee,
      businessAddress,
      adhaarCard,
      panCard,
      bankPassbook,
      msmsCertificate,
      gstCertificate,
      tradeLicence,
      shopPhoto,
    });

    // Validate password match
    if (password !== confirmPassword) {
      console.log("Validation failed: Passwords do not match.");
      return NextResponse.json({ msg: "Passwords do not match." }, { status: 400 });
    }

    // Validate the mobile number to ensure it is a 10-digit number
    const mobileNumberPattern = /^\d{10}$/;
    if (!mobileNumberPattern.test(mobileNumber)) {
      console.log("Validation failed: Invalid mobile number.");
      return NextResponse.json({ msg: "Please provide a valid 10-digit mobile number." }, { status: 400 });
    }

    // Add country code +91
    mobileNumber = `+91${mobileNumber}`;
    console.log("Formatted mobile number:", mobileNumber);

    // Check if the email or mobile number already exists
    const existingUser = await userModels.findOne({ $or: [{ email }, { mobileNumber }] });
    if (existingUser) {
      console.log("Validation failed: User already exists with the provided email or mobile number.");
      return NextResponse.json({ msg: "User with this email or mobile number already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully.");

    // Upload images to Cloudinary (if they exist)
    const adhaarCardUrl = adhaarCard ? await uploadImage(adhaarCard) : null;
    const panCardUrl = panCard ? await uploadImage(panCard) : null;
    const bankPassbookUrl = bankPassbook ? await uploadImage(bankPassbook) : null;
    const msmsCertificateUrl = msmsCertificate ? await uploadImage(msmsCertificate) : null;
    const gstCertificateUrl = gstCertificate ? await uploadImage(gstCertificate) : null;
    const tradeLicenceUrl = tradeLicence ? await uploadImage(tradeLicence) : null;
    const shopPhotoUrl = shopPhoto ? await uploadImage(shopPhoto) : null;

    const vendorData = {
      fullName,
      email,
      mobileNumber,
      password: hashedPassword,
      dob,
      gender,
      businessName,
      numberOfEmployees: noOfEmployee,
      businessAddress,
      adhaarCard: adhaarCardUrl?.secure_url || '',
      panCard: panCardUrl?.secure_url || '',
      bankPassbook: bankPassbookUrl?.secure_url || '',
      msmsCertificate: msmsCertificateUrl?.secure_url || '',
      gstCertificate: gstCertificateUrl?.secure_url || '',
      tradeLicence: tradeLicenceUrl?.secure_url || '',
      shopPhoto: shopPhotoUrl?.secure_url || '',
    };

    const vendor = new vendorModels(vendorData);
    await vendor.save();
    console.log("Vendor saved to the database:", vendor);

    const userData = {
      fullName,
      email,
      mobileNumber,
      password: hashedPassword,
      vendor: vendor._id,
      role: "Vendor",
    };

    const user = new userModels(userData);
    await user.save();
    console.log("User saved to the database:", user);

    return NextResponse.json({ msg: "Account created successfully" }, { status: 200 });
  } catch (error) {
    console.log("Error creating account:", error.message);
    return NextResponse.json({ msg: "Error creating account", error: error.message }, { status: 500 });
  }
};
