"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaAppleAlt, FaCarrot, FaPlus , FaShoppingCart, FaListUl, FaCog , FaSearch , FaHome } from "react-icons/fa";
import { FaTable , FaProductHunt } from "react-icons/fa6";
import {  GiOpenBook } from "react-icons/gi";
import { MdOutlineLogout , MdPendingActions , MdOutlineRateReview } from "react-icons/md";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { ImProfile } from "react-icons/im";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdAdd } from "react-icons/md";
import { toast } from 'react-hot-toast';


const SidebarAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/auth/logout', {
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
        animate={{ width: isOpen ? "250px" : "90px" }}
        className="bg-green-100 text-gray-900 dark:text-white h-screen p-5 transition-width duration-300 shadow-lg overflow-y-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255, 255, 255, 0.5) rgba(0, 0, 0, 0.3)" }}
      >
        <button
          onClick={toggleSidebar}
          className="bg-white text-green-700 p-2 rounded mb-4 shadow-md transition-transform transform hover:scale-110"
        >
          <RiDashboardHorizontalFill className='w-6 h-6 shadow-lg' />
        </button>
        <div className="flex flex-col space-y-4">
          <h2 className={`text-lg font-semibold mb-4 ${isOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
            {isOpen ? "Dashboard" : ""}
          </h2>
          <Link href="/admin/dashboard" passHref>
            <SidebarItem icon={<FaHome />} label="Home" isOpen={isOpen} selected={selectedItem === 'Home'} onClick={() => setSelectedItem('Home')} />
          </Link>

          {isOpen && <h3 className="text-sm font-medium mt-4 mb-2 text-black">Orders</h3>}
          <Link href="/admin/dashboard/orders" passHref>
            <SidebarItem icon={<FaShoppingCart />} label="All Orders" isOpen={isOpen} selected={selectedItem === 'All Orders'} onClick={() => setSelectedItem('All Orders')} />
          </Link>
          <Link href="/admin/dashboard/orders/searchOrders" passHref>
            <SidebarItem icon={<MdPendingActions />} label="Search Orders" isOpen={isOpen} selected={selectedItem === 'Pending Orders'} onClick={() => setSelectedItem('Pending Orders')} />
          </Link>

          {isOpen && <h3 className="text-sm font-medium mt-4 mb-2 text-black">Products</h3>}
          <Link href="/admin/dashboard/product/addProduct" passHref>
            <SidebarItem icon={<MdAdd />} label="Add Product" isOpen={isOpen} selected={selectedItem === 'Add Product'} onClick={() => setSelectedItem('Add Product')} />
          </Link>
          <Link href="/admin/dashboard/product/allProduct" passHref>
            <SidebarItem icon={<FaProductHunt />} label="Products" isOpen={isOpen} selected={selectedItem === 'Products'} onClick={() => setSelectedItem('Products')} />
          </Link>

          {isOpen && <h3 className="text-sm font-medium mt-4 mb-2 text-black">Categories</h3>}
          <Link href="/admin/dashboard/category/addCategory" passHref>
            <SidebarItem icon={<MdAdd />} label="Add Categories" isOpen={isOpen} selected={selectedItem === 'Add Categories'} onClick={() => setSelectedItem('Add Categories')} />
          </Link>
          <Link href="/admin/dashboard/category/allCategory" passHref>
            <SidebarItem icon={<FaListUl />} label="All Categories" isOpen={isOpen} selected={selectedItem === 'All Categories'} onClick={() => setSelectedItem('All Categories')} />
          </Link>

          {isOpen && <h3 className="text-sm font-medium mt-4 mb-2 text-black">Blog</h3>}
          <Link href="/admin/dashboard/blog/addBlog" passHref>
            <SidebarItem icon={<MdAdd />} label="Add Blog" isOpen={isOpen} selected={selectedItem === 'Add Blog'} onClick={() => setSelectedItem('Add Blog')} />
          </Link>
          <Link href="/admin/dashboard/blog/allBlog" passHref>
            <SidebarItem icon={<GiOpenBook />} label="Blogs" isOpen={isOpen} selected={selectedItem === 'Blogs'} onClick={() => setSelectedItem('Blogs')} />
          </Link>

          {isOpen && <h3 className="text-sm font-medium mt-4 mb-2 text-black">Users</h3>}
          <Link href="/admin/dashboard/users" passHref>
            <SidebarItem icon={<FaTable />} label="Table View" isOpen={isOpen} selected={selectedItem === 'Table View'} onClick={() => setSelectedItem('Table View')} />
          </Link>
          <Link href="/admin/dashboard/user/search" passHref>
            <SidebarItem icon={<FaSearch />} label="Search Users" isOpen={isOpen} selected={selectedItem === 'Search Users'} onClick={() => setSelectedItem('Search Users')} />
          </Link>

          {isOpen && <h3 className="text-sm font-medium mt-4 mb-2 text-black">Review</h3>}
          <Link href="/admin/dashboard/review/addReview" passHref>
            <SidebarItem icon={<FaPlus />} label="Add Review" isOpen={isOpen} />
          </Link>
          <Link href="/admin/dashboard/review/addReview" passHref>
            <SidebarItem icon={<MdOutlineRateReview />} label="Review" isOpen={isOpen} />
          </Link>

          {isOpen && <h3 className="text-sm font-medium mt-4 mb-2 text-black">Account</h3>}
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
            <MdOutlineLogout className="h-4 w-4" aria-hidden="true" />
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
      {isOpen && <span className="font-semibold text-sm">{label}</span>}
    </motion.div>
  );
};


export default SidebarAdmin;
