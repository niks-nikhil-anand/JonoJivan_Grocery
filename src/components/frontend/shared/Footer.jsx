import Link from "next/link";
import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";

const Footer = () => {
  return (
    <footer className="bg-[#171717] text-gray-300 py-10 px-5">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-xl font-bold text-white">JONOJIVAN GROCERY DISTRIBUTION PVT LTD</h3>
          <p className="mt-3 text-gray-300">
            Your one-stop destination for shopping, groceries, and courier services.
          </p>
          <div className="flex space-x-4 mt-4">
            <FaFacebookF className="text-xl cursor-pointer hover:text-white transition-colors" />
            <FaTwitter className="text-xl cursor-pointer hover:text-white transition-colors" />
            <FaInstagram className="text-xl cursor-pointer hover:text-white transition-colors" />
            <FaLinkedin className="text-xl cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-white">Contact Info</h3>
          <div className="mt-3 space-y-3">
            <div className="flex items-start gap-2">
              <IoLocationOutline className="text-lg mt-1 flex-shrink-0" />
              <p className="text-sm leading-relaxed">
                UTTAR KHATOWAL RUPAHIHAT<br />
                NAGAON ASSAM<br />
                PIN 782124
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FiPhone className="text-lg" />
              <a href="tel:9435266783" className="hover:text-white transition-colors">
                9435266783
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-gray-300">
            <li className="hover:text-white cursor-pointer transition-colors">Home</li>
            <li className="hover:text-white cursor-pointer transition-colors">Categories</li>
            <li className="hover:text-white cursor-pointer transition-colors">E-commerce</li>
            <li className="hover:text-white cursor-pointer transition-colors">Grocery</li>
            <li className="hover:text-white cursor-pointer transition-colors">Courier</li>
            <li className="hover:text-white cursor-pointer transition-colors">
              <a href="/returnPolicy">Track Your Courier</a>
            </li>
          </ul>
        </div>

        {/* Services & Support */}
        <div>
          <h3 className="text-lg font-semibold text-white">Services & Support</h3>
          <ul className="mt-3 space-y-2 text-gray-300">
            <li className="hover:text-white cursor-pointer transition-colors">
              <a href="/auth/vendorRegistration">Become JonoJivan Vendor</a>
            </li>
            <li className="hover:text-white cursor-pointer transition-colors">Customer Support</li>
            <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
            <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800 mt-8 pt-6 text-gray-300 text-sm flex justify-between flex-wrap">
        <p>© 2024 JONOJIVAN GROCERY DISTRIBUTION PVT LTD. All rights reserved.</p>
        <div className="flex space-x-6">
          <Link href={"/privacyPolicy"} className="hover:text-white transition-colors">
          Privacy Policy
          </Link>
          <Link href={"/returnPolicy"} className="hover:text-white transition-colors">
        Return Policy
          </Link>
          <Link href={"/shippingPolicy"} className="hover:text-white transition-colors">
         Shipping Policy
          </Link>
          <Link href={"/termsAndConditions"} className="hover:text-white transition-colors">
        Terms Condition
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
