import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import { FiArrowUpRight, FiClock, FiUser, FiRefreshCw, FiFileText } from "react-icons/fi";
import { FaExclamationCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const PopularBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/blogs/featuredBlog");
      
      if (res.data.success) {
        setBlogs(res.data.blogs || []);
      } else {
        setError("Failed to load blogs");
        toast.error("Unable to load featured blogs");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError(
        error?.response?.data?.message ||
          error.message ||
          "Failed to load blogs"
      );
      // গুরুতর এরর এর ক্ষেত্রে শুধু toast দেখানো
      if (!error?.response?.status || error.response.status >= 500) {
        toast.error(
          error?.response?.data?.message ||
            "Network error. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateReadTime = (content) => {
    if (!content) return 3; // Default read time
    try {
      const wordsPerMinute = 200;
      const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
      return Math.max(1, Math.ceil(words / wordsPerMinute));
    } catch {
      return 3;
    }
  };

  // লোডিং স্টেট
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 font-hind">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
          >
            <div className="w-full h-48 bg-gray-200" />
            <div className="p-6 flex flex-col justify-between h-56">
              <div className="space-y-3">
                <div className="w-3/4 h-4 bg-gray-200 rounded" />
                <div className="w-full h-4 bg-gray-200 rounded" />
                <div className="w-2/3 h-4 bg-gray-200 rounded" />
                <div className="w-1/2 h-4 bg-gray-200 rounded" />
              </div>
              <div className="flex justify-between items-center mt-6">
                <div className="w-1/4 h-4 bg-gray-200 rounded" />
                <div className="w-1/4 h-4 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // এরর স্টেট
  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-md overflow-hidden p-8 text-center">
        <FaExclamationCircle className="text-5xl text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Failed to Load Blogs
        </h3>
        <p className="text-gray-500 mb-6">
          {error.includes("Network") ? 
            "Please check your internet connection." : 
            "We're having trouble loading the blogs."}
        </p>
        <motion.button
          onClick={fetchBlogs}
          className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiRefreshCw />
          Try Again
        </motion.button>
      </div>
    );
  }

  // কোনো ব্লগ নেই এমন স্টেট
  if (!blogs || blogs.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md overflow-hidden p-8 text-center">
        <FiFileText className="text-5xl text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Blogs Available
        </h3>
        <p className="text-gray-500 mb-2">
          We don't have any featured blogs to show at the moment.
        </p>
        <p className="text-gray-400 text-sm">
          Check back later for new blog posts
        </p>
      </div>
    );
  }

  // সফলভাবে ডাটা লোড হয়েছে
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 font-hind">
      {blogs.map((blog, idx) => (
        <motion.div
          key={blog._id || blog.id || idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
        >
          <div className="relative overflow-hidden">
            <img
              src={blog.cover || "/default-blog-cover.jpg"}
              alt={blog.title || "Blog cover"}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-blog-cover.jpg";
              }}
            />
            {blog.category?.name && (
              <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                {blog.category.name}
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <span>
                  {blog.createdAt 
                    ? new Date(blog.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Recently"}
                </span>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <FiClock size={14} className="mr-1" />
                  <span>{calculateReadTime(blog.content)} min read</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition line-clamp-2">
                {blog.title || "Untitled Blog"}
              </h3>
              <div
                className="prose prose-lg max-w-none mb-4 text-gray-600 line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: blog.content 
                    ? blog.content.slice(0, 120) + (blog.content.length > 120 ? "..." : "")
                    : "No content available",
                }}
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2 items-center text-gray-500 text-sm">
                <FiUser />
                <span>{blog.author?.name || "Unknown Author"}</span>
              </div>
              <Link
                to={`/blogs/${blog._id}`}
                className="text-green-600 font-medium flex items-center group-hover:underline"
              >
                Read More
                <FiArrowUpRight className="ml-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PopularBlogs;