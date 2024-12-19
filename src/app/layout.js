import { Inter } from "next/font/google";
import "./globals.css";
import toast, { Toaster } from 'react-hot-toast';
import ogImage from '../../public/logo/og-image.jpg'; // Local image import
import EgoisticNavbar from "@/components/utils/EgosticNavbar";
import EgoisticFooter from "@/components/utils/EgosticFooter";
import Script from 'next/script'


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "JonoJivan | Your Grocery Destination",
  description: "Explore JonoJivan for the freshest vegetables, fruits, and essential daily needs. We provide a wide range of grocery items to meet all your household needs, delivered right to your door.",
  keywords: "JonoJivan, grocery, vegetables, fruits, daily needs, fresh produce, online grocery, household essentials",
  author: "JonoJivan Team",
  robots: "index, follow",
  openGraph: {
    title: "JonoJivan - Your Grocery Destination",
    type: "website",
    url: "https://www.jonojivangrocery.in", // Update this URL as needed
    description: "Discover the best in groceries with JonoJivan. From fresh vegetables to daily essentials, we have everything you need for your home.",
    images: [
      {
        url: "/public/logo/og-image.jpg", // Adjust this path as necessary
        width: 1200,
        height: 630,
        alt: "JonoJivan - Your Grocery Destination",
      },
    ],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="title" content={metadata.title} />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <meta name="robots" content={metadata.robots} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
      </head>
      <body className={inter.className}>
        <EgoisticNavbar />
        {children}
        <EgoisticFooter />
        <Toaster />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
