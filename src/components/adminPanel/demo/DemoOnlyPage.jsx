import { AdminPage } from "../AdminPage";
export default function DemoOnlyPage() {
  return (
    <AdminPage>
      <section className="v-panel p-6">
        <h1 className="text-xl font-semibold">
          Available in the demo workspace
        </h1>
        <p className="mt-3 v-muted">
          Choose “Enter demo” above to use this page with connected sample data.
        </p>
      </section>
    </AdminPage>
  );
}
