"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize router

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post('/api/admin/auth', {
        email,
        password,
        rememberMe,
      });
  
      if (response.status === 200) {
        setEmail('');
        setPassword('');
        setRememberMe(false);
        toast.success("Login successful! Redirecting to the admin panel...");
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed! Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center bg-white px-4 md:px-0 w-full flex-col my-10">
  <div className="w-full md:pl-8 md:w-1/2 ">
    {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-10  w-full flex flex-col justify-center md:ml-6"
        >
          <motion.h2
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mb-2 text-center"
          >
            Admin Login
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-gray-600 mb-6"
          >
            Access your admin dashboard 🚀
          </motion.p>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-2xl border-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 mb-2">Password</label>
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className= "w-full px-3 py-2 border rounded-2xl border-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer mt-8"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2"
              />
              <label className="text-gray-700">Remember Me</label>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className={`w-1/2 py-2 px-4 text-white rounded-2xl ${loading ? 'bg-gray-500' : 'bg-purple-900 hover:bg-purple-800'}`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <p className="text-xs text-center text-gray-500 uppercase">or login with</p>
            <span className="border-b w-1/5 lg:w-1/4"></span>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center mt-6"
          >
            <button className="bg-red-500 text-white p-2 rounded-full mx-1 hover:bg-red-600">
              <FaGoogle />
            </button>
            <button className="bg-blue-500 text-white p-2 rounded-full mx-1 hover:bg-blue-600">
              <FaFacebookF />
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-between mt-4"
          >
            <a href="/forgot-password" className="text-blue-500 hover:underline">Forgot your password?</a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLoginForm;
