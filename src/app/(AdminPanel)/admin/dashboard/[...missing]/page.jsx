import { notFound } from "next/navigation";
import { resolveRoute, BASE } from "@/lib/admin/demo/routes";
import { AdminPage } from "@/components/adminPanel/AdminPage";
export default function Page({ params }) {
  if (!resolveRoute(`${BASE}/${params.missing.join("/")}`)) notFound();
  return <AdminPage><section className="v-panel p-6"><h1 className="text-xl font-semibold">Available in the demo workspace</h1><p className="mt-3 v-muted">Choose “Enter demo” above to use this page with connected sample data.</p></section></AdminPage>;
}
