"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { FaStar } from 'react-icons/fa';


const ReviewFormComponent = () => {
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 1,
    reviewTitle: '',
    review: '',
    product: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setFetchingProducts(true);
      try {
        const response = await axios.get('/api/admin/dashboard/product/addProduct');
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setFetchingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductSelect = (productId) => {
    setFormData({ ...formData, product: productId });
  };

  const handleRatingChange = (newRating) => {
    setFormData({ ...formData, rating: newRating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/admin/dashboard/review/addReview', formData);
      toast.success('Review submitted successfully!');
      setFormData({
        name: '',
        email: '',
        rating: 1,
        reviewTitle: '',
        review: '',
        product: '',
      });
    } catch (error) {
      toast.error('Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto p-4 bg-gray-100 shadow-lg rounded-lg w-full h-[80vh] overflow-y-scroll">
      <h1 className="text-2xl font-bold mb-6">Submit a Review</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-gray-700 font-bold">
              Name <span className="text-sm text-gray-500">(displayed publicly like John Smith)</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name (public)"
              className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-bold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email (private)"
              className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-bold">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={24}
                  onClick={() => handleRatingChange(star)}
                  color={star <= formData.rating ? "#ffc107" : "#e4e5e9"}
                  className="cursor-pointer"
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-bold">Review Title</label>
            <input
              type="text"
              name="reviewTitle"
              value={formData.reviewTitle}
              onChange={handleChange}
              placeholder="Give your review a title"
              className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-gray-700 font-bold">Review</label>
          <textarea
            name="review"
            value={formData.review}
            onChange={handleChange}
            placeholder="Write your comments here"
            className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
            rows="4"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-gray-700 font-bold">Product</label>
          {fetchingProducts ? (
            <p>Loading products...</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {products.map((product) => (
                <motion.button
                  key={product._id}
                  type="button"
                  onClick={() => handleProductSelect(product._id)}
                  className={`p-3 border rounded-lg ${
                    formData.product === product._id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  {product.name}
                </motion.button>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className={`w-full p-2 mt-6 text-white ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ReviewFormComponent;
