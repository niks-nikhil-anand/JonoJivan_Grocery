"use client";
import Loader from '@/components/loader/loader';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
    const [data, setData] = useState(null); // State to store category data
    const [subCategoryData, setSubCategoryData] = useState([]); // State to store subcategory data
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to handle error
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const urlPath = window.location.pathname;
                const id = urlPath.split('/')[2];

                // Fetch category data
                const response = await fetch(`/api/admin/dashboard/category/${id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch category data: ${response.statusText}`);
                }
                const result = await response.json();
                console.log("Category Data:", result);
                setData(result);

                // Fetch subcategory data for each subcategory ID
                const subCategoryResponses = await Promise.all(
                    result.subcategory.map(async (subcategoryId) => {
                        try {
                            const subResponse = await fetch(`/api/admin/dashboard/subCatgeory/${subcategoryId}`);
                            if (!subResponse.ok) {
                                throw new Error(`Subcategory fetch failed: ${subResponse.statusText}`);
                            }
                            return await subResponse.json();
                        } catch (subError) {
                            console.error(`Error fetching subCategory ${subcategoryId}:`, subError);
                            return null;
                        }
                    })
                );

                // Filter out any null responses
                const validSubCategories = subCategoryResponses.filter((sub) => sub !== null);
                console.log("Subcategory Data:", validSubCategories);
                setSubCategoryData(validSubCategories);
            } catch (error) {
                console.error("Error:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Loader />;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="flex flex-col items-center gap-6 p-4 md:p-6 my-8">
            {/* Display Category Name at the Top */}
            <h1 className="text-lg sm:text-xl md:text-4xl mb-4 font-bold text-red-500 underline">
                {data?.name || "Category"}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {/* Map through subcategory data and display each as a card */}
                {subCategoryData.length > 0 ? (
                    subCategoryData.map((subcategory) => (
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
                    ))
                ) : (
                    <p className="text-gray-500">No subcategories available</p>
                )}
            </div>
        </div>
    );
};

export default Page;
