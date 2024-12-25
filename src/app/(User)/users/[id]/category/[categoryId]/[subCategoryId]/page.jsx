"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaRegHeart } from "react-icons/fa";

const Page = () => {
  const [data, setData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error
  const [products, setProducts] = useState([]); // State to store product data
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const [sortOption, setSortOption] = useState("priceAsc"); // Sorting option state
  const [filterPrice, setFilterPrice] = useState([0, 10000]); // Price range filter
  const router = useRouter();
  const [userId, setUserId] = useState(null);



   // Fetch user details
      useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await fetch("/api/users/userDetails/cookies");
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setUserId(data._id);
          } catch (error) {
            console.error("Failed to fetch user details:", error);
          }
        };
    
        fetchUser();
      }, []);
  



  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlPath = window.location.pathname;
        const urlParts = urlPath.split("/");

        // Extract category and subcategory from URL
        const categoryId = urlParts[urlParts.indexOf("category") + 1];
        const subcategoryId = urlParts[urlParts.indexOf("category") + 2];

        if (!categoryId || !subcategoryId) {
          throw new Error(
            "Category ID or Subcategory ID is missing in the URL"
          );
        }

        const response = await fetch(
          `/api/admin/dashboard/category/subCategory/${categoryId}/${subcategoryId}?page=${currentPage}&sort=${sortOption}&minPrice=${filterPrice[0]}&maxPrice=${filterPrice[1]}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const result = await response.json();
        setData(result);
        setProducts(result || []); // Populate products from the response
        console.log(result)
        setTotalPages(result.totalPages || 1); // Default to 1 page if not provided
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, sortOption, filterPrice]);

  const handleCardClick = (id) => {
    if (!userId) {
      alert("User information is still being fetched. Please try again in a moment.");
      return;
    }
    router.push(`/users/${userId}/product/${id}`);
  };
  

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
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

      {/* Sort Controls */}
      <div className="flex justify-between items-center mb-6">
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

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const {
            _id,
            name,
            featuredImage,
            salePrice,
            originalPrice,
            weight,
          } = product;

          return (
            <div
              key={_id}
              className="relative flex flex-col items-center border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow"
              onClick={() => handleCardClick(_id)}
            >
              {/* Wishlist Icon */}
              <button
                onClick={(e) => e.stopPropagation()} // Prevent propagation
                className="absolute top-2 right-2 text-red-500 hover:text-red-600"
              >
                <FaRegHeart size={18} />
              </button>

              {/* Product Image */}
              <img
                src={featuredImage}
                alt={name}
                className="w-28 h-28 object-contain mb-4"
              />

              {/* Product Info */}
              <h3 className="font-semibold text-gray-800 text-sm">{name}</h3>
              <span className="text-gray-500 text-xs">
                {weight?.value} {weight?.unit}
              </span>

              {/* Pricing */}
              <div className="flex gap-2 items-center">
                <span className="text-sm font-bold text-gray-400 line-through">
                  ₹{originalPrice}
                </span>
                <span className="text-sm font-bold text-gray-800">
                  ₹{salePrice}
                </span>
              </div>
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
