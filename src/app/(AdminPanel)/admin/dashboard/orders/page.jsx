"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '@/components/loader/loader';
import { FaEye, FaPrint } from 'react-icons/fa'; // Importing the icons

const Products = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Items per page
  
    // Fetch orders from API
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const response = await axios.get('/api/admin/dashboard/orders/allOrders');
          if (Array.isArray(response.data)) {
            console.log(response.data);
            setOrders(response.data);
          } else {
            console.error('Unexpected response format:', response);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchOrders();
    }, []);
  
    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    // Loader or No Orders State
    if (loading) {
      return <Loader />; // Show loader while fetching
    }
  
    if (!orders.length) {
      return <p className="text-center text-gray-600">No orders available.</p>;
    }

    return (
      <div className="w-full p-4 pr-[5rem] bg-gray-100 shadow-lg rounded-lg h-[80vh]">
        {/* Wrapper with horizontal and vertical scrollbars */}
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <table className="border-collapse border border-gray-300 min-w-[1400px] text-sm">
            <thead>
              <tr className="bg-gray-200">
              <th className="border border-gray-300 px-2 py-1 text-left">Sl. No</th> 
                <th className="border border-gray-300 px-2 py-1 text-left">Order ID</th>
                <th className="border border-gray-300 px-2 py-1 text-left">Customer</th>
                <th className="border border-gray-300 px-2 py-1 text-left">Items</th>
                <th className="border border-gray-300 px-2 py-1 text-left">Total Amount</th>
                <th className="border border-gray-300 px-2 py-1 text-left">Payment Method</th>
                <th className="border border-gray-300 px-2 py-1 text-left">Payment Status</th>
                <th className="border border-gray-300 px-2 py-1 text-left">Order Status</th>
                <th className="border border-gray-300 px-2 py-1 text-left">Order Date</th>
                <th className="border border-gray-300 px-2 py-1 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-2 py-1">{index + 1}</td> {/* Sl. No */}
                  <td className="border border-gray-300 px-2 py-1 truncate">{order._id}</td>
                  <td className="border border-gray-300 px-2 py-1 truncate">
                    {order.user?.fullName || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 truncate">
                    <button
                      onClick={() => handleView(order.cart)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                    >
                      View
                    </button>
                  </td>
                  <td className="border border-gray-300 px-2 py-1">₹{order.totalAmount}</td>
                  <td className="border border-gray-300 px-2 py-1">{order.paymentMethod}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.paymentStatus === "Completed"
                          ? "bg-green-200 text-green-800"
                          : order.paymentStatus === "Pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.orderStatus === "Delivered"
                          ? "bg-green-200 text-green-800"
                          : order.orderStatus === "Processing"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                  {new Date(order.orderDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                    <div className="flex justify-center space-x-2">
                      {/* Eye Icon for View */}
                      <button
                        onClick={() => handleView(order._id)}
                        className="px-2 py-1 bg-black text-white rounded hover:bg-blue-600 text-xs"
                      >
                        <FaEye className="inline-block text-lg" />
                      </button>

                      {/* Print Invoice Icon */}
                      <button
                        onClick={() => handlePrintInvoice(order._id)}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                      >
                        <FaPrint className="inline-block text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    
        {/* Pagination controls */}
        <div className="mt-4 flex justify-center space-x-2">
          {[...Array(Math.ceil(orders.length / itemsPerPage)).keys()].map((number) => (
            <button
              key={number}
              className={`px-2 py-1 rounded-md text-xs ${
                currentPage === number + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => paginate(number + 1)}
            >
              {number + 1}
            </button>
          ))}
        </div>
    
       
      </div>
    );
};

export default Products;
