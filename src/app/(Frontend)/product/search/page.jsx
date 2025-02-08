"use client"; // Required for useSearchParams
import { motion } from 'framer-motion';
import { FaStar, FaCartPlus } from 'react-icons/fa';
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const SearchPage = () => {
  return (
    <Suspense fallback={<p className="text-center text-gray-500">Loading...</p>}>
      <SearchResults />
    </Suspense>
  );
};

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q"); // Get search query from URL
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetch(`/api/search?query=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Search results:", data);
          setResults(data || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="min-h-screen p-6">
      {loading ? (
        <p className="text-center text-gray-500">Loading results...</p>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No related products found</p>
      )}
    </div>
  );
};

const ProductCard = ({ product }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex flex-col items-center justify-center bg-white rounded-xl p-4 border hover:shadow-lg transition-all duration-300 w-full h-full cursor-pointer"
    >
      {/* Product Image */}
      <div className="overflow-hidden h-48 w-full flex justify-center mb-4">
        <img
          src={product.featuredImage}
          alt={product.name}
          className="object-contain h-full w-full transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </div>

      {/* Product Info */}
      <div className="text-center w-full">
        <h3 className="text-lg font-medium text-gray-900 truncate mb-2">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-base font-bold text-black">
            ₹{product.salePrice}
          </span>
          <span className="text-sm font-bold text-gray-400 line-through">
            ₹{product.originalPrice}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center">
          <div className="flex text-yellow-500">
            {[...Array(4)].map((_, i) => (
              <FaStar key={i} size={16} className="mr-1" />
            ))}
            <FaStar size={16} className="text-gray-300" />
          </div>
          <FaCartPlus size={20} className="ml-4 text-gray-600" />
        </div>
      </div>
    </motion.div>
  );
};

export default SearchPage;
