"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div class="">
<section class="py-12 bg-gray-900 sm:pb-16 lg:pb-20 xl:pb-24">
        <div class="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div class="grid items-center max-w-5xl grid-cols-1 mx-auto gap-y-8 lg:grid-cols-5 gap-x-16">
                <div class="max-w-md mx-auto text-center lg:max-w-none lg:col-span-3">
                    <h1 class="text-4xl font-normal text-white uppercase sm:text-5xl lg:text-6xl xl:text-8xl">Get goods <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">delivered</span></h1>
                    <p class="mt-6 text-lg font-normal text-white sm:text-xl">
                  Discover a curated selection of top-tier products across Fashion, Electronics, Home and Furniture, Appliances, Beauty, and Mobile. Elevate your lifestyle with our premium collections, designed to meet your every need.
              </p>
              <div class="mt-8 sm:mt-10">
                <Link href={"/product/shopAllProducts"}>
                
              <motion.button
              className="inline-flex items-center justify-center px-8 py-4 text-base font-normal text-white rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:contrast-150"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Explore Our Collections
            </motion.button>
                </Link>
              </div>
              <p class="max-w-xs mx-auto mt-4 text-base font-normal text-gray-400 sm:mt-8">
                  Enjoy complimentary shipping on your first order.<br />
                  Subsequent purchases start at just $9.99.
              </p>

                </div>

                <div class="lg:col-span-2 lg:order-first">
                    <img class="w-full max-w-sm mx-auto" src="https://landingfoliocom.imgix.net/store/collection/dusk/images/hero/3/iphone-mockup.png" alt="" />
                </div>
            </div>
        </div>
    </section>
</div>

  );
};

export default HeroSection;
