import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiStar,
  FiSearch,
  FiBookOpen,
  FiX,
  FiGrid,
  FiList,
  FiTrendingUp,
} from "react-icons/fi";
import { FaRegLaughBeam } from "react-icons/fa";
import api from "../utils/axios";
import SkeletonCard from "../components/SkeletonCard";
import CourseCard from "../components/CourseCard";
import CourseListItem from "../components/CourseListItem";

// Utility: safely strip HTML
const stripHtml = (html) => (html ? String(html).replace(/<[^>]*>/g, "") : "");

const Courses = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  // Fetch courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/courses/publicCourse");
      const data = res?.data;
      if (data?.success && Array.isArray(data.courses)) {
        const sorted = data.courses.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setCourses(sorted);
        setFilteredCourses(sorted);
      } else {
        setCourses([]);
        setFilteredCourses([]);
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load courses";
      toast.error(msg);
      console.error("Courses fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/courses/courseCategory");
      const data = res?.data;
      if (data?.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load categories";
      toast.error(msg);
      console.error("Categories fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  // Filter / search / sort logic
  useEffect(() => {
    let result = [...courses];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((c) => {
        const title = String(c.title || "").toLowerCase();
        const desc = stripHtml(c.description).toLowerCase();
        return title.includes(q) || desc.includes(q);
      });
    }

    if (selectedCategory !== "all") {
      result = result.filter((course) => {
        const catId = course.category?._id || course.category;
        return String(catId) === String(selectedCategory);
      });
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "rating":
          return (b.averageRating || 0) - (a.averageRating || 0);
        case "duration":
          return (b.duration || 0) - (a.duration || 0);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredCourses(result);
  }, [courses, searchTerm, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("newest");
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-green-50 flex items-center justify-center font-hind">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-600 text-lg"
          >
            Loading amazing courses...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-green-50 text-gray-800 font-sans overflow-x-hidden font-hind">
      {/* Enhanced animated background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-200/40"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + ((i * 13) % 75)}%`,
            }}
            animate={{
              y: [0, -25, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            <FiStar size={28} />
          </motion.div>
        ))}
      </div>

      {/* Enhanced Header */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative pt-28 px-4 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white pb-32 mb-8 overflow-hidden rounded-b-4xl"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
              backgroundSize: "100px 100px",
            }}
          ></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-6"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Discover{" "}
            <span className="text-yellow-300 drop-shadow-lg">Amazing</span>{" "}
            Courses!
            <motion.span
              className="ml-4 inline-block"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 4,
              }}
            >
              🚀
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-green-100 font-medium leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Learn Quran, Islamic manners and more with fun interactive lessons
            designed for all ages!
          </motion.p>

          <motion.div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-auto border border-green-200/30"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for fun courses... 🌟"
                className="w-full pl-14 pr-6 py-5 text-gray-800 bg-transparent rounded-3xl text-lg focus:outline-none focus:ring-4 focus:ring-emerald-200/50 border-0 placeholder-gray-400"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Filters Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <motion.div
          className="rounded-3xl shadow-2xl p-6 mb-8 border border-gray-100 backdrop-blur-sm bg-white/95"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Categories */}
            <div className="flex flex-wrap gap-3 items-center">
              <motion.button
                onClick={() => setSelectedCategory("all")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 border ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg border-transparent"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                }`}
              >
                <FaRegLaughBeam />
                All Courses
              </motion.button>

              {categories.map((category) => (
                <motion.button
                  key={category._id || category.name}
                  onClick={() => setSelectedCategory(category._id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-5 py-3 rounded-2xl font-semibold transition-all duration-300 border ${
                    selectedCategory === category._id
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg border-transparent"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                  }`}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>

            {/* View controls and sort */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* View toggle */}
              <div className="flex bg-gray-100 rounded-2xl p-1.5 border border-gray-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FiGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FiList size={20} />
                </button>
              </div>

              {/* Sort dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-100 rounded-2xl px-5 py-3 focus:ring-4 focus:ring-emerald-200 outline-none text-gray-700 font-semibold appearance-none cursor-pointer border border-gray-200 hover:bg-gray-200 transition-colors duration-200"
              >
                <option value="newest">🆕 Newest First</option>
                <option value="oldest">📜 Oldest First</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="rating">⭐ Highest Rated</option>
                <option value="duration">⏰ Longest Duration</option>
              </select>

              {/* Clear filters */}
              {(searchTerm || selectedCategory !== "all") && (
                <motion.button
                  onClick={clearFilters}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md"
                >
                  <FiX size={18} />
                  Clear Filters
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Enhanced Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <AnimatePresence mode="wait">
          {filteredCourses.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-20"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md mx-auto border border-gray-100">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FiBookOpen className="text-6xl text-gray-300 mx-auto mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">
                  No courses found 😢
                </h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  {searchTerm || selectedCategory !== "all"
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "We're preparing amazing courses for you! Check back soon."}
                </p>
                {(searchTerm || selectedCategory !== "all") && (
                  <motion.button
                    onClick={clearFilters}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold shadow-lg"
                  >
                    Show All Courses
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="courses"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                  : "space-y-6"
              }
            >
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} view={viewMode} />
                  ))
                : filteredCourses.map((course, i) =>
                    viewMode === "grid" ? (
                      <CourseCard
                        key={course._id || i}
                        course={course}
                        index={i}
                      />
                    ) : (
                      <CourseListItem
                        key={course._id || i}
                        course={course}
                        index={i}
                      />
                    )
                  )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Enhanced Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-5 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group">
          <FiTrendingUp
            className="group-hover:scale-110 transition-transform duration-300"
            size={24}
          />
        </button>
      </motion.div>
    </div>
  );
};

export default Courses;
