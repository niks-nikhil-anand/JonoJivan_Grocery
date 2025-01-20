"use client";
// SubscribeSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaGift, FaBolt, FaBullhorn } from "react-icons/fa";

const SubscribeSection = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-8 px-4 sm:py-12 sm:px-6 rounded-t-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Stay Updated with Latest Offers
        </h2>
        <p className="text-sm sm:text-lg mt-2">
          Subscribe to our newsletter and get exclusive deals, new arrivals, and
          special discounts directly in your inbox.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
        <motion.input
          type="email"
          placeholder="Enter your email address"
          className="p-3 rounded-md w-full sm:w-1/2 text-black focus:outline-none"
          whileFocus={{ scale: 1.02 }}
        />
        <motion.button
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-md hover:bg-gray-100 w-full sm:w-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Subscribe Now
        </motion.button>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <motion.div
          className="flex flex-col items-center text-center bg-white bg-opacity-10 p-4 rounded-md w-full sm:w-40"
          whileHover={{ scale: 1.1 }}
        >
          <FaGift size={30} />
          <p className="mt-2 font-semibold text-sm sm:text-base">Exclusive Offers</p>
        </motion.div>
        <motion.div
          className="flex flex-col items-center text-center bg-white bg-opacity-10 p-4 rounded-md w-full sm:w-40"
          whileHover={{ scale: 1.1 }}
        >
          <FaBolt size={30} />
          <p className="mt-2 font-semibold text-sm sm:text-base">New Arrivals</p>
        </motion.div>
        <motion.div
          className="flex flex-col items-center text-center bg-white bg-opacity-10 p-4 rounded-md w-full sm:w-40"
          whileHover={{ scale: 1.1 }}
        >
          <FaBullhorn size={30} />
          <p className="mt-2 font-semibold text-sm sm:text-base">Special Events</p>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscribeSection;
