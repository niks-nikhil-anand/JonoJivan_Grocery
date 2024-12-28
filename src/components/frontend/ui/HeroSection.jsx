"use client"
import React from 'react';
import Image from 'next/image';
import grocery from '../../../../public/heroSection/grocery.png';
import bg_image from '../../../../public/heroSection/bg_image.png';
import Rectangle from '../../../../public/heroSection/Rectangle.jpg';
import vegtable from '../../../../public/heroSection/vegtable.png';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const sentence = "Buy your groceries and have it delivered to your doorstep with ease.";

  return (
    <div className="relative h-screen w-full flex items-center justify-center">
      {/* Rectangle Image as Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Image
          src={Rectangle}
          alt="Rectangle Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Circular Arcs */}
      <div className="absolute w-full h-full flex items-center justify-center">
        <div className="relative w-[400px] h-[400px] md:w-[500px] md:h-[500px]">
          <div className="absolute w-full h-full border-[2px] border-white rounded-full" />
          <div className="absolute w-full h-full border-[2px] border-orange-400 rounded-full -top-4 -left-4" />
        </div>
      </div>
      
      {/* Text Content with Typing Effect */}
      <div className="absolute top-1/3 left-10 z-10 w-4/5 md:w-1/2 lg:w-1/3">
        <motion.h1
          className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {sentence.split('').map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.05,
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>
      </div>

      {/* Resized Grocery Image */}
      <div className="absolute bottom-0 right-10 z-10">
        <Image
          src={grocery}
          alt="Grocery"
          className="w-2/5 h-auto object-contain sm:w-3/5 md:w-2/4 lg:w-2/5 xl:w-1/4"
        />
      </div>

      {/* Background Image (Mobile Centered and Larger) */}
      <div className="absolute bottom-30 right-5 z-10 hidden sm:block">
        <Image
          src={bg_image}
          alt="Grocery"
          className="w-[400px] h-auto object-contain sm:hidden md:w-[60%] lg:w-[400px] xl:w-[450px]"
        />
      </div>
      {/* Mobile View - bg_image Centered and Bigger */}
      <div className="absolute top-0 right-0 h-auto w-[50%]  object-contain z-10 sm:block md:hidden">
        <Image
          src={bg_image}
          alt="Grocery"
          className=""
        />
      </div>
    </div>
  );
};

export default HeroSection;
