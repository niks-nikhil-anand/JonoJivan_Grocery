"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { FiSmartphone, FiBox, FiHome, FiShoppingBag } from 'react-icons/fi';
import Link from 'next/link';

const FeaturedSection = () => {
  const products = [
    {
      id: 1,
      title: 'Latest Smartphones',
      description: 'Up to 30% off on premium phones',
      price: 'From  ₹499',
      icon: <FiSmartphone size={30} />,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-500',
      buttonColor: 'bg-blue-500',
    },
    {
      id: 2,
      title: 'Designer Wear',
      description: 'New collection arrival',
      price: 'From  ₹29',
      icon: <FiBox size={30} />,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-500',
      buttonColor: 'bg-purple-500',
    },
    {
      id: 3,
      title: 'Smart Appliances',
      description: 'Special bundle offers',
      price: 'From  ₹299',
      icon: <FiHome size={30} />,
      bgColor: 'bg-green-100',
      textColor: 'text-green-500',
      buttonColor: 'bg-green-500',
    },
    {
      id: 4,
      title: 'Tech Accessories',
      description: 'Buy 2 Get 1 Free',
      price: 'From  ₹19',
      icon: <FiShoppingBag size={30} />,
      bgColor: 'bg-red-100',
      textColor: 'text-red-500',
      buttonColor: 'bg-red-500',
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
        <p className="text-gray-600 mt-2">Discover our top picks across various categories</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              className={`p-6 rounded-lg shadow-md ${product.bgColor}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`flex justify-center items-center ${product.textColor} mb-4`}>
                {product.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800">{product.title}</h3>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <p className="font-bold mt-4">{product.price}</p>
              <Link href={"/product/shopAllProducts"}>
              <button
                className={`mt-4 px-4 py-2 rounded-lg text-white ${product.buttonColor} hover:opacity-90`}
              >
                Shop Now
              </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
