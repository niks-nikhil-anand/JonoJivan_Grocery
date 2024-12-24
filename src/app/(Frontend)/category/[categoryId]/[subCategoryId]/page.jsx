"use client";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FaRegHeart } from "react-icons/fa";


const Page = () => {
  const [data, setData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error
  const [products, setProducts] = useState([]); // State to store product data
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const [sortOption, setSortOption] = useState('priceAsc'); // Sorting option state
  const [filterPrice, setFilterPrice] = useState([0, 10000]); // Price range filter
  const router = useRouter();


  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchData = async () => {
        try {
          const urlPath = window.location.pathname;
          const urlParts = urlPath.split('/');
          const categoryId = urlParts[2];
          const subcategoryId = urlParts[3];

          if (!categoryId || !subcategoryId) {
            throw new Error('Category ID or Subcategory ID is missing in the URL');
          }

          const response = await fetch(`/api/admin/dashboard/category/subCategory/${categoryId}/${subcategoryId}?page=${currentPage}&sort=${sortOption}&minPrice=${filterPrice[0]}&maxPrice=${filterPrice[1]}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const result = await response.json();
          setData(result);
          setProducts(result || []);
          setTotalPages(result.totalPages);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [currentPage, sortOption, filterPrice]);

  const handleCardClick = (id) => {
    router.push(`/product/${id}`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleFilterPriceChange = (e) => {
    setFilterPrice([e[0], e[1]]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Products</h1>

      {/* Sort and Filter Controls */}
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <div className="flex gap-4">
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="border px-4 py-2 rounded-md"
          >
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="nameAsc">Name: A to Z</option>
            <option value="nameDesc">Name: Z to A</option>
          </select>
        </div>
        
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
       {products.map((product) => {
           const { _id, name, originalPrice, featuredImage, salePrice, weight } = product;
       
           return (
             <div
             key={_id}
             className="relative flex flex-col items-center border border-gray-200 rounded-lg shadow-md  bg-white hover:shadow-lg transition-shadow w-full sm:w-[48%] md:w-full"
             onClick={() => handleCardClick(_id)}
           >
       
           
             {/* Wishlist Icon */}
             <button
               onClick={(e) => {
                 e.stopPropagation();
                 handleWishlistClick();
               }}
               className="absolute top-2 left-2 text-red-500 hover:text-red-600"
             >
               <FaRegHeart size={18} />
             </button>
           
             {/* Product Image */}
               
               <div className="flex px-5">
                 <div>
                 <img
               src={featuredImage}
               alt={name}
               className="w-28 h-28 object-contain flex-shrink-0 mb-4"
             />
                 </div>
       
                 <div className="flex flex-col  items-center text-center w-full pt-5 pl-5">
               
               {/* Product Name */}
               <h3 className="font-semibold text-gray-800 text-sm mb-2">
                 {name}
               </h3>
           
               {/* Product Weight */}
               <span className="text-gray-500 text-xs mb-3">
                 {weight.value} {weight.unit}
               </span>
           
               {/* Pricing */}
               <div className="flex gap-2 items-center justify-center mb-1">
                 <span className="text-sm font-bold text-gray-400 line-through">
                   ₹{originalPrice}
                 </span>
                 <span className="text-sm font-bold text-gray-800">
                   ₹{salePrice}
                 </span>
               </div>
             </div>
               </div>
           
             {/* Product Details */}
             
           </div>
           
           );
         })}
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
