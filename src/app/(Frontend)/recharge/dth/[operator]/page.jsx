import { Suspense } from "react";
import { notFound } from "next/navigation";
import DthRecharge from "@/components/recharge/DthRecharge";
import RechargeFaq from "@/components/recharge/RechargeFaq";
import { DISCLAIMER, DTH_OPERATORS, GENERAL_FAQS, getDthOperator } from "@/config/recharge";

export const dynamicParams = false;
export const generateStaticParams = () => DTH_OPERATORS.map((o) => ({ operator: o.slug }));

export function generateMetadata({ params }) {
  const op = getDthOperator(params.operator);
  if (!op) return {};
  return {
    title: `${op.name} Recharge Online | JonoJivan`,
    description: `Recharge your ${op.name} connection online and pay securely with UPI, cards or net banking on JonoJivan.`,
    alternates: { canonical: `/recharge/dth/${op.slug}` },
  };
}

export default function DthOperatorPage({ params }) {
  if (!getDthOperator(params.operator)) notFound();
  return (
    <main className="bg-cream">
      <Suspense fallback={<div className="h-[560px] bg-charge-700" aria-hidden />}>
        <DthRecharge initialOperator={params.operator} />
      </Suspense>
      <RechargeFaq items={GENERAL_FAQS} />
      <p className="mx-auto max-w-3xl px-4 pb-10 text-center text-xs leading-relaxed text-ink-soft sm:px-6">{DISCLAIMER}</p>
    </main>
  );
}
