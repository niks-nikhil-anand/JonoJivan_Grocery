import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BannerText01 = () => {
  return (
    <div
    className="relative flex items-center justify-start h-[500px] md:h-[600px] w-full bg-cover bg-center"
    style={{
      backgroundImage: `url('/frontend/Banner/Banner102.jpg')`,
    }}
  >
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
  
    {/* Text Section */}
    <div className="relative z-10 max-w-3xl px-6 md:px-16 text-white">
      {/* Badge */}
      <div className="inline-block bg-red-500 text-xs md:text-sm px-4 py-2 rounded-full font-bold uppercase tracking-wide mb-4">
        Exclusive Deals
      </div>
  
      <h1 className="text-3xl md:text-6xl font-bold mb-6 leading-tight">
        Discover the Latest Trends <br /> in Fashion, Tech & More!
      </h1>
      <p className="text-sm md:text-lg text-gray-200 mb-8">
        Shop top-quality products at unbeatable prices. From the latest gadgets to stylish apparel, find everything you need in one place.
      </p>
  
      {/* Button */}
      <Link  href={"/product/shopAllProducts"}>
      <button className="bg-white text-black text-sm md:text-lg px-6 py-3 rounded-md shadow-md hover:bg-gray-100">
        Shop Now
      </button>
      
      </Link>
    </div>
  </div>
  
  );
};

export default BannerText01;
