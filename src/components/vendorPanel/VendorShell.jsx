"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";
import {
  LuLayoutDashboard,
  LuShoppingCart,
  LuPackage,
  LuPlus,
  LuStar,
  LuWallet,
  LuArrowLeftRight,
  LuArrowUpRight,
  LuMessageSquare,
  LuUser,
  LuSettings,
  LuLogOut,
  LuMenu,
  LuX,
  LuSearch,
  LuChevronRight,
  LuStore,
  LuSun,
  LuMoon,
  LuMonitor,
} from "react-icons/lu";
import { base } from "./ui";
import {
  WorkspaceTheme,
  ThemePicker,
} from "@/components/workspace/WorkspaceTheme";
export {
  ThemePicker,
  useWorkspaceTheme as useVendorTheme,
} from "@/components/workspace/WorkspaceTheme";
const groups = [
  ["Overview", [["Dashboard", "", LuLayoutDashboard]]],
  [
    "E-Commerce",
    [
      ["All Orders", "/orders", LuShoppingCart],
      ["Products", "/product/allProduct", LuPackage],
      ["Add Product", "/product/addProduct", LuPlus],
      ["Reviews", "/review", LuStar],
    ],
  ],
  [
    "Wallet",
    [
      ["Wallet Overview", "/wallet", LuWallet],
      ["Transactions", "/wallet/transactions", LuArrowLeftRight],
      ["Withdraw Funds", "/wallet/withdrawals", LuArrowUpRight],
    ],
  ],
  [
    "Account",
    [
      ["Support Tickets", "/tickets", LuMessageSquare],
      ["Profile & Business", "/profile", LuUser],
      ["Settings", "/settings", LuSettings],
    ],
  ],
];
export default function VendorShell({
  children,
  initialTheme = "system",
  user,
  auth = false,
}) {
  const [mobileOpen, setMobileOpen] = useState(false),
    [loggingOut, setLoggingOut] = useState(false),
    [error, setError] = useState("");
  const path = usePathname(),
    router = useRouter(),
    menuButton = useRef(null);
  useEffect(() => {
    setMobileOpen(false);
  }, [path]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMobileOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  const logout = async () => {
    setLoggingOut(true);
    setError("");
    try {
      const res = await fetch("/api/vendor/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error();
      router.replace("/vendor/auth");
      router.refresh();
    } catch {
      setError("Sign out failed. Please try again.");
      setLoggingOut(false);
    }
  };
  const active = (href) =>
    path === base + href ||
    (href &&
      path.startsWith(base + href + "/") &&
      !groups
        .flatMap((g) => g[1])
        .some(
          (i) =>
            i[1] !== href &&
            i[1].startsWith(href + "/") &&
            path.startsWith(base + i[1]),
        )) ||
    (href === "/product/allProduct" &&
      /^\/vendor\/dashboard\/product\/(?!addProduct|allProduct)/.test(path));
  const sidebar = (mobile) => (
    <div className="flex h-full min-h-0 flex-col bg-slate-950 text-slate-200">
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/10 px-5">
        <Link
          href={base}
          className="flex items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-xl text-white">
            <LuStore aria-hidden />
          </span>
          <span>
            <span className="block font-display text-base font-bold text-white">
              JonoJivan
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[.15em] text-slate-400">
              Vendor workspace
            </span>
          </span>
        </Link>
        {mobile && (
          <button
            aria-label="Close vendor menu"
            onClick={() => setMobileOpen(false)}
            className="p-2"
          >
            <LuX size={22} />
          </button>
        )}
      </div>
      <nav
        aria-label="Vendor navigation"
        className="flex-1 space-y-6 overflow-y-auto px-3 py-5"
      >
        {groups.map(([title, items]) => (
          <section key={title}>
            <h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">
              {title}
            </h2>
            <div className="space-y-1">
              {items.map(([name, href, Icon]) => (
                <Link
                  key={href}
                  href={base + href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active(href) ? "page" : undefined}
                  className={`flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition ${active(href) ? "bg-brand-700 font-semibold text-white shadow-lg" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={17} aria-hidden />
                    {name}
                  </span>
                  {active(href) && <LuChevronRight size={13} aria-hidden />}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <p className="truncate px-3 pb-2 text-xs text-slate-400">
          {user?.vendorProfile?.businessName || user?.fullName}
        </p>
        <button
          disabled={loggingOut}
          onClick={logout}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-rose-300 hover:bg-rose-500/15"
        >
          <LuLogOut aria-hidden />
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );
  return (
    <WorkspaceTheme
      initialTheme={initialTheme}
      cookieName="vendor-theme"
      className="vendor-workspace"
    >
      {auth ? (
        <>
          <div className="flex justify-end px-5 pt-5">
            <ThemePicker />
          </div>
          {children}
        </>
      ) : (
        <div className="flex min-h-screen">
          <a
            href="#vendor-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] v-button"
          >
            Skip to content
          </a>
          <aside className="v-no-print sticky top-0 hidden h-dvh w-64 shrink-0 lg:block">
            {sidebar(false)}
          </aside>
          <div className="min-w-0 flex-1">
            <header
              className="v-no-print sticky top-0 z-30 flex h-[72px] items-center justify-between gap-3 border-b px-4 v-border sm:px-6"
              style={{ background: "var(--v-panel)" }}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <button
                  ref={menuButton}
                  type="button"
                  aria-label="Open vendor menu"
                  aria-expanded={mobileOpen}
                  onClick={() => setMobileOpen(true)}
                  className="rounded-lg p-2 lg:hidden"
                >
                  <LuMenu size={24} />
                </button>
                <form
                  action={`${base}/search`}
                  className="hidden w-full max-w-md items-center gap-2 rounded-full px-4 py-2 v-soft md:flex"
                >
                  <LuSearch aria-hidden className="v-muted" />
                  <input
                    name="q"
                    aria-label="Search products and orders"
                    placeholder="Search products or orders…"
                    className="min-w-0 flex-1 bg-transparent py-1 text-sm outline-none"
                  />
                  <button className="text-xs v-green" type="submit">
                    Search
                  </button>
                </form>
                <Link
                  href={`${base}/search`}
                  aria-label="Search workspace"
                  className="p-2 md:hidden"
                >
                  <LuSearch size={20} />
                </Link>
              </div>
              <div className="flex items-center gap-2 sm:gap-5">
                <ThemePicker />
                <Menu>
                  <MenuButton
                    className="flex items-center gap-2 rounded-full p-1 sm:pr-3"
                    aria-label="Open profile menu"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full v-soft v-green">
                      <LuUser size={20} />
                    </span>
                    <span className="hidden text-left md:block">
                      <span className="block max-w-40 truncate text-sm font-semibold">
                        {user?.fullName}
                      </span>
                      <span className="block text-xs v-green">Vendor</span>
                    </span>
                  </MenuButton>
                  <MenuItems className="v-panel absolute right-4 top-16 z-40 w-56 p-2 focus:outline-none">
                    {[
                      ["Profile & Business", "/profile"],
                      ["Settings", "/settings"],
                    ].map(([title, href]) => (
                      <MenuItem key={href}>
                        <Link
                          className="block rounded-lg px-3 py-3 text-sm data-[focus]:v-soft"
                          href={base + href}
                        >
                          {title}
                        </Link>
                      </MenuItem>
                    ))}
                    <MenuItem>
                      <button
                        onClick={logout}
                        disabled={loggingOut}
                        className="v-button danger w-full"
                      >
                        Sign out
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </header>
            <main
              id="vendor-content"
              className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
            >
              {error && (
                <p role="alert" className="v-error">
                  {error}
                </p>
              )}
              {children}
            </main>
          </div>
          <Dialog
            open={mobileOpen}
            onClose={setMobileOpen}
            className="relative z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-slate-950/60" aria-hidden />
            <DialogPanel className="fixed inset-y-0 left-0 w-[min(19rem,86vw)]">
              <DialogTitle className="sr-only">Vendor menu</DialogTitle>
              {sidebar(true)}
            </DialogPanel>
          </Dialog>
        </div>
      )}
    </WorkspaceTheme>
  );
}
