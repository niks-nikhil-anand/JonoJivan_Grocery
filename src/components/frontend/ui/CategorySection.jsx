"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Loader from '@/components/loader/loader';
import { useRouter } from 'next/navigation';

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    axios
      .get('/api/admin/dashboard/category')
      .then((response) => {
        // Directly handle the array if the data is not nested
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error('Unexpected response format:', response);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader />; // Show loader while fetching
  }

  if (!categories.length) {
    return <p className="text-center">No categories available.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-2 p-4 sm:p-2  bg-gray-150">
  <h2 className="text-lg sm:text-xl md:text-3xl  font-bold text-red-600">
    Shop By Category
  </h2>
  <div className="flex gap-4 sm:gap-6 justify-center p-2 md:p-4 overflow-x-auto snap-x snap-mandatory flex-wrap">
    {categories.map((category) => (
      <motion.div
      key={category._id}
      className="flex-shrink-0 snap-center flex flex-col items-center w-32 h-40 sm:w-40 sm:h-48 md:w-52 md:h-64 bg-gradient-to-br from-gray-50 to-gray-200  shadow-lg hover:shadow-2xl transition-shadow duration-300 hover:scale-105 cursor-pointer transform border rounded-t-3xl rounded-xl"
      whileHover={{
        boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.3)",
      }}
      onClick={() => router.push(`/category/${category._id}`)}
    >
      {/* Circular Image Container */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center mb-4 shadow-md">
        <img
          src={category.image}
          alt={category.name}
          className="object-cover w-full h-full transition-transform duration-300 ease-in-out transform hover:scale-110"
          onError={(e) => (e.target.src = "/path/to/fallback-image.jpg")}
        />
      </div>
      {/* Category Name Below the Image */}
      <p className="text-center text-sm sm:text-md md:text-lg font-semibold text-gray-700 hover:text-red-500 transition-colors duration-300">
        {category.name}
      </p>
    </motion.div>
    
    ))}
  </div>
</div>

  );
};

export default CategoriesSection;
