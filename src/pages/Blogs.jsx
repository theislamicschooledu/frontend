import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiSearch,
  FiBookOpen,
  FiCalendar,
  FiArrowUpRight,
  FiInbox,
  FiLoader
} from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { Link } from "react-router";

const Blogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blogs/publishedBlog");
      setBlogPosts(res.data.blogs);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchBlogCategory = async () => {
    try {
      const res = await api.get("/blogs/blogCategory");
      setCategories(res.data.categories);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchBlogs(), fetchBlogCategory()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
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

  // Custom Loader Component
  const LoadingSpinner = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-sky-50 to-green-50">
      <div className="relative">
        <motion.div
          className="w-20 h-20 border-4 border-green-200 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-green-500 border-r-green-500 rounded-full"></div>
        </motion.div>
        <div className="mt-6 text-center">
          <motion.h3 
            className="text-xl font-semibold text-gray-700 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Loading Articles
          </motion.h3>
          <motion.p 
            className="text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Please wait while we fetch the latest content...
          </motion.p>
          <motion.div 
            className="flex justify-center space-x-1 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ 
                  duration: 0.6, 
                  repeat: Infinity, 
                  delay: i * 0.2 
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );

  // No Data Component
  const NoDataComponent = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-sky-50 to-green-50 px-6">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center"
      >
        <div className="mb-6">
          <div className="relative inline-block">
            <FiInbox className="text-6xl text-gray-300 mx-auto" />
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FiLoader className="text-2xl text-green-500" />
            </motion.div>
          </div>
        </div>
        
        <motion.h2 
          className="text-2xl font-bold text-gray-800 mb-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          No Articles Found
        </motion.h2>
        
        <motion.p 
          className="text-gray-600 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {searchTerm || selectedCategory 
            ? "No articles match your search criteria. Try different keywords or categories."
            : "There are no published articles available at the moment. Please check back later."}
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {(searchTerm || selectedCategory) && (
            <>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
                className="w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors duration-300"
              >
                Clear Filters
              </button>
              <p className="text-sm text-gray-500">
                Showing results for: 
                {searchTerm && ` Search: "${searchTerm}"`}
                {selectedCategory && categories.find(c => c._id === selectedCategory)?.name && 
                  ` Category: "${categories.find(c => c._id === selectedCategory)?.name}"`}
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );

  if (loading) return <LoadingSpinner />;
  
  if (!loading && blogPosts.length === 0) return <NoDataComponent />;

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-50 to-green-50 text-gray-800 font-sans">
      {/* Header */}
      <div className="pt-24 flex flex-col md:flex-row justify-between items-center bg-linear-to-r from-green-600 to-emerald-500 text-white py-6 px-6">
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
                {filteredBlogs.length > 0 && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'} found
                  </span>
                )}
              </div>

              {filteredBlogs.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <FiInbox className="text-5xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Matching Articles
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory(null);
                    }}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
                  >
                    Reset Filters
                  </button>
                </div>
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
                className="bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-lg p-6 text-center"
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