"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("/api/admin/dashboard/blog");
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleView = async (id) => {
    try {
      const response = await axios.get(`/api/admin/dashboard/blog/${id}`);
      alert(`Blog Title: ${response.data.title}`);
    } catch (error) {
      console.error("Error fetching blog details:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmed = confirm("Are you sure you want to delete this article?");
      if (!confirmed) return;

      await axios.delete(`/api/admin/dashboard/blog/${id}`);
      setArticles(articles.filter((article) => article._id !== id));
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }


  const truncateWords = (text, wordLimit) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  return (
    <div className="w-full p-4 pr-[5rem] bg-gray-100 shadow-lg rounded-lg h-[80vh]">
      <div className="overflow-x-auto overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <table className="border-collapse border border-gray-300 min-w-[1200px] text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-2 py-1 text-left">Featured Image</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Title</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Subtitle</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Content</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Category</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Author</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Created At</th>
              <th className="border border-gray-300 px-2 py-1 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentArticles.map((blog) => (
              <tr key={blog._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-2 py-1 text-center flex justify-center">
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-12 h-12 object-cover rounded-2xl"
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1 truncate">{blog.title}</td>
                    <td className="border border-gray-300 px-2 py-1 truncate">
                      {truncateWords(blog.subtitle, 10)}
                    </td>
                    <td
                        className="border border-gray-300 px-2 py-1 truncate"
                        dangerouslySetInnerHTML={{
                          __html: truncateWords(blog.content, 10),
                        }}
                      ></td>
                    <td className="border border-gray-300 px-2 py-1 truncate">{blog.category}</td>
                    <td className="border border-gray-300 px-2 py-1 truncate">{blog.author}</td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleView(blog._id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
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
      <div className="mt-4 flex justify-center space-x-2">
        {[...Array(Math.ceil(articles.length / articlesPerPage)).keys()].map((number) => (
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

export default News;
