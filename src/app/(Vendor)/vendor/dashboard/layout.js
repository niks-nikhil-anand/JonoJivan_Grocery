import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireVendor, publicVendor, VendorError } from "@/lib/vendor/server";
import VendorShell from "@/components/vendorPanel/VendorShell";
import "@/components/vendorPanel/vendor.css";
export const metadata = { title: "Vendor workspace | JonoJivan", robots: "noindex, nofollow" };
export const dynamic = "force-dynamic";
export default async function VendorLayout({ children }) {
  let user;
  try { user = await requireVendor(); } catch (error) { if (error instanceof VendorError) redirect("/vendor/auth"); throw error; }
  const preference = cookies().get("vendor-theme")?.value;
  const theme = ["dark","light","system"].includes(preference) ? preference : "system";
  return <VendorShell initialTheme={theme} user={JSON.parse(JSON.stringify(publicVendor(user)))}>{children}</VendorShell>;
}
