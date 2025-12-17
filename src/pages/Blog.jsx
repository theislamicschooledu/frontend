import React, { useCallback, useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiUser,
  FiCalendar,
  FiClock,
  FiArrowLeft,
  FiShare2,
  FiBookmark,
} from "react-icons/fi";
import { useParams, Link } from "react-router";
import toast from "react-hot-toast";
import api from "../utils/axios";

const Blog = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(null);

  const fetchBlogDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/blogs/publishedBlog/${id}`);
      
      setBlog(res.data.blogs);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBlogDetails();
  }, [fetchBlogDetails]);

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const roleColors = {
    admin: "bg-purple-100 text-purple-800",
    teacher: "bg-blue-100 text-blue-800",
    student: "bg-green-100 text-green-800",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-green-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-green-50 flex items-center justify-center">
        <p className="text-gray-600">Blog post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-green-50 text-gray-800 font-sans">
      {/* Header */}
      <div className="pt-24 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/blogs"
              className="inline-flex items-center text-green-100 hover:text-white mb-6 transition mr-16"
            >
              <FiArrowLeft className="mr-2" />
              Back to Blogs
            </Link>

            <div className="bg-green-500 text-white text-sm px-4 py-1.5 rounded-full inline-block mb-4">
              {blog.category?.name}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-green-100">
              <div className="flex gap-2 items-center">
                <FiUser className="mr-2" />
                <span>{blog.author?.name || "Unknown Author"}</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="mr-2" />
                <span>
                  {new Date(blog.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <FiClock className="mr-2" />
                <span>{calculateReadTime(blog.content)} min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Blog Content */}
      <section className="py-8 px-2 md:py-16 md:px-6">
        <div className="md:max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Featured Image */}
                <div className="relative">
                  <img
                    src={blog.cover}
                    alt={blog.title}
                    className="w-full h-64 md:h-96 object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 md:flex-row justify-between items-center mb-8 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <FiUser />
                      <span className="font-medium">{blog.author?.name}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          roleColors[blog.author?.role]
                        }`}
                      >
                        {blog.author?.role?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button className="p-2 text-gray-500 hover:text-green-600 transition">
                        <FiBookmark className="text-lg" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-green-600 transition">
                        <FiShare2 className="text-lg" />
                      </button>
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div
                    className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-800 prose-a:text-green-600 hover:prose-a:text-green-700 prose-blockquote:border-green-400 prose-blockquote:bg-green-50 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </div>
              </motion.article>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Author Info */}
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  About the Author
                </h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {blog.author?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {blog.author?.name || "Unknown Author"}
                    </h4>
                    <p className="text-sm text-gray-500">{blog.author?.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Passionate about Islamic parenting and child development.
                  Sharing insights and experiences to help parents nurture their
                  children with Islamic values.
                </p>
              </motion.div>

              {/* TODO */}
              {/* Related Articles */}
              {/* {relatedBlogs.length > 0 && (
                <motion.div
                  className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {relatedBlogs.map((relatedBlog) => (
                      <Link
                        key={relatedBlog._id}
                        to={`/blogs/${relatedBlog._id}`}
                        className="block group"
                      >
                        <div className="flex gap-3 p-3 rounded-lg hover:bg-green-50 transition">
                          <img
                            src={relatedBlog.cover}
                            alt={relatedBlog.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <h4 className="font-medium text-gray-800 group-hover:text-green-600 transition text-sm leading-tight mb-1">
                              {relatedBlog.title.length > 50
                                ? `${relatedBlog.title.substring(0, 50)}...`
                                : relatedBlog.title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {new Date(relatedBlog.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )} */}

              {/* Subscribe Card */}
              <motion.div
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-lg p-6 text-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3 className="text-xl font-bold mb-2">
                  Enjoying this article?
                </h3>
                <p className="text-green-100 mb-4">
                  Subscribe to get more parenting insights
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

export default Blog;
