import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import RationCard from '@/models/rationCardModel';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const rationCard = await RationCard.findById(id);

    if (!rationCard) {
      return NextResponse.json({ success: false, message: 'Ration Card not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rationCard }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const updateData = await req.json();

    const rationCard = await RationCard.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!rationCard) {
      return NextResponse.json({ success: false, message: 'Ration Card not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rationCard, message: "Updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const rationCard = await RationCard.findByIdAndDelete(id);

    if (!rationCard) {
      return NextResponse.json({ success: false, message: 'Ration Card not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Ration Card deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
