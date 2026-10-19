import Link from "next/link";
import Image from "next/image";
import { LuShoppingBasket } from "react-icons/lu";
import Section from "./ui/Section";
import vegBasket from "../../../public/frontend/WhoWeAre/banner-3.png";
import onions from "../../../public/frontend/WhoWeAre/banner-1.png";
import juice from "../../../public/frontend/WhoWeAre/banner-2.png";

// One tint family (green → mint → cream) instead of ten random colours.
const tints = ["bg-brand-50", "bg-[#F3F7EC]", "bg-[#FFF8EC]", "bg-[#EEF7F3]"];

const promos = [
  { title: "Fresh vegetables", sub: "Picked for your kitchen", image: vegBasket, bg: "bg-[#E7EAF3]" },
  { title: "Kitchen staples", sub: "Onion, potato, dal & more", image: onions, bg: "bg-[#F0E8D5]" },
  { title: "Juices & drinks", sub: "Cool down, the easy way", image: juice, bg: "bg-[#F3E8E8]" },
];

/** ④ Choice — the whole store at a glance. */
export default function Categories({ categories }) {
  return (
    <Section
      eyebrow="Shop by category"
      title="From morning chai to dinner dal."
      subtitle="Everything your kitchen needs, sorted the way you shop."
      action={{ href: "/category", label: "All categories" }}
    >
      {categories.length > 0 && (
        <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0 md:grid-cols-6 lg:grid-cols-8">
          {categories.map((c, i) => (
            <li key={c._id} className="w-[28%] shrink-0 snap-start sm:w-auto">
              <Link href={`/category/${c._id}`} className="group flex flex-col items-center gap-2 text-center">
                <span
                  className={`flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl ${tints[i % tints.length]} transition-transform duration-300 group-hover:-translate-y-1`}
                >
                  {c.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width={200}
                      height={200}
                      className="h-3/4 w-3/4 object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <LuShoppingBasket className="text-3xl text-brand-600" aria-hidden />
                  )}
                </span>
                <span className="line-clamp-2 text-xs font-semibold text-ink sm:text-sm">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Promo tiles — text is real HTML, images carry no baked-in copy */}
      <div className="mt-8 grid gap-3 sm:gap-4 lg:mt-12 lg:grid-cols-3">
        {promos.map((p) => (
          <Link
            key={p.title}
            href="/product/shopAllProducts"
            className={`group relative flex min-h-[132px] overflow-hidden rounded-3xl ${p.bg} p-5 lg:min-h-[176px] lg:p-6`}
          >
            <div className="relative z-[1] max-w-[55%]">
              <h3 className="font-display text-lg font-bold leading-tight text-ink lg:text-xl">{p.title}</h3>
              <p className="mt-1 text-xs text-ink-muted lg:text-sm">{p.sub}</p>
              <span className="mt-3 inline-flex h-9 items-center rounded-full bg-ink px-4 text-xs font-semibold text-white transition group-hover:bg-brand-700">
                Shop now
              </span>
            </div>
            <Image
              src={p.image}
              alt=""
              sizes="(min-width: 640px) 33vw, 100vw"
              className="absolute inset-y-0 right-0 h-full w-auto max-w-none object-cover object-right transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        ))}
      </div>
    </Section>
  );
}
