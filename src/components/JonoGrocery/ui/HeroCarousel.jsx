"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const images = [
  {
    src: "https://via.placeholder.com/800x400.png?text=Fresh+Fruits",
    alt: "Fresh Fruits",
    title: "Fresh Groceries Delivered Daily",
    description: "Get farm-fresh produce and groceries delivered to your doorstep within hours.",
  },
  {
    src: "https://via.placeholder.com/800x400.png?text=Organic+Vegetables",
    alt: "Organic Vegetables",
    title: "Organic Vegetables",
    description: "Enjoy our selection of organic vegetables.",
  },
  {
    src: "https://via.placeholder.com/800x400.png?text=Dairy+Products",
    alt: "Dairy Products",
    title: "Dairy Products",
    description: "High-quality dairy products for your family.",
  },
];

const HeroCarousel = () => {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const paginate = (newDirection) => {
    setCurrentIndex(([prevIndex]) => {
      const newIndex = (prevIndex + newDirection + images.length) % images.length;
      return [newIndex, newDirection];
    });
  };

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="absolute text-center text-white px-4">
        <h1 className="text-5xl font-bold">{images[currentIndex].title}</h1>
        <p className="mt-4 text-lg">{images[currentIndex].description}</p>
        <div className="mt-6 flex justify-center space-x-4">
          <button className="px-6 py-3 bg-green-500 rounded-md text-black font-semibold">
            Shop Now
          </button>
          <button className="px-6 py-3 border-2 border-white rounded-md text-white font-semibold">
            View Offers
          </button>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button
          onClick={() => paginate(-1)}
          className="bg-white p-2 rounded-full text-black"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={() => paginate(1)}
          className="bg-white p-2 rounded-full text-black"
        >
          <FaChevronRight />
        </button>
      </div>
      <div className="absolute bottom-4 flex justify-center space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-green-500" : "bg-gray-500"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
