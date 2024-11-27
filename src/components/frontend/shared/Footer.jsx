"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Image from 'next/image';

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
    <footer className="relative bg-gray-100 py-10 shadow-lg border-t-2 border-gray-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-bold text-orange-500">Useful Links</h3>
          <div className="w-16 h-1 bg-purple-600 mb-4"></div>
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
          <div className="w-16 h-1 bg-purple-600 mb-4"></div>
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

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-black text-center">Get 15% Off</h3>
          <p className="text-sm text-black font-medium text-center">
            Subscribe to receive the latest updates, offers, and more from JonoJivan Grocery!
          </p>

          <form className="space-y-4" onSubmit={handleSubscribe}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border border-black p-4 rounded-md focus:ring-2"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border border-black p-4 rounded-md focus:ring-2"
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white p-3 rounded-md font-bold shadow-lg hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Footer Banner Image */}
      

      <div className="mt-10 text-center text-sm text-black">
        <p>
          © 2024,{' '}
          <a href="#" className="text-black underline">
            JonoJivan Grocery
          </a>
          . All Rights Reserved.
        </p>
        <div className="mt-4 p-4 flex justify-center items-center flex-col">
          <div className="md:w-[50rem] w-[20rem] rounded-lg border border-gray-200 px-5 md:py-8 py-5">
            <p className="text-center">
              Enjoy 50% OFF select products and explore our wide range of grocery items, carefully
              sourced to provide the freshest and finest quality. Our commitment is to deliver
              exceptional groceries, ensuring every item meets our high standards for freshness and
              sustainability. Shop with us and taste the difference of quality ingredients.
            </p>
            <p className="mt-2 text-center">
              **Please note: These statements have not been evaluated by any regulatory authority.
              Our products are selected with care but are not intended to diagnose, treat, cure, or
              prevent any disease. Always consult with a healthcare professional for specific
              dietary or health-related guidance.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
