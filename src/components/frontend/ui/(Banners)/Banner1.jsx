"use client"
import React from 'react';
import { motion } from 'framer-motion';

const Banner1 = () => {
  return (
    <div
    className="relative flex items-center justify-center bg-cover bg-center h-[30vh] sm:h-[70vh] lg:h-[90vh]"
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
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4">
        Explore the Latest Trends
      </h1>
      <p className="text-lg sm:text-xl lg:text-2xl font-medium mb-6">
        Discover exclusive deals on premium products
      </p>
  
      {/* Product categories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Luxury Watches */}
        <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Luxury Watches</h2>
          <p className="text-sm mb-2">Timeless elegance, now on sale</p>
          <p className="text-sm font-bold mb-2">From ₹999</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Shop Now
          </button>
        </div>
  
        {/* Gaming Gear */}
        <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Gaming Gear</h2>
          <p className="text-sm mb-2">Ultimate accessories for pro gamers</p>
          <p className="text-sm font-bold mb-2">From ₹199</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Shop Now
          </button>
        </div>
  
        {/* Home Décor */}
        <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Home Décor</h2>
          <p className="text-sm mb-2">Stylish and trendy collections</p>
          <p className="text-sm font-bold mb-2">From ₹99</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Shop Now
          </button>
        </div>
  
        {/* Fitness Essentials */}
        <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Fitness Essentials</h2>
          <p className="text-sm mb-2">Stay fit with the best equipment</p>
          <p className="text-sm font-bold mb-2">From ₹149</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Shop Now
          </button>
        </div>
      </div>
    </motion.div>
  </div>
  );
};

export default Banner1;
