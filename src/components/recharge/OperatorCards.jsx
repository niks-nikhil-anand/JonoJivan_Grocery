import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { OPERATORS } from "@/config/recharge";
import OperatorBadge from "./OperatorBadge";

/** Grid of the four operators, each linking to its own recharge page. */
export default function OperatorCards({ exclude, title = "Recharge by operator" }) {
  const list = OPERATORS.filter((o) => o.slug !== exclude);
  return (
    <section aria-labelledby="operator-cards-title" className="py-12 lg:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="operator-cards-title" className="font-display text-2xl font-bold text-ink sm:text-3xl">
          {title}
        </h2>
        <ul className={`mt-6 grid gap-3 sm:gap-4 ${list.length === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-3"}`}>
          {list.map((op) => (
            <li key={op.slug}>
              <Link
                href={`/recharge/${op.slug}`}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-charge-200 hover:shadow-lift sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <OperatorBadge operator={op} />
                  <LuArrowRight
                    className="text-ink-soft transition group-hover:translate-x-0.5 group-hover:text-charge-600"
                    aria-hidden
                  />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-ink sm:text-lg">{op.name} recharge</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-muted sm:text-sm">{op.tagline}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
