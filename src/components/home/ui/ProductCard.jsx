"use client";
import Link from "next/link";
import { LuMinus, LuPlus, LuStar } from "react-icons/lu";
import { useCartQuantity } from "@/lib/cartStore";

const UNIT_LABEL = { Gm: "g", ML: "ml", kg: "kg", Pieces: "pcs" };

export default function ProductCard({ product, className = "" }) {
  const { _id, name, salePrice, originalPrice, featuredImage, weight, status } = product;
  const [qty, setQty] = useCartQuantity(_id);
  const outOfStock = status === "Out of stock";
  const hasDiscount = Number(originalPrice) > Number(salePrice);
  const off = hasDiscount ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;
  const unit = weight?.value ? `${weight.value} ${UNIT_LABEL[weight.unit] || weight.unit}` : null;

  return (
    <article
      className={`group relative flex h-full flex-col rounded-2xl border border-black/5 bg-white p-3 shadow-card transition-shadow hover:shadow-lift sm:p-4 ${className}`}
    >
      {off >= 1 && (
        <span className="absolute left-3 top-3 z-[1] rounded-full bg-offer-500 px-2 py-0.5 text-[11px] font-bold text-white">
          {off}% OFF
        </span>
      )}

      <Link href={`/product/${_id}`} className="flex flex-1 flex-col" aria-label={name}>
        <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-brand-50/60">
          {featuredImage ? (
            // Remote images come from the admin (Cloudinary or other hosts), so a plain <img> is used.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={featuredImage}
              alt={name}
              loading="lazy"
              decoding="async"
              width={320}
              height={320}
              className="h-4/5 w-4/5 object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : null}
        </div>
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-5 text-ink">{name}</h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-ink-muted">
          {unit && <span>{unit}</span>}
          {/* Real ratings only — nothing is shown until a product has reviews */}
          {product.ratings?.numberOfRatings > 0 && (
            <span className="inline-flex items-center gap-0.5 rounded bg-brand-50 px-1.5 py-0.5 font-semibold text-brand-800">
              <LuStar className="fill-current text-offer-500" aria-hidden />
              {Number(product.ratings.average).toFixed(1)}
              <span className="sr-only"> out of 5 from {product.ratings.numberOfRatings} reviews</span>
            </span>
          )}
        </div>
      </Link>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="leading-tight">
          <p className="text-base font-bold text-ink">₹{salePrice}</p>
          {hasDiscount && <p className="whitespace-nowrap text-xs text-ink-soft line-through">MRP ₹{originalPrice}</p>}
        </div>

        {outOfStock ? (
          <span className="whitespace-nowrap rounded-lg bg-gray-100 px-2.5 py-2 text-xs font-semibold text-ink-muted">Sold out</span>
        ) : qty > 0 ? (
          <div className="flex h-10 items-center rounded-lg bg-brand-600 text-white">
            <button
              type="button"
              onClick={() => setQty(qty - 1)}
              className="flex h-10 w-9 items-center justify-center rounded-l-lg hover:bg-brand-700"
              aria-label={`Remove one ${name}`}
            >
              <LuMinus aria-hidden />
            </button>
            <span className="min-w-[1.5rem] text-center text-sm font-bold" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty(qty + 1)}
              className="flex h-10 w-9 items-center justify-center rounded-r-lg hover:bg-brand-700"
              aria-label={`Add one more ${name}`}
            >
              <LuPlus aria-hidden />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setQty(1)}
            className="h-10 rounded-lg border border-brand-600 px-4 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-600 hover:text-white"
            aria-label={`Add ${name} to cart`}
          >
            ADD
          </button>
        )}
      </div>
    </article>
  );
}
