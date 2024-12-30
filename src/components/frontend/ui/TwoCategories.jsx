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
    const fetchData = async () => {
      try {
        const homecareResponse = await axios.get("/api/product/homecare");
        const kitchenwareResponse = await axios.get("/api/product/kitchenWare");

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
    e.stopPropagation();
    router.push("/auth/signIn");
  };

  const renderProductCard = (product) => {
    const { _id, name, originalPrice, featuredImage, salePrice } = product;

    return (
      <div
        key={_id}
        className="flex items-center border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow cursor-pointer p-4"
        onClick={() => handleCardClick(_id)}
      >
        <img
          src={featuredImage}
          alt={name}
          className="w-24 h-24 object-contain rounded-lg mr-4"
        />
        <div className="flex flex-col flex-grow">
          <h3 className="font-semibold text-gray-800 text-lg mb-2">
            {truncateText(name, 30)}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <span className="text-sm font-bold text-gray-400 line-through">
                ₹{originalPrice}
              </span>
              <span className="text-sm font-bold text-gray-800">₹{salePrice}</span>
            </div>
            <button
              className="text-green-600 border border-green-600 rounded px-3 py-1 text-xs font-semibold hover:bg-green-100 transition"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              ADD
            </button>
          </div>
        </div>
        <button
          onClick={handleWishlistClick}
          className="ml-4 text-red-500 hover:text-red-600"
        >
          <FaRegHeart size={18} />
        </button>
      </div>
    );
  };

  return (
    <div className="py-4 bg-gray-150">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <div>
          <h2 className="text-xl md:text-4xl mb-4 text-center font-bold text-red-500">
            Home Care
          </h2>
          <div className="space-y-4">
            {homecareProducts.slice(0, 8).map(renderProductCard)}
          </div>
        </div>
        <div>
          <h2 className="text-xl md:text-4xl mb-4 text-center font-bold text-red-500">
            Kitchenware
          </h2>
          <div className="space-y-4">
            {kitchenwareProducts.slice(0, 8).map(renderProductCard)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoCategories;
