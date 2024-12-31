"use client"
import { FaEye, FaTrash } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Loader from "@/components/loader/loader";
import toast, { Toaster } from "react-hot-toast"; // Import toast and Toaster

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [status, setStatus] = useState("active");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null); // Track the product ID to be deleted

  // Fetch products from API
  useEffect(() => {
    axios
      .get("/api/admin/dashboard/product/addProduct")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error("Unexpected response format:", response);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const truncateName = (name, wordLimit = 4) => {
    const words = name.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : name;
  };

  const handleToggle = async (productId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"; // Toggle status
    try {
      // Send PATCH request to update the product status
      const response = await axios.patch(`/api/admin/dashboard/product/${productId}`, {
        status: newStatus,
      });
  
      if (response.status === 200) {
        // Update the state if the status update was successful
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId ? { ...product, status: newStatus } : product
          )
        );
        toast.success(`Product status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update product status");
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("An error occurred while updating the product status");
    }
  };
  

  const deleteProduct = async () => {
    if (!productToDelete) return; // Ensure there's a product ID to delete
    try {
      const response = await fetch(`/api/admin/dashboard/product/${productToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Product deleted successfully");
        handleDelete(productToDelete); // Remove the product from state
      } else {
        const { msg } = await response.json();
        toast.error(msg || "Failed to delete product");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDelete = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== productId)
    );
  };

  if (loading) return <Loader />;
  if (!products.length) return <p className="text-center">No products available.</p>;

  return (
    <div className="w-full p-4 pr-[5rem] bg-gray-100 shadow-lg rounded-lg h-[80vh]">
      {/* Table Wrapper */}
      <div className="overflow-x-auto overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <table className="border-collapse border border-gray-300 min-w-[1400px] text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1 text-left">Featured Image</th>
              <th className="border px-2 py-1 text-left">Name</th>
              <th className="border px-2 py-1 text-center">Stock</th>
              <th className="border px-2 py-1 text-left">Weight</th>
              <th className="border px-2 py-1 text-left">Category</th>
              <th className="border px-2 py-1 text-left">SubCategory</th>
              <th className="border px-2 py-1 text-left">Vendor</th>
              <th className="border px-2 py-1 text-left">Price</th>
              <th className="border px-2 py-1 text-center">On Sale</th>
              <th className="border px-2 py-1 text-center">Status</th>
              <th className="border px-2 py-1 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-100">
                <td className="border px-2 py-1 text-center flex justify-center">
                  <img
                    src={product.featuredImage}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-2xl"
                  />
                </td>
                <td className="border px-2 py-1">{truncateName(product.name)}</td>
                <td className="border px-2 py-1 text-center">{product.stock}</td>
                <td className="border px-2 py-1">
                  {product.weight?.value} {product.weight?.unit}
                </td>
                <td className="border px-2 py-1">{product.category?.name || "N/A"}</td>
                <td className="border px-2 py-1">{product.subCategory?.name || "N/A"}</td>
                <td className="border px-2 py-1">
                  {product.users?.[0]?.fullName || "N/A"}
                </td>
                <td className="border px-2 py-1">
                  ₹{product.salePrice}{" "}
                  <span className="line-through text-gray-500">₹{product.originalPrice}</span>
                </td>
                <td className="border px-2 py-1 text-center">
                  {product.isOnSale ? (
                    <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs">
                      Yes
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs">
                      No
                    </span>
                  )}
                </td>
              <td className="border px-2 py-1 text-center">
              <div className="flex items-center justify-center gap-2">
                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={product.status === "active"}
                    onChange={() => handleToggle(product._id, product.status)} // Pass product ID and current status
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:bg-gray-700 peer-checked:bg-green-500">
                    <motion.div
                      className="absolute w-5 h-5 bg-white border border-gray-300 rounded-full top-[2px] left-[1px]"
                      initial={{ x: 0 }}
                      animate={{ x: product.status === "active" ? 25 : 0 }} // Adjust the toggle's position based on status
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30, // Adjust these values for a softer or faster transition
                      }}
                    />
                  </div>
                </label>
              </div>
              </td>



                <td className="border px-2 py-1 text-center">
                  <div className="flex gap-5">
                    <button
                      onClick={() => console.log("View product", product._id)}
                      className="flex items-center px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                    >
                      <FaEye className="mr-1" />
                    </button>

                    <button
                      onClick={() => {
                        setProductToDelete(product._id); // Set the product ID to delete
                        setShowDeleteModal(true);
                      }}
                      className="flex items-center px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                    >
                      <FaTrash className="mr-1" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Are you sure you want to delete this product?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={deleteProduct}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-2">
        {[...Array(Math.ceil(products.length / itemsPerPage)).keys()].map((number) => (
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

export default Products;
