import { cookies } from "next/headers";
import VendorShell from "@/components/vendorPanel/VendorShell";
import VendorSignIn from "@/components/vendorPanel/VendorSignIn";
import "@/components/vendorPanel/vendor.css";
export const metadata = { title: "Vendor sign in | JonoJivan", robots: "noindex, nofollow" };
export default function Page(){const value=cookies().get("vendor-theme")?.value;return <VendorShell auth initialTheme={["dark","light","system"].includes(value)?value:"system"}><VendorSignIn/></VendorShell>;}
