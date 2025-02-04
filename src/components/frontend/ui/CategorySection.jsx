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

  const bgColors = [
    "bg-red-100", "bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-purple-100", 
    "bg-pink-100", "bg-gray-100", "bg-indigo-100", "bg-teal-100", "bg-orange-100"
  ];

  return (
    <div className="flex flex-col items-center gap-2 p-4 sm:p-2  bg-gray-150">
  <h2 className="text-lg sm:text-xl md:text-3xl  font-bold text-red-600">
    Shop By Category
  </h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {categories.map((category, index) => (
        <motion.div
          key={category._id}
          className={`flex flex-col items-center p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer ${bgColors[index % bgColors.length]}`}
          whileHover={{ scale: 1.05 }}
          onClick={() => router.push(`/category/${category._id}`)}
        >
          {/* Image Container */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = "/path/to/fallback-image.jpg")}
            />
          </div>

          {/* Category Name */}
          <p className="mt-3 text-center text-sm sm:text-md md:text-lg font-semibold text-gray-800 hover:text-red-500 transition-colors duration-300">
            {category.name}
          </p>
        </motion.div>
      ))}
    </div>
</div>

  );
};

export default CategoriesSection;
