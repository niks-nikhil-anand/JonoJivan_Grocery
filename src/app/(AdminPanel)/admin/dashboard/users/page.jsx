"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/loader/loader";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  // Fetch users from API
  useEffect(() => {
    axios
      .get("/api/admin/dashboard/users/allUsers")
      .then((response) => {
        if (Array.isArray(response.data.users)) {
          setUsers(response.data.users);
          console.log(response.data.users.users)
        } else {
          console.error("Unexpected response format:", response);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <Loader />;
  }

  if (!users.length) {
    return <p className="text-center">No users available.</p>;
  }

  return (
    <div className="w-full p-4  bg-gray-100 shadow-lg rounded-lg h-[80vh] overflow-hidden">
    {/* Horizontal & Vertical Scroll Wrapper */}
    <div className="overflow-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <table className="border-collapse border border-gray-300 min-w-[1000px] text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-2 py-1 text-left">Name</th>
            <th className="border border-gray-300 px-2 py-1 text-left">Email</th>
            <th className="border border-gray-300 px-2 py-1 text-left">Mobile</th>
            <th className="border border-gray-300 px-2 py-1 text-left">Address</th>
            <th className="border border-gray-300 px-2 py-1 text-left">Role</th>
            <th className="border border-gray-300 px-2 py-1 text-left">Status</th>
            <th className="border border-gray-300 px-2 py-1 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user._id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-2 py-1 truncate">{user.fullName}</td>
              <td className="border border-gray-300 px-2 py-1 truncate">{user.email}</td>
              <td className="border border-gray-300 px-2 py-1">{user.mobileNumber}</td>
              <td className="border border-gray-300 px-2 py-1 truncate">{user.address}</td>
              <td className="border border-gray-300 px-2 py-1">{user.role}</td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    user.status === "Active"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handleView(user._id)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  
    {/* Pagination controls */}
    <div className="mt-4 flex justify-center space-x-2">
      {[...Array(Math.ceil(users.length / itemsPerPage)).keys()].map((number) => (
        <button
          key={number}
          className={`px-2 py-1 rounded-md text-xs ${
            currentPage === number + 1
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => paginate(number + 1)}
        >
          {number + 1}
        </button>
      ))}
    </div>
  </div>
  


  );
};

export default Users;
