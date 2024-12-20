"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaRegHeart } from "react-icons/fa";
import Loader from '@/components/loader/loader';

const ProductCard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev < 100) return prev + 1;
                    clearInterval(interval);
                    return 100;
                });
            }, 30);
        }

        axios.get('/api/product/onSaleProducts')
            .then(response => {
                console.log(response.data.products)
                setProducts(response.data.products);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the product data!", error);
                setLoading(false);
            });
    }, [loading]);

    if (loading) {
        return (
            <Loader/>
        );
    }

    if (products.length === 0) {
        return <div>No products found.</div>;
    }
    const truncateText = (text, limit) => {
        return text.length > limit ? `${text.substring(0, limit)}...` : text;
      };

    const handleCardClick = (id) => {
        router.push(`/product/${id}`);
    };

    const handleWishlistClick = () => {
        router.push('/auth/signIn');
    };

    return (
<div className="flex flex-col mb-4 md:px-7 pt-5">
<h2 className="text-xl md:text-4xl mb-4 text-center font-bold text-red-500">Fresh Fruits</h2>
        <div className="flex gap-5 hover:cursor-pointer justify-start px-2 py-3 overflow-x-auto">
            <div className="flex gap-5">
                {products.map(product => {
                    const { _id, name, originalPrice, featuredImage, salePrice , weight } = product;
    
                    return (
                        <div
                            key={_id}
                            className="relative flex flex-col items-center w-52 h-80 border border-gray-200 rounded-lg shadow-sm p-4 cursor-pointer shrink-0"
                            onClick={() => handleCardClick(_id)}
                        >
                            {/* SALE Badge */}
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                SALE
                            </div>
    
                            {/* Time Estimate Badge */}
                            <div className="absolute top-2 left-2 bg-white text-gray-500 text-xs flex items-center gap-1 p-1 rounded">
                                <span>⏱ 6 mins</span>
                            </div>
    
                            {/* Product Image */}
                            <img
                                src={featuredImage}
                                alt={name}
                                className="w-full h-36 object-contain mb-3"
                            />
    
                            {/* Product Name */}
                            <h3 className="text-center font-semibold text-gray-800 text-sm mb-1">
                                {name}
                            </h3>
    
                            {/* Product Weight */}
                            <span className="text-gray-500 text-sm mb-3">
                                {weight.value} {weight.unit}
                            </span>
    
                            {/* Pricing and Add to Cart */}
                            <div className="flex justify-between items-center w-full mt-auto">
                                <div className='flex gap-1'>
                                    <span className="text-lg font-bold text-gray-400 line-through">
                                        ₹{originalPrice}
                                    </span>
                                    <span className="text-lg font-bold text-gray-800">
                                        ₹{salePrice}
                                    </span>
                                </div>
    
                                <button
                                    className="text-green-600 border border-green-600 rounded px-4 py-1 text-sm font-semibold hover:bg-green-100 transition"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Add to cart logic here
                                    }}
                                >
                                    ADD
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
    

    );
};

export default ProductCard;
