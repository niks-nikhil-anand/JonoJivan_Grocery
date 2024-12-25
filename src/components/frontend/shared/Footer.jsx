"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Image from 'next/image';
import logo from '../../../../public/logo/logo.png'


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

         {/* Logo & Address */}
         <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Image src={logo} alt="Logo" width={100} height={100} />
            <div className='flex flex-col'>
            <h3 className="text-xl font-bold text-black"> Jonojivan Grocery</h3>
            <div className="w-16 h-1 bg-[#4ADE80] "></div>
            </div>
           
          </div>
          <p>Email: <a href="mailto:support@bringsmile.org" className="hover:underline">support@bringsmile.org</a></p>
          <p>Tel: <a href="tel:+9195993 22679" className="hover:underline">+91 95993 22679</a></p>
          <p>Singhi Kalan, PO- Ara, District- Bhojpur, Bihar, Pin- 802301.</p>
          <div className="mt-10 sm:flex sm:items-center sm:space-x-8">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold text-white transition-all duration-200 bg-orange-500 hover:bg-orange-600 focus:bg-orange-600 rounded-2xl"
                  role="button"
                >
                  Start Shopping Now
                </a>
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

      <div className="mt-10 text-center text-sm text-black">
       
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
