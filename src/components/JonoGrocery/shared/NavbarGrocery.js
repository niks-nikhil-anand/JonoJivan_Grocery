"use client";
import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { HiOutlineShoppingCart, HiOutlineLocationMarker } from "react-icons/hi";
import { motion } from "framer-motion";

const NavbarGrocery = () => {
  const [location, setLocation] = useState("Detecting...");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Auto-detect location using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`)
            .then((response) => response.json())
            .then((data) => {
              setLocation(data.address?.city || "Unknown");
            })
            .catch(() => setLocation("Unavailable"));
        },
        () => setLocation("Permission Denied")
      );
    } else {
      setLocation("Geolocation Not Supported");
    }
  }, []);

  return (
    <nav className="bg-black text-white px-4 py-3 flex items-center justify-between shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold">GroceryMart</div>

       <motion.div
                initial={{ width: "150px" }}
                animate={{ width: isSearchFocused ? "250px" : "150px" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none w-full"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </motion.div>

      {/* Navigation Links */}
      <div className="hidden lg:flex space-x-6">
        <a href="/categories" className="hover:text-green-400 transition duration-200">
          Categories
        </a>
        <a href="/featured" className="hover:text-green-400 transition duration-200">
          Featured
        </a>
        <a href="/benefits" className="hover:text-green-400 transition duration-200">
          Benefits
        </a>
      </div>

      {/* Location, Cart, and Login */}
      <div className="flex items-center space-x-4">
        {/* Location */}
        <div className="flex items-center text-sm px-10">
          <HiOutlineLocationMarker className="mr-1 text-green-500" />
          {location}
        </div>

        {/* Cart */}
        <HiOutlineShoppingCart className="text-2xl cursor-pointer hover:text-green-400 transition duration-200" />

        {/* Login */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md hidden md:block"
        >
          Sign In
        </motion.button>
      </div>
    </nav>
  );
};

export default NavbarGrocery;
