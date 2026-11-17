import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
export class VendorError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
export async function requireVendor() {
  let payload;
  try {
    payload = jwt.verify(
      cookies().get("vendorAuthToken")?.value || "",
      process.env.JWT_SECRET,
      { algorithms: ["HS256"] },
    );
  } catch {
    throw new VendorError(
      "Your session has expired. Please sign in again.",
      401,
    );
  }
  if (
    typeof payload !== "object" ||
    typeof payload.id !== "string" ||
    typeof payload.email !== "string"
  )
    throw new VendorError("Please sign in again.", 401);
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    include: { vendorProfile: true },
  });
  if (
    !user ||
    user.email !== payload.email ||
    user.role !== "VENDOR" ||
    user.status !== "ACTIVE"
  )
    throw new VendorError(
      "This account cannot access the vendor workspace.",
      403,
    );
  return user;
}
export function publicVendor(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    mobileNumber: user.mobileNumber,
    profileImage: user.profileImage,
    vendorProfile: user.vendorProfile,
  };
}
