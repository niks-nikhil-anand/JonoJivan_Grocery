"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Link from "next/link";
import googleIcon from "../../../../public/IconHub/GoogleIcons.png";
import facebookIcon from "../../../../public/IconHub/facebookIcon.png";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";




const CreateAccountForm = () => {
  const router = useRouter(); 
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false); 
  
  const handleProviderSignIn = async (provider) => {
    try {
      console.log("Attempting to sign in with provider:", provider);
      const result = await signIn(provider);
      console.log("Sign-in result:", result);
  
      if (result?.error) {
        console.error("Sign-in error:", result.error);
        throw new Error(result.error);
      } else {
        console.log("User signed in successfully:", result);
      }
    } catch (error) {
      console.error("Error during sign-in:", error.message);
    }
  };
  
  
  
  
  

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (!acceptedTerms) {
      toast.error("You must accept the terms and conditions!");
      setLoading(false);
      return;
    }



    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("mobileNumber", mobileNumber);
    formData.append("password", password);

    try {
      const response = await axios.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setFullName("");
        setEmail("");
        setMobileNumber("");
        setPassword("");
        setConfirmPassword("");
        setAcceptedTerms(false);
        toast.success("Account created successfully!");

        setTimeout(() => {
          router.push("/auth/signIn");
        }, 1000); 
      
      }
    } catch (error) {
      toast.error("Error creating account. Please try again.");
      console.error(error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-white px-4 md:px-0 w-full flex-col my-10">
  <div>
    <h1 className="text-3xl md:text-4xl text-green-800 my-5 text-center">Create Account</h1>
  </div>
  
  <div className="w-full md:w-1/2 px-2 md:px-0">          
    <form onSubmit={handleCreateAccount}>
      <div className="mb-4">
        <input
          type="text"
          value={fullName}
          placeholder="Full Name"
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-2 border border-green-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <div className="mb-4">
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-green-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <div className="mb-4">
        <div className="flex items-center">
          <span className="bg-green-200 border border-r-0 border-green-600 rounded-l-xl px-3 py-2 text-green-700">+91</span>
          <input
            type="tel"
            value={mobileNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                setMobileNumber(value);
              }
            }}
            placeholder="Mobile Number"
            className="w-full px-4 py-2 border border-l-0 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-green-500 border-green-600"
            maxLength={10}
            required
          />
        </div>
      </div>

      <div className="mb-4 relative">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 border-green-600"
          required
          placeholder="Password"
        />
        <div
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </div>
      </div>

      <div className="mb-4 relative">
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <div
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center text-gray-700">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mr-2"
            required
          />
          <Link href={"/termsAndConditions"}  className="text-green-700 hover:underline">
            I accept the terms & conditions
          </Link>
        </label>
      </div>

      <div className="w-full flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95, y: 1 }}
          type="submit"
          disabled={loading}
          className={`w-3/4 md:w-1/2 py-3 px-5 text-white font-semibold rounded-2xl transition-all duration-300 ${
            loading
            ? "bg-gradient-to-r from-gray-400 to-gray-500"
            : "bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 shadow-lg"
          } ${loading ? "cursor-not-allowed" : ""} shadow-lg shadow-green-400/50 active:shadow-md`}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </motion.button>
      </div>

      <div className="flex justify-between mt-4">
        <Link href={"/auth/signIn"} className="text-green-700">
          Already have an account? <span className="text-blue-500 hover:underline">Sign in</span>
        </Link>
      </div>
    </form>

    <div className="flex items-center justify-between mt-6">
      <span className="border-t border-gray-300 flex-grow"></span>
      <span className="mx-4 text-gray-600">Or</span>
      <span className="border-t border-gray-300 flex-grow"></span>
    </div>

    <div className="flex flex-col sm:flex-row sm:justify-around space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
  <button
    onClick={() => handleProviderSignIn("google")}
    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-lg bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-white transition-all transform hover:-translate-y-1 hover:shadow-xl active:shadow-md active:translate-y-0"
  >
    <Image src={googleIcon} alt="Google Icon" width={24} height={24} />
    <span className="ml-2 text-gray-700 font-medium">Sign in with Google</span>
  </button>
 
</div>


  </div>
</div>

  );
};

export default CreateAccountForm;