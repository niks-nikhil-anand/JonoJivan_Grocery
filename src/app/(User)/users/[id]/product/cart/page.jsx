
"use client";
import Image from "next/image";
import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Loader from '@/components/loader/loader';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : null;

  useEffect(() => {
    const fetchCartAndProducts = async () => {
      if (userId) {
        setLoading(true);
        try {
          const cartResponse = await axios.get(`/api/users/cart/${userId}`);
          const fetchedCart = cartResponse.data.items || [];
          setCart(fetchedCart);

          const productDetails = await Promise.all(
            fetchedCart.map(async (item) => {
              const response = await axios.get(`/api/admin/dashboard/product/${item.productId}`);
              return { ...response.data, quantity: item.quantity || 1 };
            })
          );
          setProducts(productDetails);
        } catch (error) {
          console.error('Error fetching cart or product details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCartAndProducts();
  }, [userId]);

  const updateCartAPI = async (updatedCart) => {
    try {
      const formattedCart = updatedCart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      await axios.put(`/api/users/cart/${userId}`, { items: formattedCart });
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const incrementQuantity = async (productId) => {
    const updatedProducts = products.map((product) => (
      product._id === productId ? { ...product, quantity: product.quantity + 1 } : product
    ));
    setProducts(updatedProducts);

    const updatedCart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    );
    setCart(updatedCart);
    await updateCartAPI(updatedCart);
  };

  const decrementQuantity = async (productId) => {
    const updatedProducts = products.map((product) =>
      product._id === productId && product.quantity > 1 ? { ...product, quantity: product.quantity - 1 } : product
    );
    setProducts(updatedProducts);

    const updatedCart = cart.map((item) =>
      item.productId === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
    await updateCartAPI(updatedCart);
  };

  const totalPriceForProduct = (product) => (product.salePrice * product.quantity).toFixed(2);

  const estimatedTotal = () => (
    products.reduce((total, product) => total + (product.salePrice * product.quantity), 0).toFixed(2)
  );

  const removeItem = async (productId) => {
    try {
      await axios.delete(`/api/users/cart/${productId}`);
      const updatedProducts = products.filter((product) => product._id !== productId);
      setProducts(updatedProducts);

      const updatedCart = cart.filter((item) => item.productId !== productId);
      setCart(updatedCart);
      await updateCartAPI(updatedCart);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen shadow-lg border-b-black-100 border p-4">
      <div className="flex flex-col md:flex-row items-center w-full">
        <h1 className="text-2xl md:text-5xl font-semibold text-orange-600 mb-2 md:mb-4">Your Cart</h1>
        <Link href={"/"}>
          <h1 className="text-sm md:text-xl font-semibold text-blue-500 mb-2 md:mb-4 underline ml-0 md:ml-5 mt-1 md:mt-3 hover:cursor-pointer hover:underline-offset-1">Continue Shopping</h1>
        </Link>
      </div>

      <div className="w-full p-2 md:p-4 bg-white">
        {loading ? (
          <Loader />
        ) : products.length > 0 ? (
          <>
            <table className="w-full table-auto border-collapse text-xs md:text-base">
              <thead>
                <tr>
                  <th className="px-2 md:px-4 py-2 text-left">Product</th>
                  <th className="px-2 md:px-4 py-2 text-center hidden md:table-cell">Quantity</th>
                  <th className="px-2 md:px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b">
                    <td className="flex items-center py-2">
                      <Image width={64} height={64} sizes="(max-width: 768px) 48px, 64px"
                        src={product.featuredImage}
                        alt={product.name}
                        className="w-12 md:w-16 h-12 md:h-16 object-cover mr-2 md:mr-4 rounded-lg hover:cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <h2 className="text-xs md:text-lg hover:cursor-pointer hover:underline">{product.name}</h2>
                        <div className="flex gap-2 md:gap-3">
                          <p className="text-gray-500 text-xs md:text-sm">
                            ₹<span className="line-through">{product.originalPrice}</span>
                          </p>
                          <p className="text-black text-sm md:text-lg">₹{product.salePrice}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-center hidden md:table-cell">
                      <div className="flex items-center justify-center">
                        <button
                          className="px-2 py-1 text-gray-600 border border-gray-300 rounded-l hover:bg-gray-200"
                          onClick={() => decrementQuantity(product._id)}
                        >
                          -
                        </button>
                        <span className="px-2 md:px-4 py-2">{product.quantity}</span>
                        <button
                          className="px-2 py-1 text-gray-600 border border-gray-300 rounded-r hover:bg-gray-200"
                          onClick={() => incrementQuantity(product._id)}
                        >
                          +
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 ml-2 md:ml-4"
                          onClick={() => removeItem(product._id)}
                        >
                          <FaTrashAlt size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="text-right text-xs md:text-lg font-medium">
                      ₹{totalPriceForProduct(product)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-right">
              <p className="text-base md:text-lg font-semibold">
                <span className='text-[#D07021]'>Estimated total:</span> <span className="pl-3">₹{estimatedTotal()}</span>
              </p>
              <p className="text-xs md:text-sm font-semibold">
                Taxes, discounts, and shipping calculated at checkout
              </p>
              <Link href={"cart/information"}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-3 bg-[#6a0dad] text-white rounded-full shadow-lg hover:bg-[#4b0082] transition text-sm md:text-base mt-4">
                  Proceed to Checkout
                </motion.button>
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-lg font-semibold">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
