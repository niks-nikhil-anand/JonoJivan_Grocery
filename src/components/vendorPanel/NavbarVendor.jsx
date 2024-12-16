"use client";
import React, { useState } from 'react';
import { IoIosMenu } from "react-icons/io"; // For the hamburger menu
import { IoMdLogOut } from "react-icons/io"; // For the logout icon
import { HiMoon, HiSun } from 'react-icons/hi'; 
import Image from 'next/image';
import logo from '../../../public/logo/logo.png';
import { motion } from 'framer-motion';



const NavbarVendor = () => {
  const [darkMode, setDarkMode] = useState(false);
  
    const toggleDarkMode = () => {
      setDarkMode(!darkMode);
      document.documentElement.classList.toggle("dark", !darkMode);
    };




  return (
    <nav className="bg-white dark:bg-gray-800 text-white transition-colors duration-300 shadow-lg">
  <div className="flex justify-between items-center px-4 ">
    {/* Logo Section */}
    <div className="flex items-center">
      <Image src={logo} alt="Logo" className="w-[80px] h-auto mr-4" />
      <span className="text-lg font-bold text-black">JonoJivan Vendor</span>
    </div>

    {/* Hamburger Menu for Mobile View */}
    <div className="block lg:hidden">
      <button className="text-2xl hover:text-yellow-400 transition-transform transform hover:scale-110 duration-200">
        <IoIosMenu />
      </button>
    </div>

    {/* Right Section: Logout Icon */}
    <div className="hidden lg:flex items-center space-x-4">
      <button
        className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors duration-200"
      >
        <IoMdLogOut className="text-xl" />
        <span className="hidden md:inline">Logout</span>
      </button>
    </div>
  </div>
</nav>

  );
};

export default NavbarVendor;

