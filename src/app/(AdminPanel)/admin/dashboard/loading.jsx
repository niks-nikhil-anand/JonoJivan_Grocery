import { AdminPage } from "@/components/adminPanel/AdminPage";
export default function Loading() {
  return (
    <AdminPage>
      <div
        role="status"
        aria-label="Loading admin workspace"
        className="space-y-5"
      >
        <span className="sr-only">Loading…</span>
        <div className="h-10 w-52 animate-pulse rounded-xl v-soft" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl v-soft" />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-2xl v-soft" />
      </div>
    </AdminPage>
  );
}
