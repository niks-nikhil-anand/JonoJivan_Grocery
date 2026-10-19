import Image from "next/image";
import { LuMessageCircle, LuPhone, LuBadgePercent, LuBell } from "react-icons/lu";
import { Container } from "./ui/Section";
import { business } from "@/config/home";
import basket from "../../../public/frontend/slider/our-features-basket.png";

/** ⑫ Habit — offers on WhatsApp (more effective than email in India). */
export default function StayConnected() {
  const wa = business.whatsappNumber
    ? `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent("Hi JonoJivan! Please send me offers and updates.")}`
    : null;

  return (
    <section className="py-12 lg:py-20">
      <Container>
        <div className="relative grid items-center gap-6 overflow-hidden rounded-3xl bg-brand-800 p-6 text-white sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:p-14">
          <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand-600/50 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-200">Stay in the loop</p>
            <h2 className="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
              Get deals on WhatsApp before anyone else.
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-brand-100 sm:text-base">
              <li className="flex items-center gap-2"><LuBadgePercent aria-hidden /> Price drops on daily needs</li>
              <li className="flex items-center gap-2"><LuBell aria-hidden /> New arrivals and seasonal offers</li>
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 font-semibold text-white transition hover:brightness-95"
                >
                  <LuMessageCircle className="text-xl" aria-hidden />
                  Join on WhatsApp
                </a>
              )}
              <a
                href={`tel:${business.phone}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-6 font-semibold text-white transition hover:bg-white/10"
              >
                <LuPhone aria-hidden />
                Call {business.phone}
              </a>
            </div>
          </div>
          <div className="relative hidden justify-center sm:flex">
            <Image src={basket} alt="" sizes="(min-width: 1024px) 30vw, 50vw" className="h-auto w-64 drop-shadow-2xl lg:w-80" />
          </div>
        </div>
      </Container>
    </section>
  );
}
