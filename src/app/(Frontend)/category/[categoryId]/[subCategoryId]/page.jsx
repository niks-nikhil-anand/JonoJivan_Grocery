"use client";
import React, { useState, useEffect } from 'react';

const Page = () => {
  const [data, setData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error
  const [products, setProducts] = useState([]); // State to store product data
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state

  useEffect(() => {
    // Ensure this code runs only in the browser (client-side)
    if (typeof window !== "undefined") {
      const fetchData = async () => {
        try {
          const urlPath = window.location.pathname;
          // Split the URL and extract the category ID and subcategory ID
          const urlParts = urlPath.split('/');
          const categoryId = urlParts[2]; // Extract category ID
          const subcategoryId = urlParts[3]; // Extract subcategory ID

          // Check if both IDs exist, otherwise throw an error
          if (!categoryId || !subcategoryId) {
            throw new Error('Category ID or Subcategory ID is missing in the URL');
          }

          console.log('Category ID:', categoryId); // Debugging: log category ID
          console.log('Subcategory ID:', subcategoryId); // Debugging: log subcategory ID

          const response = await fetch(`/api/admin/dashboard/category/subCategory/${categoryId}/${subcategoryId}?page=${currentPage}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const result = await response.json();
          console.log('Fetched data:', result); // Debugging: log fetched data
          setData(result); // Store fetched data
          setProducts(result || []); // If products exist in the response, store them
          setTotalPages(result.totalPages); // Set the total number of pages
        } catch (error) {
          console.error('Error fetching data:', error); // Debugging: log any errors
          setError(error.message); // Set error message if fetch fails
        } finally {
          setLoading(false); // Set loading to false after fetch attempt
          console.log('Loading complete'); // Debugging: log when loading is finished
        }
      };

      fetchData(); // Call the fetchData function
    }
  }, [currentPage]); // Re-fetch when currentPage changes

  if (loading) {
    console.log('Loading data...'); // Debugging: log when still loading
    return <div>Loading...</div>; // Show loading indicator while data is being fetched
  }

  if (error) {
    console.log('Error occurred:', error); // Debugging: log error
    return <p>Error: {error}</p>; // Show error message if there is an error
  }

  console.log('Data loaded successfully:', data); // Debugging: log the data once it’s loaded

  const handleCardClick = (id) => {
    // Handle card click (you can add the logic for redirection or any other functionality)
    console.log(`Card with ID ${id} clicked`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // Change the page
    }
  };

  return (
    <div>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {products.length > 0 ? (
          products.map((product) => {
            const { _id, name, originalPrice, featuredImage, salePrice, weight } = product;

            return (
              <div
                key={_id}
                className="relative flex flex-col items-center border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer"
                onClick={() => handleCardClick(_id)}
              >
                {/* SALE Badge */}
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  SALE
                </div>

                {/* Time Estimate Badge */}
                <div className="absolute top-2 left-2 bg-white text-gray-500 text-xs flex items-center gap-1 p-1 rounded">
                  <span>⏱ 6 mins</span>
                </div>

                {/* Product Image */}
                <img
                  src={featuredImage}
                  alt={name}
                  className="w-full h-32 object-contain mb-3 rounded-md"
                />

                {/* Product Name */}
                <h3 className="text-center font-semibold text-gray-800 text-sm mb-2">
                  {name}
                </h3>

                {/* Product Weight */}
                <span className="text-gray-500 text-xs mb-3">
                  {weight.value} {weight.unit}
                </span>

                {/* Pricing and Add to Cart */}
                <div className="flex justify-between items-center w-full mt-auto">
                  <div className="flex gap-1">
                    <span className="text-sm font-bold text-gray-400 line-through">
                      ₹{originalPrice}
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      ₹{salePrice}
                    </span>
                  </div>

                  <button
                    className="text-green-600 border border-green-600 rounded px-3 py-1 text-xs font-semibold hover:bg-green-100 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart logic here
                    }}
                  >
                    ADD
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No products found</p> // Display if no products are available
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="flex items-center text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Page;
