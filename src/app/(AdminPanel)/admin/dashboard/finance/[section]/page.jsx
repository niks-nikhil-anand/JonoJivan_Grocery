import FinanceDemoPage from "@/components/adminPanel/DemoDataPage";

export default async function FinanceSectionPage({ params }) {
  const { section } = await params;
  return <FinanceDemoPage section={section} />;
}
