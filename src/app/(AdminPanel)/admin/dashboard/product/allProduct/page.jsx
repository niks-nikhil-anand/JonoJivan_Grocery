"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Loader from '@/components/loader/loader';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); 

  // Fetch products from API
  useEffect(() => {
    axios
      .get('/api/admin/dashboard/product/addProduct')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error('Unexpected response format:', response);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <Loader />; // Show loader while fetching
  }

  if (!products.length) {
    return <p className="text-center">No products available.</p>;
  }

  const truncateName = (name, wordLimit = 4) => {
    const words = name.split(' ');
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(' ') + '...'
      : name;
  };

  return (
    <div className='max-w-full mx-auto p-4 bg-gray-100 shadow-lg rounded-lg w-full h-[80vh] overflow-y-scroll'>
  {/* Display products in a table */}
  <table className="w-full border-collapse border border-gray-300">
    <thead>
      <tr className="bg-gray-200">
        <th className="border border-gray-300 px-4 py-2 text-left">Image</th>
        <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
        <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
        <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {currentProducts.map((product) => (
        <tr key={product._id} className="hover:bg-gray-100">
          <td className="border border-gray-300 px-4 py-2">
            <img
              src={product.featuredImage}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-md"
              onError={(e) => (e.target.src = '/path/to/fallback-image.jpg')} // Fallback image
            />
          </td>
          <td className="border border-gray-300 px-4 py-2">
            {truncateName(product.name)}
          </td>
          <td className="border border-gray-300 px-4 py-2 text-green-500 font-bold">
            ${product.salePrice}
          </td>
          <td className="border border-gray-300 px-4 py-2 text-center">
            <button
              onClick={() => handleView(product._id)}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
            >
              View
            </button>
            <button
              onClick={() => handleDelete(product._id)}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Pagination controls */}
  <div className="mt-8 flex justify-center space-x-4">
    {[...Array(Math.ceil(products.length / itemsPerPage)).keys()].map((number) => (
      <button
        key={number}
        className={`px-3 py-1 rounded-md ${
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

export default Products;
