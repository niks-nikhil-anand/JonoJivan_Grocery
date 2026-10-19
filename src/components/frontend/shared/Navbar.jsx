"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LuSearch, LuShoppingCart, LuUser, LuMenu, LuSmartphone, LuChevronDown, LuTv, LuArrowRight } from "react-icons/lu";
import { OPERATORS } from "@/config/recharge";
import OperatorBadge from "@/components/recharge/OperatorBadge";
import { useCartCount } from "@/lib/cartStore";
import MenuDrawer from "./MenuDrawer";
import logo from "../../../../public/logo/logo.png";

export const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Shop all", href: "/product/shopAllProducts" },
  { name: "Categories", href: "/category" },
  { name: "Recharge", href: "/recharge", menu: "recharge" },
  { name: "Ration Card", href: "/rationCard" },
  { name: "Blog", href: "/blog", desktopFrom: "xl" },
];

const POPULAR_SEARCHES = ["Rice", "Atta", "Dal", "Onion", "Potato", "Milk", "Cooking oil", "Tea", "Detergent", "Biscuits"];

function SearchBox({ autoFocus = false, onDone }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);

  const go = (term = q) => {
    const t = term.trim();
    if (!t) return;
    router.push(`/product/search?q=${encodeURIComponent(t)}`);
    setFocused(false);
    onDone?.();
  };

  return (
    <div className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          go();
        }}
        className="flex h-11 items-center gap-2 rounded-xl border border-black/10 bg-cream px-3 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-100"
      >
        <LuSearch className="shrink-0 text-ink-muted" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder='Search "rice", "atta", "milk"…'
          aria-label="Search products"
          autoComplete="off"
          autoFocus={autoFocus}
          className="h-full w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
        />
      </form>
      {focused && !q && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border border-black/5 bg-white p-4 shadow-lift">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Popular searches</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(term)}
                className="rounded-full bg-cream px-3 py-1.5 text-sm text-ink hover:bg-brand-100"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CartButton({ className = "" }) {
  const count = useCartCount();
  return (
    <Link
      href="/product/cart"
      className={`relative flex h-11 w-11 items-center justify-center rounded-xl text-xl text-ink hover:bg-brand-50 ${className}`}
      aria-label={`Cart${count ? `, ${count} items` : ""}`}
    >
      <LuShoppingCart aria-hidden />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-offer-500 px-1 text-[11px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

/** Desktop "Recharge" item with a dropdown of operators (hover, focus or click). */
function RechargeMenu({ active }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);
  const wrapRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) => !wrapRef.current?.contains(e.target) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const show = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <li
      ref={wrapRef}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="recharge-menu"
        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors xl:px-3 ${
          active || open ? "text-charge-700" : "text-ink hover:text-charge-700"
        }`}
      >
        <LuSmartphone className="text-charge-600" aria-hidden />
        Recharge
        <LuChevronDown className={`text-xs transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      <div
        id="recharge-menu"
        className={`absolute left-1/2 top-full z-50 w-[420px] -translate-x-1/2 pt-3 transition-all duration-200 ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_24px_60px_-12px_rgb(0_0_0/0.25)]">
          <Link
            href="/recharge"
            className="group flex items-center gap-3 bg-gradient-to-r from-charge-600 to-charge-700 p-4 text-white"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl">
              <LuSmartphone aria-hidden />
            </span>
            <span className="flex-1">
              <span className="block font-display font-bold">Mobile recharge</span>
              <span className="block text-xs text-charge-100">All operators · browse plans for your circle</span>
            </span>
            <LuArrowRight className="transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
          <ul className="grid grid-cols-2 gap-1 p-2">
            {OPERATORS.map((op) => (
              <li key={op.slug}>
                <Link
                  href={`/recharge/${op.slug}`}
                  className="flex items-center gap-3 rounded-xl p-2.5 text-sm font-semibold text-ink transition-colors hover:bg-charge-50 hover:text-charge-700"
                >
                  <OperatorBadge operator={op} size="sm" />
                  {op.name} recharge
                </Link>
              </li>
            ))}
            <li className="col-span-2">
              <span className="flex cursor-default items-center gap-3 rounded-xl p-2.5 text-sm font-semibold text-ink-soft">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-ink-soft">
                  <LuTv aria-hidden />
                </span>
                DTH recharge
                <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-ink-muted">Coming soon</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </li>
  );
}

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuBtnRef = useRef(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href) => (href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href));

  return (
    <>
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur transition-shadow ${scrolled ? "shadow-card" : "border-b border-black/5"}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:h-[72px] lg:gap-6 lg:px-8">
        {/* hamburger (phones + tablets) */}
        <button
          ref={menuBtnRef}
          type="button"
          onClick={() => setMenuOpen(true)}
          className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl text-ink transition hover:bg-brand-50 hover:text-brand-700 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label="Open menu"
        >
          <LuMenu aria-hidden />
        </button>

        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="JonoJivan home">
          <Image src={logo} alt="" width={40} height={40} className="h-9 w-9 lg:h-10 lg:w-10" priority />
          <span className="font-display text-lg font-bold tracking-tight text-brand-800 lg:text-xl">JonoJivan</span>
        </Link>

        {/* desktop links */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((l) =>
              l.menu === "recharge" ? (
                <RechargeMenu key={l.name} active={isActive(l.href)} />
              ) : (
              <li key={l.name} className={l.desktopFrom === "xl" ? "hidden xl:block" : undefined}>
                <Link
                  href={l.href}
                  className={`whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors xl:px-3 ${
                    isActive(l.href) ? "text-brand-700" : "text-ink hover:text-brand-700"
                  }`}
                >
                  {l.name}
                </Link>
              </li>
              )
            )}
          </ul>
        </nav>

        {/* search (tablet + desktop) */}
        <div className="ml-auto hidden w-full max-w-sm sm:block lg:max-w-[240px] xl:max-w-sm">
          <SearchBox />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:ml-0">
          <Link
            href="/auth/signIn"
            className="hidden h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-ink hover:bg-brand-50 sm:flex"
          >
            <LuUser className="text-xl" aria-hidden />
            <span className="hidden whitespace-nowrap xl:inline">Sign in</span>
          </Link>
          <CartButton />
        </div>
      </div>

      {/* mobile search row (phones) */}
      <div className="px-4 pb-3 sm:hidden">
        <SearchBox />
      </div>

    </header>
    {/* Rendered outside <header>: its backdrop-blur would otherwise trap the fixed drawer */}
    <MenuDrawer open={menuOpen} onClose={closeMenu} returnFocusRef={menuBtnRef} />
    </>
  );
};

export default Navbar;
