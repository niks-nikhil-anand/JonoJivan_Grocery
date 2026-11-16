"use client";

import { useState } from "react";
import NavbarAdmin from "@/components/adminPanel/NavbarAdmin";
import SidebarAdmin from "@/components/adminPanel/SidebarAdmin";

export default function AdminDashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return <div className="flex min-h-screen w-full bg-[#f7f8f5]">
    <SidebarAdmin mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    <div className="min-w-0 flex-1 overflow-hidden">
      <NavbarAdmin onMenuClick={() => setMobileMenuOpen(true)} />
      <div className="min-w-0">{children}</div>
    </div>
  </div>;
}
