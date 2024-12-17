"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Loader from '@/components/loader/loader';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage] = useState(10); 

  // Fetch categories from API
  useEffect(() => {
    axios
      .get('/api/admin/dashboard/category')
      .then((response) => {
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <Loader />; // Show loader while fetching
  }

  if (!categories.length) {
    return <p className="text-center">No categories available.</p>;
  }

  return (
<div className="flex flex-col items-center gap-4 p-6 md:p-10 w-full h-screen ">
  {/* Category Cards Container with Fixed Height and Scrollbar */}
  <div className="flex gap-4 sm:gap-6 justify-center p-4 md:p-6 overflow-y-auto flex-wrap w-full h-[85vh] md:h-[75vh]">
    {categories.map((category) => (
      <motion.div
        key={category._id}
        className="flex-shrink-0 flex flex-col items-center w-24 h-24 sm:w-32 sm:h-40 md:w-44 md:h-52 rounded-lg hover:shadow-lg transition-shadow duration-300 bg-gray-100 relative"
      >
        {/* Circular Image Container */}
        <div className="w-14 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center mt-2 mb-2">
          <img
            src={category.image}
            alt={category.name}
            className="object-cover w-full h-full transition-transform duration-300 ease-in-out transform hover:scale-105"
            onError={(e) => (e.target.src = '/path/to/fallback-image.jpg')}
          />
        </div>

        {/* Category Name and Icons */}
        <p className="text-center text-xs sm:text-sm md:text-md font-medium text-red-500 mt-1 sm:mt-2">
          {category.name}
        </p>
        <div className="flex absolute bottom-2 justify-between w-full gap-2 ">
          <button className="text-blue-500 hover:text-blue-600 transition duration-200">
            <FaEdit className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </button>
          <button className="text-red-500 hover:text-red-600 transition duration-200">
            <FaTrashAlt className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          </button>
        </div>
      </motion.div>
    ))}
  </div>

  {/* Pagination controls */}
  <div className="mt-6 flex justify-center space-x-3">
    {[...Array(Math.ceil(categories.length / itemsPerPage)).keys()].map((number) => (
      <button
        key={number}
        className={`px-2 py-1 rounded-md ${
          currentPage === number + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'
        }`}
        onClick={() => paginate(number + 1)}
      >
        {number + 1}
      </button>
    ))}
  </div>
</div>


  );
};

export default Categories;
