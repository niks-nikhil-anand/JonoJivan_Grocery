"use client";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Animation variants for the menu
  const menuVariants = {
    open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200 } },
    closed: { opacity: 0, y: -20, transition: { type: "spring", stiffness: 200 } },
  };

  return (
    <nav className="bg-black text-white px-6 py-3 flex items-center justify-between relative">
      {/* Logo */}
      <div className="text-xl font-bold">JonoJivan</div>

      {/* Hamburger Menu for Mobile */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-2xl focus:outline-none"
        >
          {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Navigation Links, Search, and Sign-In for Mobile */}
      <motion.div
        initial={false}
        animate={isMenuOpen ? "open" : "closed"}
        variants={menuVariants}
        className={`lg:hidden flex-col absolute top-12 left-0 w-full bg-black p-4 space-y-4 z-20 ${
          isMenuOpen ? "flex" : "hidden"
        }`}
      >
        <ul className="flex flex-col space-y-4">
          {[
            { name: "Home", link: "/" },
            { name: "Categories", link: "/categories" },
            { name: "E-commerce", link: "/" },
            { name: "Grocery", link: "/JonoGrocery" },
            { name: "Courier", link: "/JonoCourier" },
            { name: "Deals", link: "/deals" },
          ].map((item) => (
            <li
              key={item.name}
              className="hover:text-gray-400 transition-colors duration-200 cursor-pointer"
            >
              <a href={item.link}>{item.name}</a>
            </li>
          ))}
        </ul>
        <div className="flex flex-col space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none w-full"
            />
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md">
            Sign In
          </button>
        </div>
      </motion.div>

      {/* Navigation Links, Search, and Sign-In for Desktop */}
      <motion.ul
        className="hidden lg:flex items-center space-x-6"
      >
        {[
          { name: "Home", link: "/" },
          { name: "Categories", link: "/categories" },
          { name: "E-commerce", link: "/" },
          { name: "Grocery", link: "/JonoGrocery" },
          { name: "Courier", link: "/JonoCourier" },
          { name: "Deals", link: "/deals" },
        ].map((item) => (
          <li
            key={item.name}
            className="hover:text-gray-400 transition-colors duration-200 cursor-pointer"
          >
            <a href={item.link}>{item.name}</a>
          </li>
        ))}
      </motion.ul>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="hidden lg:flex items-center space-x-3"
      >
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Sign In
        </motion.button>
      </motion.div>
    </nav>
  );
};

export default Navbar;
