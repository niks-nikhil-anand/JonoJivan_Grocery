import AdminDemoListPage from "@/components/adminPanel/AdminDemoListPage";
export default function Page({ searchParams }) {
  return (
    <AdminDemoListPage
      key={searchParams.q || ""}
      type="orders"
      initialQuery={typeof searchParams.q === "string" ? searchParams.q : ""}
    />
  );
}
