import React from "react";
import { FaApple, FaGooglePlay } from "react-icons/fa"; // React Icons
import Image from "next/image"; // If using Next.js
import banner from "../../../../../public/frontend/Banner/app-thumbnail.webp";

const Banner2 = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between p-6 lg:p-16 bg-gray-100">
      {/* Text Section */}
      <div className="text-center lg:text-left lg:w-1/2 space-y-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
          Make your online shop easier with our mobile app
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          BoroBazar makes online grocery shopping fast and easy. Get groceries
          delivered and order the best of seasonal farm fresh food.
        </p>
        {/* App Store Buttons */}
        <div className="flex justify-center lg:justify-start space-x-4 mt-4">
          <a
            href="#"
            className="flex items-center justify-center space-x-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            <FaApple size={20} />
            <span className="text-sm sm:text-base">App Store</span>
          </a>
          <a
            href="#"
            className="flex items-center justify-center space-x-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            <FaGooglePlay size={20} />
            <span className="text-sm sm:text-base">Google Play</span>
          </a>
        </div>
      </div>

      {/* Image Section */}
      <div className="lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0">
        <Image
          src={banner}
          alt="Grocery Bag"
          width={300}
          height={300}
          className="w-full max-w-sm"
        />
      </div>
    </section>
  );
};

export default Banner2;
