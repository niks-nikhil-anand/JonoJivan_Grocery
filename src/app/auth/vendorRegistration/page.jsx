

const resend = new Resend(process.env.RESEND_API_KEY);

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

    if (
      !fullName ||
      !email ||
      !mobileNumber ||
      !password ||
      !confirmPassword ||
      !dob ||
      !gender ||
      !businessName ||
      !noOfEmployee ||
      !businessAddress
    ) {
      console.log("Validation failed: Missing required fields.");
      return NextResponse.json({ msg: "Please provide all the required fields." }, { status: 400 });
    }

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

    // Upload images to Cloudinary
    const adhaarCardUrl = adhaarCard ? await uploadImages(adhaarCard) : null;
    const panCardUrl = panCard ? await uploadImages(panCard) : null;
    const bankPassbookUrl = bankPassbook ? await uploadImages(bankPassbook) : null;
    const msmsCertificateUrl = msmsCertificate ? await uploadImages(msmsCertificate) : null;
    const gstCertificateUrl = gstCertificate ? await uploadImages(gstCertificate) : null;
    const tradeLicenceUrl = tradeLicence ? await uploadImages(tradeLicence) : null;
    const shopPhotoUrl = shopPhoto ? await uploadImages(shopPhoto) : null;

    const userData = {
      fullName,
      email,
      mobileNumber,
      password: hashedPassword,
      dob,
      gender,
      businessName,
      noOfEmployee,
      businessAddress,
      adhaarCard: adhaarCardUrl,
      panCard: panCardUrl,
      bankPassbook: bankPassbookUrl,
      msmsCertificate: msmsCertificateUrl,
      gstCertificate: gstCertificateUrl,
      tradeLicence: tradeLicenceUrl,
      shopPhoto: shopPhotoUrl,
    };

    const user = new userModels(userData);
    await user.save();
    console.log("User saved to the database:", user);

    await resend.emails.send({
      from: 'no-reply@JonoJivan.com',
      to: email,
      subject: 'Welcome to JonoJivan',
      react: <WelcomeEmail fullName={fullName} />,
    });
    console.log("Welcome email sent to:", email);

    return NextResponse.json({ msg: "Account created successfully" }, { status: 200 });
  } catch (error) {
    console.log("Error creating account:", error.message);
    return NextResponse.json({ msg: "Error creating account", error: error.message }, { status: 500 });
  }
};
