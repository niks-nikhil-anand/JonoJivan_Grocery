"use client";
import React, { useState, useEffect } from "react";
import { FaPrint, FaDownload } from "react-icons/fa";

const Page = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlPath = window.location.pathname;
        const id = urlPath.split("/").pop();

        const response = await fetch(`/api/admin/dashboard/orders/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
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


  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="p-4 border rounded-md shadow-sm bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Order Details</h2>
          <div className="flex space-x-4">
            {/* Print Button */}
            <button
              className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
              onClick={() => window.print()}
            >
              <FaPrint className="mr-2" />
              Print
            </button>

            {/* Download Invoice Button */}
            <button
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              onClick={() =>
                window.open(`/api/admin/dashboard/orders/${data.id}/download`, "_blank")
              }
            >
              <FaDownload className="mr-2" />
              Download Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Section */}
      <div className="mt-6 p-4 border rounded-md shadow-sm bg-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Information</h3>
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Order ID:</span> {data.orderStatus}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
