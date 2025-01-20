"use client";
import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { HiOutlineShoppingCart, HiOutlineLocationMarker } from "react-icons/hi";

const NavbarGrocery = () => {
  const [location, setLocation] = useState("Detecting...");

  // Auto-detect location using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Fetch location name using reverse geocoding API
          fetch(
            `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`
          )
            .then((response) => response.json())
            .then((data) => {
              setLocation(data.address.city || "Unknown");
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
      <div className="text-2xl font-bold text-white">GroceryMart</div>

      {/* Search Bar */}
      <div className="relative flex-1 mx-4 hidden md:flex">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full px-4 py-2 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>

      {/* Navigation Links */}
      <div className="hidden lg:flex space-x-6">
        <a
          href="/categories"
          className="hover:text-green-400 transition duration-200"
        >
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
        <div className="flex items-center text-sm">
          <HiOutlineLocationMarker className="mr-1 text-green-500" />
          {location}
        </div>

        {/* Cart */}
        <div className="relative">
          <HiOutlineShoppingCart className="text-2xl text-green-500" />
          <span className="absolute -top-1 -right-1 text-xs bg-green-500 text-white rounded-full px-1">
            0
          </span>
        </div>

        {/* Login Button */}
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md">
          Login
        </button>
      </div>
    </nav>
  );
};

export default NavbarGrocery;
