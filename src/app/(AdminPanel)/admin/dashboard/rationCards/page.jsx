"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { IoIosSearch, IoMdRefresh, IoMdClose } from "react-icons/io";
import { FaIdCard, FaEye, FaEdit, FaTrash, FaSave } from "react-icons/fa";
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const RationCardsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1, limit: 10, total: 0, totalPages: 1
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedCard, setSelectedCard] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});

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
      const res = await axios.get('/api/rationCard', {
        params: { page: pagination.page, limit: pagination.limit, search: debouncedSearch }
      });
      if (res.data.success) {
        setData(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      toast.error("Failed to load applications");
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

  // Actions
  const handleView = (card) => {
    setSelectedCard(card);
    setIsViewOpen(true);
  };

  const handleEdit = (card) => {
    setSelectedCard(card);
    setEditFormData({
        name: card.name,
        fatherName: card.fatherName,
        dob: card.dob ? card.dob.split('T')[0] : '', // Format for date input
        whatsappNo: card.whatsappNo,
        email: card.email,
        address: card.address,
        state: card.state,
        pincode: card.pincode,
        aadhaarCardNumber: card.aadhaarCardNumber,
        panCardNumber: card.panCardNumber,
        bankName: card.bankDetails?.bankName || card.bankName,
        accountNumber: card.bankDetails?.accountNumber || card.accountNumber,
        ifscCode: card.bankDetails?.ifscCode || card.ifscCode
    });
    setIsEditOpen(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this application?")) return;
    
    try {
        const res = await axios.delete(`/api/rationCard/${id}`);
        if(res.data.success) {
            toast.success("Deleted successfully");
            fetchData();
        }
    } catch (error) {
        toast.error("Failed to delete");
    }
  };

  const handleUpdate = async (e) => {
      e.preventDefault();
      try {
          const res = await axios.put(`/api/rationCard/${selectedCard._id}`, editFormData);
          if(res.data.success) {
              toast.success("Updated successfully");
              setIsEditOpen(false);
              fetchData();
          }
      } catch (error) {
          toast.error("Failed to update");
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
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Unique ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Applicant</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Documents</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                   [...Array(5)].map((_, i) => (
                     <tr key={i} className="animate-pulse">
                       <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                       <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
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
                      <td className="px-6 py-4 text-center">
                         <div className="flex items-center justify-center gap-2">
                             <button onClick={() => handleView(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                                <FaEye />
                             </button>
                             <button onClick={() => handleEdit(item)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors" title="Edit">
                                <FaEdit />
                             </button>
                             <button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <FaTrash />
                             </button>
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">No applications found.</td></tr>
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
            {isViewOpen && selectedCard && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">Application Details</h2>
                            <button onClick={() => setIsViewOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl"><IoMdClose /></button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-6">
                            <div className="flex items-center gap-4">
                                {selectedCard.profilePicture ? (
                                    <img src={selectedCard.profilePicture} className="w-20 h-20 rounded-xl object-cover border" />
                                ) : (
                                    <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center text-3xl font-bold text-gray-500">{selectedCard.name?.charAt(0)}</div>
                                )}
                                <div>
                                    <h3 className="text-lg font-bold">{selectedCard.name}</h3>
                                    <p className="text-gray-600">ID: {selectedCard.uniqueNumber}</p>
                                    <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 border-b pb-2">Personal Info</h4>
                                    <InfoRow label="Father Name" value={selectedCard.fatherName} />
                                    <InfoRow label="Date of Birth" value={selectedCard.dob ? format(new Date(selectedCard.dob), 'MMM dd, yyyy') : '-'} />
                                    <InfoRow label="Email" value={selectedCard.email} />
                                    <InfoRow label="WhatsApp" value={selectedCard.whatsappNo} />
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 border-b pb-2">Documents & Address</h4>
                                    <InfoRow label="Aadhaar No." value={selectedCard.aadhaarCardNumber} />
                                    <InfoRow label="PAN No." value={selectedCard.panCardNumber} />
                                    <InfoRow label="Address" value={selectedCard.address} />
                                    <InfoRow label="Pincode" value={`${selectedCard.state} - ${selectedCard.pincode}`} />
                                </div>
                            </div>

                             <div className="bg-blue-50 p-4 rounded-xl">
                                <h4 className="font-semibold text-blue-900 mb-2">Bank Details</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <p><span className="text-blue-700">Bank:</span> {selectedCard.bankName || selectedCard.bankDetails?.bankName}</p>
                                    <p><span className="text-blue-700">Account:</span> {selectedCard.accountNumber || selectedCard.bankDetails?.accountNumber}</p>
                                    <p><span className="text-blue-700">IFSC:</span> {selectedCard.ifscCode || selectedCard.bankDetails?.ifscCode}</p>
                                </div>
                             </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
            {isEditOpen && selectedCard && (
                 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                 <motion.div 
                     initial={{ opacity: 0, scale: 0.95 }} 
                     animate={{ opacity: 1, scale: 1 }} 
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
                 >
                     <div className="p-6 border-b flex justify-between items-center">
                         <h2 className="text-xl font-bold text-gray-800">Edit Application</h2>
                         <button onClick={() => setIsEditOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl"><IoMdClose /></button>
                     </div>
                     <form onSubmit={handleUpdate} className="p-6 space-y-4 overflow-y-auto">
                        <InputGroup label="Full Name" name="name" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} />
                        <InputGroup label="Father Name" name="fatherName" value={editFormData.fatherName} onChange={(e) => setEditFormData({...editFormData, fatherName: e.target.value})} />
                        <div className="grid grid-cols-2 gap-4">
                           <InputGroup label="DOB" type="date" name="dob" value={editFormData.dob} onChange={(e) => setEditFormData({...editFormData, dob: e.target.value})} />
                           <InputGroup label="WhatsApp" name="whatsappNo" value={editFormData.whatsappNo} onChange={(e) => setEditFormData({...editFormData, whatsappNo: e.target.value})} />
                        </div>
                        <InputGroup label="Email" name="email" value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Aadhaar No." name="aadhaarCardNumber" value={editFormData.aadhaarCardNumber} onChange={(e) => setEditFormData({...editFormData, aadhaarCardNumber: e.target.value})} />
                            <InputGroup label="PAN No." name="panCardNumber" value={editFormData.panCardNumber} onChange={(e) => setEditFormData({...editFormData, panCardNumber: e.target.value})} />
                        </div>

                        <InputGroup label="Address" name="address" value={editFormData.address} onChange={(e) => setEditFormData({...editFormData, address: e.target.value})} />
                         <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="State" name="state" value={editFormData.state} onChange={(e) => setEditFormData({...editFormData, state: e.target.value})} />
                            <InputGroup label="Pincode" name="pincode" value={editFormData.pincode} onChange={(e) => setEditFormData({...editFormData, pincode: e.target.value})} />
                        </div>

                        <h4 className="font-semibold text-gray-700 mt-2">Bank Details</h4>
                        <InputGroup label="Bank Name" name="bankName" value={editFormData.bankName} onChange={(e) => setEditFormData({...editFormData, bankName: e.target.value})} />
                         <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Account No." name="accountNumber" value={editFormData.accountNumber} onChange={(e) => setEditFormData({...editFormData, accountNumber: e.target.value})} />
                            <InputGroup label="IFSC Code" name="ifscCode" value={editFormData.ifscCode} onChange={(e) => setEditFormData({...editFormData, ifscCode: e.target.value})} />
                        </div>

                        <div className="pt-4 flex justify-end gap-3 border-t mt-4">
                            <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                                <FaSave /> Save Changes
                            </button>
                        </div>
                     </form>
                 </motion.div>
             </div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between text-sm">
        <span className="text-gray-500">{label}</span>
        <span className="font-medium text-gray-800 text-right">{value || '-'}</span>
    </div>
);

const InputGroup = ({ label, name, value, onChange, type = "text" }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input 
            type={type} 
            name={name} 
            value={value || ''} 
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
        />
    </div>
);

export default RationCardsPage;
