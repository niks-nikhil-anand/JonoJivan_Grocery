"use client";
import Link from "next/link";
import { AdminPage } from "@/components/adminPanel/AdminPage";
export default function Error({ reset }) {
  return (
    <AdminPage>
      <section className="v-panel space-y-4 p-8">
        <h1 className="text-xl font-semibold">Unable to load this page</h1>
        <p className="v-muted">Please try again or return to the dashboard.</p>
        <button className="v-button" onClick={reset}>
          Try again
        </button>{" "}
        <Link className="v-button secondary" href="/admin/dashboard">
          Back to dashboard
        </Link>
      </section>
    </AdminPage>
  );
}
