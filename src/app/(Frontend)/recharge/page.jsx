import { Suspense } from "react";
import RechargeExperience from "@/components/recharge/RechargeExperience";
import OperatorCards from "@/components/recharge/OperatorCards";
import RechargeSteps from "@/components/recharge/RechargeSteps";
import RechargeFaq from "@/components/recharge/RechargeFaq";
import { DISCLAIMER, GENERAL_FAQS } from "@/config/recharge";

export const metadata = {
  title: "Mobile Recharge Online — Jio, Airtel, Vi, BSNL | JonoJivan",
  description:
    "Recharge Jio, Airtel, Vi and BSNL prepaid numbers online. Browse plans for your circle and pay securely with UPI, cards or net banking on JonoJivan.",
  alternates: { canonical: "/recharge" },
};

export default function RechargePage() {
  return (
    <main className="bg-cream">
      <Suspense fallback={<div className="h-[640px] bg-charge-700" aria-hidden />}>
        <RechargeExperience />
      </Suspense>
      <OperatorCards />
      <RechargeSteps />
      <RechargeFaq items={GENERAL_FAQS} />
      <p className="mx-auto max-w-3xl px-4 pb-10 text-center text-xs leading-relaxed text-ink-soft sm:px-6">{DISCLAIMER}</p>
    </main>
  );
}
