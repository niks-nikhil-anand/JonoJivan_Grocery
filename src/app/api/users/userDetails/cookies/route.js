import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUserFromCookie } from "@/lib/authSession";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUserFromCookie(cookies().get("userAuthToken")?.value);
    return NextResponse.json(user);
  } catch (error) {
    const status = Number.isInteger(error?.status) ? error.status : 500;
    return NextResponse.json({ msg: "Error retrieving user", error: error.message }, { status });
  }
}
