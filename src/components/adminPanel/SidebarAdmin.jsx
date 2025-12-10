"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaHome,
  FaShoppingCart,
  FaProductHunt,
  FaListUl,
  FaUser,
  FaSearch,
  FaPlus,
  FaCog,
  FaSignOutAlt,
  FaChevronRight,
  FaIdCard
} from "react-icons/fa";
import { MdPendingActions, MdOutlineRateReview, MdDashboard } from "react-icons/md";
import { GiOpenBook } from "react-icons/gi";
import { ImProfile } from "react-icons/im";

const SidebarAdmin = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const menuGroups = [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/admin/dashboard", icon: <MdDashboard /> },
      ],
    },
    {
      title: "E-Commerce",
      items: [
        { label: "All Orders", href: "/admin/dashboard/orders", icon: <FaShoppingCart /> },
        { label: "Search Orders", href: "/admin/dashboard/orders/searchOrders", icon: <MdPendingActions /> },
        { label: "Products", href: "/admin/dashboard/product/allProduct", icon: <FaProductHunt /> },
        { label: "Add Product", href: "/admin/dashboard/product/addProduct", icon: <FaPlus /> },
        { label: "Categories", href: "/admin/dashboard/category/allCategory", icon: <FaListUl /> },
        { label: "Add Category", href: "/admin/dashboard/category/addCategory", icon: <FaPlus /> },
      ],
    },
    {
        title: "Content",
        items: [
            { label: "All Blogs", href: "/admin/dashboard/blog/allBlog", icon: <GiOpenBook /> },
            { label: "Add Blog", href: "/admin/dashboard/blog/addBlog", icon: <FaPlus /> },
            { label: "Reviews", href: "/admin/dashboard/review/addReview", icon: <MdOutlineRateReview /> },
        ]
    },
    {
      title: "User Management",
      items: [
        { label: "Users Table", href: "/admin/dashboard/users", icon: <FaUser /> },
        { label: "Search User", href: "/admin/dashboard/user/search", icon: <FaSearch /> },
        { label: "Ration Cards", href: "/admin/dashboard/rationCards", icon: <FaIdCard /> },
      ],
    },
    {
      title: "Settings",
      items: [
        { label: "Profile", href: "/admin/dashboard/profile", icon: <ImProfile /> },
        { label: "Settings", href: "/settings", icon: <FaCog /> },
      ],
    },
  ];

  return (
    <aside className="h-screen w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl sticky top-0 font-sans">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg">
                <FaProductHunt className="text-white text-xl" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">
            Jonojivan
            </h1>
        </div>
      </div>

      {/* Scrollable Menu */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#475569 #1e293b" }}
      >
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item, itemIndex) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={itemIndex} href={item.href} passHref>
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors duration-200 cursor-pointer group ${
                        isActive
                          ? "bg-green-600 text-white shadow-lg shadow-green-900/50"
                          : "hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-lg transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}>
                            {item.icon}
                        </span>
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      {/* Optional Indicator for active state */}
                       {isActive && <FaChevronRight className="text-xs opacity-70" />}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-300 font-medium text-sm group"
        >
          <FaSignOutAlt className="group-hover:rotate-180 transition-transform duration-300" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
