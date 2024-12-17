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
    <div className="w-full p-4 bg-gray-100 shadow-lg rounded-lg h-[80vh] overflow-hidden">
    {/* Horizontal & Vertical Scroll Wrapper */}
    <div className="overflow-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <table className="border-collapse border border-gray-300 min-w-[1000px] text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-2 py-1 text-left">Image</th>
            <th className="border border-gray-300 px-2 py-1 text-left">Name</th>
            <th className="border border-gray-300 px-2 py-1 text-left">SubCategories</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id} className="hover:bg-gray-100">
              {/* Category Image */}
              <td className="border border-gray-300 px-2 py-1">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-12 h-12 object-cover rounded"
                />
              </td>
  
              {/* Category Name */}
              <td className="border border-gray-300 px-2 py-1 truncate">
                {category.name}
              </td>
  
              {/* SubCategories */}
              <td className="border border-gray-300 px-2 py-1">
            {category.subcategories.length > 0 ? (
              <div className="flex overflow-auto whitespace-nowrap space-x-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {category.subcategories.map((sub) => (
                  <div key={sub._id} className="shrink-0">
                    <span className="bg-gray-200 px-3 py-1 rounded-md inline-block">
                      {sub.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span>No Subcategories</span>
            )}
          </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  
    {/* Pagination controls */}
    <div className="mt-4 flex justify-center space-x-2">
      {[...Array(Math.ceil(categories.length / itemsPerPage)).keys()].map((number) => (
        <button
          key={number}
          className={`px-2 py-1 rounded-md text-xs ${
            currentPage === number + 1
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
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
