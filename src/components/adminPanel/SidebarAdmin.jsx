"use client";

import Link from "next/link";
import { navigation } from "@/lib/admin/demo/routes";
import { usePathname } from "next/navigation";
import {
  FaBookOpen,
  FaBoxOpen,
  FaChartLine,
  FaChevronRight,
  FaCog,
  FaCreditCard,
  FaExchangeAlt,
  FaFileInvoiceDollar,
  FaIdCard,
  FaListUl,
  FaMoneyBillWave,
  FaPlus,
  FaProductHunt,
  FaSearch,
  FaShoppingCart,
  FaSignOutAlt,
  FaUndoAlt,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { MdDashboard, MdOutlineRateReview } from "react-icons/md";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ImProfile } from "react-icons/im";

const menuGroups = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: MdDashboard },
    ],
  },
  {
    title: "E-Commerce",
    items: [
      {
        label: "All Orders",
        href: "/admin/dashboard/orders",
        icon: FaShoppingCart,
      },
      {
        label: "Search Orders",
        href: "/admin/dashboard/orders/searchOrders",
        icon: FaSearch,
      },
      {
        label: "Products",
        href: "/admin/dashboard/product/allProduct",
        icon: FaProductHunt,
      },
      {
        label: "Add Product",
        href: "/admin/dashboard/product/addProduct",
        icon: FaPlus,
      },
      {
        label: "Categories",
        href: "/admin/dashboard/category/allCategory",
        icon: FaListUl,
      },
      {
        label: "Add Category",
        href: "/admin/dashboard/category/addCategory",
        icon: FaPlus,
      },
      {
        label: "Add Subcategory",
        href: "/admin/dashboard/category/addSubCategory",
        icon: FaPlus,
      },
      {
        label: "Add Sub-subcategory",
        href: "/admin/dashboard/category/addSubSubCatgeory",
        icon: FaPlus,
      },
    ],
  },
  {
    title: "Finance · demo",
    items: [
      {
        label: "Finance Overview",
        href: "/admin/dashboard/finance",
        icon: FaChartLine,
      },
      {
        label: "Transactions",
        href: "/admin/dashboard/finance/transactions",
        icon: FaExchangeAlt,
      },
      {
        label: "Refunds",
        href: "/admin/dashboard/finance/refunds",
        icon: FaUndoAlt,
      },
      {
        label: "Settlements & Payouts",
        href: "/admin/dashboard/finance/settlements",
        icon: FaMoneyBillWave,
      },
      {
        label: "Expenses",
        href: "/admin/dashboard/finance/expenses",
        icon: FaCreditCard,
      },
      {
        label: "Financial Reports",
        href: "/admin/dashboard/finance/reports",
        icon: FaFileInvoiceDollar,
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        label: "All Blogs",
        href: "/admin/dashboard/blog/allBlog",
        icon: FaBookOpen,
      },
      {
        label: "Add Blog",
        href: "/admin/dashboard/blog/addBlog",
        icon: FaPlus,
      },
      {
        label: "Reviews",
        href: "/admin/dashboard/review/addReview",
        icon: MdOutlineRateReview,
      },
    ],
  },
  {
    title: "User Management",
    items: [
      { label: "Users Table", href: "/admin/dashboard/users", icon: FaUsers },
      {
        label: "Search User",
        href: "/admin/dashboard/user/search",
        icon: FaUser,
      },
      {
        label: "Ration Cards",
        href: "/admin/dashboard/rationCards",
        icon: FaIdCard,
      },
    ],
  },
  {
    title: "Store Policies",
    items: [
      {
        label: "Privacy Policy",
        href: "/admin/dashboard/policy/privacyPolicy",
        icon: FaBookOpen,
      },
      {
        label: "Return Policy",
        href: "/admin/dashboard/policy/returnPolicy",
        icon: FaBookOpen,
      },
      {
        label: "Shipping Policy",
        href: "/admin/dashboard/policy/shippingPolicy",
        icon: FaBookOpen,
      },
      {
        label: "Terms & Conditions",
        href: "/admin/dashboard/policy/termsAndCondition",
        icon: FaBookOpen,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Profile", href: "/admin/dashboard/profile", icon: ImProfile },
      { label: "Settings", href: "/admin/dashboard/settings", icon: FaCog },
    ],
  },
];

export default function SidebarAdmin({
  demoEnabled = true,
  mobileOpen = false,
  onClose = () => {},
  onLogout,
  loggingOut = false,
}) {
  const pathname = usePathname();
  const icons = [
    MdDashboard,
    FaMoneyBillWave,
    FaShoppingCart,
    FaUsers,
    FaChartLine,
    FaExchangeAlt,
    FaBookOpen,
    FaUndoAlt,
    FaBookOpen,
    FaCog,
  ];
  const activeGroups = demoEnabled
    ? navigation.map(([title, items], index) => ({
        title,
        items: items.map(([label, path]) => ({
          label,
          href: `/admin/dashboard${path}`,
          icon: icons[index],
        })),
      }))
    : menuGroups;

  const isActiveRoute = (href) => {
    const matches = pathname === href || pathname.startsWith(`${href}/`);
    if (!matches) return false;
    const hasMoreSpecificMatch = activeGroups
      .flatMap((group) => group.items)
      .some(
        (item) =>
          item.href !== href &&
          item.href.startsWith(`${href}/`) &&
          (pathname === item.href || pathname.startsWith(`${item.href}/`)),
      );
    return !hasMoreSpecificMatch;
  };

  const renderMenu = () => (
    <nav
      aria-label="Admin navigation"
      className="flex-1 space-y-6 overflow-y-auto px-3 py-5"
    >
      {activeGroups.map((group) => (
        <section key={group.title}>
          <h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {group.title}
          </h2>
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActiveRoute(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={`group flex min-h-11 items-center justify-between rounded-xl px-3 py-2 text-sm transition ${active ? "bg-brand-700 font-semibold text-white shadow-lg shadow-brand-950/25" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Icon
                      aria-hidden="true"
                      className={`shrink-0 text-base ${active ? "text-white" : "text-slate-400 group-hover:text-white"}`}
                    />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {active && (
                    <FaChevronRight
                      aria-hidden="true"
                      className="shrink-0 text-[10px] opacity-75"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </nav>
  );

  const renderPanel = (mobile = false) => (
    <div className="flex h-full min-h-0 flex-col bg-slate-950 text-slate-200">
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/10 px-5">
        <Link
          href="/admin/dashboard"
          onClick={onClose}
          className="flex items-center gap-3"
          aria-label="JonoJivan admin dashboard"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-xl text-white">
            <FaBoxOpen aria-hidden="true" />
          </span>
          <span>
            <span className="block font-display text-base font-bold tracking-tight text-white">
              JonoJivan
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
              Admin workspace
            </span>
          </span>
        </Link>
        {mobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close admin menu"
            className="rounded-lg p-2 text-xl text-slate-300 hover:bg-white/10"
          >
            ×
          </button>
        )}
      </div>
      {renderMenu()}
      <div className="shrink-0 border-t border-white/10 p-3">
        <button
          type="button"
          onClick={onLogout}
          disabled={loggingOut}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/15 hover:text-rose-200"
        >
          <FaSignOutAlt aria-hidden="true" />{" "}
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="v-no-print sticky top-0 hidden h-dvh w-64 shrink-0 lg:block">
        {renderPanel()}
      </aside>
      <Dialog
        open={mobileOpen}
        onClose={onClose}
        className="admin-mobile-nav fixed inset-0 z-50 lg:hidden"
      >
        <div className="fixed inset-0 bg-slate-950/60" aria-hidden="true" />
        <DialogPanel className="fixed inset-y-0 left-0 w-[min(19rem,86vw)] shadow-2xl">
          <DialogTitle className="sr-only">Admin menu</DialogTitle>
          {renderPanel(true)}
        </DialogPanel>
      </Dialog>
    </>
  );
}
