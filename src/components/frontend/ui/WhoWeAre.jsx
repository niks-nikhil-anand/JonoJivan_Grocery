"use client"
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Banner1 from '../../../../public/frontend/WhoWeAre/banner-1.png';
import Banner2 from '../../../../public/frontend/WhoWeAre/banner-2.png';
import Banner3 from '../../../../public/frontend/WhoWeAre/banner-3.png';

const cardData = [
  {
    title: 'Everyday Fresh & Clean with Our Products',
    image: Banner1,
  },
  {
    title: 'Make your Breakfast Healthy and Easy',
    image: Banner2,
  },
  {
    title: 'The best Organic Products Online',
    image: Banner3,
  },
];

const WhoWeAre = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-6 p-6">
      {cardData.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className="relative w-full md:w-1/3 h-64 rounded-lg shadow-lg overflow-hidden"
        >
          {/* Background Image */}
          <Image
            src={card.image}
            alt={`Banner ${index + 1}`}
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 z-0"
          />

          {/* Overlay Content */}
          <div className="relative z-10 bg-black bg-opacity-10 w-full h-full flex flex-col justify-start items-center text-white p-4">
            <h3 className="text-lg font-semibold mb-4 text-center">{card.title}</h3>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600">
              Shop Now →
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default WhoWeAre;
