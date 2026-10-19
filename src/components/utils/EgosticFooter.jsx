"use client"
import React from 'react';
import { usePathname } from 'next/navigation';
import Footer from '../frontend/shared/Footer';
import MobileTabBar from '../frontend/shared/MobileTabBar';


const EgoisticFooter = () => {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin/dashboard');
  const isVendorPage = pathname.startsWith('/vendor/dashboard');
  const isUserPage = pathname.startsWith('/user');

  if (isAdminPage || isUserPage || isVendorPage) {
    return null;
  }

  return (
    <>
      <Footer />
      {/* Spacer so the fixed bottom tab bar never covers the footer on phones */}
      <div className="h-16 sm:hidden" aria-hidden />
      <MobileTabBar />
    </>
  );
};

export default EgoisticFooter;
