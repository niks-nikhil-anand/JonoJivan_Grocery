"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuHome, LuShoppingBasket, LuSmartphone, LuShoppingCart, LuUser } from "react-icons/lu";
import { useCartCount } from "@/lib/cartStore";

const TABS = [
  { name: "Home", href: "/", icon: LuHome, match: (p) => p === "/" },
  { name: "Grocery", href: "/product/shopAllProducts", icon: LuShoppingBasket, match: (p) => p.startsWith("/product/shop") || p.startsWith("/category") },
  { name: "Recharge", href: "/recharge", icon: LuSmartphone, match: (p) => p.startsWith("/recharge") },
  { name: "Cart", href: "/product/cart", icon: LuShoppingCart, match: (p) => p.startsWith("/product/cart") },
  { name: "Account", href: "/auth/signIn", icon: LuUser, match: (p) => p.startsWith("/auth") },
];

/** Thumb-zone navigation for phones (hidden from 640px up). */
export default function MobileTabBar() {
  const pathname = usePathname() || "/";
  const count = useCartCount();

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
    >
      <ul className="grid grid-cols-5">
        {TABS.map(({ name, href, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={name}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${
                  active ? "text-brand-700" : name === "Recharge" ? "text-charge-600" : "text-ink-muted"
                }`}
              >
                {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-brand-600" aria-hidden />}
                <span className="relative text-[22px]">
                  <Icon aria-hidden />
                  {name === "Cart" && count > 0 && (
                    <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-offer-500 px-1 text-[10px] font-bold text-white">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </span>
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
