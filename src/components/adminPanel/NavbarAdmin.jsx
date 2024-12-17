"use client";
import React, { useState } from 'react';
import { IoIosMenu } from "react-icons/io"; // For the hamburger menu
import { IoMdLogOut } from "react-icons/io"; // For the logout icon
import { HiMoon, HiSun } from 'react-icons/hi'; 
import Image from 'next/image';
import logo from '../../../public/logo/logo.png';
import { motion } from 'framer-motion';




const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  
    const toggleDarkMode = () => {
      setDarkMode(!darkMode);
      document.documentElement.classList.toggle("dark", !darkMode);
    };


    const handleLogout = async () => {
      try {
        const response = await fetch('/api/admin/auth/logout', {
          method: 'POST',
        });
        const data = await response.json();
        if (response.ok) {
          router.push('/');
        } else {
          alert(`Logout failed: ${data.message}`);
        }
      } catch (error) {
        alert(`Logout failed: ${error.message}`);
      }
    };




  return (
    <nav className="bg-white dark:bg-gray-800 text-white transition-colors duration-300 shadow-lg">
    <div className="flex justify-between items-center px-4">
      {/* Logo Section */}
      <div className="flex items-center">
        <Image src={logo} alt="Logo" className="w-[80px] h-auto mr-4" />
        <span className="text-lg font-bold text-black">JonoJivan Super Admin Panel</span>
      </div>

      {/* Right Section: Logout Icon */}
      <div className="hidden lg:flex items-center space-x-4">
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors duration-200"
          onClick={handleLogout}
        >
          <IoMdLogOut className="text-xl" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </div>

   
  </nav>
);
};



export default Navbar;

