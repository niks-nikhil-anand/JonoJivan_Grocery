"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from "react-hot-toast";
import Image from "next/image";
import facebookIcon from '../../../../public/IconHub/facebookIcon.png';
import googleIcon from '../../../../public/IconHub/GoogleIcons.png';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isOtpLogin) {
      // Handle login with password
      const formData = { email, password, rememberMe };
      try {
        const response = await axios.post('/api/auth/login', formData, { headers: { 'Content-Type': 'application/json' } });
        if (response.status === 200) {
          const cookieResponse = await axios.get('/api/auth/userAuthTokenCookies');
          if (cookieResponse.status === 200 && cookieResponse.data) {
            toast.success("Login successful!");
            setEmail(''); setPassword(''); setRememberMe(false);
            router.push(`/users/${cookieResponse.data[0]._id}`);
          }
        }
      } catch (error) {
        toast.error("Login failed. Please check your credentials.");
      } finally {
        setLoading(false);
      }
    } else {
      // Handle login with OTP
      if (otpInput === "123456") { // Mock OTP validation
        toast.success("OTP verified successfully!");
        setOtpInput('');
        router.push(`/users/profile`); // Change route as needed
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleOtpInputChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) { // Allow only numbers, max 6 digits
      setOtpInput(value);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.success(`Logging in with ${provider}`);
  };

  return (
    <div className="flex justify-center items-center bg-green-50 px-6 md:px-4 w-full flex-col ">
  <div className="w-full md:w-2/3 lg:w-1/2 md:pl-6 my-5">
    <h2 className="text-3xl font-bold mb-4 text-center md:text-left text-green-900 mt-5">Login</h2>

    <div className="flex justify-center mb-6">
      <button
        onClick={() => setIsOtpLogin(false)}
        className={`px-4 py-2 ${!isOtpLogin ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-800'} rounded-l-2xl text-sm md:text-base`}
      >
        Sign In with Password
      </button>
      <button
        onClick={() => setIsOtpLogin(true)}
        className={`px-4 py-2 ${isOtpLogin ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-800'} rounded-r-2xl text-sm md:text-base`}
      >
        Sign In with OTP
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

      {!isOtpLogin ? (
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
      ) : (
        <div className="mb-4">
          <input
            type="text"
            value={otpInput}
            onChange={handleOtpInputChange}
            maxLength={6}
            className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
            placeholder="Enter 6-digit OTP"
            required
          />
        </div>
      )}

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

    <div className="flex items-center justify-between mt-6">
      <span className="border-t border-gray-300 flex-grow"></span>
      <span className="mx-4 text-gray-600">JonoJivan Grocery</span>
      <span className="border-t border-gray-300 flex-grow"></span>
    </div>

    {/* Social login buttons */}
    <div className="flex justify-center mt-6 space-x-4">
      <button
        onClick={() => handleSocialLogin("Google")}
        className="flex items-center px-4 py-2 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 bg-white"
      >
        <Image src={googleIcon} alt="Google Icon" width={30} height={30} className="mr-2" />
        <span className="text-gray-700 font-semibold text-sm md:text-base">Sign In with Google</span>
      </button>
      <button
        onClick={() => handleSocialLogin("Facebook")}
        className="flex items-center px-4 py-2 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 bg-white"
      >
        <Image src={facebookIcon} alt="Facebook Icon" width={30} height={30} className="mr-2" />
        <span className="text-gray-700 font-semibold text-sm md:text-base">Sign In with Facebook</span>
      </button>
    </div>
  </div>
</div>

  );
};

export default LoginForm;
