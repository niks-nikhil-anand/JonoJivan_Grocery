"use client"
import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <nav className="bg-black text-white px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="text-xl font-bold">JonoJivan</div>

     {/* Links */}
<ul className="flex space-x-6">
  {[
    { name: 'Home', link: '/' },
    { name: 'Categories', link: '/categories' },
    { name: 'E-commerce', link: '/ecommerce' },
    { name: 'Grocery', link: '/JonoGrocery' },
    { name: 'Courier', link: '/JonoCourier' },
    { name: 'Deals', link: '/deals' },
  ].map((item) => (
    <li
      key={item.name}
      className="hover:text-gray-400 transition-colors duration-200 cursor-pointer"
    >
      <a href={item.link}>{item.name}</a>
    </li>
  ))}
</ul>


      {/* Search Bar */}
      <div className="flex items-center space-x-3">
        <motion.div
          initial={{ width: '150px' }}
          animate={{ width: isSearchFocused ? '250px' : '150px' }}
          transition={{ type: 'spring', stiffness: 300 }}
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

        {/* Sign In Button */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md">
          Sign In
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
