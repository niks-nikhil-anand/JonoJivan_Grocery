"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  LuX,
  LuHome,
  LuShoppingBasket,
  LuLayoutGrid,
  LuContact,
  LuFileText,
  LuSmartphone,
  LuChevronRight,
  LuUser,
  LuShoppingCart,
  LuMapPin,
  LuPhone,
  LuMessageCircle,
  LuInfo,
  LuHeadphones,
  LuHelpCircle,
  LuStore,
  LuWallet,
  LuCreditCard,
} from "react-icons/lu";
import { useCartCount } from "@/lib/cartStore";
import { business } from "@/config/home";
import { OPERATORS } from "@/config/recharge";
import OperatorBadge from "@/components/recharge/OperatorBadge";
import logo from "../../../../public/logo/logo.png";

const SHOP_LINKS = [
  { name: "Home", href: "/", icon: LuHome },
  { name: "Shop all products", href: "/product/shopAllProducts", icon: LuShoppingBasket },
  { name: "Categories", href: "/category", icon: LuLayoutGrid },
  { name: "Ration Card", href: "/rationCard", icon: LuContact },
  { name: "Blog", href: "/blog", icon: LuFileText },
];

const HELP_LINKS = [
  { name: "About us", href: "/aboutUs", icon: LuInfo },
  { name: "Contact us", href: "/contactUs", icon: LuHeadphones },
  { name: "FAQs", href: "/Faqs", icon: LuHelpCircle },
  { name: "Become a vendor", href: "/auth/vendorRegistration", icon: LuStore },
];

const POLICY_LINKS = [
  { name: "Privacy", href: "/privacyPolicy" },
  { name: "Returns", href: "/returnPolicy" },
  { name: "Shipping", href: "/shippingPolicy" },
  { name: "Terms", href: "/termsAndConditions" },
];

function SectionTitle({ children, tone = "text-ink-muted" }) {
  return <p className={`px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] ${tone}`}>{children}</p>;
}

/**
 * Slide-in navigation drawer for phones and tablets (< 1024px).
 * Esc / backdrop / any link closes it; page scroll is locked while open.
 */
export default function MenuDrawer({ open, onClose, returnFocusRef }) {
  const pathname = usePathname() || "/";
  const count = useCartCount();
  const reduce = useReducedMotion();
  const closeRef = useRef(null);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const wa = business.whatsappNumber ? `https://wa.me/${business.whatsappNumber}` : null;

  // Close when the route changes
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const returnTo = returnFocusRef?.current;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
      returnTo?.focus();
    };
  }, [open, onClose, returnFocusRef]);

  const item = (i) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, x: -12 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.08 + i * 0.03, duration: 0.3, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <motion.div
            className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden
          />

          <motion.aside
            id="mobile-menu"
            className="absolute inset-y-0 left-0 flex w-[88%] max-w-[380px] flex-col bg-cream shadow-2xl"
            initial={reduce ? { opacity: 0 } : { x: "-100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "-100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
          >
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 to-brand-900 px-5 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))] text-white">
              <div aria-hidden className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10" />
              <div aria-hidden className="absolute -bottom-14 left-10 h-28 w-28 rounded-full bg-white/5" />
              <div className="relative flex items-center justify-between">
                <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
                  <Image src={logo} alt="" width={40} height={40} className="h-10 w-10 rounded-full bg-white p-0.5" />
                  <span>
                    <span className="block font-display text-lg font-bold leading-tight">JonoJivan</span>
                    <span className="block text-xs text-brand-100">Groceries & recharge</span>
                  </span>
                </Link>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl transition hover:rotate-90 hover:bg-white/25"
                  aria-label="Close menu"
                >
                  <LuX aria-hidden />
                </button>
              </div>

              {/* Account + cart tiles */}
              <div className="relative mt-5 grid grid-cols-2 gap-2.5">
                <Link
                  href="/auth/signIn"
                  onClick={onClose}
                  className="flex items-center gap-2.5 rounded-2xl bg-white px-3 py-3 text-ink shadow-lg shadow-black/10 transition hover:-translate-y-0.5"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                    <LuUser aria-hidden />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-bold">Sign in</span>
                    <span className="block text-[11px] text-ink-muted">Orders & addresses</span>
                  </span>
                </Link>
                <Link
                  href="/product/cart"
                  onClick={onClose}
                  className="flex items-center gap-2.5 rounded-2xl bg-white/15 px-3 py-3 text-white ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:bg-white/20"
                >
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                    <LuShoppingCart aria-hidden />
                    {count > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-offer-500 px-1 text-[10px] font-bold">
                        {count > 99 ? "99+" : count}
                      </span>
                    )}
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-bold">My cart</span>
                    <span className="block text-[11px] text-brand-100">{count ? `${count} item${count > 1 ? "s" : ""}` : "Empty"}</span>
                  </span>
                </Link>
              </div>
            </div>

            {/* Scrollable body */}
            <nav aria-label="Main" className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
              <SectionTitle>Shop</SectionTitle>
              <ul className="space-y-1">
                {SHOP_LINKS.map(({ name, href, icon: Icon }, i) => {
                  const active = isActive(href);
                  return (
                    <motion.li key={href} {...item(i)}>
                      <Link
                        href={href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-medium transition ${
                          active ? "bg-white text-brand-800 shadow-card" : "text-ink hover:bg-white hover:shadow-card"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg transition ${
                            active ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700 group-hover:bg-brand-100"
                          }`}
                        >
                          <Icon aria-hidden />
                        </span>
                        <span className="flex-1">{name}</span>
                        <LuChevronRight className="text-ink-soft transition group-hover:translate-x-0.5 group-hover:text-brand-700" aria-hidden />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Recharge */}
              <motion.div className="mt-6" {...item(SHOP_LINKS.length)}>
                <SectionTitle tone="text-charge-600">Recharge</SectionTitle>
                <Link
                  href="/recharge"
                  onClick={onClose}
                  className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-charge-600 to-charge-700 p-3.5 text-white shadow-lg shadow-charge-600/25 transition hover:-translate-y-0.5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl">
                    <LuSmartphone aria-hidden />
                  </span>
                  <span className="flex-1 leading-tight">
                    <span className="block font-display font-bold">Mobile recharge</span>
                    <span className="block text-xs text-charge-100">All operators · plans for your circle</span>
                  </span>
                  <LuChevronRight className="transition group-hover:translate-x-0.5" aria-hidden />
                </Link>
                <ul className="mt-2.5 grid grid-cols-4 gap-2">
                  {OPERATORS.map((op) => (
                    <li key={op.slug}>
                      <Link
                        href={`/recharge/${op.slug}`}
                        onClick={onClose}
                        className={`flex flex-col items-center gap-1.5 rounded-2xl border bg-white py-2.5 text-xs font-semibold transition hover:-translate-y-0.5 hover:border-charge-200 hover:shadow-card ${
                          pathname === `/recharge/${op.slug}` ? "border-charge-500 text-charge-700" : "border-black/5 text-ink"
                        }`}
                      >
                        <OperatorBadge operator={op} size="sm" />
                        {op.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Help */}
              <motion.div className="mt-6" {...item(SHOP_LINKS.length + 1)}>
                <SectionTitle>Help & company</SectionTitle>
                <ul className="grid grid-cols-2 gap-2">
                  {HELP_LINKS.map(({ name, href, icon: Icon }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={onClose}
                        className="flex h-full items-center gap-2 rounded-2xl border border-black/5 bg-white px-3 py-2.5 text-[13px] font-medium text-ink transition hover:border-brand-200 hover:text-brand-800 hover:shadow-card"
                      >
                        <Icon className="shrink-0 text-brand-600" aria-hidden />
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Visit / contact card */}
              <motion.div className="mt-6" {...item(SHOP_LINKS.length + 2)}>
                <SectionTitle>Visit or contact us</SectionTitle>
                <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-card">
                  <div className="flex gap-3 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-offer-100 text-lg text-offer-600">
                      <LuMapPin aria-hidden />
                    </span>
                    <address className="text-sm not-italic leading-relaxed text-ink">
                      <span className="block font-semibold">{business.legalName}</span>
                      {business.address.map((line) => (
                        <span key={line} className="block text-ink-muted">
                          {line}
                        </span>
                      ))}
                    </address>
                  </div>
                  <div className={`grid border-t border-black/5 text-xs font-semibold ${wa ? "grid-cols-2" : "grid-cols-1"}`}>
                    <a
                      href={`tel:${business.phone}`}
                      className="flex flex-col items-center gap-1 py-3 text-ink transition hover:bg-brand-50 hover:text-brand-700"
                    >
                      <LuPhone className="text-lg text-brand-600" aria-hidden />
                      Call
                    </a>
                    {wa && (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 border-l border-black/5 py-3 text-ink transition hover:bg-[#25D366]/10 hover:text-[#128C7E]"
                      >
                        <LuMessageCircle className="text-lg text-[#25D366]" aria-hidden />
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
                <p className="mt-2 px-1 text-xs text-ink-muted">
                  Phone:{" "}
                  <a href={`tel:${business.phone}`} className="font-semibold text-ink hover:text-brand-700">
                    {business.phone}
                  </a>
                </p>
              </motion.div>
            </nav>

            {/* Footer */}
            <div className="border-t border-black/5 bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                {POLICY_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={onClose} className="text-ink-muted hover:text-brand-700">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-[11px] text-ink-soft">© {new Date().getFullYear()} JonoJivan</p>
                <div className="flex gap-1.5 text-[11px] text-ink-muted">
                  <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2 py-1"><LuSmartphone aria-hidden /> UPI</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2 py-1"><LuCreditCard aria-hidden /> Cards</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2 py-1"><LuWallet aria-hidden /> COD</span>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
