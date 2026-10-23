import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import uploadImage from "@/lib/uploadImages";

const present = (card) => ({
  ...card, _id: card.id, profilePicture: card.profilePictureUrl,
  whatsappNo: card.whatsappNumber, aadhaarCardNumber: card.aadhaarNumber,
  panCardNumber: card.panNumber, dob: card.dateOfBirth, pincode: card.postalCode,
  bankDetails: { accountNumber: card.bankAccountNumber, ifscCode: card.bankIfscCode, bankName: card.bankName },
});

export async function POST(req) {
  try {
    const form = await req.formData();
    const image = form.get("profilePicture");
    const imageUrl = image instanceof File ? (await uploadImage(image, "ration_cards/profiles")).secure_url : null;
    const uniqueNumber = `RC${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;
    const card = await prisma.rationCard.create({ data: {
      name: String(form.get("name") || ""), fatherName: String(form.get("fatherName") || ""), uniqueNumber,
      whatsappNumber: form.get("whatsappNo") || null, email: form.get("email") || null,
      dateOfBirth: form.get("dob") ? new Date(String(form.get("dob"))) : null,
      address: form.get("address") || null, state: form.get("state") || null, postalCode: form.get("pincode") || null,
      bankAccountNumber: form.get("accountNumber") || null, bankIfscCode: form.get("ifscCode") || null, bankName: form.get("bankName") || null,
      profilePictureUrl: imageUrl, aadhaarNumber: form.get("aadhaarCardNumber") || null, panNumber: form.get("panCardNumber") || null,
    }});
    return NextResponse.json({ success: true, message: "Ration Card created successfully", data: present(card) }, { status: 201 });
  } catch (error) { console.error("Error creating Ration Card:", error); return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 }); }
}

export async function GET(req) {
  try {
    const q = new URL(req.url).searchParams, page = Math.max(1, Number(q.get("page")) || 1), limit = Math.min(100, Math.max(1, Number(q.get("limit")) || 10)), search = q.get("search") || "";
    const where = search ? { OR: ["name", "uniqueNumber", "aadhaarNumber", "panNumber", "whatsappNumber"].map((field) => ({ [field]: { contains: search, mode: "insensitive" } })) } : {};
    const sortBy = ["createdAt", "name", "uniqueNumber", "issuedAt"].includes(q.get("sortBy")) ? q.get("sortBy") : "createdAt";
    const [data, total] = await Promise.all([prisma.rationCard.findMany({ where, orderBy: { [sortBy]: q.get("order") === "asc" ? "asc" : "desc" }, skip: (page - 1) * limit, take: limit }), prisma.rationCard.count({ where })]);
    return NextResponse.json({ success: true, data: data.map(present), pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (error) { return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 }); }
}
