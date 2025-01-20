"use client"
import React from "react";
import { motion } from "framer-motion";
import { FiTruck, FiHeadphones, FiShield, FiStar } from "react-icons/fi";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FiTruck size={30} className="text-green-500" />,
      title: "Free Delivery",
      description: "Free delivery on orders above $50",
    },
    {
      icon: <FiHeadphones size={30} className="text-blue-500" />,
      title: "24/7 Support",
      description: "Round the clock customer service",
    },
    {
      icon: <FiStar size={30} className="text-yellow-500" />,
      title: "Fresh Products",
      description: "100% fresh & organic products",
    },
    {
      icon: <FiShield size={30} className="text-purple-500" />,
      title: "Secure Payment",
      description: "100% secure payment methods",
    },
  ];

  return (
    <div className="bg-gray-900 text-white py-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Why Choose Us</h2>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-md text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-8">
        <motion.a
          href="#"
          className="inline-block bg-green-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-green-600 transition"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          Start Shopping Now →
        </motion.a>
      </div>
    </div>
  );
};

export default WhyChooseUs;
