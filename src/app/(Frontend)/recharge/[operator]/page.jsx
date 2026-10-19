import { Suspense } from "react";
import { notFound } from "next/navigation";
import RechargeExperience from "@/components/recharge/RechargeExperience";
import OperatorCards from "@/components/recharge/OperatorCards";
import RechargeSteps from "@/components/recharge/RechargeSteps";
import RechargeFaq from "@/components/recharge/RechargeFaq";
import { DISCLAIMER, GENERAL_FAQS, OPERATORS, getOperator } from "@/config/recharge";

// Pre-render /recharge/jio, /recharge/airtel, /recharge/vi, /recharge/bsnl
export function generateStaticParams() {
  return OPERATORS.map((o) => ({ operator: o.slug }));
}
export const dynamicParams = false;

export function generateMetadata({ params }) {
  const op = getOperator(params.operator);
  if (!op) return {};
  return {
    title: op.seo.title,
    description: op.seo.description,
    alternates: { canonical: `/recharge/${op.slug}` },
  };
}

export default function OperatorRechargePage({ params }) {
  const op = getOperator(params.operator);
  if (!op) notFound();

  return (
    <main className="bg-cream">
      <Suspense fallback={<div className="h-[640px] bg-charge-700" aria-hidden />}>
        <RechargeExperience initialOperator={op.slug} />
      </Suspense>
      <RechargeSteps />
      <RechargeFaq title={`${op.name} recharge FAQs`} items={[...op.faqs, ...GENERAL_FAQS]} />
      <OperatorCards exclude={op.slug} title="Recharge another operator" />
      <p className="mx-auto max-w-3xl px-4 pb-10 text-center text-xs leading-relaxed text-ink-soft sm:px-6">{DISCLAIMER}</p>
    </main>
  );
}
