import { cookies } from "next/headers";
import AdminShell from "@/components/adminPanel/AdminShell";
export const metadata = {
  title: "Admin workspace | JonoJivan",
  robots: "noindex, nofollow",
};
export default function AdminDashboardLayout({ children }) {
  const preference = cookies().get("admin-theme")?.value;
  return (
    <AdminShell
      initialTheme={
        ["dark", "light", "system"].includes(preference) ? preference : "system"
      }
    >
      {children}
    </AdminShell>
  );
}
