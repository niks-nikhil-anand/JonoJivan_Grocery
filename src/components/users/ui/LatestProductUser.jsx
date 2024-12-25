"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaRegHeart } from "react-icons/fa";
import Image from 'next/image';
import Loader from '@/components/loader/loader';

const LatestProductUser = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [userId, setUserId] = useState(null);
  
  const router = useRouter();


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
    // Handle loading progress animation
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) return prev + 1;
          clearInterval(interval);
          return 100;
        });
      }, 30);
    }

    // Fetch products from the API
    axios
      .get("/api/product/onSaleProducts")
      .then((response) => {
        setProducts(response.data.products);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
        setLoading(false);
      });
  }, [loading]);

  if (loading) {
    return <Loader />;
  }

  if (products.length === 0) {
    return <div className="text-center py-6">No products found.</div>;
  }

  const truncateText = (text, limit) =>
    text.length > limit ? `${text.substring(0, limit)}...` : text;

    const handleCardClick = (id) => {
        router.push(`${userId}/product/${id}`);
    };

    const handleWishlistClick = () => {
        router.push('/auth/signIn');
    };

    const topProducts = products.slice(0, 10).reverse();


    return (
         <div className="flex flex-col mb-4 md:px-7 bg-gradient-to-b from-green-100 to-green-50 border-t-2 border-gray-50">
              {/* Section Title */}
              <h2 className="text-xl md:text-4xl mb-4 text-center font-bold text-red-500">
                Latest Products
              </h2>
        
              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 py-3">
          {topProducts.map((product) => {
            const { _id, name, originalPrice, featuredImage, salePrice, weight } = product;
        
            return (
              <div
              key={_id}
              className="relative flex flex-col items-center border border-gray-200 rounded-lg shadow-md  bg-white hover:shadow-lg transition-shadow w-full sm:w-[48%] md:w-full"
              onClick={() => handleCardClick(_id)}
            >
              {/* SALE Badge */}
              <div className="absolute top-2 right-2 text-white text-xs font-semibold px-3 py-1 rounded ">
                🕔
                </div>
        
            
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
                  {truncateText(name, 20)}
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
        
            </div>
    );
};

export default LatestProductUser;
