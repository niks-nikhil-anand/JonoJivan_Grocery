import 'tailwindcss/tailwind.css';
import '@/app/globals.css';
import NavbarAdmin from '@/components/adminPanel/NavbarAdmin';
import SidebarAdmin from '@/components/adminPanel/SidebarAdmin';

const Layout = ({ children }) => {
  return (
    <div className="flex w-full min-h-screen overflow-hidden">
    <SidebarAdmin className="w-1/4 h-screen bg-gray-800" />
    <div className="flex flex-col w-full">
      <NavbarAdmin className="w-full" />
      <main className="flex-1 p-4 overflow-hidden">
        {children}
      </main>
    </div>
  </div>
  
  );
};

export default Layout;
