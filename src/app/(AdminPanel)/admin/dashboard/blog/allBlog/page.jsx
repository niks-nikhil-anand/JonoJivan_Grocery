"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { IoIosSearch, IoMdRefresh } from "react-icons/io";
import { FaNewspaper, FaEye, FaTrash } from "react-icons/fa";
import { format } from 'date-fns';

const NewsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1, limit: 10, total: 0, totalPages: 1
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination(prev => ({ ...prev, page: 1 })); 
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/dashboard/blog', {
        params: { page: pagination.page, limit: pagination.limit, search: debouncedSearch }
      });
      if (res.data.success) {
        setData(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, debouncedSearch]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleDelete = async (id) => {
      if(!window.confirm("Delete this blog post?")) return;
      try {
          await axios.delete(`/api/admin/dashboard/blog/${id}`);
          toast.success("Blog deleted");
          fetchData(); 
      } catch (error) {
          toast.error("Failed to delete");
      }
  };
  
  const handleView = async (id) => {
       try {
        const response = await axios.get(`/api/admin/dashboard/blog/${id}`);
        // Simple alert as per original code, or could be modal. Keeping simple.
        alert(`Blog Title: ${response.data.title}\n\nContent Preview: ${response.data.content?.substring(0, 100)}...`);
       } catch (error) {
           toast.error("Could not fetch details");
       }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50/50">
      <Toaster />
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaNewspaper className="text-pink-600" /> Blog Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage news and articles</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative">
                <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input 
                  type="text" 
                  placeholder="Search Blogs..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none w-full md:w-64" 
                />
             </div>
             <button onClick={fetchData} className="p-2 bg-white border rounded-lg hover:bg-gray-50 text-gray-600 shadow-sm">
                <IoMdRefresh className={`text-xl ${loading ? 'animate-spin' : ''}`} />
             </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Image</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Author</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                   [...Array(5)].map((_, i) => (
                     <tr key={i} className="animate-pulse">
                       <td className="px-6 py-4" colSpan="6"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                     </tr>
                   ))
                ) : data.length > 0 ? (
                  data.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                           <img src={blog.featuredImage} alt="" className="w-12 h-12 rounded-lg object-cover border" />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">{blog.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{blog.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{blog.author}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                         {blog.createdAt ? format(new Date(blog.createdAt), 'MMM dd, yyyy') : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex items-center justify-center gap-2">
                             <button onClick={() => handleView(blog._id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                                <FaEye />
                             </button>
                             <button onClick={() => handleDelete(blog._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <FaTrash />
                             </button>
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">No blogs found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!loading && data.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
               <span className="text-sm text-gray-600">Page {pagination.page} of {pagination.totalPages}</span>
               <div className="flex gap-2">
                  <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1} className="px-4 py-2 text-sm border rounded bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
                  <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} className="px-4 py-2 text-sm border rounded bg-white hover:bg-gray-50 disabled:opacity-50">Next</button>
               </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NewsPage;
