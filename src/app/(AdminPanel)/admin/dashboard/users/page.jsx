"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/loader/loader";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
    <div className="max-w-full  p-4 bg-gray-100 shadow-lg rounded-lg w-full h-[80vh] overflow-y-scroll overflow-x-scroll">
      {/* Display users in a table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">Profile Picture</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Full Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Mobile Number</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Address</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user._id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">
                <img
                  src={user.profilePic }
                  alt={user.fullName}
                  className="w-16 h-16 object-cover rounded-md"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">{user.fullName}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">{user.mobileNumber}</td>
              <td className="border border-gray-300 px-4 py-2">{user.address}</td>
              <td className="border border-gray-300 px-4 py-2">{user.role}</td>
              <td className="border border-gray-300 px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full ${
                    user.status === "Active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <div className="flex ">
                <button
                  onClick={() => handleView(user._id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
                </div>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>

  {/* Pagination controls */}
  <div className="mt-8 flex justify-center space-x-4">
    {[...Array(Math.ceil(users.length / itemsPerPage)).keys()].map((number) => (
      <button
        key={number}
        className={`px-3 py-1 rounded-md ${
          currentPage === number + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'
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
