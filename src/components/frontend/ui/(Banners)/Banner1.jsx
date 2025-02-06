"use client"
import React from 'react';
import { motion } from 'framer-motion';

const Banner1 = () => {
  return (
    <div
  className="relative flex items-center justify-center bg-cover bg-center h-[60vh] sm:h-[70vh] lg:h-[90vh]"
  style={{ backgroundImage: `url('/frontend/Banner/Banner101.jpg')` }}
>
  {/* Overlay for better text visibility */}
  <div className="absolute inset-0 bg-black bg-opacity-30"></div>

  {/* Text content */}
  <motion.div
    className="relative z-10 text-center text-white px-4"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
  >
    <h1 className="text-xl sm:text-xl lg:text-6xl font-bold mb-4">
      Explore the Latest Trends
    </h1>
    <p className="text-sm sm:text-sm lg:text-2xl font-medium mb-6">
      Discover exclusive deals on premium products
    </p>
  </motion.div>
</div>

  );
};

export default Banner1;
