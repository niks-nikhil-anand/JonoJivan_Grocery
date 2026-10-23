import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const postgresRoles = { USER: "User", SUPER_ADMIN: "SuperAdmin", VENDOR: "Vendor" };
const postgresStatuses = { ACTIVE: "Active", BLOCKED: "Blocked", PENDING: "Pending", IN_REVIEW: "inReview" };

export class SessionAuthError extends Error {
  constructor(message, status = 401) {
    super(message);
    this.name = "SessionAuthError";
    this.status = status;
  }
}

function mongoCompatibleUser(user) {
  return {
    _id: user.id,
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    mobileNumber: user.mobileNumber,
    password: user.passwordHash,
    isVerified: user.isVerified,
    isVerifiedExpires: user.verificationExpiresAt,
    resetPasswordToken: user.resetPasswordToken || "",
    resetPasswordExpires: user.resetPasswordExpiresAt,
    profilePic: user.profileImage || "",
    address: user.addresses.map((address) => address.id),
    role: postgresRoles[user.role],
    status: postgresStatuses[user.status],
    isToken: "",
    orderHistory: user.orders.map((order) => order.id),
    wishlist: user.wishlist ? [user.wishlist.id] : [],
    vendor: user.vendorProfile?.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function verifyUserToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || typeof decoded === "string" || !decoded.id || !decoded.email) {
      throw new SessionAuthError("Invalid token.");
    }
    return decoded;
  } catch (error) {
    if (error instanceof SessionAuthError) throw error;
    throw new SessionAuthError("Invalid token.");
  }
}

async function findPostgresUser({ id, email }) {
  const user = await prisma.user.findFirst({
    where: { id, email },
    include: {
      addresses: { select: { id: true } },
      orders: { select: { id: true } },
      wishlist: { select: { id: true } },
      vendorProfile: { select: { id: true } },
    },
  });
  if (!user) throw new SessionAuthError("User not found.", 404);
  if (user.status !== "ACTIVE" || user.role !== "USER") {
    throw new SessionAuthError("Not Authorised", 403);
  }
  return mongoCompatibleUser(user);
}

export async function getCurrentUserFromCookie(cookieValue) {
  if (!cookieValue) throw new SessionAuthError("User authentication token is missing.");
  const token = verifyUserToken(cookieValue);
  return findPostgresUser({ id: String(token.id), email: token.email });
}
