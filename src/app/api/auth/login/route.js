import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { email, password, rememberMe } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) return NextResponse.json({ msg: "Invalid email or password" }, { status: 401 });
    if (user.status !== "ACTIVE" || user.role !== "USER") return NextResponse.json({ msg: "Not Authorised" }, { status: 403 });
    const token = jwt.sign({ id: String(user.id || user._id), email: user.email }, process.env.JWT_SECRET, { expiresIn: "1w" });
    const response = NextResponse.json({ msg: "Login successful" });
    response.cookies.set("userAuthToken", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: rememberMe ? 2592000 : 604800, path: "/" });
    return response;
  } catch (error) { return NextResponse.json({ msg: "Error processing login", error: error.message || error }, { status: 500 }); }
}
