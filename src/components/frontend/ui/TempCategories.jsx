"use client"
import React from "react";
import { motion } from "framer-motion";
import { FaTv, FaTshirt, FaTruck, FaHeart, FaFootballBall, FaBook } from "react-icons/fa";
import { MdKitchen, MdShoppingCart } from "react-icons/md";

const categories = [
  { icon: <FaTv size={30} className="text-blue-500" />, title: "Electronics", subtitle: "Latest Gadgets", bgColor: "bg-blue-50" },
  { icon: <FaTshirt size={30} className="text-purple-500" />, title: "Fashion", subtitle: "Trending Styles", bgColor: "bg-purple-50" },
  { icon: <MdKitchen size={30} className="text-green-500" />, title: "Home Appliances", subtitle: "Smart Living", bgColor: "bg-green-50" },
  { icon: <MdShoppingCart size={30} className="text-yellow-500" />, title: "Groceries", subtitle: "Fresh & Daily", bgColor: "bg-yellow-50" },
  { icon: <FaTruck size={30} className="text-red-500" />, title: "Courier", subtitle: "Fast Delivery", bgColor: "bg-red-50" },
  { icon: <FaHeart size={30} className="text-pink-500" />, title: "Beauty", subtitle: "Wellness & Care", bgColor: "bg-pink-50" },
  { icon: <FaFootballBall size={30} className="text-indigo-500" />, title: "Sports", subtitle: "Fitness & Games", bgColor: "bg-indigo-50" },
  { icon: <FaBook size={30} className="text-teal-500" />, title: "Books", subtitle: "Knowledge Hub", bgColor: "bg-teal-50" },
];

const TempCategories = () => {
  return (
    <div className="py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Shop By Categories</h1>
        <p className="text-gray-600">Explore our wide range of products and services</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={index}
            className={`p-6 rounded-lg shadow-md ${category.bgColor} hover:shadow-lg transition-shadow`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center justify-center mb-4">{category.icon}</div>
            <h2 className="text-lg font-semibold text-center mb-2">{category.title}</h2>
            <p className="text-sm text-gray-500 text-center">{category.subtitle}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TempCategories;
