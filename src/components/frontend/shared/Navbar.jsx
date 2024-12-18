"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiUser, FiShoppingBag } from "react-icons/fi";
import { AiOutlineDown, AiOutlineUp, AiOutlineMenu } from "react-icons/ai";
import Image from 'next/image';
import waveNav from '../../../../public/frontend/SvgAssets/wave-nav.svg'; 
import Link from "next/link";
import logo from '../../../../public/logo/logo.png'


const Navbar = () => {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isLearnOpen, setIsLearnOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleShopDropdown = () => {
    setIsShopOpen((prev) => !prev);
    if (isLearnOpen) setIsLearnOpen(false);
  };

  const toggleLearnDropdown = () => {
    setIsLearnOpen((prev) => !prev);
    if (isShopOpen) setIsShopOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-white shadow-md w-full  md:py-2 px-6 md:px-12 relative z-50">
      <div className="flex justify-between items-center">
  {/* Mobile Menu Icon */}
  <div className="md:hidden">
    <AiOutlineMenu
      className="w-8 h-8 cursor-pointer"
      onClick={toggleMobileMenu}
    />
  </div>

  {/* Logo */}
  <div className="flex justify-center md:hidden z-50">
  <Link href={"/"}>
    <Image src={logo} alt="Logo" width={100} height={100} />
  </Link>
</div>


  {/* Right Side - Search, User, Cart Icons */}
  <div className="flex items-center space-x-4 md:hidden">
    <FiSearch className="w-6 h-6 cursor-pointer" />


    <Link href={"/auth/signIn"}>
    <FiUser className="w-6 h-6 cursor-pointer" />
    </Link>

    <div className="relative">
      <Link href={"/product/cart"}>
            <FiShoppingBag className="w-6 h-6 cursor-pointer" />
      </Link>
          </div>

          
  </div>
</div>

{/* Mobile Menu */}
{isMobileMenuOpen && (
  <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: "auto", opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
    className="md:hidden bg-white w-full mt-4 p-6 shadow-lg rounded-lg"
  >
    {/* Animate links individually for a staggered effect */}
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: -10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2,
          },
        },
      }}
      className="space-y-6"
    >
      <motion.li variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
        <button
          onClick={toggleShopDropdown}
          className="text-lg font-medium flex items-center justify-between w-full"
        >
          Shop
          {isShopOpen ? <AiOutlineUp className="ml-2" /> : <AiOutlineDown className="ml-2" />}
        </button>
        {isShopOpen && (
          <motion.ul
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-2 space-y-2 pl-4"
          >
            <li>
              <a href="#" className="block hover:text-blue-600">
                Men`&apos;s Health
              </a>
            </li>
            <li>
              <a href="#" className="block hover:text-blue-600">
                Women`&apos;s Health
              </a>
            </li>
            <li>
              <a href="#" className="block hover:text-blue-600">
                Best Sellers
              </a>
            </li>
          </motion.ul>
        )}
      </motion.li>

      {/* Learn dropdown */}
      <motion.li variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
        <button
          onClick={toggleLearnDropdown}
          className="text-lg font-medium flex items-center justify-between w-full"
        >
          Learn
          {isLearnOpen ? <AiOutlineUp className="ml-2" /> : <AiOutlineDown className="ml-2" />}
        </button>
        {isLearnOpen && (
          <motion.ul
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-2 space-y-2 pl-4"
          >
            <li>
              <Link href={"/aboutUs"} className="block hover:text-blue-600">
                About Us
              </Link>
            </li>
            <li>
              <Link href={"/contactUs"} className="block hover:text-blue-600">
               Contact Us
              </Link>
            </li>
            <li>
              <Link href={"/Faqs"} className="block hover:text-blue-600">
                FAQs
              </Link>
            </li>
            <li>
              <Link href={"/blog"} className="block hover:text-blue-600">
                Blog
              </Link>
            </li>
          </motion.ul>
        )}
      </motion.li>

      {/* Regular Links */}
      <motion.li variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
        <a href="#" className="block hover:text-blue-600">
          Rewards
        </a>
      </motion.li>
      <motion.li variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
        <a href="#" className="block hover:text-blue-600">
          Take Quiz
        </a>
      </motion.li>
    </motion.ul>
  </motion.div>
)}


      {/* Desktop Menu */}
      <div className="mx-auto hidden md:flex justify-between items-center px-8 bg-white py-4 ">
        {/* Left Side - Menu Links */}
        <div className="flex items-center space-x-10 relative z-50 ">
          {/* Shop Dropdown */}
          <div className="relative">
            <button
              onClick={toggleShopDropdown}
              className="text-lg font-medium hover:text-gray-700 focus:outline-none flex items-center"
            >
              Shop
              {isShopOpen ? <AiOutlineUp className="ml-2" /> : <AiOutlineDown className="ml-2" />}
            </button>
            {isShopOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 mt-4 w-[60rem] bg-white shadow-xl rounded-b-3xl py-10 px-14 flex gap-[10rem] z-50"
                style={{ zIndex: 9999 }}
              >
                {/* Collections, Categories, Health Focus sections */}
                <div>
                  <h3 className="font-bold text-lg mb-3 ml-7">Collections</h3>
                  <ul className="space-y-6">
                    <li className="flex items-center space-x-3">
                      <span>♂</span>
                      <a href="#" className="hover:text-blue-600">Men`&apos;s Health</a>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span>♀</span>
                      <a href="#" className="hover:text-blue-600">Women`&apos;s Health</a>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span>🔥</span>
                      <a href="#" className="hover:text-blue-600">Best Sellers</a>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span>🍎</span>
                      <a href="#" className="hover:text-blue-600">New Products</a>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span>📦</span>
                      <Link href={"/product/shopAllProducts"} className="hover:text-blue-600">All Products </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-3 ml-7">Categories</h3>
                  <ul className="space-y-6">
                    <li className="flex items-center space-x-3">
                      <span>🍬</span>
                      <a href="#" className="hover:text-blue-600">Gummies</a>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span>💧</span>
                      <a href="#" className="hover:text-blue-600">Liquids</a>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span>🧂</span>
                      <a href="#" className="hover:text-blue-600">Powders</a>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span>💊</span>
                      <a href="#" className="hover:text-blue-600">Capsules</a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-3 ml-7">Health Focus</h3>
                  <ul className="space-y-6">
                    <li className="flex items-center space-x-3">
                      <span>🛡️</span>
                      <a href="#" className="hover:text-blue-600">Immunity</a>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span>⚛️</span>
                      <a href="#" className="hover:text-blue-600">Mind + Mood</a>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span>🌟</span>
                      <a href="#" className="hover:text-blue-600">Beauty</a>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span>🏋️‍♂️</span>
                      <a href="#" className="hover:text-blue-600">Active Line</a>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>

          {/* Learn Dropdown */}
          <div className="relative">
            <button
              onClick={toggleLearnDropdown}
              className="text-lg font-medium hover:text-gray-700 focus:outline-none flex items-center"
            >
              Learn
              {isLearnOpen ? <AiOutlineUp className="ml-2" /> : <AiOutlineDown className="ml-2" />}
            </button>
            {isLearnOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 mt-4 w-[20rem] bg-white shadow-xl rounded-b-3xl py-5 px-5 z-50"
                style={{ zIndex: 9999 }}
              >
                <ul className="space-y-4">
                  <li className="flex items-center space-x-3">
                    <span>📖</span>
                    <a href="#" className="hover:text-blue-600">About Us</a>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span>❓</span>
                    <a href="#" className="hover:text-blue-600">FAQs</a>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span>📝</span>
                    <Link href={"/blog"} className="hover:text-blue-600">Wellness Blog</Link>
                  </li>
                </ul>
              </motion.div>
            )}
          </div>

          <a href="#" className="text-lg font-medium hover:text-gray-700">Rewards</a>
          <a href="#" className="text-lg font-medium hover:text-gray-700">Take Quiz</a>
        </div>

       
        <div className="flex justify-center relative z-50">
          <Link href={"/"}>
          <h1 className="font-bold text-xl hover:cursor-pointer">JonoJivan</h1>
          </Link>
        </div>

        
        <div className="flex items-center space-x-6 relative z-50">
          <FiSearch className="w-6 h-6 cursor-pointer" />
          <Link href={"/auth/signIn"}>
          <FiUser className="w-6 h-6 cursor-pointer" />
          </Link>
          <Link href={"/product/cart"}>
          <div className="relative">
            <FiShoppingBag className="w-6 h-6 cursor-pointer" />
          </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
