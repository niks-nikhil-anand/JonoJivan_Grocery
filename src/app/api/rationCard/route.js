import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import RationCard from '@/models/rationCardModel';
import uploadImage from '@/lib/uploadImages';

export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();

    // Extract fields
    const name = formData.get('name');
    const fatherName = formData.get('fatherName');
    const whatsappNo = formData.get('whatsappNo');
    const email = formData.get('email');
    const dob = formData.get('dob');
    const address = formData.get('address');
    const state = formData.get('state');
    const pincode = formData.get('pincode');

    // Bank Details
    const accountNumber = formData.get('accountNumber');
    const ifscCode = formData.get('ifscCode');
    const bankName = formData.get('bankName');

    // Files
    const profilePictureFile = formData.get('profilePicture');
    const aadhaarCardNumber = formData.get('aadhaarCardNumber');
    const panCardNumber = formData.get('panCardNumber');

    // Upload Files if present
    let profilePictureUrl = "";
    if (profilePictureFile && profilePictureFile instanceof File) {
      const uploadResult = await uploadImage(profilePictureFile, 'ration_cards/profiles');
      profilePictureUrl = uploadResult.secure_url;
    }



    // Generate Unique Number
    // Format: RC + Timestamp last 6 + Random 4
    const uniqueNumber = `RC${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;

    const newRationCard = new RationCard({
      name,
      fatherName,
      whatsappNo,
      email,
      dob,
      address,
      state,
      pincode,
      accountNumber, // Note: Model expects nested bankDetails or flat?
                     // Let's check model. Model has:
                     // bankDetails: { accountNumber, ifscCode, bankName }
                     // So we need to structure it.
      bankDetails: {
        accountNumber,
        ifscCode,
        bankName
      },
      profilePicture: profilePictureUrl,
      aadhaarCardNumber,
      panCardNumber,
      uniqueNumber
    });

    await newRationCard.save();

    return NextResponse.json({
      success: true,
      message: 'Ration Card created successfully',
      data: newRationCard
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating Ration Card:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { uniqueNumber: { $regex: search, $options: 'i' } },
        { aadhaarCardNumber: { $regex: search, $options: 'i' } },
        { panCardNumber: { $regex: search, $options: 'i' } },
        { whatsappNo: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const data = await RationCard.find(query)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const total = await RationCard.countDocuments(query);

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching Ration Cards:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}
