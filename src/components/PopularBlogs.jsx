import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router";
import api from "../utils/axios";
import { FiArrowUpRight, FiClock, FiUser } from "react-icons/fi";

const PopularBlogs = () => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await api.get("/blogs/featuredBlog");
        if (res.data.success) {
          setBlogs(res.data.blogs);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 font-hind">
      {loading
        ? Array.from({ length: 3 }).map((_, idx) => (
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
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="w-1/4 h-4 bg-gray-200 rounded" />
                  <div className="w-1/4 h-4 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))
        : blogs.map((blog, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div className="relative overflow-hidden">
                <img
                  src={blog.cover}
                  alt="blog"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                  {blog.category.name}
                </div>
              </div>

              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>
                      {new Date(blog.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <FiClock size={14} className="mr-1" />
                      <span>{calculateReadTime(blog.content)} min read</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition">
                    {blog.title}
                  </h3>
                  <div
                    className="prose prose-lg max-w-none mb-4 text-gray-600 line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: blog.content.slice(1, 120),
                    }}
                  />
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2 items-center text-gray-500 text-sm">
                    <FiUser />
                    <span>{blog.author.name}</span>
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
