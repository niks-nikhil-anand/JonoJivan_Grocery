"use client";
import React, { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { motion } from "framer-motion";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For Next.js App Router


const Navbar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); // State for mobile search modal
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
      <Link href={"/"}>
      <div className="text-xl font-bold">JonoJivan</div>
      </Link>
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
          {/* Mobile view search  */}
          <button
          className="text-2xl relative"
          onClick={() => setIsMobileSearchOpen(true)} // Open the modal
        >
          <FaSearch />
        </button>
      </div>

       {/* Mobile Search Modal */}
       {isMobileSearchOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    onClick={() => setIsMobileSearchOpen(false)} // Close on overlay click
  >
    <div
      className="bg-gray-800 w-full max-w-md p-6 rounded-lg relative"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
    >
      {/* Close Icon */}
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
        onClick={() => setIsMobileSearchOpen(false)}
      >
        <FiX size={20} />
      </button>

      {/* Search Input & Button */}
      <div className="relative flex items-center flex flex-col gap-5 mt-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          autoFocus
          aria-label="Search"
          autoComplete="off"
        />

        {/* Search Button */}
        <button
          className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition w-full"
          onClick={() => handleSearch(searchQuery)}
        >
          Search
        </button>
      </div>

      {/* Popular Searches Dropdown */}
      {isSearchFocused && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-3">
            {popularSearches.map((item, index) => (
              <span
                key={index}
                onClick={() => handleSearch(item)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
)}


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
            { name: "Ration Card", link: "/rationCard" },
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress} // Changed from onKeyPress (deprecated)
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              aria-label="Search"
              autoComplete="off"
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
          { name: "Ration Card", link: "/rationCard" },
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
