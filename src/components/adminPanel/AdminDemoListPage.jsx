"use client";

import { useMemo, useState } from "react";
import { LuSearch, LuSparkles } from "react-icons/lu";
import {
  ADMIN_DEMO_BLOGS,
  ADMIN_DEMO_CATEGORIES,
  ADMIN_DEMO_ORDERS,
  ADMIN_DEMO_PRODUCTS,
  ADMIN_DEMO_RATION_CARDS,
  ADMIN_DEMO_REVIEWS,
  ADMIN_DEMO_USERS,
} from "@/lib/adminDemoData";

const allFields = (labelFields, data, title, subtitle) => ({ title, subtitle, fields: labelFields, data, search: (row) => Object.values(row).join(" ") });
const configs = {
  orders: allFields([["Order", "id"], ["Customer", "customer"], ["Date", "date"], ["Items", "items"], ["Payment", "payment"], ["Amount", "amount"], ["Status", "status"]], ADMIN_DEMO_ORDERS, "Search orders", "Find sample orders by order number, customer, payment, or status."),
  users: allFields([["Customer ID", "id"], ["Name", "name"], ["Email", "email"], ["Orders", "orders"], ["Total spent", "spent"], ["Status", "status"]], ADMIN_DEMO_USERS, "Search users", "Find sample customer accounts by name, email, or customer ID."),
  products: allFields([["SKU", "id"], ["Product", "name"], ["Category", "category"], ["Stock", "stock"], ["Price", "price"], ["Status", "status"]], ADMIN_DEMO_PRODUCTS, "Products", "Browse sample inventory, categories, prices, and stock levels."),
  categories: allFields([["Category", "name"], ["Products", "products"], ["Stock health", "stock"], ["Sales", "amount"]], ADMIN_DEMO_CATEGORIES, "Categories", "Review sample catalogue categories and stock health."),
  blogs: allFields([["Post ID", "id"], ["Title", "title"], ["Category", "category"], ["Author", "author"], ["Updated", "updated"], ["Status", "status"]], ADMIN_DEMO_BLOGS, "All blogs", "Review sample editorial content and publishing status."),
  reviews: allFields([["Review", "id"], ["Product", "product"], ["Customer", "customer"], ["Rating", "rating"], ["Comment", "comment"], ["Date", "date"], ["Status", "status"]], ADMIN_DEMO_REVIEWS, "Reviews", "Moderate sample product feedback from customers."),
  rationCards: allFields([["Application", "id"], ["Name", "name"], ["Card number", "card"], ["Household", "household"], ["District", "district"], ["Updated", "updated"], ["Status", "status"]], ADMIN_DEMO_RATION_CARDS, "Ration cards", "Review sample applications with sensitive card numbers masked."),
};

export default function AdminDemoListPage({ type }) {
  const [query, setQuery] = useState("");
  const config = configs[type] || configs.orders;
  const results = useMemo(() => config.data.filter((row) => config.search(row).toLowerCase().includes(query.trim().toLowerCase())), [config, query]);

  return <div className="min-h-[calc(100vh-72px)] bg-[#f7f8f5] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"><div className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">Demo directory</p><h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{config.title}</h1><p className="mt-2 text-sm text-ink-muted">{config.subtitle}</p></div><span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-charge-200 bg-charge-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-charge-700"><LuSparkles aria-hidden="true" /> Demo data</span></header>
    <section className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-card"><div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div><h2 className="font-semibold text-ink">{results.length} sample records</h2><p className="mt-1 text-xs text-ink-muted">Search updates as you type</p></div><label className="flex h-10 w-full items-center gap-2 rounded-xl border border-black/10 px-3 text-ink-muted sm:max-w-sm"><LuSearch aria-hidden="true" /><span className="sr-only">Search {config.title}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records…" className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft" /></label></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="bg-[#fafaf7]">{config.fields.map(([label]) => <th key={label} className="whitespace-nowrap px-5 py-3 text-xs font-bold uppercase tracking-wide text-ink-muted">{label}</th>)}</tr></thead><tbody className="divide-y divide-gray-100">{results.map((row) => <tr key={row.id} className="hover:bg-brand-50/30">{config.fields.map(([label, key]) => <td key={key} className={`whitespace-nowrap px-5 py-4 ${["id", "amount", "spent", "price"].includes(key) ? "font-semibold text-brand-800" : "text-ink"}`}>{["amount", "spent", "price"].includes(key) ? `₹${row[key].toLocaleString("en-IN")}` : row[key]}</td>)}</tr>)}{!results.length && <tr><td colSpan={config.fields.length} className="px-5 py-12 text-center text-ink-muted">No matching demo records.</td></tr>}</tbody></table></div><p className="border-t border-gray-100 px-5 py-3 text-xs text-ink-soft">Sample records for interface preview only.</p>
    </section>
  </div></div>;
}
