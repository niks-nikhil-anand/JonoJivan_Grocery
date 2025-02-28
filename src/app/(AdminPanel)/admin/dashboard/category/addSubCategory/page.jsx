"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddSubCategory = () => {
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setFetchingCategories(true);
      try {
        const response = await axios.get('/api/admin/dashboard/category');
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
      } finally {
        setFetchingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  

  // Handle form submission for adding sub-subcategory
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !image || !selectedCategory ) {
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    formData.append('category', selectedCategory);

    try {
      await axios.post('/api/admin/dashboard/subCatgeory', formData);
      toast.success('Sub-subcategory added successfully!');
      setName('');
      setImage(null);
    } catch (error) {
      console.error('Error adding sub-subcategory:', error);
      toast.error('Failed to add sub-subcategory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 w-full mx-auto h-[80vh] overflow-y-scroll">
      <h2 className="text-2xl font-extrabold mb-8 text-purple-600 underline">Add  SubCategories</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          {/* Category Selection */}
          <div>
            <label className="block text-blue-600 font-bold mb-3">Category</label>
            {fetchingCategories ? (
              <p>Loading categories...</p>
            ) : (
              <div className="h-32 border border-gray-300 overflow-y-scroll p-2 rounded-lg">
                {categories.map((category) => (
                  <motion.button
                    key={category._id}
                    type="button"
                    onClick={() => setSelectedCategory(category._id)}
                    className={`p-2 border rounded-lg mb-2 mx-2 ${
                      selectedCategory === category._id
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.name}
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Sub-SubCategory Form */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                SubCategory Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="shadow border rounded-lg w-full py-3 px-4"
                placeholder="Enter name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="image">
                Sub-SubCategory Image
              </label>
              <input
                type="file"
                id="image"
                onChange={(e) => setImage(e.target.files[0])}
                className="shadow border rounded-lg w-full py-3 px-4"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className={`bg-blue-500 text-white font-bold py-3 px-6 rounded-lg ${
                loading && 'opacity-50 cursor-not-allowed'
              }`}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Sub-SubCategory'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddSubCategory;
