"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { IoIosSearch, IoMdRefresh } from "react-icons/io";
import { FaBoxOpen, FaEye, FaTrash } from "react-icons/fa";
import { motion } from 'framer-motion';

const ProductsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1, limit: 10, total: 0, totalPages: 1
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

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
      const res = await axios.get('/api/admin/dashboard/product/addProduct', {
        params: { page: pagination.page, limit: pagination.limit, search: debouncedSearch }
      });
      if (res.data.success) {
        setData(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      toast.error("Failed to load products");
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

  const handleToggle = async (productId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const response = await axios.patch(`/api/admin/dashboard/product/${productId}`, {
        status: newStatus,
      });
  
      if (response.status === 200) {
        setData((prev) =>
          prev.map((product) =>
            product._id === productId ? { ...product, status: newStatus } : product
          )
        );
        toast.success(`Updated to ${newStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const response = await fetch(`/api/admin/dashboard/product/${productToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Product deleted");
        fetchData();
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
       toast.error("Delete error");
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const truncateName = (name, wordLimit = 4) => {
    if(!name) return "";
    const words = name.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : name;
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50/50">
      <Toaster />
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaBoxOpen className="text-orange-600" /> Product Inventory
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage store products and stock</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative">
                <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input 
                  type="text" 
                  placeholder="Search Products..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none w-full md:w-64" 
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
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">On Sale</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                   [...Array(5)].map((_, i) => (
                     <tr key={i} className="animate-pulse">
                       <td className="px-6 py-4" colSpan="7"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                     </tr>
                   ))
                ) : data.length > 0 ? (
                  data.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <img src={product.featuredImage} alt="" className="w-10 h-10 rounded-lg object-cover border" />
                           <span className="font-medium text-gray-800 text-sm truncate max-w-[150px]" title={product.name}>{truncateName(product.name)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category?.name || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                            <span className="font-bold text-gray-900">₹{product.salePrice}</span>
                            {product.originalPrice > product.salePrice && (
                                <span className="text-xs text-gray-400 line-through ml-1">₹{product.originalPrice}</span>
                            )}
                        </div>
                      </td>
                       <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                      <td className="px-6 py-4 text-center">
                         {product.isOnSale ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Yes</span>
                         ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">No</span>
                         )}
                      </td>
                      <td className="px-6 py-4 text-center">
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={product.status === "active"} 
                                onChange={() => handleToggle(product._id, product.status)}
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                         </label>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex items-center justify-center gap-2">
                             <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                                <FaEye />
                             </button>
                             <button onClick={() => { setProductToDelete(product._id); setShowDeleteModal(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <FaTrash />
                             </button>
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No products found.</td></tr>
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

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Product?</h3>
              <p className="text-gray-500 mb-6">Are you sure? This action cannot be undone.</p>
              <div className="flex justify-center gap-3">
                  <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                  <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
              </div>
           </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default ProductsPage;
