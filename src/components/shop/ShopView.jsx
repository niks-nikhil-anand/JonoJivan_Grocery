"use client";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LuSearch,
  LuX,
  LuSlidersHorizontal,
  LuChevronRight,
  LuChevronLeft,
  LuPackageSearch,
  LuWallet,
  LuShieldCheck,
  LuRotateCcw,
  LuSmartphone,
  LuArrowRight,
  LuLoader2,
} from "react-icons/lu";
import ProductCard from "@/components/home/ui/ProductCard";
import Sheet from "@/components/recharge/Sheet";
import ShopFilters from "./ShopFilters";
import { PRICE_RANGES, SORT_OPTIONS } from "@/lib/shopOptions";

const FILTER_KEYS = ["q", "category", "price", "onSale", "inStock", "sort"];

function pageList(current, total) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push("…" + p);
    out.push(p);
  });
  return out;
}

/**
 * Interactive shop page. All filters live in the URL, so the server renders the
 * right results, Back/Forward work and links are shareable.
 */
export default function ShopView({ result, categories, params }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(params.q);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [extra, setExtra] = useState([]); // products appended by "Load more" (phones)
  const [loadingMore, setLoadingMore] = useState(false);
  const [morePage, setMorePage] = useState(result.page);
  const gridTopRef = useRef(null);

  // Reset appended items whenever the server sends a new result set.
  useEffect(() => {
    setExtra([]);
    setMorePage(result.page);
    setQuery(params.q);
  }, [result, params.q]);

  const navigate = (patch, { resetPage = true, scroll = false } = {}) => {
    const next = new URLSearchParams();
    const merged = { ...params, ...patch };
    FILTER_KEYS.forEach((k) => {
      const v = merged[k];
      if (k === "sort" && v === "newest") return;
      if (v === true) next.set(k, "1");
      else if (v && v !== false) next.set(k, String(v));
    });
    const page = resetPage ? 1 : merged.page;
    if (page > 1) next.set("page", String(page));
    const qs = next.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
    if (scroll) gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Debounced search-as-you-type
  useEffect(() => {
    if (query === params.q) return;
    const t = setTimeout(() => navigate({ q: query.trim() }), 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const activeChips = useMemo(() => {
    const chips = [];
    if (params.q) chips.push({ key: "q", label: `“${params.q}”` });
    if (params.category) {
      const c = categories.find((x) => x._id === params.category);
      chips.push({ key: "category", label: c ? c.name : "Category" });
    }
    if (params.price) chips.push({ key: "price", label: PRICE_RANGES.find((r) => r.id === params.price)?.label });
    if (params.onSale) chips.push({ key: "onSale", label: "On sale" });
    if (params.inStock) chips.push({ key: "inStock", label: "In stock" });
    return chips;
  }, [params, categories]);

  const filterCount = (params.price ? 1 : 0) + (params.onSale ? 1 : 0) + (params.inStock ? 1 : 0);
  const products = [...result.products, ...extra];
  const from = result.total ? (result.page - 1) * result.limit + 1 : 0;
  const to = Math.min(result.total, (result.page - 1) * result.limit + result.products.length);
  const hasMore = morePage < result.totalPages;

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const qs = new URLSearchParams();
      FILTER_KEYS.forEach((k) => params[k] && params[k] !== "newest" && qs.set(k, params[k] === true ? "1" : params[k]));
      if (params.sort) qs.set("sort", params.sort);
      qs.set("page", String(morePage + 1));
      const res = await fetch(`/api/products?${qs.toString()}`);
      const data = await res.json();
      setExtra((prev) => [...prev, ...(data.products || [])]);
      setMorePage(morePage + 1);
    } catch {
      /* keep what we have */
    } finally {
      setLoadingMore(false);
    }
  };

  const clearAll = () => {
    setQuery("");
    navigate({ q: "", category: "", price: "", onSale: false, inStock: false });
  };

  return (
    <main className="bg-cream">
      {/* ── Header ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-cream">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-200/50 blur-3xl" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-6 pt-6 sm:px-6 lg:px-8 lg:pb-8 lg:pt-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-ink-muted">
            <Link href="/" className="hover:text-brand-700">Home</Link>
            <LuChevronRight aria-hidden />
            <span className="text-ink">Shop all</span>
          </nav>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Shop all products</h1>
              <p className="mt-1 text-sm text-ink-muted sm:text-base">
                {result.total} {result.total === 1 ? "product" : "products"} · fruits, vegetables, staples & daily needs
              </p>
            </div>
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ q: query.trim() });
              }}
              className="flex h-12 w-full items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 shadow-card focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100 lg:max-w-md"
            >
              <LuSearch className="shrink-0 text-ink-muted" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search in all products…"
                aria-label="Search products"
                className="h-full w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="text-ink-soft hover:text-ink" aria-label="Clear search">
                  <LuX aria-hidden />
                </button>
              )}
            </form>
          </div>

          {/* Category chips */}
          {categories.length > 0 && (
            <ul className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0" aria-label="Categories">
              {[{ _id: "", name: "All" }, ...categories].map((c) => {
                const active = params.category === c._id;
                return (
                  <li key={c._id || "all"} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => navigate({ category: c._id })}
                      aria-pressed={active}
                      className={`inline-flex h-11 items-center gap-2 rounded-full border pl-1.5 pr-4 text-sm font-semibold transition ${
                        active
                          ? "border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-600/25"
                          : "border-black/5 bg-white text-ink hover:border-brand-200 hover:text-brand-800"
                      } ${c._id ? "" : "pl-4"}`}
                    >
                      {c.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.image} alt="" width={32} height={32} loading="lazy" className="h-8 w-8 rounded-full bg-white object-contain" />
                      )}
                      {c.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div ref={gridTopRef} className="mx-auto grid w-full max-w-7xl scroll-mt-24 grid-cols-1 gap-8 px-4 pb-12 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:px-8 lg:pb-16">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-3xl border border-black/5 bg-white p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-ink">Filters</h2>
              {filterCount > 0 && (
                <button type="button" onClick={() => navigate({ price: "", onSale: false, inStock: false })} className="text-xs font-semibold text-brand-700 hover:underline">
                  Reset
                </button>
              )}
            </div>
            <ShopFilters params={params} onChange={(patch) => navigate(patch)} />
          </div>
        </aside>

        <div className="min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <p className="mr-auto text-sm text-ink-muted" aria-live="polite">
              {result.total ? (
                <>
                  Showing <span className="font-semibold text-ink">{from}–{to}</span> of{" "}
                  <span className="font-semibold text-ink">{result.total}</span>
                </>
              ) : (
                "No products"
              )}
            </p>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold text-ink shadow-sm hover:border-brand-300 lg:hidden"
            >
              <LuSlidersHorizontal aria-hidden /> Filters
              {filterCount > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] text-white">{filterCount}</span>
              )}
            </button>
            <label className="sr-only" htmlFor="shop-sort">Sort by</label>
            <select
              id="shop-sort"
              value={params.sort}
              onChange={(e) => navigate({ sort: e.target.value })}
              className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm font-medium text-ink shadow-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  Sort: {s.label}
                </option>
              ))}
            </select>
          </div>

          {activeChips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {activeChips.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => {
                    if (c.key === "q") setQuery("");
                    navigate({ [c.key]: c.key === "onSale" || c.key === "inStock" ? false : "" });
                  }}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full bg-brand-100 px-3 text-xs font-semibold text-brand-800 hover:bg-brand-200"
                  aria-label={`Remove filter ${c.label}`}
                >
                  {c.label} <LuX aria-hidden />
                </button>
              ))}
              <button type="button" onClick={clearAll} className="h-8 px-2 text-xs font-semibold text-ink-muted underline-offset-4 hover:text-ink hover:underline">
                Clear all
              </button>
            </div>
          )}

          {/* Grid */}
          <div className={`relative mt-5 transition-opacity ${isPending ? "pointer-events-none opacity-50" : ""}`} aria-busy={isPending}>
            {isPending && (
              <div className="absolute inset-x-0 top-24 z-10 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-lift">
                  <LuLoader2 className="animate-spin text-brand-600" aria-hidden /> Updating…
                </span>
              </div>
            )}

            {products.length ? (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                {products.map((p) => (
                  <li key={p._id}>
                    <ProductCard product={p} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center rounded-3xl border border-dashed border-black/10 bg-white px-6 py-14 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-3xl text-brand-600">
                  <LuPackageSearch aria-hidden />
                </span>
                <h2 className="mt-4 font-display text-xl font-bold text-ink">
                  {result.error ? "We couldn't load products" : "No products match"}
                </h2>
                <p className="mt-1 max-w-sm text-sm text-ink-muted">
                  {result.error ? "Please refresh the page in a moment." : "Try a different search, or remove a filter to see more products."}
                </p>
                {activeChips.length > 0 && (
                  <button type="button" onClick={clearAll} className="mt-5 h-11 rounded-xl bg-brand-600 px-6 text-sm font-bold text-white hover:bg-brand-700">
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination — numbered (tablet/desktop) */}
          {result.totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-8 hidden items-center justify-center gap-1.5 sm:flex">
              <button
                type="button"
                disabled={result.page <= 1}
                onClick={() => navigate({ page: result.page - 1 }, { resetPage: false, scroll: true })}
                className="inline-flex h-11 items-center gap-1 rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold text-ink hover:border-brand-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <LuChevronLeft aria-hidden /> Prev
              </button>
              {pageList(result.page, result.totalPages).map((p) =>
                typeof p === "string" ? (
                  <span key={p} className="px-1 text-ink-soft">…</span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => navigate({ page: p }, { resetPage: false, scroll: true })}
                    aria-current={p === result.page ? "page" : undefined}
                    className={`h-11 min-w-[44px] rounded-xl px-3 text-sm font-semibold transition ${
                      p === result.page ? "bg-brand-600 text-white shadow-md shadow-brand-600/25" : "border border-black/10 bg-white text-ink hover:border-brand-300"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                type="button"
                disabled={result.page >= result.totalPages}
                onClick={() => navigate({ page: result.page + 1 }, { resetPage: false, scroll: true })}
                className="inline-flex h-11 items-center gap-1 rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold text-ink hover:border-brand-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next <LuChevronRight aria-hidden />
              </button>
            </nav>
          )}

          {/* Load more — phones */}
          {hasMore && (
            <div className="mt-8 flex justify-center sm:hidden">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-brand-600 bg-white text-sm font-bold text-brand-700 disabled:opacity-60"
              >
                {loadingMore ? <LuLoader2 className="animate-spin" aria-hidden /> : null}
                {loadingMore ? "Loading…" : `Load more products`}
              </button>
            </div>
          )}

          {/* Trust + cross-link */}
          <div className="mt-12 grid gap-3 sm:grid-cols-[1fr_auto]">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl bg-white px-5 py-4 text-sm text-ink shadow-card">
              <li className="inline-flex items-center gap-2"><LuWallet className="text-brand-600" aria-hidden /> Cash on delivery</li>
              <li className="inline-flex items-center gap-2"><LuShieldCheck className="text-brand-600" aria-hidden /> Secure online payments</li>
              <li className="inline-flex items-center gap-2"><LuRotateCcw className="text-brand-600" aria-hidden /> Easy returns</li>
            </ul>
            <Link
              href="/recharge"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-charge-600 px-5 py-4 text-sm font-bold text-white shadow-card transition hover:bg-charge-700"
            >
              <LuSmartphone aria-hidden /> Need a mobile recharge?
              <LuArrowRight className="transition group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile filters sheet */}
      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Filters"
        footer={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate({ price: "", onSale: false, inStock: false })}
              className="h-12 flex-1 rounded-xl border border-black/10 text-sm font-bold text-ink hover:bg-cream"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="h-12 flex-[2] rounded-xl bg-brand-600 text-sm font-bold text-white hover:bg-brand-700"
            >
              {isPending ? "Updating…" : `Show ${result.total} products`}
            </button>
          </div>
        }
      >
        <ShopFilters params={params} onChange={(patch) => navigate(patch)} />
      </Sheet>
    </main>
  );
}
