"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import AddSubCategory from '../addSubCategory/page';


const AddCategoryForm = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Show loading toast
    const loadingToast = toast.loading('Adding category...');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);

    try {
      const response = await axios.post('/api/admin/dashboard/category', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update loading toast to success
      toast.success('Category added successfully!', {
        id: loadingToast,
      });

      setName('');
      setImage(null);
    } catch (error) {
      // Update loading toast to error
      toast.error('Failed to add category.', {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="max-w-full mx-auto p-4 bg-gray-100 shadow-lg rounded-lg w-full h-[80vh] overflow-y-scroll">
         <div className="flex flex-col w-full justify-center items-center border-t-black-100 border-2 ">
      <div className="bg-white p-4  w-full mx-auto ">
  <h2 className="text-2xl font-extrabold mb-8 text-blue-700 underline">Add Categories</h2>
  <form className="space-y-6" onSubmit={handleSubmit}>
    <div className="flex flex-wrap gap-4">
      <div className="flex-1">
        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
          Category Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Enter category name"
          required
        />
      </div>

      <div className="flex-1">
        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="image">
          Category Image
        </label>
        <input
          type="file"
          id="image"
          onChange={(e) => setImage(e.target.files[0])}
          className="shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>
    </div>

    <div className="flex justify-end mt-4">
      <button
        type="submit"
        className={`bg-blue-500 hover:bg-blue-600 transition-colors duration-300 ease-in-out text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          loading && 'opacity-50 cursor-not-allowed'
        }`}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Category'}
      </button>
    </div>
  </form>
</div>
    </div>

<div className=' border-t-black-100 border-2'>
  <AddSubCategory/>
</div>
    </div>
   

    
    
  );
};

export default AddCategoryForm;
