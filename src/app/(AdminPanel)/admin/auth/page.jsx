"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from "react-hot-toast";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('vendor'); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginUrl = role === 'vendor' ? '/api/vendor/auth' : '/api/admin/auth';
      const response = await axios.post(loginUrl, {
        email,
        password,
        rememberMe,
      });

      if (response.status === 200) {
        setEmail('');
        setPassword('');
        setRememberMe(false);
        toast.success("Login successful! Redirecting...");
        const redirectUrl = role === 'vendor' ? '/vendor/dashboard' : '/admin/dashboard';
        router.push(redirectUrl);
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed! Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-green-50 px-6 md:px-4 w-full flex-col">
  <div className="w-full md:w-2/3 lg:w-1/2 md:pl-6 my-5">
    <motion.h2
      className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-extrabold mb-6 text-center md:text-left text-green-800 mt-8 tracking-wide"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      Welcome Back to JonoJivan Grocery
    </motion.h2>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setRole('vendor')}
            className={`px-4 py-2 ${role === 'vendor' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-800'} rounded-l-2xl text-sm md:text-base`}
          >
            Sign In as Vendor
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`px-4 py-2 ${role === 'admin' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-800'} rounded-r-2xl text-sm md:text-base`}
          >
            Sign In as Admin
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
              required
            />
          </div>

          <div className="mb-4 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
              required
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center text-sm cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 text-white rounded-2xl ${loading ? 'bg-gray-400' : 'bg-green-700 hover:bg-green-600'} text-sm md:text-base`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>

        <div className="flex justify-between mt-4 text-sm md:text-base">
          <a href="#" className="text-green-700 hover:underline">Forgot password?</a>
          <Link href={"/auth/register"} className="text-green-700 hover:underline">Create an account</Link>
        </div>

        <div className="flex items-center justify-between my-6">
          <span className="border-t border-gray-300 flex-grow"></span>
          <span className="mx-4 text-gray-600">JonoJivan Grocery</span>
          <span className="border-t border-gray-300 flex-grow"></span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
