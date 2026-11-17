import Link from "next/link";
import { AdminPage } from "@/components/adminPanel/AdminPage";
export default function NotFound() {
  return (
    <AdminPage>
      <section className="v-panel space-y-4 p-8 text-center">
        <p className="text-sm font-semibold v-green">404 · Page not found</p>
        <h1 className="text-2xl font-semibold">
          This page isn’t in your workspace.
        </h1>
        <p className="v-muted">Check the link or return to the dashboard.</p>
        <Link className="v-button" href="/admin/dashboard">
          Back to dashboard
        </Link>
      </section>
    </AdminPage>
  );
}
