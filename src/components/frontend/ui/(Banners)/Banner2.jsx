"use client";
import React from "react";
import { FaApple, FaGooglePlay } from "react-icons/fa"; // React Icons
import Image from "next/image";
import { motion } from "framer-motion"; // For animations
import banner from '../../../../../public/frontend/slider/our-features-basket.png'

const Banner2 = () => {
  return (
    <section className="relative flex flex-col lg:flex-row items-center justify-between p-6 lg:p-16 bg-gradient-to-r from-green-500 via-green-400 to-green-300 shadow-2xl  overflow-hidden">
      {/* Text and App Store Buttons Section */}
      <div className="relative z-10 text-center lg:text-left lg:w-1/2 space-y-6">
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Make Your Grocery Shopping Effortless with Our App
        </motion.h2>
        <motion.p
          className="text-white text-sm sm:text-base"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          BoroBazar delivers fresh groceries straight to your door. Experience the ease of seasonal farm-fresh food, fast delivery, and amazing deals.
        </motion.p>
        
        {/* App Store Buttons */}
        <div className="flex justify-center lg:justify-start space-x-4 mt-6">
          <motion.a
            href="#"
            className="flex items-center justify-center space-x-3 bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transform transition-all hover:scale-105 shadow-lg text-sm sm:text-base lg:text-base"
            whileHover={{ scale: 1.05 }}
          >
            <FaApple size={20} />
            <span className="font-medium">App Store</span>
          </motion.a>
          <motion.a
            href="#"
            className="flex items-center justify-center space-x-3 bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transform transition-all hover:scale-105 shadow-lg text-sm sm:text-base lg:text-base"
            whileHover={{ scale: 1.05 }}
          >
            <FaGooglePlay size={20} />
            <span className="font-medium">Google Play</span>
          </motion.a>
        </div>
      </div>

      {/* Image Section */}
      <motion.div
        className="lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src={banner}
          alt="BoroBazar Mobile App"
          width={400}
          height={400}
          className="transform transition-all hover:scale-105"
        />
      </motion.div>
    </section>
  );
};

export default Banner2;
