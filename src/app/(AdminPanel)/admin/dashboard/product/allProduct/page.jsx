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
          console.log(response)
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
    <div className="w-full p-4 pr-[5rem] bg-gray-100 shadow-lg rounded-lg h-[80vh] ">
  {/* Wrapper with horizontal and vertical scrollbars */}
  <div className="overflow-x-auto overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
    <table className="border-collapse border border-gray-300 min-w-[1400px] text-sm">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-300 px-2 py-1 text-left">Featured Image</th>
          <th className="border border-gray-300 px-2 py-1 text-left">Name</th>
          <th className="border border-gray-300 px-2 py-1 text-left">Stock</th>
          <th className="border border-gray-300 px-2 py-1 text-left">Weight</th>
          <th className="border border-gray-300 px-2 py-1 text-left">Category</th>
          <th className="border border-gray-300 px-2 py-1 text-left">SubCategory</th>
          <th className="border border-gray-300 px-2 py-1 text-left">Vendor</th>
          <th className="border border-gray-300 px-2 py-1 text-left">Price</th>
          <th className="border border-gray-300 px-2 py-1 text-left">On Sale</th>
          <th className="border border-gray-300 px-2 py-1 text-left">Status</th>
          <th className="border border-gray-300 px-2 py-1 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentProducts.map((product) => (
          <tr key={product._id} className="hover:bg-gray-100">
            <td className="border border-gray-300 px-2 py-1 text-center flex justify-center">
              <img
                src={product.featuredImage}
                alt={product.name}
                className="w-12 h-12 object-cover rounded-2xl"
              />
            </td>
            <td className="border border-gray-300 px-2 py-1 truncate">{product.name}</td>
            <td className="border border-gray-300 px-2 py-1 text-center">{product.stock}</td>
            <td className="border border-gray-300 px-2 py-1">
              {product.weight.value} {product.weight.unit}
            </td>
            <td className="border border-gray-300 px-2 py-1 truncate">{product.category?.name}</td>
            <td className="border border-gray-300 px-2 py-1 truncate">
            {product.subCategory?.name || "N/A"}
            </td>
            <td className="border border-gray-300 px-2 py-1 truncate">
          {product.users && product.users.length > 0
            ? `${product.users[0].fullName} (${product.users[0].role})`
            : "N/A"}
        </td>

            
            <td className="border border-gray-300 px-2 py-1">
              ₹{product.salePrice}
              <span className="line-through text-gray-500 ml-1">₹{product.originalPrice}</span>
            </td>
            <td className="border border-gray-300 px-2 py-1 text-center">
              {product.isOnSale ? (
                <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs">
                  Yes
                </span>
              ) : (
                <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs">
                  No
                </span>
              )}
            </td>
            <td className="border border-gray-300 px-2 py-1 text-center">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  product.status === "active"
                    ? "bg-green-200 text-green-800"
                    : product.status === "inactive"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {product.status}
              </span>
            </td>
            <td className="border border-gray-300 px-2 py-1 text-center">
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handleView(product._id)}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Pagination controls */}
  <div className="mt-4 flex justify-center space-x-2">
    {[...Array(Math.ceil(products.length / itemsPerPage)).keys()].map((number) => (
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

export default Products;
