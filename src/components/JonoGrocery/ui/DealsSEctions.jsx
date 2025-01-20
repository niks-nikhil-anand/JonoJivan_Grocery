"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaLocationArrow } from "react-icons/fa";

const DealsSection = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-[50vh] py-10">
      <div className="mx-auto max-w-screen-lg text-center">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mr-3">Deals Near You</h1>
          <FaLocationArrow className="text-green-500" />
        </div>
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div
            className="bg-white shadow-lg rounded-lg p-6 relative"
            whileHover={{ scale: 1.05 }}
          >
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              Today Only
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mt-4">Weekend Special</h2>
            <p className="text-sm text-gray-600 mt-2">Get 30% off on all fresh vegetables</p>
            <p className="text-green-500 text-sm font-bold mt-2">Valid until today midnight</p>
            <button className="mt-6 bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
              Claim Now
            </button>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="bg-white shadow-lg rounded-lg p-6 relative"
            whileHover={{ scale: 1.05 }}
          >
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              New Users
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mt-4">First Order Discount</h2>
            <p className="text-sm text-gray-600 mt-2">50% off on your first order above $50</p>
            <p className="text-green-500 text-sm font-bold mt-2">Use code: FIRST50</p>
            <button className="mt-6 bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
              Get Code
            </button>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            className="bg-white shadow-lg rounded-lg p-6 relative"
            whileHover={{ scale: 1.05 }}
          >
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
              Limited Time
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mt-4">Bulk Purchase Offer</h2>
            <p className="text-sm text-gray-600 mt-2">Buy more save more: Up to 40% off</p>
            <p className="text-green-500 text-sm font-bold mt-2">Min. purchase $100</p>
            <button className="mt-6 bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
              Shop Now
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DealsSection;
