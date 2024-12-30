"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Image from 'next/image';
import logo from '../../../../public/logo/logo.png'
import playstoreIcon from '../../../../public/icons/playstore.png';
import appleStoreIcon from '../../../../public/icons/app-store.png';



const Footer = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/admin/dashboard/newsLetter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Subscription successful!');
        setFormData({ name: '', email: '' });
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <footer className="relative bg-gray-200 py-10 shadow-lg ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">

      <div className="space-y-6">
  {/* Logo and Brand Title */}
  <div className="flex items-center space-x-3">
    <Image src={logo} alt="JonoJivan Grocery Logo" width={80} height={80} />
    <div className='flex flex-col'>
    <h1 className="text-xl md:text-2xl font-bold text-black">JonoJivan Grocery</h1>
    <div className="w-16 h-1 bg-[#4ADE80] mb-2"></div>
    </div>
   

  </div>

  {/* Description */}
  <p className="text-gray-700">
    Stay connected with us on social media and explore our platform for the latest updates, offers, and products!
  </p>

  {/* Mobile App Links */}
  <div className="flex space-x-4 mt-6">
    <button className="flex items-center px-2 py-3  bg-black text-white rounded-lg shadow hover:bg-gray-800 transition">
      <Image src={playstoreIcon} alt="Google Play Store Icon" width={20} height={20} />
      <span className="text-base font-medium">Google Play</span>
    </button>
    <button className="flex items-center space-x-2 px-4 py-3  bg-black text-white rounded-lg shadow hover:bg-gray-800 transition">
      <Image src={appleStoreIcon} alt="Apple App Store Icon" width={20} height={20} />
      <span className="text-base font-medium">App Store</span>
    </button>
  </div>
</div>

     <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-bold text-orange-500">Useful Links</h3>
          <div className="w-16 h-1 bg-[#4ADE80] mb-2"></div>
          <ul className="space-y-2">
            {[
              { name: 'Shop', url: '/product/shopAllProducts' },
              { name: 'Contact', url: '/contactUs' },
              { name: 'Blog', url: '/blog' },
              { name: 'About Us', url: '/aboutUs' },
              { name: 'Feedback', url: '/feedback' },
            ].map((link) => (
              <li key={link.name} className="hover:underline cursor-pointer">
                <a href={link.url}>{link.name}</a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-orange-500">Resources</h3>
          <div className="w-16 h-1 bg-[#4ADE80] mb-4"></div>
          <ul className="space-y-3">
            {[
              { name: 'Home', url: '/' },
              { name: 'Cancellation and Return Policies', url: '/returnPolicy' },
              { name: 'Shipping And Delivery', url: '/shippingPolicy' },
              { name: 'Privacy Policy', url: '/privacyPolicy' },
              { name: 'Terms & Condition', url: '/termsAndConditions' },
            ].map((link) => (
              <li key={link.name} className="hover:underline cursor-pointer">
                <a href={link.url}>{link.name}</a>
              </li>
            ))}
          </ul>
        </motion.div>

        
      </div>      

      <div className="text-center text-sm text-black">
       
        <div className="mt-4 p-4 flex justify-center items-center flex-col">
          <div className='mt-5'>
          <p>
          © 2024,{' '}
          <a href="#" className="text-black underline">
            JonoJivan Grocery
          </a>
          . All Rights Reserved.
        </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
