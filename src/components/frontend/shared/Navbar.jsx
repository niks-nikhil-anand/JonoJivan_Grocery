"use client";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { motion } from "framer-motion";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For Next.js App Router


const Navbar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter(); // Initialize router



  // Animation variants for the menu
  const menuVariants = {
    open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200 } },
    closed: { opacity: 0, y: -20, transition: { type: "spring", stiffness: 200 } },
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
  
        if (response.ok) {
          // Redirect if response is OK
          router.push(`/product/search?q=${encodeURIComponent(searchQuery)}`);
        } else {
          console.error("Search failed:", data.msg || "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  // Function to handle key press (Enter)
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
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
        <ul className="flex flex-col space-y-4">
          {[
            { name: "Home", link: "/" },
            { name: "Mobile & Laptops", link: "/JonoCourier" },
            { name: "All Categories", link: "/category" },
            { name: "Electronics", link: "/" },
            { name: "Fashion", link: "/JonoGrocery" },
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
          <div>
          <Link href={"/auth/signIn"}>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md w-full">
            Sign In
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
          onKeyDown={handleKeyPress} // Changed from onKeyPress (deprecated)
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          aria-label="Search"
          autoComplete="off"
        />

          <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </motion.div>
        <Link href={"/auth/signIn"}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
          
        >
          Sign In
        </motion.button>
        </Link>
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
