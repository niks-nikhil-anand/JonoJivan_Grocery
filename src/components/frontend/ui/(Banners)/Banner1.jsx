"use client"
import React from 'react';
import { motion } from 'framer-motion';

const Banner1 = () => {
  return (
    <div
      className="relative flex items-center justify-center bg-cover bg-center h-[30vh] sm:h-[70vh] lg:h-[90vh]"
      style={{ backgroundImage: `url('/frontend/Banner/slider-6-min.png')` }}
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Text content */}
      <motion.div
        className="relative z-10 text-center text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4">
          Fresh Vegetables
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl font-medium">
          Don&apos;t miss the grocer deals
        </p>
      </motion.div>
    </div>
  );
};

export default Banner1;
