import 'tailwindcss/tailwind.css';
import '@/app/globals.css';
import Head from 'next/head';
import NavbarGrocery from '@/components/JonoGrocery/shared/NavbarGrocery';

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
        url: "/logo/og-image.jpg", // Adjust this path as necessary
        width: 1200,
        height: 630,
        alt: "JonoJivan - Your Grocery Destination",
      },
    ],
  },
};

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <meta name="robots" content={metadata.robots} />
        
        <title>{metadata.title}</title>
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:type" content={metadata.openGraph.type} />
      </Head>

      {/* Main Layout */}
      <div >
          <NavbarGrocery/>
          {children}
        {/* You can add a footer here */}
      </div>
    </>
  );
};

export default Layout;
