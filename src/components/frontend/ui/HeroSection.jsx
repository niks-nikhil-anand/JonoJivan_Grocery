"use client"
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Import images
import hero1 from "../../../../public/frontend/HeroSection/hero1.png";
import hero2 from "../../../../public/frontend/HeroSection/hero2.jpg";
import main from "../../../../public/frontend/HeroSection/main.jpg";

const HeroSection = () => {
  return (
    <section className="w-full flex flex-col md:flex-row gap-6 px-4 md:px-10 py-5 bg-white">
      {/* Left Side - Main Hero Section */}
      <motion.div
        className="relative w-full md:w-3/4 rounded-lg overflow-hidden shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={main}
          alt="Shopping Hero"
          className="w-full h-auto object-cover"
        />
      </motion.div>

      {/* Right Side - Two Small Banners */}
      <div className="w-full md:w-1/4 flex md:flex-col gap-4">
        {/* Big Sale Banner */}
        <motion.div
          className="rounded-lg overflow-hidden shadow-lg w-[49%]"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Image
            src={hero1}
            alt="Big Sale Banner"
            className="w-full h-auto object-cover"
          />
        </motion.div>

        {/* Fresh Fruits Banner */}
        <motion.div
          className="rounded-lg overflow-hidden shadow-lg w-[49%]"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Image
            src={hero2}
            alt="Fresh Fruits Banner"
            className="w-full h-auto object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
