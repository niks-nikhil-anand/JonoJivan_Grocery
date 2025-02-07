"use client";
import Loader from '@/components/loader/loader';
import React, { useEffect, useState } from 'react';
import { FaStar, FaCartPlus } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";

const Page = () => {
    const [data, setData] = useState(null);
    const [sub_subCategory, setSub_subCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const urlPath = window.location.pathname;
                const name = decodeURIComponent(urlPath.split('/')[4]);

                const response = await fetch(`/api/admin/dashboard/sub_subCategory?name=${name}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }
                const result = await response.json();
                console.log("Fetched Data:", result);
                setData(result.products);
                setSub_subCategory(result.subCategory);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCardClick = (id) => {
        router.push(`/product/${id}`);
    };

    if (loading) return <Loader />;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="flex flex-col items-center gap-6 p-4 md:p-6 my-8">
            <h1 className="text-lg sm:text-xl md:text-4xl mb-4 font-bold text-red-500 underline">
                {sub_subCategory?.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {data && data.length > 0 ? (
                    data.map((product) => (
                        <ProductCard 
                            key={product._id} 
                            product={product} 
                            handleCardClick={handleCardClick} 
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No Products available</p>
                )}
            </div>
        </div>
    );
};

const ProductCard = ({ product, handleCardClick }) => {
    return (
      <motion.div
        className="relative flex-shrink-0 snap-center flex flex-col items-center justify-center bg-gray-50 rounded-xl p-6 border hover:shadow-lg transition-all duration-300 w-[80%] sm:w-[220px] md:w-[250px] lg:w-[280px] h-[250px] md:h-[300px] text-center group cursor-pointer"
        onClick={() => handleCardClick(product._id)}
      >
        <div className="overflow-hidden h-[15rem] flex justify-center">
          <img
            src={product.featuredImage}
            alt={product.name}
            className="object-contain h-full w-full transition-transform duration-300 ease-in-out transform group-hover:scale-105"
          />
        </div>
  
        <div className="text-center mt-4">
          <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
        </div>

        <div className="flex items-center gap-2 mt-1">
            <span className="text-sm sm:text-base font-bold text-black">₹{product.salePrice}</span>
            <span className="text-xs sm:text-sm font-bold text-[#999999] line-through">
                ₹{product.originalPrice}
            </span>
        </div>
  
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

export default Page;
