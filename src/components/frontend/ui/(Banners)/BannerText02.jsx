"use client"
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import icon1 from "../../../../../public/frontend/icons/icon-1.png";
import icon2 from "../../../../../public/frontend/icons/icon-2.png";
import icon3 from "../../../../../public/frontend/icons/icon-3.png";
import icon4 from "../../../../../public/frontend/icons/icon-4.png";
import icon5 from "../../../../../public/frontend/icons/icon-5.png";

const BannerText02 = () => {
  const items = [
    {
      icon: icon1,
      title: "Best prices & offers",
      description: "Orders $50 or more",
    },
    {
      icon: icon2,
      title: "Free delivery",
      description: "24/7 amazing services",
    },
    {
      icon: icon3,
      title: "Great daily deal",
      description: "When you sign up",
    },
    {
      icon: icon4,
      title: "Wide assortment",
      description: "Mega Discounts",
    },
    {
      icon: icon5,
      title: "Easy returns",
      description: "Within 30 days",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 py-8 px-4 bg-gray-100">
  {items.map((item, index) => (
    <motion.div
      key={index}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center bg-white shadow-lg rounded-lg p-4"
    >
      {/* Icon Section */}
      <div className="flex-shrink-0">
        <Image src={item.icon} alt={item.title} width={40} height={40} />
      </div>

      {/* Text Section */}
      <div className="flex flex-col ml-4">
        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
      </div>
    </motion.div>
  ))}
</div>


  );
};

export default BannerText02;
