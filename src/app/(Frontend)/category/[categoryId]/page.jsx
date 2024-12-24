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

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
    {/* Map through subcategories and display each as a card */}
    {data?.subcategories?.map((subcategory) => (
      <div
        key={subcategory._id}
        className="w-full flex items-center gap-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 cursor-pointer"
        onClick={() => router.push(`/category/${data._id}/${subcategory.name}`)} // Update the URL
      >
        {/* Subcategory Image */}
        <img
          src={subcategory.image}
          alt={subcategory.name}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-md"
        />
        {/* Subcategory Name */}
        <h2 className="text-base sm:text-lg md:text-xl font-medium text-red-500">
          {subcategory.name}
        </h2>
      </div>
    ))}
  </div>
</div>

      
      

    );
};

export default Page;
