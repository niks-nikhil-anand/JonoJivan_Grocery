import Link from "next/link";
import { LuApple, LuShoppingBasket, LuSprayCan, LuSmartphone, LuTv, LuContact } from "react-icons/lu";
import { Container } from "./ui/Section";

const actions = [
  { label: "Fruits & Veg", href: "/category", icon: LuApple, tone: "brand" },
  { label: "Daily Needs", href: "/category", icon: LuShoppingBasket, tone: "brand" },
  { label: "Home Care", href: "/category", icon: LuSprayCan, tone: "brand" },
  { label: "Mobile Recharge", href: "/recharge", icon: LuSmartphone, tone: "charge" },
  { label: "DTH Recharge", href: "#recharge-dth", icon: LuTv, tone: "charge" },
  { label: "Ration Card", href: "/rationCard", icon: LuContact, tone: "offer" },
];

const toneClass = {
  brand: "bg-brand-100 text-brand-700 group-hover:bg-brand-600 group-hover:text-white",
  charge: "bg-charge-100 text-charge-700 group-hover:bg-charge-600 group-hover:text-white",
  offer: "bg-offer-100 text-offer-600 group-hover:bg-offer-500 group-hover:text-white",
};

/** ② Ease — every service one tap away. */
export default function QuickActions() {
  return (
    <section aria-label="Quick actions" className="relative z-[2] -mt-2 lg:-mt-8">
      <Container>
        <ul className="grid grid-cols-3 gap-2.5 rounded-3xl bg-white p-3 shadow-card sm:grid-cols-6 sm:gap-3 sm:p-4 lg:p-5">
          {actions.map(({ label, href, icon: Icon, tone }) => (
            <li key={label}>
              <Link
                href={href}
                className="group flex h-full flex-col items-center gap-2 rounded-2xl p-2 text-center transition-colors hover:bg-cream sm:p-3"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-[22px] transition-colors lg:h-14 lg:w-14 lg:text-2xl ${toneClass[tone]}`}
                >
                  <Icon aria-hidden />
                </span>
                <span className="text-xs font-medium leading-tight text-ink sm:text-[13px]">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
