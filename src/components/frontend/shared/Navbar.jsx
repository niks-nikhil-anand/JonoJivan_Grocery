"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiUser, FiShoppingBag } from "react-icons/fi";
import { AiOutlineDown, AiOutlineUp, AiOutlineMenu } from "react-icons/ai";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../../public/logo/logo.png";

const Navbar = () => {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleShopDropdown = () => setIsShopOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-white z-50 p-6"
        >
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl absolute top-4 right-4"
          >
            &times;
          </button>
          <ul className="space-y-6 text-lg font-medium">
            <li>
              <Link href="/" className="block hover:text-green-600">
                Home
              </Link>
            </li>
            <li>
              <button
                onClick={toggleShopDropdown}
                className="w-full flex justify-between items-center"
              >
                Shop
                {isShopOpen ? <AiOutlineUp /> : <AiOutlineDown />}
              </button>
              {isShopOpen && (
                <ul className="mt-2 pl-4 space-y-2">
                  <li>
                    <Link href="/fruits" className="block hover:text-green-600">
                      Fruits & Vegetables
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/bakery"
                      className="block hover:text-green-600"
                    >
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
              )}
            </li>
            <li>
              <Link href="/offers" className="block hover:text-green-600">
                Offers
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className="block hover:text-green-600">
                Contact Us
              </Link>
            </li>
          </ul>
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
