"use client"
import Loader from '@/components/loader/loader';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


const Page = () => {
    const [data, setData] = useState(null); // State to store API response
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to handle error
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const urlPath = window.location.pathname;
                const id = urlPath.split('/')[2];

                const response = await fetch(`/api/admin/dashboard/category/subCategory/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false); 
            }
        };

        fetchData();
    }, []);

    if (loading) return <Loader />;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="flex flex-col items-center gap-6 p-4 md:p-6 my-8">
  {/* Display Category Name at the Top */}
  <h1 className="text-lg sm:text-xl md:text-4xl mb-4 font-bold text-red-500 underline">
    {data?.name || "Category"}
  </h1>

  <div className="flex gap-4 sm:gap-6 justify-center p-1 md:p-4 overflow-x-auto snap-x snap-mandatory flex-wrap">
    {/* Map through subcategories and display each as a card */}
    {data?.subcategories?.map((subcategory) => (
      <div
        key={subcategory._id}
        className="flex-shrink-0 snap-center flex flex-col items-center w-28 h-32 sm:w-32 sm:h-36 md:w-48 md:h-52 bg-gray-50 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300 cursor-pointer"
        onClick={() => router.push(`/category/${subcategory._id}/products`)}
      >
        {/* Subcategory Image */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gray-100 flex items-center justify-center shadow-md mb-2 sm:mb-3">
          <img
            src={subcategory.image}
            alt={subcategory.name}
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full"
          />
        </div>
        {/* Subcategory Name */}
        <h2 className="text-center text-sm sm:text-base md:text-lg font-medium text-red-500 mt-1 sm:mt-2 px-2">
          {subcategory.name}
        </h2>
      </div>
    ))}
  </div>
</div>

    );
};

export default Page;
