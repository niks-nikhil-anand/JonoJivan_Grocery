import Loader from '@/components/loader/loader';
import { useRouter, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaStar, FaCartPlus } from 'react-icons/fa';

const RelatedProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id: productId } = useParams();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/admin/dashboard/product/relatedProduct/${productId}`);
        setProducts(response.data.slice(0, 4)); // Show only 4 products
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchRelatedProducts();
  }, [productId]);

  const handleCardClick = (id) => {
    router.push(`/product/${id}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-3 py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-8 text-center text-gray-800">
        Related Products
      </h1>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onClick={() => handleCardClick(product._id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No related products found</p>
      )}
    </div>
  );
};

const ProductCard = ({ product, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex flex-col items-center justify-center bg-white rounded-xl p-4 border hover:shadow-lg transition-all duration-300 w-full h-full cursor-pointer"
      onClick={onClick}
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

export default RelatedProducts;