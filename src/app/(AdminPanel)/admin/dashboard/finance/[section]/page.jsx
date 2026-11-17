import { notFound } from "next/navigation";
import FinanceDemoPage from "@/components/adminPanel/DemoDataPage";

export default async function FinanceSectionPage({ params }) {
  const { section } = await params;
  if (
    !["transactions", "refunds", "settlements", "expenses", "reports"].includes(
      section,
    )
  )
    notFound();
  return <FinanceDemoPage section={section} />;
}
