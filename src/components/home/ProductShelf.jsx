"use client";
import { useRef } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import ProductCard from "./ui/ProductCard";

/**
 * Product list used by "Today's deals" (grid) and "Just added" (rail).
 * grid: 2 cols mobile → 3 tablet → 5 desktop.
 * rail: horizontal snap scroll on every size, arrows on desktop.
 */
export default function ProductShelf({ products, layout = "grid" }) {
  const railRef = useRef(null);

  if (layout === "grid") {
    return (
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 sm:[&>li:nth-child(10)]:hidden lg:[&>li:nth-child(10)]:block">
        {products.map((p) => (
          <li key={p._id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    );
  }

  const scroll = (dir) => {
    const el = railRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <ul
        ref={railRef}
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 no-scrollbar sm:-mx-6 sm:gap-4 sm:px-6 lg:mx-0 lg:px-0"
      >
        {products.map((p) => (
          <li key={p._id} className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-[calc((100%-4rem)/5)]">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
      {products.length > 5 && (
        <>
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="absolute -left-5 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl text-ink shadow-lift transition hover:bg-brand-600 hover:text-white lg:flex"
            aria-label="Scroll left"
          >
            <LuChevronLeft aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="absolute -right-5 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl text-ink shadow-lift transition hover:bg-brand-600 hover:text-white lg:flex"
            aria-label="Scroll right"
          >
            <LuChevronRight aria-hidden />
          </button>
        </>
      )}
    </div>
  );
}
