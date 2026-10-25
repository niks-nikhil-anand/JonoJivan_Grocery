'use client';
import Image from "next/image";
import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';


export default function AboutPageOne() {
  return (
    <div>
      <div className="flex flex-col gap-10">
        {/* Hero Section */}
        <div className="w-full bg-green-600 h-[60vh] flex justify-center items-center relative px-5">
          <div className="flex flex-col space-y-8 pb-10 pt-12 md:pt-24">
            <motion.div
              className="mx-auto max-w-max rounded-full border-2 border-white bg-gray-50 p-1 px-3 shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-center text-xs font-semibold leading-normal md:text-sm">
                About JonoJivan Grocery
              </p>
            </motion.div>
            <motion.p
              className="text-center text-xl font-bold text-white md:text-5xl md:leading-10"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Freshness Delivered, Every Day
            </motion.p>
            <p className="mx-auto max-w-4xl text-sm text-center text-gray-200 md:text-xl">
              Discover quality and freshness at JonoJivan Grocery – your one-stop shop for fresh vegetables, fruits, daily essentials, and household products. We’re committed to making your grocery shopping convenient, affordable, and sustainable.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-10 px-6 md:px-20 lg:px-40">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-16 flex flex-col md:flex-row gap-10 items-center"
          >
            <div className="flex flex-col gap-6 md:w-2/3">
              <p className="text-xl font-bold text-green-800 md:text-4xl">Fresh and Quality Products at Your Doorstep</p>
              <p className="text-base text-gray-700 md:text-xl">
                At JonoJivan, we bring you a diverse selection of fresh produce, high-quality household essentials, and everyday items tailored to meet your needs. From organic vegetables and seasonal fruits to pantry staples and personal care products, we ensure quality and freshness in every item you receive.
              </p>
              <p className="text-xl font-bold text-green-800 md:text-4xl">Supporting Healthier Lifestyles</p>
              <p className="text-base text-gray-700 md:text-xl">
                With JonoJivan Grocery, maintaining a healthy lifestyle has never been easier. Our carefully sourced and fresh products help you prepare nutritious meals for your family, so you can focus on what truly matters. Experience the ease of shopping for quality groceries and household products all in one place.
              </p>
            </div>
            <div className="md:w-1/3 w-full">
              <Image width={500} height={333} sizes="(max-width: 768px) 100vw, 500px"
                src="https://plus.unsplash.com/premium_photo-1686285539314-fd401f48fa61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1pbi1zYW1lLXNlcmllc3w4fHx8ZW58MHx8fHx8"
                className="max-w-full h-auto rounded-lg object-cover"
                alt="Grocery and fresh products"
              />
            </div>
          </motion.div>

          <hr className="mt-5" />

          <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6 py-8 px-4 md:flex-row md:justify-between md:gap-8"
    >
      {/* Left Section */}
      <div className="md:w-2/3 space-y-6">
        <p className="text-sm font-semibold text-green-600 md:text-lg">
          Shop with JonoJivan &rarr;
        </p>
        <h1 className="text-3xl font-bold text-green-600 md:text-4xl">
          Convenience Meets Quality
        </h1>
        <p className="text-base text-gray-600 md:text-lg">
          We aim to make grocery shopping an enjoyable and hassle-free experience. From fresh produce to household essentials, JonoJivan offers a wide variety of quality products you can trust.
        </p>
        <div className="w-full md:w-1/2">
          <Image width={500} height={333} sizes="(max-width: 768px) 100vw, 500px"
            src="https://plus.unsplash.com/premium_photo-1686285541215-015dfccebe27?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHZlZ2V0YWJsZXN8ZW58MHx8MHx8fDA%3D"
            className="w-full h-auto rounded-lg object-cover shadow-md"
            alt="Convenient grocery shopping"
          />
        </div>
      </div>

      {/* Contact Card */}
      <div className="mt-8 max-w-sm w-full rounded-lg bg-white shadow-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Us</h2>
        <div className="space-y-4 text-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center bg-green-100 rounded-full p-2">
              <FaMapMarkerAlt className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-base">Biswanath Chariali, Sonitpur Assam, 784176</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center bg-green-100 rounded-full p-2">
              <FaPhoneAlt className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-base">+91 8761873802</p>
          </div>
        </div>
      </div>
    </motion.div>
        </div>
      </div>
    </div>
  );
}
