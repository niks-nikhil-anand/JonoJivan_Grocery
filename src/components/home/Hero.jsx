import Image from "next/image";
import Link from "next/link";
import { LuShoppingBasket, LuSmartphone, LuWallet, LuShieldCheck, LuRotateCcw, LuZap } from "react-icons/lu";
import { Container } from "./ui/Section";
import groceryBag from "../../../public/frontend/slider/hero-img-1.webp";

const trust = [
  { icon: LuWallet, label: "Cash on delivery" },
  { icon: LuShieldCheck, label: "Secure online payments" },
  { icon: LuRotateCcw, label: "Easy returns" },
];

/** ① Hook — one promise, two doors. */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-cream to-cream">
      {/* soft background shapes */}
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-200/50 blur-3xl sm:h-96 sm:w-96" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-charge-100/70 blur-3xl" />

      <Container className="relative grid items-center gap-8 pb-10 pt-8 sm:pt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:pb-20 lg:pt-16">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-800 shadow-card">
            <span className="h-2 w-2 rounded-full bg-brand-500" aria-hidden />
            Groceries + Recharge, in one place
          </p>

          <h1 className="font-display text-[2rem] font-bold leading-[1.15] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]">
            Fresh groceries at your door.{" "}
            <span className="relative whitespace-nowrap text-brand-700">
              Recharge
              <svg aria-hidden viewBox="0 0 200 12" className="absolute -bottom-1 left-0 h-2.5 w-full text-offer-500" preserveAspectRatio="none">
                <path d="M2 9c40-6 120-8 196-3" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>{" "}
            in seconds.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base text-ink-muted sm:text-lg lg:mx-0">
            Daily needs, fruits, vegetables and mobile or DTH recharge — everything your home runs on, without the
            running around.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/product/shopAllProducts"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-base font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 sm:h-14 sm:px-8"
            >
              <LuShoppingBasket className="text-xl" aria-hidden />
              Shop groceries
            </Link>
            <Link
              href="#recharge"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-charge-600 px-6 text-base font-semibold text-white shadow-lg shadow-charge-600/25 transition hover:bg-charge-700 sm:h-14 sm:px-8"
            >
              <LuSmartphone className="text-xl" aria-hidden />
              Recharge now
            </Link>
          </div>

          <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-ink-muted lg:justify-start">
            {trust.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-1.5">
                <Icon className="text-brand-600" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none">
          <div className="relative aspect-[4/3] w-full">
            <div aria-hidden className="absolute inset-[6%] rounded-[40%] bg-gradient-to-br from-brand-100 to-brand-200" />
            <Image
              src={groceryBag}
              alt="A paper bag full of fresh vegetables, fruit, bread and dairy"
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 45vw, (min-width: 640px) 512px, 90vw"
              className="relative z-[1] h-full w-full object-contain drop-shadow-xl"
            />
          </div>

          {/* floating chips */}
          <div className="absolute left-0 top-[8%] z-[2] hidden items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-lift sm:flex animate-float">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
              <LuShoppingBasket aria-hidden />
            </span>
            <span className="text-left text-xs leading-tight">
              <span className="block font-semibold text-ink">Daily essentials</span>
              <span className="text-ink-muted">Fruits · Veg · Staples</span>
            </span>
          </div>
          <div className="absolute bottom-[6%] right-0 z-[2] flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-lift animate-float [animation-delay:1.5s]">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-charge-100 text-charge-700">
              <LuZap aria-hidden />
            </span>
            <span className="text-left text-xs leading-tight">
              <span className="block font-semibold text-ink">Mobile & DTH</span>
              <span className="text-ink-muted">Recharge in seconds</span>
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
