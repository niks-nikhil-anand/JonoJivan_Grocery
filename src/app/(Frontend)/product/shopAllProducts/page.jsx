"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loader from "@/components/loader/loader";
import Image from "next/image";
import { FaCartPlus } from "react-icons/fa";
import banner from '../../../../../public/frontend/Banner/AllProductPageBannerlg.jpg';
import { FaStar, FaLock } from "react-icons/fa";
import { useRouter } from 'next/navigation';



const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("best-selling");
  const [filters, setFilters] = useState({ availability: "", price: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const router = useRouter();


  // Fetch products whenever sort option, filters, or current page changes
  useEffect(() => {
    fetchProducts();
  }, [sortOption, filters, currentPage]);

  // Fetch products from the API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/dashboard/product/addProduct");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id) => {
    router.push(`/product/${id}`);
};

  // Handle sort change
  const handleSortChange = (e) => setSortOption(e.target.value);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Filter and sort products based on user selection
  const filteredProducts = products
    .filter((product) => {
      if (filters.availability && product.availability !== filters.availability)
        return false;
      if (filters.price && product.price !== filters.price) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "best-selling") return a.sales - b.sales;
      if (sortOption === "price-low-high") return a.price - b.price;
      if (sortOption === "price-high-low") return b.price - a.price;
      return 0;
    });

  // Display products for the current page
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Product card component
  const ProductCard = ({ product }) => {
    return (
      <motion.div
        className="relative flex-shrink-0 snap-center flex flex-col items-center justify-center bg-white rounded-xl p-6 border hover:shadow-lg transition-all duration-300 w-[80%] sm:w-[220px] md:w-[250px] lg:w-[280px] h-[250px] md:h-[300px] text-center group cursor-pointer"

        onClick={() => handleCardClick(product._id)}

      >
        {/* Product Image */}
        <div className="overflow-hidden h-[15rem] flex justify-center">
          <img
            src={product.featuredImage}
            alt={product.name}
            className="object-contain h-full w-full transition-transform duration-300 ease-in-out transform group-hover:scale-105"
          />
        </div>
  
        {/* Product Info */}
        <div className="text-center mt-4">
          <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
        </div>
         {/* Price Section */}
         <div className="flex items-center gap-2 mt-1">
              <span className="text-sm sm:text-base font-bold text-black">₹{product.salePrice}</span>
              <span className="text-xs sm:text-sm font-bold text-[#999999] line-through">
                ₹{product.originalPrice}
              </span>
            </div>
  
        {/* Rating and Lock Icon */}
        <div className="flex items-center justify-center mt-2">
          <div className="flex text-yellow-500 justify-between w-16">
            {[...Array(4)].map((_, i) => (
              <FaStar key={i} size={16} className="mr-1" />
            ))}
            <FaStar size={16} className="text-gray-400" />
          </div>
          <FaCartPlus size={20} className="ml-4 text-gray-500" />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="mb-5 mx-auto max-w-[100%]">
  {loading ? (
    <Loader />
  ) : (
    <>
      {/* Banner and Title */}
      <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] flex items-center">
        <Image 
          src={banner} 
          alt="Banner"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
          priority 
        />
      </div>

      {/* Sort By Dropdown */}
      <div className="flex flex-col sm:flex-row sm:justify-end px-4 sm:px-6 py-4">
        <label className="mb-2 sm:mb-0 sm:mr-2 text-lg font-medium text-gray-700">
          Sort By:
        </label>
        <select
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
          value={sortOption}
          onChange={handleSortChange}
        >
          <option value="best-selling">Best Selling</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
        </select>
      </div>


      {/* Filters and Product List */}
      <div className="flex flex-col gap-5 py-5">

        {/* Products Grid */}
        <motion.div
          className="flex flex-wrap gap-7 justify-center sm:justify-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product}     
            />
          ))}
        </motion.div>
      </div>

      {/* Pagination */}
      <motion.div className="mt-6 flex justify-center space-x-4">
        {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 rounded-md ${
              currentPage === index + 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </motion.div>
    </>
  )}
</div>

  );
};

export default AllProducts;
