import Link from "next/link";
import { LuGift, LuArrowRight } from "react-icons/lu";
import { Container } from "./ui/Section";
import { crossSell } from "@/config/home";

/** ⑩ Links the two services into one habit. Hidden until the offer is approved. */
export default function CrossSell() {
  if (!crossSell.enabled) return null;
  return (
    <section className="py-6 lg:py-10">
      <Container>
        <div className="grid overflow-hidden rounded-3xl shadow-card sm:grid-cols-[1fr_auto]">
          <div className="flex items-center gap-4 bg-gradient-to-r from-charge-600 to-brand-600 p-5 text-white sm:p-8">
            <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-3xl sm:flex">
              <LuGift aria-hidden />
            </span>
            <div>
              <p className="font-display text-lg font-bold leading-snug sm:text-2xl">{crossSell.headline}</p>
              <p className="mt-1 text-sm text-white/80">{crossSell.subline}</p>
            </div>
          </div>
          <Link
            href="#recharge"
            className="flex items-center justify-center gap-2 bg-brand-700 px-8 py-4 text-sm font-bold text-white transition hover:bg-brand-800"
          >
            Recharge now <LuArrowRight aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  );
}
