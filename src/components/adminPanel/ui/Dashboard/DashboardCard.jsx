import React from "react";
import { FaArrowUp, FaChartLine } from "react-icons/fa";

const DashboardCard = () => {
  return (
    <div className="w-54 h-36 bg-gradient-to-br from-white to-indigo-50 shadow-lg hover:shadow-xl transition-shadow rounded-2xl p-6 flex justify-between items-start text-left ">
  <div className="space-y-3">
    <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Orders</h2>
    <div className="space-y-1">
      <p className="text-3xl font-bold text-gray-900">1,482</p>
      <div className="flex items-center space-x-1 mt-5">
        <span className="text-sm font-medium text-green-600">↑12.5%</span>
        <span className="text-xs text-green-600">from last month</span>
      </div>
    </div>
  </div>
  <div className="bg-indigo-100 p-3 rounded-full flex-shrink-0">
    <FaChartLine size={28} className="text-indigo-600" />
  </div>
</div>
  );
};

export default DashboardCard;
