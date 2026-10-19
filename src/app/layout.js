import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import EgoisticNavbar from "@/components/utils/EgosticNavbar";
import EgoisticFooter from "@/components/utils/EgosticFooter";
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const SITE_URL = "https://www.jonojivangrocery.in";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "JonoJivan | Groceries & Mobile Recharge",
  description:
    "Fresh fruits, vegetables and daily household essentials delivered to your door, plus quick mobile and DTH recharge — all in one place with JonoJivan.",
  keywords:
    "JonoJivan, grocery, online grocery, vegetables, fruits, daily needs, mobile recharge, DTH recharge, household essentials",
  authors: [{ name: "JonoJivan Team" }],
  robots: "index, follow",
  openGraph: {
    title: "JonoJivan — Groceries & Mobile Recharge",
    type: "website",
    url: SITE_URL,
    description:
      "Daily needs, fresh produce and instant mobile / DTH recharge. Everything your home runs on, in one place.",
    images: [
      {
        url: "/logo/og-image.jpg",
        width: 1024,
        height: 536,
        alt: "JonoJivan — Groceries & Mobile Recharge",
      },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16A34A",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-body text-ink antialiased">
        <EgoisticNavbar />
        {children}
        <EgoisticFooter />
        <Toaster />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
