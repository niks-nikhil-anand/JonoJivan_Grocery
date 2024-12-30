"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaRegHeart } from "react-icons/fa";
import Loader from "@/components/loader/loader";

const TwoCategories = () => {
  const [homecareProducts, setHomecareProducts] = useState([]);
  const [kitchenwareProducts, setKitchenwareProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch products from the APIs
    const fetchData = async () => {
      try {
        const homecareResponse = await axios.get("/api/product/homecare");
        const kitchenwareResponse = await axios.get("/api/product/kitchenWare");

        // Check if the responses contain products
        if (homecareResponse.data && homecareResponse.data.products) {
          setHomecareProducts(homecareResponse.data.products);
        } else {
          setError("No Home Care products found.");
        }

        if (kitchenwareResponse.data && kitchenwareResponse.data.products) {
          setKitchenwareProducts(kitchenwareResponse.data.products);
        } else {
          setError("No Kitchenware products found.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setError("Failed to fetch products.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>;
  }

  if (homecareProducts.length === 0 && kitchenwareProducts.length === 0) {
    return <div className="text-center py-6">No products found.</div>;
  }

  const truncateText = (text, limit) =>
    text.length > limit ? `${text.substring(0, limit)}...` : text;

  const handleCardClick = (id) => {
    router.push(`/product/${id}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation(); // Prevent triggering card click event
    router.push("/auth/signIn");
  };

  const renderProductCard = (product) => {
    const { _id, name, originalPrice, featuredImage, salePrice, weight } = product;

    return (
      <div
        key={_id}
        className="relative flex flex-col items-center border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow cursor-pointer h-[250px] w-[180px]"
        onClick={() => handleCardClick(_id)}
      >
        {/* SALE Badge */}
        <div className="absolute top-2 right-2 text-white bg-red-500 text-xs font-semibold px-3 py-1 rounded">
          SALE
        </div>

        {/* Wishlist Icon */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 left-2 text-red-500 hover:text-red-600"
        >
          <FaRegHeart size={18} />
        </button>

        {/* Product Image */}
        <img
          src={featuredImage}
          alt={name}
          className="w-28 h-28 object-contain mb-4"
        />

        {/* Product Details */}
        <div className="flex flex-col items-center text-center w-full px-4">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-800 text-sm mb-2">
            {truncateText(name, 20)}
          </h3>

          {/* Product Weight */}
          <span className="text-gray-500 text-xs mb-3">
            {weight?.value} {weight?.unit}
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
        <button
          className="text-green-600 border border-green-600 rounded px-3 py-1 text-xs font-semibold hover:bg-green-100 transition absolute bottom-2 right-3"
          onClick={(e) => {
            e.stopPropagation();
            // Add to cart logic here
          }}
        >
          ADD
        </button>
      </div>
    );
  };

  return (
    <div className="py-4 md:px-7 bg-gray-150">
      {/* Section Title for Homecare */}
      <h2 className="text-xl md:text-4xl mb-4 text-center font-bold text-red-500">
        Home Care
      </h2>

      {/* Homecare Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-4 py-3">
        {homecareProducts.slice(0, 8).map(renderProductCard)}
      </div>

      {/* Section Title for Kitchenware */}
      <h2 className="text-xl md:text-4xl mb-4 text-center font-bold text-red-500 mt-8">
        Kitchenware
      </h2>

      {/* Kitchenware Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-4 py-3">
        {kitchenwareProducts.slice(0, 8).map(renderProductCard)}
      </div>
    </div>
  );
};

export default TwoCategories;
