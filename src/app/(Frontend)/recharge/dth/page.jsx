import { Suspense } from "react";
import DthRecharge from "@/components/recharge/DthRecharge";
import RechargeFaq from "@/components/recharge/RechargeFaq";
import { DISCLAIMER, GENERAL_FAQS } from "@/config/recharge";

export const metadata = {
  title: "DTH Recharge Online — Tata Play, Airtel, Dish TV, d2h, Sun Direct | JonoJivan",
  description: "Recharge Tata Play, Airtel Digital TV, Dish TV, d2h and Sun Direct online. Pay securely with UPI, cards or net banking on JonoJivan.",
  alternates: { canonical: "/recharge/dth" },
};

export default function DthPage() {
  return (
    <main className="bg-cream">
      <Suspense fallback={<div className="h-[560px] bg-charge-700" aria-hidden />}>
        <DthRecharge />
      </Suspense>
      <RechargeFaq items={GENERAL_FAQS} />
      <p className="mx-auto max-w-3xl px-4 pb-10 text-center text-xs leading-relaxed text-ink-soft sm:px-6">{DISCLAIMER}</p>
    </main>
  );
}
