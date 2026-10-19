"use client";
import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LuPlus, LuPhone, LuMessageCircle, LuHeadphones } from "react-icons/lu";
import { Container } from "./ui/Section";
import { business, faqs } from "@/config/home";

/** ⑬ Remove the last doubts — animated accordion + "still have questions?" card. */
export default function Faq() {
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();
  const baseId = useId();
  const wa = business.whatsappNumber ? `https://wa.me/${business.whatsappNumber}` : null;

  return (
    <section id="faq" className="relative scroll-mt-24 overflow-hidden py-12 lg:py-20">
      {/* background: soft gradient + dot grid + glow */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-cream via-brand-50/70 to-cream" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-60 [background-image:radial-gradient(rgb(22_163_74/0.12)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <div aria-hidden className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl" />
      <div aria-hidden className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-charge-100/60 blur-3xl" />

      <Container className="relative grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-6">
        {/* Intro — DOM order is intro → questions → help card, so phones read questions first */}
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">FAQ</p>
          <h2 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl lg:text-4xl">
            Questions, answered.
          </h2>
          <p className="mt-3 max-w-md text-sm text-ink-muted sm:text-base">
            Everything you need to know about delivery, payments, returns and recharge.
          </p>
        </div>

        {/* Accordion */}
        <ul className="space-y-3 sm:space-y-4 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {faqs.map(({ q, a, link }, i) => {
            const isOpen = open === i;
            const btnId = `${baseId}-q${i}`;
            const panelId = `${baseId}-a${i}`;
            return (
              <li
                key={q}
                className={`group relative overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                  isOpen
                    ? "border-brand-200 shadow-[0_18px_40px_-12px_rgb(22_163_74/0.28)]"
                    : "border-black/5 shadow-[0_6px_20px_-8px_rgb(0_0_0/0.12)] hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-[0_14px_30px_-10px_rgb(0_0_0/0.18)]"
                }`}
              >
                {/* left accent bar */}
                <span
                  aria-hidden
                  className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand-500 to-brand-700 transition-transform duration-300 origin-top ${
                    isOpen ? "scale-y-100" : "scale-y-0"
                  }`}
                />

                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors duration-300 ${
                        isOpen ? "bg-brand-100 text-brand-800" : "bg-cream text-ink-muted group-hover:bg-brand-50 group-hover:text-brand-700"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`flex-1 font-display text-[15px] font-semibold leading-snug transition-colors sm:text-base ${
                        isOpen ? "text-brand-800" : "text-ink group-hover:text-brand-800"
                      }`}
                    >
                      {q}
                    </span>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg transition-all duration-300 ${
                        isOpen
                          ? "rotate-45 bg-brand-600 text-white shadow-md shadow-brand-600/30"
                          : "bg-brand-50 text-brand-700 group-hover:bg-brand-100"
                      }`}
                    >
                      <LuPlus aria-hidden />
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      key="panel"
                      initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={reduce ? false : { y: -8 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="pb-5 pl-[4.25rem] pr-6 text-sm leading-relaxed text-ink-muted sm:pl-[4.75rem] sm:text-[15px]"
                      >
                        {a}{" "}
                        {link && (
                          <Link
                            href={link.href}
                            className="font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-700"
                          >
                            {link.label}
                          </Link>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
        {/* Help card — sits under the intro on desktop, after the questions on phones */}
        <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-[0_20px_50px_-12px_rgb(20_83_45/0.45)] sm:p-7">
            <div aria-hidden className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10" />
            <div aria-hidden className="absolute -bottom-12 right-10 h-24 w-24 rounded-full bg-white/5" />
            <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl ring-1 ring-white/20">
              <LuHeadphones aria-hidden />
            </span>
            <h3 className="relative mt-4 font-display text-xl font-bold">Still have questions?</h3>
            <p className="relative mt-1 text-sm text-white/80">Talk to a real person from our team.</p>
            <div className="relative mt-5 flex flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
              <a
                href={`tel:${business.phone}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-brand-800 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <LuPhone aria-hidden /> Call us
              </a>
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <LuMessageCircle aria-hidden /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

      </Container>
    </section>
  );
}
