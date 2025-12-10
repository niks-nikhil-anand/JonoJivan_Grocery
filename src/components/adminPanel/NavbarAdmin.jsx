"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosSearch, IoIosNotificationsOutline, IoIosMenu } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        toast.success("Logout successful!");
        router.push("/");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between">
      {/* Left: Mobile Toggle & Title/Search */}
      <div className="flex items-center gap-4 flex-1">
        <button className="lg:hidden text-2xl text-gray-600 hover:text-green-600 transition-colors">
          <IoIosMenu />
        </button>
        
        {/* Search Bar - Hidden on small mobile */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-full max-w-md focus-within:ring-2 focus-within:ring-green-100 transition-all">
          <IoIosSearch className="text-xl text-gray-400" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-transparent border-none outline-none ml-2 w-full text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative cursor-pointer">
          <div className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
             <IoIosNotificationsOutline className="text-2xl" />
          </div>
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 hover:bg-gray-50 rounded-full p-1 pr-4 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <FaUserCircle className="text-xl" />
            </div>
            <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-700">Super Admin</p>
                <p className="text-xs text-green-600 font-medium">Administrator</p>
            </div>
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                 <div className="px-4 py-2 border-b border-gray-50 md:hidden">
                    <p className="text-sm font-semibold text-gray-800">Super Admin</p>
                 </div>
                 <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                 >
                    <FiLogOut /> Logout
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
