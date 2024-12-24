"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Loader from '@/components/loader/loader';

const Products = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Items per page
    const [selectedAddress, setSelectedAddress] = useState(null); // Declare state for selected address

  
    // Fetch orders from API
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const response = await axios.get('/api/admin/dashboard/orders/allOrders');
          if (Array.isArray(response.data)) {
            console.log(response.data)
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

     // Close Modal/Box
  const closeModal = () => {
    setSelectedAddress(null);
  };


  return (
    <div className="w-full p-4 pr-[5rem] bg-gray-100 shadow-lg rounded-lg h-[80vh]">
  {/* Wrapper with horizontal and vertical scrollbars */}
  <div className="overflow-x-auto overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
    <table className="border-collapse border border-gray-300 min-w-[1400px] text-sm">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-300 px-2 py-1 text-left">Order ID</th>
          <th className="border border-gray-300 px-2 py-1 text-left">User</th>
          <th className="border border-gray-300 px-2 py-1 text-left">Cart</th>
          <th className="border border-gray-300 px-2 py-1 text-left">Total Amount</th>
          <th className="border border-gray-300 px-2 py-1 text-left">Address</th>
          <th className="border border-gray-300 px-2 py-1 text-left">Payment Method</th>
          <th className="border border-gray-300 px-2 py-1 text-left">Payment Status</th>
          <th className="border border-gray-300 px-2 py-1 text-left">Order Status</th>
          <th className="border border-gray-300 px-2 py-1 text-left">Order Date</th>
          <th className="border border-gray-300 px-2 py-1 text-left">Delivery Date</th>
          <th className="border border-gray-300 px-2 py-1 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentOrders.map((order) => (
          <tr key={order._id} className="hover:bg-gray-100">
            <td className="border border-gray-300 px-2 py-1 truncate">{order._id}</td>
            <td className="border border-gray-300 px-2 py-1 truncate">
              {order.user?.fullName || "N/A"}
            </td>
            <td className="border border-gray-300 px-2 py-1 truncate">{order.cart?.name || "N/A"}</td>
            <td className="border border-gray-300 px-2 py-1">₹{order.totalAmount}</td>
            <td className="border border-gray-300 px-2 py-1 truncate">
             <button
                    onClick={() => handleView(order.address)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                  >
                    View
                  </button>
            </td>
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
              {new Date(order.orderDate).toLocaleDateString()}
            </td>
            <td className="border border-gray-300 px-2 py-1">
              {order.deliveryDate
                ? new Date(order.deliveryDate).toLocaleDateString()
                : "N/A"}
            </td>
            <td className="border border-gray-300 px-2 py-1 text-center">
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handleView(order._id)}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(order._id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                >
                  Delete
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

   {/* Modal for Address */}
      {selectedAddress && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg w-[300px]">
            <h2 className="text-lg font-semibold mb-2">Address Details</h2>
            <p>First Name: {selectedAddress.firstName}</p>
            <p>Last Name: {selectedAddress.lastName}</p>
            <p>Address: {selectedAddress.address}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}


</div>
  );
};

export default Products;
