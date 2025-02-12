import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { AiFillApple, AiFillAndroid } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="bg-[#171717] text-gray-300 py-10 px-5">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-xl font-bold">JONOJIVAN</h3>
          <p className="mt-3 text-gray-300">
            Your one-stop destination for shopping, groceries, and courier services.
          </p>
          <div className="flex space-x-4 mt-4">
            <FaFacebookF className="text-xl cursor-pointer hover:text-gray-300" />
            <FaTwitter className="text-xl cursor-pointer hover:text-gray-300" />
            <FaInstagram className="text-xl cursor-pointer hover:text-gray-300" />
            <FaLinkedin className="text-xl cursor-pointer hover:text-gray-300" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-gray-300">
            <li className="hover:text-gray-300 cursor-pointer">Home</li>
            <li className="hover:text-gray-300 cursor-pointer">Categories</li>
            <li className="hover:text-gray-300 cursor-pointer">E-commerce</li>
            <li className="hover:text-gray-300 cursor-pointer">Grocery</li>
            <li className="hover:text-gray-300 cursor-pointer">Courier</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-gray-300">
            <li className="hover:text-gray-300 cursor-pointer">
              <a href="/returnPolicy">Track Your Courier</a>
            </li>
            <li className="hover:text-gray-300 cursor-pointer">
              <a href="/shippingPolicy">Shipping And Delivery</a>
            </li>
            <li className="hover:text-gray-300 cursor-pointer">
              <a href="/privacyPolicy">Privacy Policy</a>
            </li>
            <li className="hover:text-gray-300 cursor-pointer">
              <a href="/termsAndConditions">Terms & Condition</a>
            </li>
            <li className="hover:text-gray-300 cursor-pointer">
              <a href="/auth/vendorRegistration">Become JonoJivan Vendor</a>
            </li>
          </ul>
        </div>


        
       

        {/* App Download */}
        <div>
          <h3 className="text-lg font-semibold">Download Our App</h3>
          <div className="mt-3 space-y-3">
            <button className="flex items-center bg-white text-black px-4 py-2 rounded-md shadow hover:bg-gray-200">
              <AiFillAndroid className="mr-2 text-2xl" /> Play Store
            </button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800 mt-8 pt-6 text-gray-300 text-sm flex justify-between flex-wrap">
        <p>© 2024 JONOJIVAN. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-gray-300">Privacy Policy</a>
          <a href="#" className="hover:text-gray-300">Terms of Service</a>
          <a href="#" className="hover:text-gray-300">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
