"use client";
import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LuPlus } from "react-icons/lu";

/** Animated accordion used on the recharge pages. */
export default function RechargeFaq({ items, title = "Recharge FAQs" }) {
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();
  const baseId = useId();

  return (
    <section aria-labelledby={`${baseId}-title`} className="bg-gradient-to-b from-cream to-charge-50/40 py-12 lg:py-16">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-charge-600">FAQ</p>
        <h2 id={`${baseId}-title`} className="font-display text-2xl font-bold text-ink sm:text-3xl">
          {title}
        </h2>
        <ul className="mt-6 space-y-3">
          {items.map(({ q, a }, i) => {
            const isOpen = open === i;
            return (
              <li
                key={q}
                className={`group overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                  isOpen
                    ? "border-charge-200 shadow-[0_18px_40px_-12px_rgb(79_70_229/0.25)]"
                    : "border-black/5 shadow-card hover:-translate-y-0.5 hover:shadow-lift"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={`${baseId}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${baseId}-a${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left"
                  >
                    <span className={`flex-1 font-display text-[15px] font-semibold ${isOpen ? "text-charge-700" : "text-ink group-hover:text-charge-700"}`}>
                      {q}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen ? "rotate-45 bg-charge-600 text-white" : "bg-charge-50 text-charge-700"
                      }`}
                    >
                      <LuPlus aria-hidden />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`${baseId}-a${i}`}
                      role="region"
                      aria-labelledby={`${baseId}-q${i}`}
                      initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-ink-muted sm:text-[15px]">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
