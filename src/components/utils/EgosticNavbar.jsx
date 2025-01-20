"use client"
import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '../frontend/shared/Navbar';

const EgoisticNavbar = () => {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin/dashboard');
  const isVendorPage = pathname.startsWith('/vendor/dashboard');
  const isUserPage = pathname.startsWith('/user');
  const isGrocery = pathname.startsWith('/JonoGrocery');



  if (isAdminPage || isUserPage || isVendorPage || isGrocery ) {
    return null; 
  }

  return <Navbar />;
};

export default EgoisticNavbar;
