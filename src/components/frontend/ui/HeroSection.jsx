"use client"
import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <div className="bg-gray-900 text-white py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Text Section */}
          <div className="flex flex-col justify-center">
            <motion.h1
              className="text-5xl font-bold leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Discover Amazing Deals
              <span className="text-blue-500"> Every Day</span>
            </motion.h1>
            <motion.p
              className="text-lg mt-4 text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Shop across categories, get fresh groceries delivered, and track
              your parcels - all in one place!
            </motion.p>
            {/* Buttons */}
            <motion.div
              className="flex mt-6 space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md shadow-md">
                Shop Now
              </button>
              <button className="bg-transparent border border-white text-white px-6 py-3 rounded-md hover:bg-gray-800">
                View Offers
              </button>
            </motion.div>
            {/* Tags */}
            <motion.div
              className="flex mt-6 space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <span className="bg-green-200 text-green-800 px-4 py-2 rounded-full text-sm">
                50% OFF on Electronics
              </span>
              <span className="bg-purple-200 text-purple-800 px-4 py-2 rounded-full text-sm">
                Free Delivery
              </span>
              <span className="bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full text-sm">
                Special Deals
              </span>
            </motion.div>
          </div>
          {/* Category Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Electronics", subtitle: "Latest Gadgets" },
              { title: "Fashion", subtitle: "Trending Styles" },
              { title: "Groceries", subtitle: "Fresh Produce" },
              { title: "Courier", subtitle: "Fast Delivery" },
            ].map((category, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
              >
                <h3 className="text-lg font-bold">{category.title}</h3>
                <p className="text-gray-400">{category.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
