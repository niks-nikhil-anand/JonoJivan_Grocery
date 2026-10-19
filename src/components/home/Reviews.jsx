import { LuStar, LuQuote } from "react-icons/lu";
import Section from "./ui/Section";
import { reviews } from "@/config/home";

/** ⑪ Social proof — real customers only; hidden until there are enough. */
export default function Reviews() {
  if (reviews.items.length < reviews.minToShow) return null;
  return (
    <Section eyebrow="Customer love" title="What families around you say.">
      <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-3">
        {reviews.items.map((r, i) => (
          <li key={i} className="w-[85%] shrink-0 snap-start rounded-2xl bg-white p-5 shadow-card sm:w-auto">
            <LuQuote className="text-2xl text-brand-300" aria-hidden />
            <p className="mt-2 text-sm leading-relaxed text-ink">{r.text}</p>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">
                {r.name} <span className="font-normal text-ink-muted">· {r.area}</span>
              </p>
              <span className="flex text-offer-500" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: r.rating }).map((_, s) => (
                  <LuStar key={s} className="fill-current" aria-hidden />
                ))}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
