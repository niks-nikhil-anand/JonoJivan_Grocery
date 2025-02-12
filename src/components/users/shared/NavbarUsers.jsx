"use client"
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import {  FiUser, FiShoppingBag } from "react-icons/fi";
import { AiOutlineDown, AiOutlineUp, AiOutlineMenu } from "react-icons/ai";
import Image from 'next/image';
import logo from '../../../../public/logo/logo.png'
import { FiHome, FiBox, FiMapPin, FiBell, FiStar, FiTag, FiSearch, FiLogOut } from "react-icons/fi";
import Link from "next/link";
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaShoppingCart, FaUser } from "react-icons/fa";



const Navbar = () => {
  const [userId, setUserId] = useState(null);
    const [isShopOpen, setIsShopOpen] = useState(false);
    const [isLearnOpen, setIsLearnOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);

    const [isSearchFocused, setIsSearchFocused] = useState(false);
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const [searchQuery, setSearchQuery] = useState("");
      const router = useRouter(); // Initialize router
    
    
    
      // Animation variants for the menu
      const menuVariants = {
        open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200 } },
        closed: { opacity: 0, y: -20, transition: { type: "spring", stiffness: 200 } },
      };
    
       // Updated handleSearch function
       const handleSearch = (query = searchQuery) => {
        if (query.trim()) {
          // Redirect to the search results page with query parameter
          router.push(`/product/search?q=${encodeURIComponent(query)}`);
          setIsSearchFocused(false); // Close the popular searches dropdown
        }
      };
    
      // Function to handle key press (Enter)
      const handleKeyPress = (e) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      };
    
      const popularSearches = [
        "saree", "jacket", "shoes", "sweater for women",
        "kurti", "sweater", "watch", "earring", "tshirt",
        "winter wear for women", "lehenga", "blouse",
        "Mobile", "Laptops", "blouse",
      ];

    const toggleShopDropdown = () => {
        setIsShopOpen((prev) => !prev);
        if (isLearnOpen) setIsLearnOpen(false);
      };
    
      const toggleLearnDropdown = () => {
        setIsLearnOpen((prev) => !prev);
        if (isShopOpen) setIsShopOpen(false);
      };
      const toggleAccountDropdown = () => {
        setIsAccountOpen((prev) => !prev);
        if (isAccountOpen) setIsAccountOpen(false);
      };
    
      const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
      };

      useEffect(() => {
        // Fetch user details from the API
        const fetchUser = async () => {
          try {
            const response = await fetch('/api/users/userDetails/cookies');
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data)
            setUserId(data._id); // Assuming the API returns an object with the `_id` field
          } catch (error) {
            console.error('Failed to fetch user details:', error);
          }
        };
    
        fetchUser();
      }, []);

      const handleLogout = async () => {
        try {
          toast.loading('Logging out...');
          await fetch('/api/users/auth/logout', {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
            },
          });
          toast.dismiss(); // Dismiss the loading toast
          toast.success('Logged out successfully!');
          window.location.href = '/';
        } catch (error) {
          toast.dismiss(); // Dismiss the loading toast
          toast.error('Logout failed. Please try again.');
          console.error('Logout failed:', error);
        }
      };
    
    
  return (
    <nav className="bg-black text-white px-6 py-3 flex items-center justify-between relative">
    {/* Logo */}

    {/* Hamburger Menu for Mobile */}
    <div className="lg:hidden">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-2xl focus:outline-none"
      >
        {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
      </button>
    </div>
    <div className="text-xl font-bold">JonoJivan</div>
    <div className="flex gap-5 md:hidden">
      <Link href={"/auth/signIn"}>
    <button className="text-2xl relative">
        <FaUser />
        </button>
        </Link>
      <Link href={"/product/cart"}>
    <button className="text-2xl relative">
        <FaShoppingCart />
        </button>
        </Link>
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
      {/* Menu List */}
      <ul className="flex flex-col space-y-4 text-white">
        {[
          { name: "Home", link: "/", icon: <FiHome /> },
          { name: "Orders", link: "/JonoCourier", icon: <FiBox /> },
          { name: "Saved Addresses", link: "/category", icon: <FiMapPin /> },
          { name: "Notifications", link: "/", icon: <FiBell /> },
          { name: "All Catgeories", link: "/JonoGrocery", icon: <FiShoppingBag /> },
          { name: "Beauty", link: "/JonoCourier", icon: <FiStar /> },
          { name: "Deals", link: "/deals", icon: <FiTag /> },
        ].map((item) => (
          <li key={item.name} className="flex items-center space-x-3 hover:text-gray-400 transition-colors duration-200 cursor-pointer">
            <span className="text-lg">{item.icon}</span>
            <a href={item.link} className="text-sm">{item.name}</a>
          </li>
        ))}
      </ul>

      {/* Search and Logout */}
      <div className="flex flex-col space-y-3">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            aria-label="Search"
            autoComplete="off"
          />
          <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Logout Button */}
        <div>
          <Link href={"/auth/signIn"}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md w-full flex items-center justify-center space-x-2">
              <FiLogOut className="text-lg" />
              <span>Logout</span>
            </button>
          </Link>
        </div>
      </div>
    </motion.div>

    {/* Navigation Links, Search, and Sign-In for Desktop */}
    <motion.ul
      className="hidden lg:flex items-center space-x-6"
    >
      {[
        { name: "Home", link: "/" },
        { name: "All Categories", link: "/category" },
        { name: "Mobile & Laptops", link: "/" },
        { name: "Electronics", link: "/JonoGrocery" },
        { name: "Fashion", link: "/JonoCourier" },
        { name: "Beauty", link: "/JonoCourier" },
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
      className="w-full px-4 py-2 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={handleKeyPress}
      onFocus={() => setIsSearchFocused(true)}
      onBlur={() => setIsSearchFocused(false)}
      aria-label="Search"
      autoComplete="off"
    />

    <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

    {/* Popular Searches Dropdown */}
    {isSearchFocused && (
      <div className="absolute mt-4 w-full bg-gray-800 rounded-lg shadow-lg z-10 min-w-[25rem] ">
       <div className="flex flex-wrap gap-3 py-5 px-3 ">
      {popularSearches.map((item, index) => (
        <span
          key={index}
          onClick={() => handleSearch(item)} 
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm cursor-pointer"
        >
          {item}
        </span>
      ))}
    </div>
      </div>
    )}
  </motion.div>

  <div className="relative">
            <button
              onClick={toggleAccountDropdown}
              className="text-lg font-medium hover:text-gray-700 focus:outline-none flex items-center"
            >
                        <FiUser className="w-6 h-6 cursor-pointer" />
              {isAccountOpen ? <AiOutlineUp className="ml-2" /> : <AiOutlineDown className="ml-2" />}
            </button>
            {isAccountOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-1 mt-4 w-[10rem] bg-black shadow-xl rounded-b-3xl py-5 px-5 z-50"
                style={{ zIndex: 9999 }}
              >
                <ul className="space-y-4">
                  <li className="flex items-center space-x-3">
                  <span>📦</span>
                    <Link href={`/users/${userId}/accounts/ordersHistory`} className="hover:text-blue-600">
                    Orders
                    </Link>
                  </li>
                  <li className="flex items-center space-x-3">
                  <span>❤️</span>
                    <Link href={`/users/${userId}/accounts/wishlist`} className="hover:text-blue-600">Wislist</Link>
                  </li>
                  <li className="flex items-center space-x-3">
                  <span>🏠</span>
                    <Link href={`/users/${userId}/accounts/savedAddress`} className="hover:text-blue-600">Addresses</Link>
                  </li>
                  <li className="flex items-center space-x-3">
                  <span>🔔</span>
                    <a href="#" className="hover:text-blue-600">Notification</a>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span>▶️</span>
                    <Link href="#" onClick={handleLogout} className="hover:text-blue-600">Logout</Link>
                  </li>
                </ul>
              </motion.div>
            )}
          </div>
    
      <Link href={"/product/cart"}>
    <button className="text-2xl relative">
        <FaShoppingCart />
        </button>
      </Link>
    </motion.div>
  </nav>
  );
};

export default Navbar;
