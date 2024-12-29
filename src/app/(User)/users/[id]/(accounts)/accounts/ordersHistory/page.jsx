"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '@/components/loader/loader';

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // To store error message if any

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const urlPath = window.location.pathname;
      const userId = urlPath.split('/')[2]; // Get userId from URL path
  
      try {
        // Fetch the order history for the specific user
        const response = await axios.get(`/api/users/accounts/${userId}/orderHistory`);
        const orders = response.data;
  
        if (orders.length === 0) {
          console.log("No orders found");
          setOrderHistory([]);
        } else {
          console.log("Fetching cart details for each order...");
  
          // Fetch details for each order
          const ordersWithDetails = await Promise.all(
            orders.map(async (order) => {
              // Fetch the cart for each order using the cartId
              const cartResponse = await axios.get(`/api/users/cart/cartId/${order.cart}`);
              // const fetchedCart = cartResponse.data.items || [];
              const fetchedCart = cartResponse.data.cart.items || [];
              console.log(`Cart  ${order.cart}:`, fetchedCart);
  
              // Fetch each product's details in the cart
              const productDetails = await Promise.all(
                fetchedCart.map(async (item) => {
                  const productResponse = await axios.get(`/api/admin/dashboard/product/${item.productId}`);
                  return { ...productResponse.data, quantity: item.quantity || 1 };
                })
              );
  
              // Return the order with the cart items and product details
              return { ...order, cartItems: productDetails };
            })
          );
  
          // Set the order history with cart items and product details
          setOrderHistory(ordersWithDetails);
        }
      } catch (error) {
        console.error("Error fetching order history:", error);
        setError("Failed to load order history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    // Initiate the order history fetch
    fetchOrderHistory();
  }, []);
  
  
  
  
  

  // Show loading spinner if data is being fetched
  if (loading) return <div><Loader /></div>;

  // Show error message if fetching fails
  if (error) return <div className="text-red-500">{error}</div>;

  return (
   <div className="p-4">
  <h2 className="text-2xl font-semibold mb-4">Order History</h2>
  {orderHistory.length === 0 ? (
    <p>No orders found.</p>
  ) : (
    orderHistory.map((order) => {
      // Remove duplicate items by using a map to store unique products based on _id
      const uniqueItems = order.cartItems.reduce((acc, item) => {
        if (!acc.some((i) => i._id === item._id)) {
          acc.push(item);
        }
        return acc;
      }, []);

      return (
        <div key={order._id} className="bg-white p-4 shadow mb-4 rounded">
          <div className="flex items-center space-x-4">
            <img
              src={order.cartItems[0]?.featuredImage} // Placeholder in case no image
              alt="Product"
              className="w-24 h-24 object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold">
                Order Date: {new Date(order.orderDate).toLocaleDateString()}
              </h3>
              <p>Payment Method: {order.paymentMethod}</p>
              <p>
                Order Status:{" "}
                <span className={`font-semibold ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </p>
            </div>
          </div>

          {/* Horizontal line for order status */}
          <div className="mt-2">
            <hr className={`my-2 ${order.orderStatus === 'Completed' ? 'border-4 border-black' : 'border-gray-300'}`} />
          </div>

          <div className="mt-4">
            <h4 className="text-lg font-medium">Items:</h4>
            <ul className="list-disc list-inside">
              {uniqueItems.map((item) => (
                <li key={item._id}>
                  {item.name} - {item.quantity}
                </li>
              ))}
            </ul>
          </div>

          {/* Show total price */}
          <div className="mt-4">
            <h4 className="text-lg font-medium">
              Total Price: ${uniqueItems.reduce((total, item) => total + item.salePrice * item.quantity, 0).toFixed(2)}
            </h4>
          </div>
        </div>
      );
    })
  )}
</div>

  );
};

// Function to get color based on order status
const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'text-yellow-500';
    case 'Processing': return 'text-blue-500';
    case 'Shipped': return 'text-purple-500';
    case 'Delivered': return 'text-green-500';
    case 'Cancelled': return 'text-red-500';
    case 'Completed': return 'text-gray-800'; // You can set this to a specific color as needed
    default: return 'text-gray-500';
  }
};

export default OrderHistory;
