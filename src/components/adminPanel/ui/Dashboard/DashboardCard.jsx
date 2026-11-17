import React from "react";
import { FaArrowUp, FaChartLine } from "react-icons/fa";

const DashboardCard = () => {
  return (
    <div className="w-full min-h-36 bg-[var(--v-panel)] border border-[var(--v-border)] shadow-lg hover:shadow-xl transition-shadow rounded-2xl p-6 flex justify-between items-start text-left ">
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-[var(--v-muted)] uppercase tracking-wide">
          Total Orders
        </h2>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-[var(--v-text)]">1,482</p>
          <div className="flex items-center space-x-1 mt-5">
            <span className="text-sm font-medium text-[var(--v-green)]">
              ↑12.5%
            </span>
            <span className="text-xs text-[var(--v-green)]">
              from last month
            </span>
          </div>
        </div>
      </div>
      <div className="bg-[var(--v-blue-soft)] p-3 rounded-full flex-shrink-0">
        <FaChartLine size={28} className="text-[var(--v-blue)]" />
      </div>
    </div>
  );
};

export default DashboardCard;
