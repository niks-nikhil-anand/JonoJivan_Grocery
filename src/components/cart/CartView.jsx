"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  LuChevronRight,
  LuMinus,
  LuPlus,
  LuTrash2,
  LuShoppingBasket,
  LuShieldCheck,
  LuWallet,
  LuRotateCcw,
  LuAlertTriangle,
  LuUser,
  LuArrowRight,
  LuBadgePercent,
  LuTruck,
} from "react-icons/lu";
import { useCartItems, setQuantity, removeFromCart, restoreToCart } from "@/lib/cartStore";
import ProductCard from "@/components/home/ui/ProductCard";

const MAX_QTY = 99;
const UNIT_LABEL = { Gm: "g", ML: "ml", kg: "kg", Pieces: "pcs" };
const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const STEPS = ["Cart", "Address", "Payment"];

function Steps() {
  return (
    <ol className="flex items-center gap-2 text-xs font-semibold sm:text-sm" aria-label="Checkout progress">
      {STEPS.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
              i === 0 ? "bg-brand-600 text-white" : "bg-white text-ink-muted ring-1 ring-black/10"
            }`}
            aria-current={i === 0 ? "step" : undefined}
          >
            {i + 1}
          </span>
          <span className={i === 0 ? "text-ink" : "text-ink-muted"}>{s}</span>
          {i < STEPS.length - 1 && <span className="h-px w-5 bg-black/15 sm:w-8" aria-hidden />}
        </li>
      ))}
    </ol>
  );
}

function removeWithUndo(id, name) {
  const removed = removeFromCart(id);
  if (!removed) return;
  toast(
    (t) => (
      <span className="flex items-center gap-3 text-sm">
        <span>
          Removed <strong>{name || "item"}</strong>
        </span>
        <button
          type="button"
          onClick={() => {
            restoreToCart(removed);
            toast.dismiss(t.id);
          }}
          className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-700"
        >
          Undo
        </button>
      </span>
    ),
    { duration: 5000 }
  );
}

export default function CartView() {
  const { items, ready } = useCartItems();
  const [details, setDetails] = useState({}); // id -> product
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [popular, setPopular] = useState([]);

  const idsKey = useMemo(() => items.map((i) => i.id).sort().join(","), [items]);

  // Load product details once per set of ids (not on every quantity change).
  useEffect(() => {
    if (!ready) return;
    const ids = idsKey ? idsKey.split(",") : [];
    const missing = ids.filter((id) => !details[id]);
    if (!missing.length) {
      setLoaded(true);
      return;
    }
    let cancelled = false;
    setError(false);
    fetch("/api/products/by-ids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: missing }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (cancelled) return;
        setDetails((prev) => {
          const next = { ...prev };
          missing.forEach((id) => (next[id] = next[id] || null)); // null = not found
          (data.products || []).forEach((p) => (next[p._id] = p));
          return next;
        });
      })
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoaded(true));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, ready]);

  // Suggestions for the empty cart
  useEffect(() => {
    if (!ready || items.length || popular.length) return;
    fetch("/api/products?onSale=1&inStock=1&sort=discount&limit=8")
      .then((r) => r.json())
      .then((d) => setPopular(d.products || []))
      .catch(() => {});
  }, [ready, items.length, popular.length]);

  const lines = items.map((i) => ({ ...i, product: details[i.id] }));
  const available = lines.filter((l) => l.product && l.product.status !== "Out of stock" && l.product.status !== "Inactive");
  const problems = lines.filter((l) => l.product === null || (l.product && (l.product.status === "Out of stock" || l.product.status === "Inactive")));
  const pending = lines.some((l) => l.product === undefined);

  const itemCount = available.reduce((n, l) => n + l.quantity, 0);
  const mrpTotal = available.reduce((s, l) => s + Math.max(l.product.originalPrice, l.product.salePrice) * l.quantity, 0);
  const subtotal = available.reduce((s, l) => s + l.product.salePrice * l.quantity, 0);
  const savings = mrpTotal - subtotal;
  const canCheckout = loaded && !pending && available.length > 0 && problems.length === 0;

  // ── Loading skeleton ────────────────────────────────────────
  if (!ready || (items.length > 0 && !loaded && pending)) {
    return (
      <Shell count={null}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex animate-pulse gap-4 rounded-2xl bg-white p-4 shadow-card">
                <div className="h-20 w-20 rounded-xl bg-gray-100" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 w-2/3 rounded bg-gray-100" />
                  <div className="h-3 w-1/3 rounded bg-gray-100" />
                  <div className="h-8 w-28 rounded-lg bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-3xl bg-white shadow-card" />
        </div>
      </Shell>
    );
  }

  // ── Empty cart ──────────────────────────────────────────────
  if (!items.length) {
    return (
      <Shell count={0}>
        <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-14 text-center shadow-card">
          <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-brand-50 text-5xl text-brand-600">
            <LuShoppingBasket aria-hidden />
            <span className="absolute -right-1 top-2 h-5 w-5 rounded-full bg-offer-500 ring-4 ring-white" aria-hidden />
          </span>
          <h2 className="mt-5 font-display text-2xl font-bold text-ink">Your cart is empty</h2>
          <p className="mt-1 max-w-sm text-sm text-ink-muted">Fresh vegetables, staples and daily needs are a tap away.</p>
          <Link
            href="/product/shopAllProducts"
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-brand-600 px-7 text-sm font-bold text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700"
          >
            Start shopping <LuArrowRight aria-hidden />
          </Link>
        </div>

        {popular.length > 0 && (
          <section className="mt-10" aria-labelledby="popular-title">
            <h2 id="popular-title" className="font-display text-xl font-bold text-ink sm:text-2xl">
              Popular right now
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {popular.map((p) => (
                <li key={p._id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </Shell>
    );
  }

  // ── Cart with items ─────────────────────────────────────────
  return (
    <Shell count={itemCount}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
        <div className="min-w-0 space-y-3">
          {error && (
            <p className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <LuAlertTriangle aria-hidden /> We couldn&apos;t load some items. Please refresh the page.
            </p>
          )}

          {problems.length > 0 && (
            <div className="rounded-2xl border border-offer-100 bg-offer-50 p-4">
              <p className="flex items-start gap-2 text-sm font-semibold text-ink">
                <LuAlertTriangle className="mt-0.5 shrink-0 text-offer-600" aria-hidden />
                {problems.length === 1 ? "1 item is" : `${problems.length} items are`} no longer available. Remove{" "}
                {problems.length === 1 ? "it" : "them"} to continue.
              </p>
              <ul className="mt-3 space-y-2">
                {problems.map((l) => (
                  <li key={l.id} className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-sm">
                    <span className="truncate text-ink">{l.product?.name || "A product that was removed from the store"}</span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(l.id)}
                      className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ul className="space-y-3">
            {available.map(({ id, quantity, product }) => {
              const unit = product.weight?.value ? `${product.weight.value} ${UNIT_LABEL[product.weight.unit] || product.weight.unit}` : null;
              const hasMrp = product.originalPrice > product.salePrice;
              return (
                <li key={id} className="group flex gap-3 rounded-2xl border border-black/5 bg-white p-3 shadow-card transition hover:shadow-lift sm:gap-4 sm:p-4">
                  <Link href={`/product/${id}`} className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-50/60 sm:h-24 sm:w-24">
                    {product.featuredImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.featuredImage} alt={product.name} width={96} height={96} loading="lazy" className="h-4/5 w-4/5 object-contain" />
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link href={`/product/${id}`} className="line-clamp-2 text-sm font-semibold text-ink hover:text-brand-700 sm:text-base">
                          {product.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          {unit && <span>{unit} · </span>}
                          {inr(product.salePrice)} each
                          {hasMrp && <span className="ml-1 line-through">{inr(product.originalPrice)}</span>}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeWithUndo(id, product.name)}
                        className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-soft transition hover:bg-red-50 hover:text-red-600"
                        aria-label={`Remove ${product.name}`}
                      >
                        <LuTrash2 aria-hidden />
                      </button>
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                      <div className="flex h-10 items-center rounded-xl border border-brand-200 bg-brand-50">
                        <button
                          type="button"
                          onClick={() => (quantity <= 1 ? removeWithUndo(id, product.name) : setQuantity(id, quantity - 1))}
                          className="flex h-10 w-10 items-center justify-center rounded-l-xl text-brand-800 hover:bg-brand-100"
                          aria-label={quantity <= 1 ? `Remove ${product.name}` : `Decrease quantity of ${product.name}`}
                        >
                          {quantity <= 1 ? <LuTrash2 aria-hidden /> : <LuMinus aria-hidden />}
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-bold text-ink" aria-live="polite">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(id, Math.min(MAX_QTY, quantity + 1))}
                          disabled={quantity >= MAX_QTY}
                          className="flex h-10 w-10 items-center justify-center rounded-r-xl text-brand-800 hover:bg-brand-100 disabled:opacity-40"
                          aria-label={`Increase quantity of ${product.name}`}
                        >
                          <LuPlus aria-hidden />
                        </button>
                      </div>
                      <div className="text-right leading-tight">
                        <p className="font-display text-lg font-bold text-ink">{inr(product.salePrice * quantity)}</p>
                        {hasMrp && <p className="text-xs font-semibold text-brand-700">Save {inr((product.originalPrice - product.salePrice) * quantity)}</p>}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <Link href="/product/shopAllProducts" className="inline-flex items-center gap-1 pt-2 text-sm font-semibold text-brand-700 hover:underline">
            <LuPlus aria-hidden /> Add more items
          </Link>
        </div>

        {/* Summary */}
        <aside className="space-y-3 lg:sticky lg:top-28 lg:self-start">
          <section aria-labelledby="summary-title" className="rounded-3xl border border-black/5 bg-white p-5 shadow-lift sm:p-6">
            <h2 id="summary-title" className="font-display text-lg font-bold text-ink">
              Order summary
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Items ({itemCount})</dt>
                <dd className="font-semibold text-ink">{inr(mrpTotal)}</dd>
              </div>
              {savings > 0 && (
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Discount</dt>
                  <dd className="font-semibold text-brand-700">− {inr(savings)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="inline-flex items-center gap-1.5 text-ink-muted"><LuTruck aria-hidden /> Delivery</dt>
                <dd className="text-right text-ink-muted">Calculated at checkout</dd>
              </div>
              <div className="flex items-end justify-between border-t border-dashed border-black/10 pt-4">
                <dt className="font-semibold text-ink">Subtotal</dt>
                <dd className="font-display text-2xl font-bold text-ink">{inr(subtotal)}</dd>
              </div>
            </dl>

            {savings > 0 && (
              <p className="mt-4 flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2.5 text-sm font-semibold text-brand-800">
                <LuBadgePercent aria-hidden /> You save {inr(savings)} on this order
              </p>
            )}

            <CheckoutButton enabled={canCheckout} className="mt-5 hidden lg:flex" />
            {!canCheckout && problems.length > 0 && (
              <p className="mt-2 text-center text-xs text-red-600">Remove unavailable items to continue.</p>
            )}

            <ul className="mt-5 space-y-2 border-t border-black/5 pt-4 text-xs text-ink-muted">
              <li className="flex items-center gap-2"><LuWallet className="text-brand-600" aria-hidden /> Cash on delivery available</li>
              <li className="flex items-center gap-2"><LuShieldCheck className="text-brand-600" aria-hidden /> Secure payments by Razorpay</li>
              <li className="flex items-center gap-2">
                <LuRotateCcw className="text-brand-600" aria-hidden /> Easy returns —{" "}
                <Link href="/returnPolicy" className="font-semibold text-brand-700 hover:underline">policy</Link>
              </li>
            </ul>
          </section>

          <Link
            href="/auth/signIn?next=/product/cart"
            className="group flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-card transition hover:border-brand-200"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><LuUser aria-hidden /></span>
            <span className="flex-1 text-sm">
              <span className="block font-semibold text-ink">Have an account?</span>
              <span className="block text-ink-muted">Sign in to use saved addresses — or continue as a guest.</span>
            </span>
            <LuChevronRight className="text-ink-soft transition group-hover:translate-x-0.5 group-hover:text-brand-700" aria-hidden />
          </Link>
        </aside>
      </div>

      {/* Sticky checkout bar — phones & tablets (sits above the phone tab bar) */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-black/5 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgb(0_0_0/0.08)] backdrop-blur sm:bottom-0 lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="leading-tight">
            <p className="font-display text-xl font-bold text-ink">{inr(subtotal)}</p>
            <p className="text-xs text-ink-muted">
              {itemCount} item{itemCount === 1 ? "" : "s"}
              {savings > 0 && <span className="font-semibold text-brand-700"> · saving {inr(savings)}</span>}
            </p>
          </div>
          <CheckoutButton enabled={canCheckout} className="flex w-auto px-6" compact />
        </div>
      </div>
      <div className="h-20 lg:hidden" aria-hidden />
    </Shell>
  );
}

function CheckoutButton({ enabled, className = "", compact = false }) {
  const cls = `h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold transition ${
    enabled ? "bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700" : "cursor-not-allowed bg-gray-200 text-ink-muted"
  } ${compact ? "" : "w-full text-base"} ${className}`;
  if (!enabled) {
    return (
      <span className={cls} aria-disabled="true">
        Checkout
      </span>
    );
  }
  return (
    <Link href="/product/cart/information" className={cls}>
      Checkout <LuArrowRight aria-hidden />
    </Link>
  );
}

function Shell({ count, children }) {
  return (
    <main className="min-h-[70vh] bg-cream">
      <div className="bg-gradient-to-b from-brand-50 to-cream">
        <div className="mx-auto w-full max-w-7xl px-4 pb-6 pt-6 sm:px-6 lg:px-8 lg:pt-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-ink-muted">
            <Link href="/" className="hover:text-brand-700">Home</Link>
            <LuChevronRight aria-hidden />
            <span className="text-ink">Cart</span>
          </nav>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
                Your cart{count ? <span className="ml-2 text-lg font-semibold text-ink-muted sm:text-xl">({count} item{count === 1 ? "" : "s"})</span> : null}
              </h1>
              <Link href="/product/shopAllProducts" className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
                Continue shopping <LuChevronRight aria-hidden />
              </Link>
            </div>
            {count !== 0 && <Steps />}
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">{children}</div>
    </main>
  );
}
