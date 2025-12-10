"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { IoIosSearch, IoMdRefresh, IoMdClose } from "react-icons/io";
import { FaUser, FaEye, FaTrash } from "react-icons/fa";
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const UsersPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1, limit: 10, total: 0, totalPages: 1
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

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
      const res = await axios.get('/api/admin/dashboard/users/allUsers', {
        params: { page: pagination.page, limit: pagination.limit, search: debouncedSearch }
      });
      if (res.data.success) {
        setData(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      toast.error("Failed to load users");
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

  const handleView = (user) => {
      setSelectedUser(user);
      setIsViewOpen(true);
  };

  const handleDelete = async (id) => {
      if(!window.confirm("Are you sure you want to delete this user?")) return;
      try {
          // Assuming a delete route exists or implementing later. 
          // For now, let's try the common REST pattern or just warn.
          // Note: The original file did NOT have working delete logic.
          const res = await axios.delete(`/api/admin/dashboard/users/${id}`); 
          if(res.data.success) {
            toast.success("User deleted");
            fetchData();
          }
      } catch (error) {
        // If 404/method not allowed, we know the API is missing
        console.error(error);
        toast.error("Delete operation not supported yet");
      }
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaUser className="text-blue-600" /> Users Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">View and manage registered users</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative">
                <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input 
                  type="text" 
                  placeholder="Search Users..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64" 
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
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Address</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                   [...Array(5)].map((_, i) => (
                     <tr key={i} className="animate-pulse">
                       <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                       <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                       <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
                       <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                       <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                       <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                       <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-16"></div></td>
                     </tr>
                   ))
                ) : data.length > 0 ? (
                  data.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{user.fullName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div>{user.email}</div>
                        <div className="text-xs text-gray-400">{user.mobileNumber}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{user.address || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">{user.role || 'User'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {user.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                         {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex items-center justify-center gap-2">
                             <button onClick={() => handleView(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                                <FaEye />
                             </button>
                             <button onClick={() => handleDelete(user._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <FaTrash />
                             </button>
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No users found.</td></tr>
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

        {/* View Modal */}
         <AnimatePresence>
            {isViewOpen && selectedUser && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                    >
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">User Details</h2>
                            <button onClick={() => setIsViewOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl"><IoMdClose /></button>
                        </div>
                        <div className="p-6 space-y-4">
                             <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl text-blue-600 font-bold">
                                    {selectedUser.fullName?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">{selectedUser.fullName}</h3>
                                    <p className="text-gray-500 text-sm">{selectedUser.email}</p>
                                </div>
                             </div>
                             
                             <InfoRow label="Mobile" value={selectedUser.mobileNumber} />
                             <InfoRow label="Role" value={selectedUser.role} />
                             <InfoRow label="Status" value={selectedUser.status} />
                             <InfoRow label="Address" value={selectedUser.address} />
                             <InfoRow label="Joined" value={selectedUser.createdAt ? format(new Date(selectedUser.createdAt), 'PPpp') : '-'} />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between border-b border-gray-100 py-2 last:border-0">
        <span className="text-gray-500 text-sm">{label}</span>
        <span className="font-medium text-gray-800 text-sm text-right max-w-[60%]">{value || '-'}</span>
    </div>
);

export default UsersPage;
