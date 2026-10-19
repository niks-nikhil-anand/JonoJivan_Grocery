import Image from "next/image";
import { LuLeaf, LuIndianRupee, LuMapPin, LuShieldCheck } from "react-icons/lu";
import Section from "./ui/Section";
// TODO(photo): replace with a real photo of the JonoJivan store / team.
import storyImg from "../../../public/frontend/Banner/Group_520.webp";

const points = [
  { icon: LuLeaf, title: "Fresh, checked produce", text: "Fruits and vegetables are checked before they're packed for you." },
  { icon: LuIndianRupee, title: "Fair, clear prices", text: "MRP and your price side by side on every product. No hidden charges." },
  { icon: LuMapPin, title: "A local business", text: "Run from Nagaon, Assam — by people who shop in the same markets you do." },
  { icon: LuShieldCheck, title: "Safe payments", text: "Online payments are processed by Razorpay. Cash on delivery when you prefer." },
];

/** ⑧ The trust story — why choose a local store online. */
export default function WhyUs() {
  return (
    <Section className="bg-white">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div className="relative order-last lg:order-first">
          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src={storyImg}
              alt="A shopper choosing fresh vegetables"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[4/3] h-auto w-full object-cover sm:aspect-[16/9] lg:aspect-square"
            />
          </div>
          <div className="absolute -bottom-4 right-4 rounded-2xl bg-brand-700 px-4 py-3 text-white shadow-lift sm:right-6">
            <p className="font-display text-sm font-bold">JonoJivan</p>
            <p className="text-xs text-brand-100">Your neighbourhood store, online</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">Why JonoJivan</p>
          <h2 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl lg:text-4xl">
            Shopping that feels like your local store — minus the queue.
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5">
            {points.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl bg-cream p-4 sm:p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-xl text-brand-700">
                  <Icon aria-hidden />
                </span>
                <h3 className="mt-3 font-display text-base font-bold text-ink">{title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
