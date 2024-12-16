"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Loader from '@/components/loader/loader';
import waveSvg from '../../../../../public/frontend/SvgAssets/wave-white.svg';
import Image from 'next/image';
import DOMPurify from 'dompurify';

const Page = () => {
    const [data, setData] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching shipping and delivery policy data...");
                const response = await fetch(`/api/admin/dashboard/policy/shippingPolicy`);
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                console.log("Fetched data:", result); // Debugging API response
                
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error); // Debugging error
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-center text-red-500 text-lg p-4">Error: {error}</div>;
    }

    // Sanitize the HTML content before rendering
    const sanitizedContent = DOMPurify.sanitize(data?.content);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-white flex flex-col"
        >
            <div className='w-full bg-blue-500 h-[60vh] flex justify-center items-center relative'>
                <h1 className='text-white md:text-6xl text-3xl text-center'>Shipping and Delivery Policy</h1>
            </div>

            {/* Wave SVG */}
            <div className="relative w-full overflow-hidden md:-mt-[4rem] -mt-[1rem]">
                <Image 
                    src={waveSvg} 
                    alt="Wave"
                    layout="responsive"
                    objectFit="cover" 
                    className="w-full"
                    priority 
                />
            </div>

            {/* Content */}
            <div className="md:w-15/20 w-full px-4 md:px-12 mx-auto overflow-x-hidden">
                <div 
                    className="prose md:prose-base prose-sm max-w-none text-gray-800"
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
            </div>
        </motion.div>
    );
};

export default Page;
