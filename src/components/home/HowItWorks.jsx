import Image from "next/image";
import { LuSearch, LuWallet, LuTruck } from "react-icons/lu";
import Section from "./ui/Section";
import deliveryImg from "../../../public/frontend/Banner/footerBanner.png";

const steps = [
  {
    icon: LuSearch,
    title: "Choose",
    text: "Add groceries to your cart, or enter your number and pick a recharge plan.",
  },
  {
    icon: LuWallet,
    title: "Pay your way",
    text: "UPI, cards and net banking through Razorpay — or cash on delivery for groceries.",
  },
  {
    icon: LuTruck,
    title: "Delivered or recharged",
    text: "Your order heads to your door; your recharge reflects on your number.",
  },
];

/** ⑦ Trust through clarity — three steps, no surprises. */
export default function HowItWorks() {
  return (
    <Section eyebrow="How it works" title="Three steps. That's it." subtitle="No queues, no running around.">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <ol className="relative space-y-6 lg:space-y-8">
          {/* connecting line */}
          <span aria-hidden className="absolute bottom-6 left-6 top-6 w-px bg-gradient-to-b from-brand-300 via-brand-200 to-transparent" />
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative flex gap-4">
              <span className="relative z-[1] flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-xl text-white shadow-lg shadow-brand-600/25">
                <Icon aria-hidden />
              </span>
              <div className="pt-1">
                <p className="text-xs font-semibold text-brand-700">Step {i + 1}</p>
                <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
                <p className="mt-1 text-sm text-ink-muted sm:text-base">{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="relative overflow-hidden rounded-3xl bg-[#47704C]">
          <Image
            src={deliveryImg}
            alt="Delivery person holding a box of fresh vegetables"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-auto w-full"
          />
        </div>
      </div>
    </Section>
  );
}
