"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Loader from '@/components/loader/loader';
import { useRouter } from 'next/navigation';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import {  AiOutlineClose } from 'react-icons/ai';
import ReviewProductPage from '@/components/frontend/ui/ReviewProductPage';



const ProductDetail = () => {
  // Main hooks and setup
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [idFromURL, setIdFromURL] = useState('');
  const [userIdFromURL, setUserIdFromUR] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);



  useEffect(() => {
      const urlPath = window.location.pathname;
      const userId = urlPath.split('/')[2];
      const productId = urlPath.split('/')[4];
      setIdFromURL(productId);
      setUserIdFromUR(userId);

      if (productId) {
          const interval = setInterval(() => {
              setProgress((prev) => (prev < 100 ? prev + 1 : prev));
          }, 10);

          axios.get(`/api/admin/dashboard/product/${productId}`)
              .then((response) => {
                  clearInterval(interval);
                  setProduct(response.data);
                  setLoading(false);
              })
              .catch((error) => {
                  console.error("Error fetching product data:", error);
                  clearInterval(interval);
                  setLoading(false);
              });
      }
  }, []);
  const handleAddToCart = async () => {
      const cartData = {
          id: idFromURL,
          quantity: quantity,
      };

      try {
          await axios.post(`/api/users/cart/${idFromURL}`, {
              cart: [cartData],
          });

          setAddedToCart(true);
          router.push(`/users/${userIdFromURL}/product/cart`);
      } catch (error) {
          console.error("Error syncing cart with the backend:", error);
      }
  };



  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const increaseQuantity = () => setQuantity((prevQuantity) => prevQuantity + 1);
  const decreaseQuantity = () => setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  const toggleOpen = () => setIsOpen(!isOpen);

  if (loading) {
      return <Loader />;
  }

  const { name, description, images, salePrice, originalPrice, featuredImage, ratings, descriptionImage, servingPerBottle, suggestedUse, ingredients, productHighlights } = product || {};
  const averageRating = ratings?.average || 4.2;
  const allImages = [...(images || [])];

  const currentImage = images[currentImageIndex];
  const discountPercentage = Math.round(
    ((product.originalPrice - product.salePrice) / product.originalPrice) * 100
  );

  return (
    <div>
    <div className="flex flex-col lg:flex-row p-6 bg-gray-100 w-full h-full  gap-6">
{/* Product Images */}
<div className="w-full lg:w-1/3 flex flex-col items-center gap-4">
  {/* Main Product Image */}
  <div className="w-full h-[18rem] lg:h-[28rem] bg-white flex justify-center items-center rounded-lg border shadow-md">
    <img
      src={currentImage}
      alt={name}
      className="object-contain w-full h-full cursor-pointer"
      onClick={toggleFullScreen}
    />
  </div>

  {/* Thumbnails */}
  <div className="flex flex-wrap gap-2">
    {images.map((image, index) => (
      <div
        key={index}
        className={`w-16 h-16 border rounded-md p-1 bg-white shadow-sm ${
          currentImageIndex === index ? 'border-purple-600' : ''
        }`}
      >
        <img
          src={image}
          alt={`Thumbnail ${index + 1}`}
          className="w-full h-full object-contain cursor-pointer"
          onClick={() => setCurrentImageIndex(index)}
        />
      </div>
    ))}
  </div>
</div>

{/* Product Details */}
<div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-lg flex flex-col gap-6">
  {/* Title and Availability */}
  <div className="flex justify-between items-center">
    <h1 className="text-xl lg:text-2xl font-bold text-gray-800">{name}</h1>
    <span className="text-green-600 font-medium">
    {product.stock > 0 ? "In Stock" : "Out of Stock"}
    </span>
  </div>

  {/* Ratings */}
  <div className="flex items-center">
    <span className="text-yellow-400 text-lg">★ ★ ★ ★ ★</span>
    
  </div>

  {/* Price */}
  <div className="flex items-center gap-4">
      <h2 className="text-2xl lg:text-3xl font-bold text-purple-600">
        ₹{salePrice.toLocaleString('en-IN')}
      </h2>
      <span className="line-through text-gray-400 text-lg">
        ₹{originalPrice.toLocaleString('en-IN')}
      </span>
      <span className="text-sm text-green-500">
        {discountPercentage}% Off
      </span>
    </div>


  

  {/* Quantity Selector */}
  <div className="flex items-center gap-4">
    <span className="font-medium text-gray-600">Quantity:</span>
    <div className="flex items-center border rounded-full px-3 py-2 bg-gray-100">
      <button
        className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-full"
        onClick={decreaseQuantity}
      >
        -
      </button>
      <input
        type="number"
        className="w-10 text-center bg-transparent border-none focus:outline-none text-gray-800"
        value={quantity}
        readOnly
      />
      <button
        className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-full"
        onClick={increaseQuantity}
      >
        +
      </button>
    </div>
  </div>

  {/* Add to Cart Button */}
  <div>
    <button
      className="w-full bg-purple-600 text-white py-3 rounded-full shadow-md hover:bg-purple-700 transition"
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  </div>

  <div className="flex items-center gap-2">
      <span className="font-medium">Weight:</span>
      <span className="text-gray-600">{product.weight.value}{product.weight.unit}</span>
    </div>

  {/* Additional Info */}
  <div className="text-gray-700 space-y-2" style={{ height: '300px', overflowY: 'auto' }}>
<p 
  className="prose prose-sm md:prose-lg mx-auto text-sm" 
  dangerouslySetInnerHTML={{ __html: description }}
/>
</div>
</div>
</div>

<div>


</div>


{/* Review Section */}
<div className=" p-6 bg-gray-100 w-full h-full">
  <ReviewProductPage />
</div>








        {isFullScreen && (
      <motion.div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="relative bg-white p-2 rounded-lg" style={{ width: '80vw', height: '80vh' }}>
          <img src={currentImage} alt="Full Size Product" className="object-contain w-full h-full" />
          <AiOutlineClose className="absolute top-2 right-2 text-2xl text-gray-600 cursor-pointer" onClick={toggleFullScreen} />
          
          {/* Navigation Controls */}
          <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4">
            <button onClick={prevImage} className="text-black text-2xl">
              <AiOutlineLeft />
            </button>
            <button onClick={nextImage} className="text-black text-2xl">
              <AiOutlineRight />
            </button>
          </div>
        </div>
      </motion.div>
    )}
    </div>
);
};





export default ProductDetail;



