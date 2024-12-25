import { Inter } from "next/font/google";
import Navbar from "@/components/users/shared/NavbarUsers";
import Footer from "@/components/users/shared/FooterUsers";
import { ToastContainer } from 'react-toastify'; // Import ToastContainer

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
    <>
      <Navbar />
      <div className={inter.className}>
        {children}
      </div>
      <Footer />
      <ToastContainer /> {/* Toast container for notifications */}
    </>
  );
}
