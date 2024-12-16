"use client";
import React, { useState } from 'react';
import { FaUserCircle, FaHome, FaCog, FaUser } from 'react-icons/fa';
import { IoIosMenu } from 'react-icons/io';
import { HiMoon, HiSun } from 'react-icons/hi'; 
import { motion } from 'framer-motion';



const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  
    const toggleDarkMode = () => {
      setDarkMode(!darkMode);
      document.documentElement.classList.toggle("dark", !darkMode);
    };




  return (
    <motion.nav
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 100, damping: 20 }}
    className="bg-green-500 text-white transition-colors duration-300 shadow-lg"
  >
    <div className="container mx-auto flex justify-between items-center p-4">
      {/* Hamburger Menu for Mobile View */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="block lg:hidden"
      >
        <button className="text-2xl hover:text-yellow-400 transition-transform transform hover:scale-110 duration-200">
          <IoIosMenu />
        </button>
      </motion.div>

      <h1 className="text-xl font-semibold text-white md:text-2xl underline">
          JonoJivan Grocery
        </h1>

      {/* Navigation Links */}
      <div className="hidden lg:flex space-x-6">
        <motion.a
          whileHover={{ scale: 1.05 }}
          href="#"
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-gray-900 text-gray-900 transition-colors duration-300 shadow-md"
        >
          <FaHome className="text-lg" />
          <span>Dashboard</span>
        </motion.a>
        <motion.a
          whileHover={{ scale: 1.05 }}
          href="#"
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-gray-900 text-gray-900 transition-colors duration-300 shadow-md"
        >
          <FaCog className="text-lg" />
          <span>Settings</span>
        </motion.a>
        <motion.a
          whileHover={{ scale: 1.05 }}
          href="#"
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-gray-900 text-gray-900  transition-colors duration-300 shadow-md"
        >
          <FaUser className="text-lg" />
          <span>Profile</span>
        </motion.a>
      </div>

      {/* Dark Mode Toggle and User Icon */}
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={toggleDarkMode}
          className={`flex items-center w-16 h-8 p-1 rounded-full transition-colors duration-300 ${
            darkMode ? "bg-blue-600" : "bg-gray-200"
          }`}
          aria-label="Toggle dark mode"
        >
          <motion.div
            layout
            className={`w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center ${
              darkMode ? "translate-x-0" : "translate-x-7"
            }`}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {darkMode ? (
              <HiMoon className="text-gray-500" />
            ) : (
              <HiSun className="text-yellow-400" />
            )}
          </motion.div>
        </motion.button>
      </div>
    </div>
  </motion.nav>
);
};


export default Navbar;

