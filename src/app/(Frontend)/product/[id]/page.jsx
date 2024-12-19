"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Loader from '@/components/loader/loader';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { FaRegArrowAltCircleRight , FaRegArrowAltCircleLeft  } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useRouter } from 'next/navigation';
import ReviewProductPage from '@/components/frontend/ui/ReviewProductPage';





const ProductDetail = () => {
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [idFromURL, setIdFromURL] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);



    useEffect(() => {
        const urlPath = window.location.pathname;
        const id = urlPath.substring(urlPath.lastIndexOf('/') + 1);
        setIdFromURL(id);

        if (id) {
            const interval = setInterval(() => {
                setProgress(prev => (prev < 100 ? prev + 1 : prev));
            }, 10); 

            axios.get(`/api/admin/dashboard/product/${id}`)
                .then(response => {
                    clearInterval(interval);
                    setProduct(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching product data:", error);
                    clearInterval(interval);
                    setLoading(false);
                });
        }
    }, []);

    if (loading) {
        return (
            <Loader/>
        );
    }

    const handleAddToCart = () => {
      const cartData = {
        id: idFromURL,
        quantity: quantity
      };
    
      // Retrieve the existing cart from localStorage
      let existingCart = localStorage.getItem('cart');
    
      try {
        // Parse the cart if it exists and is valid JSON, otherwise initialize an empty array
        existingCart = existingCart ? JSON.parse(existingCart) : [];
      } catch (e) {
        // If parsing fails, initialize as an empty array
        existingCart = [];
      }
    
      // Ensure existingCart is an array
      if (!Array.isArray(existingCart)) {
        existingCart = [];
      }
    
      // Check if the product is already in the cart
      const existingProductIndex = existingCart.findIndex((item) => item.id === idFromURL);
    
      if (existingProductIndex !== -1) {
        // If the product is already in the cart, update its quantity
        existingCart[existingProductIndex].quantity += quantity;
      } else {
        // If the product is not in the cart, add it
        existingCart.push(cartData);
      }
    
      // Update the cart in localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));
    
      // Navigate to the cart page
      setAddedToCart(true);
      router.push("/product/cart")
    };

    
    
    
    const increaseQuantity = () => {
      setQuantity(prevQuantity => prevQuantity + 1);
    };
    
    const decreaseQuantity = () => {
      setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
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


    const toggleOpen = () => {
      setIsOpen(!isOpen);
    };

    if (!product) {
        return <div>Product not found.</div>;
    }
    const { name, description, images, salePrice, originalPrice, featuredImage, ratings} = product;
    const averageRating = ratings?.average || 4.2;
    const allImages = [ ...(images || [])];


    const currentImage = images[currentImageIndex];


    

    return (
      <div>
      <motion.div 
            className="flex flex-col lg:flex-row  p-4 sm:p-6 bg-[#e0d2ff] w-full h-full mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
>
      {/* Product Images */}
      <div className="w-full md:w-[49%] h-full flex flex-col items-center ">
        {/* Preview Image */}
        <div className="w-full md:w-[30rem] h-[20rem] md:h-[40rem] flex justify-center items-center overflow-hidden mb-4  rounded-lg relative">
          <img
            src={currentImage}
            alt={name}
            className="object-contain w-full h-full cursor-pointer"
            
            onClick={toggleFullScreen} // Open full-screen on click
            
          />
        </div>

        {/* Manual Image Slider Controls */}
                  <div className="flex justify-between w-full md:hidden absolute top-1/2 transform -translate-y-1/2 left-0 right-0">
          <button onClick={prevImage} className="p-2 rounded-l text-black text-2xl">
            <FaRegArrowAltCircleLeft />
          </button>
          <button onClick={nextImage} className="p-2 rounded-l text-black text-2xl">
            <FaRegArrowAltCircleRight />
          </button>
        </div>


        {/* Thumbnail Images (Optional) */}
        <div className="md:flex gap-2 overflow-x-auto w-full hidden">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div key={index} className="w-[5rem] h-[5rem] sm:w-[6rem] sm:h-[6rem] overflow-hidden rounded-lg shadow-lg cursor-pointer">
                <img
                  src={image}
                  alt={`Product Image ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                  onClick={() => setCurrentImageIndex(index)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-5 flex items-center justify-center text-gray-500">
              No images available
            </div>
          )}
        </div>
      </div>


{/* Product Details */}
<div className="w-full max-w-lg md:max-w-xl lg:max-w-xl bg-white rounded-3xl px-6 sm:px-10 py-10 ">
<motion.div 
  className="flex flex-col justify-start mb-2"
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <motion.h1 
    className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4"
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    {name}
  </motion.h1>

  <div className="flex items-center mb-2  bg-white rounded-3xl">
    <span className="text-green-500 text-lg font-bold">★ ★ ★ ★ ★</span>
    <span className="text-gray-500 ml-2">{ratings.numberOfRatings} Reviews</span>
  </div>
  <h1 className="text-2xl sm:text-3xl font-bold mb-4">
    ₹{salePrice || originalPrice}
  </h1>

  <div className="flex flex-col sm:flex-row justify-start  gap-4 mb-4">
    <span className="text-gray-700">Quantity</span>
    <div className="flex items-center border rounded-3xl py-3 px-5 w-full sm:w-1/4 justify-between">
      <button className="px-3 py-1" onClick={decreaseQuantity}>-</button>
      <input type="number" className="w-12 text-center" value={quantity} readOnly />
      <button className="px-3 py-1" onClick={increaseQuantity}>+</button>
    </div>
  </div>

  
</motion.div>

{/* Action Buttons */}
<motion.div 
  className="flex flex-col gap-4 w-full"
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <motion.button 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="px-4 py-3 bg-[#6a0dad] text-white rounded-full shadow-lg hover:bg-[#4b0082] transition text-sm sm:text-base"
    onClick={handleAddToCart} 
  >
    {addedToCart ? 'Go to Cart' : 'Add to Cart'}
  </motion.button>
</motion.div>
</div>

</motion.div>
<div>
{product && product.productHighlights && (
<ProductHighlights highlights={product.productHighlights} />
)}

</div>


<div className="flex flex-col md:flex-row items-center p-4 md:p-8 border-t-2 border-gray-300 bg-[#e0d2ff]">
  <div className="flex w-full flex-col md:flex-row justify-between">
    {/* Image Section */}
    <div className="w-full md:w-1/2 mb-6 md:mb-0 md:mr-8">
      <Image
        src={featuredImage}
        alt="Banner Image"
        className="w-full h-[20rem] md:h-[30rem] object-cover rounded-xl"
        width={500}
        height={300}
      />
    </div>

    {/* Text Section */}
    <div className="flex flex-col justify-start w-full md:w-1/2">
      <h1 className="text-xl md:text-3xl lg:text-4xl text-[#D07021] mb-4">
        {name}
      </h1>
      <p className="text-black-100 text-base md:text-lg lg:text-xl leading-relaxed">
        {description}
      </p>
    </div>
  </div>
</div>

{/* Review Section */}
<div className=" md:mt-0 p-4 md:p-8 border-t-2 border-gray-300 bg-[#e0d2ff]">
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


// Place these components outside of ProductDetail to avoid conditional rendering issues
const ProductHighlights = ({ highlights }) => (
<div className="flex flex-col items-center justify-center min-h-[75vh] bg-white p-6 sm:p-10">
  <motion.h2
    className="text-xl sm:text-2xl font-semibold text-orange-600 mb-6 sm:mb-8"
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    Product Highlights
  </motion.h2>
  <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-10">
    {highlights.map((highlight, index) => (
      <motion.div
        key={highlight.id}
        className="flex flex-col items-center max-w-[90%] sm:max-w-xs text-center mt-4 sm:mt-5"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
      >
        <img
          src={highlight.icon}
          alt={highlight.icon}
          className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-3 sm:mb-4 rounded-full"
        />
        <h3 className="text-base sm:text-lg font-bold text-orange-600 mb-1 sm:mb-2">
          {highlight.title}
        </h3>
        <p className="text-sm sm:text-base text-gray-600">{highlight.description}</p>
      </motion.div>
    ))}
  </div>
</div>
);

const FeaturedIngredients = ({ ingredients }) => (
<div className="p-6 sm:p-10 bg-white">
  <h2 className="text-center text-2xl sm:text-3xl font-semibold text-orange-600 mb-6 sm:mb-10">
    Featured Ingredients
  </h2>
  <div className="flex justify-center items-start flex-wrap gap-5 sm:space-x-5">
    {ingredients.map((ingredient, index) => (
      <motion.div
        key={index}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-green-100 rounded-xl p-4 sm:p-6 shadow-md w-full sm:w-[45%] lg:w-[20%] mt-5"
      >
        <img
          src={ingredient.image}
          alt={ingredient.name}
          className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-3 sm:mb-4 rounded-full"
        />
        <h3 className="text-orange-600 text-center font-semibold text-base sm:text-lg mb-1 sm:mb-2">
          {ingredient.name}
        </h3>
        <p className="text-center text-sm sm:text-base text-gray-700 mb-2">
          {ingredient.description}
        </p>
        <p className="text-center font-semibold text-gray-800">
          {ingredient.weightInGram}mg
        </p>
      </motion.div>
    ))}
  </div>
</div>
);


export default ProductDetail;



