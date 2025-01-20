"use client"
import React from "react";
import { motion } from "framer-motion";
import { FaLocationArrow } from "react-icons/fa";

const DealsSection = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mr-2">Deals Near You</h1>
          <FaLocationArrow className="text-green-500" />
        </div>
        <p className="text-gray-500 mb-4">Location access denied</p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1 */}
          <motion.div
            className="bg-white shadow rounded-lg p-4 relative"
            whileHover={{ scale: 1.05 }}
          >
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              Today Only
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mt-4">Weekend Special</h2>
            <p className="text-sm text-gray-600">Get 30% off on all fresh vegetables</p>
            <p className="text-green-500 text-sm font-bold mt-2">Valid until today midnight</p>
            <button className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Claim Now
            </button>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="bg-white shadow rounded-lg p-4 relative"
            whileHover={{ scale: 1.05 }}
          >
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              New Users
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mt-4">First Order Discount</h2>
            <p className="text-sm text-gray-600">50% off on your first order above $50</p>
            <p className="text-green-500 text-sm font-bold mt-2">Use code: FIRST50</p>
            <button className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Get Code
            </button>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            className="bg-white shadow rounded-lg p-4 relative"
            whileHover={{ scale: 1.05 }}
          >
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
              Limited Time
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mt-4">Bulk Purchase Offer</h2>
            <p className="text-sm text-gray-600">Buy more save more: Up to 40% off</p>
            <p className="text-green-500 text-sm font-bold mt-2">Min. purchase $100</p>
            <button className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Shop Now
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DealsSection;
