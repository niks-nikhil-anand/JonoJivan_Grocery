"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { IoIosSearch, IoMdRefresh } from "react-icons/io";
import { FaIdCard } from "react-icons/fa";
import { format } from 'date-fns';

const rationCardsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/rationCard', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: debouncedSearch
        }
      });
      if (res.data.success) {
        setData(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      toast.error("Failed to load applications");
      console.error(error);
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

  return (
    <div className="p-6 min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaIdCard className="text-green-600" /> Ration Card Applications
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage and view all ration card requests</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative">
                <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input 
                  type="text" 
                  placeholder="Search by Name, Aadhaar..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none w-full md:w-64" 
                />
             </div>
             <button 
               onClick={fetchData} 
               className="p-2 bg-white border rounded-lg hover:bg-gray-50 text-gray-600 shadow-sm"
               title="Refresh"
             >
                <IoMdRefresh className={`text-xl ${loading ? 'animate-spin' : ''}`} />
             </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Unique ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Applicant</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Documents</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                   // Skeleton Loading
                   [...Array(5)].map((_, i) => (
                     <tr key={i} className="animate-pulse">
                       <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                       <td className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-gray-100 rounded w-24"></div>
                       </td>
                       <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                       <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
                       <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                       <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-16"></div></td>
                     </tr>
                   ))
                ) : data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {item.uniqueNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           {item.profilePicture ? (
                             <img src={item.profilePicture} alt="" className="w-8 h-8 rounded-full object-cover border" />
                           ) : (
                             <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                               {item.name?.charAt(0)}
                             </div>
                           )}
                           <div>
                              <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                              <p className="text-xs text-gray-500">S/O {item.fatherName}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          <p>{item.whatsappNo}</p>
                          <p className="text-xs text-gray-400">{item.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="space-y-1">
                            <p className="text-xs"><span className="font-medium text-gray-500">Aadhaar:</span> {item.aadhaarCardNumber}</p>
                            <p className="text-xs"><span className="font-medium text-gray-500">PAN:</span> {item.panCardNumber}</p>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {item.createdAt ? format(new Date(item.createdAt), 'MMM dd, yyyy') : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                         <button className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline">
                            View Details
                         </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                       No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!loading && data.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
               <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
               </span>
               <div className="flex gap-2">
                  <button 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 text-sm border rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 text-sm border rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default rationCardsPage;
