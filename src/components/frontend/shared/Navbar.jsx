"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiUser, FiShoppingBag } from "react-icons/fi";
import { AiOutlineDown, AiOutlineUp, AiOutlineMenu, AiOutlineRight } from "react-icons/ai"; 
import Image from "next/image";
import Link from "next/link";
import logo from "../../../../public/logo/logo.png";



const Navbar = () => {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);


  const toggleShopDropdown = () => setIsShopOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const toggleSearchBar = () => setIsSearchOpen((prev) => !prev);


  return (
    <nav className="bg-white shadow-md w-full md:py-3 px-6 md:px-12 relative z-50">
      <div className="flex justify-between items-center">
        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <AiOutlineMenu
            className="w-8 h-8 cursor-pointer"
            onClick={toggleMobileMenu}
          />
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center md:hidden">
          <Image src={logo} alt="Logo" width={100} height={40} />
        </Link>

        {/* Right Side - Icons */}
        <div className="flex items-center space-x-4 md:hidden">
          <FiSearch className="w-6 h-6 cursor-pointer" />
          <Link href="/auth/signIn">
            <FiUser className="w-6 h-6 cursor-pointer" />
          </Link>
          <Link href="/cart">
            <FiShoppingBag className="w-6 h-6 cursor-pointer" />
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-gray-100 p-4 flex justify-center items-center space-x-4 mt-4"
        >
          <input
            type="text"
            placeholder="Search..."
            className="w-full md:w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={toggleSearchBar}
            className="p-2 bg-red-500 text-white rounded-md"
          >
            Close
          </button>
        </motion.div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="fixed inset-0 bg-white z-50 p-6 shadow-lg"
  >
    {/* Close Button */}
        <motion.button
      onClick={() => setIsMobileMenuOpen(false)}
      whileHover={{
        scale: 1.1,
        rotate: 90,
        color: "#FF0000",
        boxShadow: "0px 8px 15px rgba(255, 0, 0, 0.3)",
      }}
      whileTap={{ scale: 0.9 }}
      className="absolute top-4 right-4 text-2xl text-red-600 hover:text-red-800 bg-white rounded-full shadow-md p-2 transition-all duration-300"
    >
      &times;
    </motion.button>


    {/* Navigation Menu */}
    <ul className="mt-8 space-y-6 text-lg font-medium">
      {/* Home */}
      <li>
        <Link href="/" className="block text-gray-800 hover:text-green-600">
          Home
        </Link>
      </li>

      {/* Products Dropdown */}
      <li>
        <button
          onClick={toggleShopDropdown}
          className="w-full flex justify-between items-center text-gray-800 hover:text-green-600"
        >
          Products
          {isShopOpen ? (
            <AiOutlineUp className="text-xl" />
          ) : (
            <AiOutlineDown className="text-xl" />
          )}
        </button>
        {isShopOpen && (
          <ul className="mt-2 pl-4 space-y-2">
            <li>
              <Link
                href="/fruits"
                className="block text-gray-600 hover:text-green-600"
              >
                Fruits & Vegetables
              </Link>
            </li>
            <li>
              <Link
                href="/bakery"
                className="block text-gray-600 hover:text-green-600"
              >
                Bakery & Dairy
              </Link>
            </li>
            <li>
              <Link
                href="/snacks"
                className="block text-gray-600 hover:text-green-600"
              >
                Snacks & Beverages
              </Link>
            </li>
          </ul>
        )}
      </li>

      {/* Campaigns */}
      <li>
        <Link
          href="/campaigns"
          className="block text-gray-800 hover:text-green-600"
        >
          Campaigns
        </Link>
      </li>

      {/* Coupons */}
      <li>
        <Link
          href="/coupons"
          className="block text-gray-800 hover:text-green-600"
        >
          Coupons
        </Link>
      </li>

      {/* Pages */}
      <li className="flex justify-between items-center">
        <Link href="/pages" className="block text-gray-800 hover:text-green-600">
          Pages
        </Link>
        <AiOutlineRight className="text-gray-400" />
      </li>

      {/* Language */}
      <li className="flex justify-between items-center">
        <button className="w-full text-left text-gray-800 hover:text-green-600">
          English
        </button>
        <AiOutlineRight className="text-gray-400" />
      </li>
    </ul>

    <div className="mt-8 flex flex-col space-y-4">
  {/* Sign In Button */}
  <Link href={"/auth/signIn"}>
  <motion.button
    whileHover={{
      scale: 1.05,
      backgroundColor: "#1E40AF",
      boxShadow: "0px 8px 15px rgba(30, 64, 175, 0.3)",
    }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center justify-center w-full py-3 text-white bg-blue-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
  >
    <FiUser className="mr-2 text-lg" />
    Sign In
  </motion.button>
  </Link>
  

  {/* Register Button */}

  <Link href={"//auth/register"}> 
  <motion.button
    whileHover={{
      scale: 1.05,
      backgroundColor: "#EFF6FF",
      boxShadow: "0px 8px 15px rgba(59, 130, 246, 0.3)",
    }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center justify-center w-full py-3 text-blue-600 bg-white border border-blue-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
  >
    <FiUser className="mr-2 text-lg" />
    Register Now
  </motion.button>
  </Link>
  
</div>

  </motion.div>
)}



      {/* Desktop Menu */}
      <div className="hidden md:flex justify-between items-center py-4">
        {/* Left Side Links */}
        <div>
        <ul className="flex space-x-8 font-medium text-lg">
          <li>
            <Link href="/" className="hover:text-green-600">
              Home
            </Link>
          </li>
          <li className="relative">
            <button
              onClick={toggleShopDropdown}
              className="hover:text-green-600 flex items-center"
            >
              Shop
              {isShopOpen ? <AiOutlineUp /> : <AiOutlineDown />}
            </button>
            {isShopOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute mt-2 bg-white shadow-lg rounded-lg p-4"
              >
                <ul>
                  <li>
                    <Link
                      href="/fruits"
                      className="block hover:text-green-600"
                    >
                      Fruits & Vegetables
                    </Link>
                  </li>
                  <li>
                    <Link href="/bakery" className="block hover:text-green-600">
                      Bakery & Dairy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/snacks"
                      className="block hover:text-green-600"
                    >
                      Snacks & Beverages
                    </Link>
                  </li>
                </ul>
              </motion.div>
            )}
          </li>
          <li>
            <Link href="/offers" className="hover:text-green-600">
              Offers
            </Link>
          </li>
          <li>
            <Link href="/contact-us" className="hover:text-green-600">
              Contact Us
            </Link>
          </li>
        </ul>
        </div>

        <div>
        <h1 className="font-bold text-xl ">
          JonoJivan Grocery
        </h1>
        </div>
        

        {/* Right Side Icons */}
        <div className="flex items-center space-x-6">
          <FiSearch className="w-6 h-6 cursor-pointer" />
          <Link href="/auth/signIn">
            <FiUser className="w-6 h-6 cursor-pointer" />
          </Link>
          <Link href="/cart">
            <FiShoppingBag className="w-6 h-6 cursor-pointer" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
