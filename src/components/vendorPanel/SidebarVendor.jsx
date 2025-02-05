"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


import { RiDashboardHorizontalFill } from "react-icons/ri";
import { FaHome, FaShoppingCart, FaProductHunt, FaTable, FaIdCard, FaCog } from "react-icons/fa";
import { MdAdd, MdOutlineRateReview, MdOutlineLogout } from "react-icons/md";
import { ImProfile } from "react-icons/im";



const SidebarVendor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/vendor/auth/logout', {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        router.push('/');
      } else {
        alert(`Logout failed: ${data.message}`);
      }
    } catch (error) {
      alert(`Logout failed: ${error.message}`);
    }
  };

  return (
    <div className="flex">
    <motion.div
      animate={{ width: isOpen ? '250px' : '90px' }}
      className="bg-green-100 text-gray-900 dark:text-white h-screen p-5 transition-width duration-300 shadow-lg overflow-y-auto"
      style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255, 255, 255, 0.5) rgba(0, 0, 0, 0.3)' }}
    >
      <button
        onClick={toggleSidebar}
        className="bg-white text-green-700 p-2 rounded mb-4 shadow-md transition-transform transform hover:scale-110"
      >
        <RiDashboardHorizontalFill className="w-6 h-6 shadow-lg" />
      </button>
      <div className="flex flex-col space-y-4">
        <h2 className={`text-lg font-semibold mb-4 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          {isOpen ? 'Dashboard' : ''}
        </h2>
        <Link href="/admin/dashboard/property/AddProperty" passHref>
          <SidebarItem icon={<FaHome />} label="Home" isOpen={isOpen} selected={selectedItem === 'Home'} onClick={() => setSelectedItem('Home')} />
        </Link>

        {isOpen && <h3 className="text-sm font-medium mt-4 mb-2 text-black">Orders</h3>}
        <Link href="/vendor/dashboard/orders" passHref>
          <SidebarItem icon={<FaShoppingCart />} label="All Orders" isOpen={isOpen} selected={selectedItem === 'All Orders'} onClick={() => setSelectedItem('All Orders')} />
        </Link>

        {isOpen && <h3 className="text-sm font-medium mt-4 mb-2 text-black">Products</h3>}
        <Link href="/vendor/dashboard/product/addProduct" passHref>
          <SidebarItem icon={<MdAdd />} label="Add Product" isOpen={isOpen} selected={selectedItem === 'Add Product'} onClick={() => setSelectedItem('Add Product')} />
        </Link>
        <Link href="/vendor/dashboard/product/allProduct" passHref>
          <SidebarItem icon={<FaProductHunt />} label="Products" isOpen={isOpen} selected={selectedItem === 'Products'} onClick={() => setSelectedItem('Products')} />
        </Link>
        <Link href="/vendor/dashboard/product/review" passHref>
          <SidebarItem icon={<MdOutlineRateReview />} label="Review" isOpen={isOpen} />
        </Link>

        {isOpen && <h3 className="text-sm font-medium mt-4 mb-2 text-black">Wallet</h3>}
        <Link href="/admin/dashboard/user/tableView" passHref>
          <SidebarItem icon={<FaTable />} label="Transactions" isOpen={isOpen} selected={selectedItem === 'Transactions'} onClick={() => setSelectedItem('Transactions')} />
        </Link>
        <Link href="/admin/dashboard/user/cardView" passHref>
          <SidebarItem icon={<FaIdCard />} label="Withdraw Funds" isOpen={isOpen} selected={selectedItem === 'Withdraw Funds'} onClick={() => setSelectedItem('Withdraw Funds')} />
        </Link>

        {isOpen && <h3 className="text-sm font-medium mt-4 mb-2 text-black">Account</h3>}
        <Link href="/admin/dashboard/profile" passHref>
          <SidebarItem icon={<ImProfile />} label="Tickets" isOpen={isOpen} selected={selectedItem === 'Tickets'} onClick={() => setSelectedItem('Tickets')} />
        </Link>
        <Link href="/admin/dashboard/profile" passHref>
          <SidebarItem icon={<ImProfile />} label="Profile" isOpen={isOpen} selected={selectedItem === 'Profile'} onClick={() => setSelectedItem('Profile')} />
        </Link>
        <Link href="/settings" passHref>
          <SidebarItem icon={<FaCog />} label="Settings" isOpen={isOpen} selected={selectedItem === 'Settings'} onClick={() => setSelectedItem('Settings')} />
        </Link>

        <button
          className="mt-6 flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-red-700 shadow-md"
          onClick={handleLogout}
        >
          <MdOutlineLogout className="h-5 w-5" aria-hidden="true" />
          {isOpen && <span className="ml-2">Logout</span>}
        </button>
      </div>
    </motion.div>
  </div>
  );
};

const SidebarItem = ({ icon, label, isOpen, selected, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 shadow-sm cursor-pointer ${
        selected
          ? "bg-gray-600 text-white"
          : " hover:bg-green-500 border-gray-200 border-2 hover:text-white"
      }`}
    >
      <div className=" w-4 h-4">{icon}</div>
      {isOpen && <span className="font-semibold text-base">{label}</span>}
    </motion.div>
  );
};

export default SidebarVendor;
