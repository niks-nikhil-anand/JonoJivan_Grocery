import Link from "next/link";
import Image from "next/image";
import { LuMapPin, LuPhone, LuMessageCircle, LuWallet, LuCreditCard, LuSmartphone, LuFacebook, LuInstagram } from "react-icons/lu";
import { business } from "@/config/home";
import logo from "../../../../public/logo/logo.png";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Shop all products", href: "/product/shopAllProducts" },
      { label: "Categories", href: "/category" },
      { label: "Mobile recharge", href: "/recharge" },
      { label: "Jio recharge", href: "/recharge/jio" },
      { label: "Airtel recharge", href: "/recharge/airtel" },
      { label: "Vi recharge", href: "/recharge/vi" },
      { label: "BSNL recharge", href: "/recharge/bsnl" },
      { label: "Ration Card", href: "/rationCard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/aboutUs" },
      { label: "Contact us", href: "/contactUs" },
      { label: "Blog", href: "/blog" },
      { label: "FAQs", href: "/Faqs" },
      { label: "Become a vendor", href: "/auth/vendorRegistration" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Privacy policy", href: "/privacyPolicy" },
      { label: "Return policy", href: "/returnPolicy" },
      { label: "Shipping policy", href: "/shippingPolicy" },
      { label: "Terms & conditions", href: "/termsAndConditions" },
    ],
  },
];

const payments = [
  { icon: LuSmartphone, label: "UPI" },
  { icon: LuCreditCard, label: "Cards" },
  { icon: LuWallet, label: "Cash on delivery" },
];

const Footer = () => {
  const year = new Date().getFullYear();
  const socials = [
    business.social?.facebook && { href: business.social.facebook, icon: LuFacebook, label: "Facebook" },
    business.social?.instagram && { href: business.social.instagram, icon: LuInstagram, label: "Instagram" },
  ].filter(Boolean);

  return (
    <footer className="bg-[#0F1F16] text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8 lg:py-16">
        {/* Brand + contact */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src={logo} alt="" width={40} height={40} className="h-10 w-10 rounded-full bg-white" />
            <span className="font-display text-xl font-bold text-white">JonoJivan</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">
            Groceries and recharge for every home — from your neighbourhood store, online.
          </p>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <LuMapPin className="mt-0.5 shrink-0 text-brand-300" aria-hidden />
              <span>
                {business.address.map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </span>
            </li>
            <li>
              <a href={`tel:${business.phone}`} className="inline-flex items-center gap-2.5 hover:text-white">
                <LuPhone className="text-brand-300" aria-hidden /> {business.phone}
              </a>
            </li>
            {business.whatsappNumber && (
              <li>
                <a
                  href={`https://wa.me/${business.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 hover:text-white"
                >
                  <LuMessageCircle className="text-brand-300" aria-hidden /> WhatsApp us
                </a>
              </li>
            )}
          </ul>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-2">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg hover:bg-brand-600 hover:text-white"
                >
                  <Icon aria-hidden />
                </a>
              ))}
            </div>
          )}
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">{col.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-xs text-gray-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© {year} {business.legalName}. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-2" aria-label="Payment methods">
            {payments.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-gray-300">
                <Icon aria-hidden /> {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
