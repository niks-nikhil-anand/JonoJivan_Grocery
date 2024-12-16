"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const BlogFormComponent = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    featuredImage: '',
    subtitle: '',
    category: '',
    author: '',
  });
  const [loading, setLoading] = useState(false);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuillChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, featuredImage: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post('/api/admin/dashboard/blog', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Blog added successfully!');
      setFormData({
        title: '',
        content: '',
        featuredImage: '',
        subtitle: '',
        category: '',
        author: '',
      });
      setStep(1);
    } catch (error) {
      toast.error('Error adding blog');
    } finally {
      setLoading(false); // End loading state
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, x: '100vw' },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120 } },
    exit: { opacity: 0, x: '-100vw', transition: { ease: 'easeInOut' } },
  };

  return (
    <div className="max-w-full mx-auto p-4 bg-gray-100 shadow-lg rounded-lg w-full h-[80vh] overflow-y-scroll">
      <h1 className="text-2xl font-extrabold mb-8  text-blue-700 underline">Add Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          className="flex flex-col space-y-4"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {step === 1 && (
            <>
              <div className='flex flex-col gap-5'>
                <div>
                  <label className="block mb-2 text-gray-700 font-bold">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter the title"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block mb-3 text-gray-700 font-bold">Content</label>
                  <ReactQuill
                    value={formData.content}
                    onChange={handleQuillChange}
                    className="w-full h-80 rounded"
                  />
                </div>
                <div className='mt-5'>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full p-2 mt-6 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div>
                <label className="block mb-2 text-gray-700 font-bold">Featured Image</label>
                <input
                  type="file"
                  name="featuredImageFile"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700 font-bold">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="Enter the subtitle"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700 font-bold">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Enter the category"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700 font-bold">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter the author"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/2 p-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className={`w-1/2 p-2 ml-2 text-white ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default BlogFormComponent;
