"use client";
import { PRICE_RANGES } from "@/lib/shopOptions";

/** Price + availability filters. Used in the desktop sidebar and the mobile sheet. */
export default function ShopFilters({ params, onChange }) {
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-3 font-display text-sm font-bold text-ink">Price</legend>
        <div className="space-y-1.5">
          {[{ id: "", label: "Any price" }, ...PRICE_RANGES].map((r) => {
            const checked = params.price === r.id;
            return (
              <label
                key={r.id || "any"}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  checked ? "bg-brand-50 font-semibold text-brand-800" : "text-ink hover:bg-cream"
                }`}
              >
                <input
                  type="radio"
                  name="price"
                  value={r.id}
                  checked={checked}
                  onChange={() => onChange({ price: r.id })}
                  className="h-4 w-4 accent-brand-600"
                />
                {r.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-display text-sm font-bold text-ink">Availability</legend>
        <div className="space-y-1.5">
          {[
            { key: "onSale", label: "On sale / discounted" },
            { key: "inStock", label: "In stock only" },
          ].map(({ key, label }) => (
            <label
              key={key}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                params[key] ? "bg-brand-50 font-semibold text-brand-800" : "text-ink hover:bg-cream"
              }`}
            >
              <input
                type="checkbox"
                checked={params[key]}
                onChange={(e) => onChange({ [key]: e.target.checked ? "1" : "" })}
                className="h-4 w-4 rounded accent-brand-600"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
