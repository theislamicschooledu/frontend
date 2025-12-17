import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiUser,
  FiSearch,
  FiBookOpen,
  FiCalendar,
  FiArrowUpRight,
} from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { Link } from "react-router";

const Blogs = () => {
  const [loading, setLoading] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/blogs/publishedBlog");
      setBlogPosts(res.data.blogs);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogCategory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/blogs/blogCategory");
      setCategories(res.data.categories);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchBlogCategory();
  }, []);

  const categoryCounts = blogPosts.reduce((acc, post) => {
    const catId = post.category?._id;
    if (catId) {
      acc[catId] = (acc[catId] || 0) + 1;
    }
    return acc;
  }, {});

  const filteredBlogs = blogPosts.filter((blog) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      blog.title.toLowerCase().includes(term) ||
      blog.content.toLowerCase().includes(term);

    const matchesCategory = selectedCategory
      ? blog.category?._id === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-green-50 text-gray-800 font-sans">
     {/* Header */}
      <div className="pt-24 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-green-600 to-emerald-500 text-white py-6 px-6">
        <motion.h1
          className="text-2xl md:text-4xl font-extrabold mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Islamic Parenting Blog
        </motion.h1> 

        {/* Search */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg w-full md:w-96"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <FiSearch className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-black bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </motion.div>
      </div>

      {/* Blog Content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-bold text-gray-800">
                  Latest Articles
                </h2>
              </div>

              {filteredBlogs.length === 0 ? (
                <p className="text-gray-500 text-center py-10">
                  No articles found.
                </p>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {filteredBlogs.map((post, index) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                    >
                      {/* Image Section */}
                      <div className="relative overflow-hidden">
                        <img
                          src={post.cover}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                          {post.category?.name || "N/A"}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <FiCalendar className="mr-1" />
                            <span className="mr-4">
                              {new Date(post.createdAt).toLocaleString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-green-600 transition">
                            {post.title}
                          </h3>
                          <div
                            className="prose prose-lg max-w-none mb-4 text-gray-600"
                            dangerouslySetInnerHTML={{
                              __html: post.content.slice(1, 120),
                            }}
                          />
                        </div>

                        {/* Author and Read More */}
                        <div className="flex justify-between items-center text-sm text-gray-600 mt-4 pt-4 border-t border-t-gray-300">
                          <div className="flex items-center">
                            <FiUser className="mr-1" />
                            <span>{post.author.name}</span>
                          </div>
                          <Link
                            to={`/blogs/${post._id}`}
                            className="text-green-600 font-medium flex items-center hover:underline"
                          >
                            Read More
                            <FiArrowUpRight className="ml-1" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Categories
                </h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`flex items-center justify-between w-full py-2 transition ${
                        selectedCategory === null
                          ? "text-green-600 font-semibold"
                          : "text-gray-600 hover:text-green-600"
                      } cursor-pointer`}
                    >
                      <span>All</span>
                      <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">
                        {blogPosts.length}
                      </span>
                    </button>
                  </li>
                  {categories?.map((category, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => setSelectedCategory(category._id)}
                        className={`flex items-center justify-between w-full py-2 transition ${
                          selectedCategory === category._id
                            ? "text-green-600 font-semibold"
                            : "text-gray-600 hover:text-green-600"
                        } cursor-pointer`}
                      >
                        <span>{category.name}</span>
                        <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">
                          {categoryCounts[category._id] || 0}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-lg p-6 text-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <FiBookOpen className="text-4xl mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">
                  Subscribe to Our Blog
                </h3>
                <p className="text-green-100 mb-4">
                  Get the latest articles delivered to your inbox
                </p>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full pl-4 pr-32 py-3 bg-white text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                  <button className="absolute right-2 top-2 bg-green-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-green-700 transition">
                    Subscribe
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
