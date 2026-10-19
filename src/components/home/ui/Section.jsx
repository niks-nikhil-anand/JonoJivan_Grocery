import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

/** Page-width wrapper used by every homepage section (16 / 24 / 32px gutters). */
export function Container({ className = "", children }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

/**
 * Standard section: one eyebrow, one headline, optional subline, one action.
 * Vertical rhythm: 48px mobile → 80px desktop.
 */
export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  action,
  tone = "brand",
  className = "",
  containerClassName = "",
  children,
}) {
  const eyebrowColor = tone === "charge" ? "text-charge-600" : tone === "offer" ? "text-offer-600" : "text-brand-700";
  return (
    <section id={id} className={`scroll-mt-24 py-12 lg:py-20 ${className}`}>
      <Container className={containerClassName}>
        {(title || eyebrow) && (
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between lg:mb-10">
            <div className="max-w-2xl">
              {eyebrow && (
                <p className={`mb-2 text-xs font-semibold uppercase tracking-[0.14em] ${eyebrowColor}`}>{eyebrow}</p>
              )}
              {title && (
                <h2 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl lg:text-4xl">
                  {title}
                </h2>
              )}
              {subtitle && <p className="mt-2 text-sm text-ink-muted sm:text-base">{subtitle}</p>}
            </div>
            {action && (
              <Link
                href={action.href}
                className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
              >
                {action.label}
                <LuArrowRight className="transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
