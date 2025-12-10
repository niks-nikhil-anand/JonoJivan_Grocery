"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { IoIosSearch, IoMdRefresh, IoMdClose } from "react-icons/io";
import { FaShoppingCart, FaEye, FaPrint, FaTimes } from "react-icons/fa";
import { format } from 'date-fns';
import { useRouter } from "next/navigation";
import GenrerateInvoice from "@/components/adminPanel/ui/GenrerateInvoice";

const OrdersPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1, limit: 10, total: 0, totalPages: 1
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  
  const router = useRouter();

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
      const res = await axios.get('/api/admin/dashboard/orders/allOrders', {
        params: { page: pagination.page, limit: pagination.limit, search: debouncedSearch }
      });
      if (res.data.success) {
        setData(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      toast.error("Failed to load orders");
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
  
  const handleOpenInvoice = (id) => {
      setSelectedOrderId(id);
      setIsInvoiceOpen(true);
  };
  
  const handleNavigate = (id) => {
      router.push(`orders/${id}`);
  };

  const getStatusColor = (status) => {
     switch(status) {
         case 'Delivered': return 'bg-green-100 text-green-700';
         case 'Processing': return 'bg-yellow-100 text-yellow-700';
         case 'Pending': return 'bg-orange-100 text-orange-700';
         case 'Cancelled': return 'bg-red-100 text-red-700';
         default: return 'bg-gray-100 text-gray-700';
     }
  };
  
  const getPaymentColor = (status) => {
      return status === 'Completed' ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaShoppingCart className="text-purple-600" /> Orders Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">Track and manage customer orders</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative">
                <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input 
                  type="text" 
                  placeholder="Search Invoice, Status..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none w-full md:w-64" 
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
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Sl. No</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Invoice No.</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Total Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Payment</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                   [...Array(5)].map((_, i) => (
                     <tr key={i} className="animate-pulse">
                       <td className="px-6 py-4" colSpan="8"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                     </tr>
                   ))
                ) : data.length > 0 ? (
                  data.map((order, index) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500">{(pagination.page - 1) * pagination.limit + index + 1}</td>
                      <td className="px-6 py-4 font-mono text-sm text-gray-700">{order.invoiceNo || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-800">{order.user?.fullName || 'Guest'}</div>
                        <div className="text-xs text-gray-500">{order.user?.mobileNumber}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">₹{order.totalAmount}</td>
                      <td className="px-6 py-4">
                        <div className="text-xs">
                            <span className="block text-gray-600 font-medium">{order.paymentMethod}</span>
                            <span className={`inline-block px-2 py-0.5 rounded border mt-1 ${getPaymentColor(order.paymentStatus)}`}>
                                {order.paymentStatus}
                            </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                         {order.orderDate ? format(new Date(order.orderDate), 'MMM dd, yyyy') : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex items-center justify-center gap-2">
                             <button onClick={() => handleNavigate(order._id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                <FaEye />
                             </button>
                             <button onClick={() => handleOpenInvoice(order._id)} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Print Invoice">
                                <FaPrint />
                             </button>
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="8" className="px-6 py-12 text-center text-gray-500">No orders found.</td></tr>
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

      {/* Invoice Modal */}
      {isInvoiceOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
          <div className="bg-white w-full h-full max-h-screen p-4 overflow-y-auto relative">
            <button
              onClick={() => setIsInvoiceOpen(false)}
              className="absolute top-4 right-10 z-50 text-white bg-red-500 rounded-full p-2 hover:bg-red-600 shadow-lg"
            >
              <FaTimes />
            </button>
            <GenrerateInvoice orderId={selectedOrderId} />
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default OrdersPage;
