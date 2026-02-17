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
  FiClock,
  FiCalendar,
  FiUsers,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { FaRegLaughBeam, FaGraduationCap } from "react-icons/fa";
import api from "../utils/axios";
import SkeletonCard from "../components/SkeletonCard";
import CourseCard from "../components/CourseCard";
import CourseListItem from "../components/CourseListItem";

// Utility: safely strip HTML
const stripHtml = (html) => (html ? String(html).replace(/<[^>]*>/g, "") : "");

// Course status badge component
const CourseStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "coming_soon":
        return {
          text: "Coming Soon",
          bg: "bg-purple-100",
          textColor: "text-purple-700",
          icon: FiClock,
        };
      case "upcoming":
        return {
          text: "Upcoming",
          bg: "bg-blue-100",
          textColor: "text-blue-700",
          icon: FiCalendar,
        };
      case "enrollment_open":
        return {
          text: "Enrollment Open",
          bg: "bg-green-100",
          textColor: "text-green-700",
          icon: FiUsers,
        };
      case "enrollment_closed":
        return {
          text: "Enrollment Closed",
          bg: "bg-orange-100",
          textColor: "text-orange-700",
          icon: FiX,
        };
      case "course_started":
        return {
          text: "Course Started",
          bg: "bg-teal-100",
          textColor: "text-teal-700",
          icon: FaGraduationCap,
        };
      default:
        return {
          text: "Published",
          bg: "bg-gray-100",
          textColor: "text-gray-700",
          icon: FiBookOpen,
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.textColor}`}
    >
      <Icon size={12} />
      {config.text}
    </span>
  );
};

const Courses = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false); // মোবাইলের জন্য ফিল্টার টগল স্টেট

  // Status options for filtering
  const statusOptions = [
    { value: "all", label: "All Courses", icon: FiBookOpen },
    { value: "coming_soon", label: "Coming Soon", icon: FiClock },
    { value: "upcoming", label: "Upcoming", icon: FiCalendar },
    { value: "enrollment_open", label: "Enrollment Open", icon: FiUsers },
    { value: "enrollment_closed", label: "Enrollment Closed", icon: FiX },
    { value: "course_started", label: "Course Started", icon: FaGraduationCap },
  ];

  // Fetch courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/courses/published");
      const data = res?.data;

      if (data?.success && Array.isArray(data.data)) {
        const sorted = data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setCourses(sorted);
        setFilteredCourses(sorted);
      } else if (data?.success && Array.isArray(data.courses)) {
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
      const res = await api.get("/courses/category");
      const data = res?.data;

      if (data?.success && Array.isArray(data.data)) {
        setCategories(data.data);
      } else if (data?.success && Array.isArray(data.categories)) {
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

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((c) => {
        const title = String(c.title || "").toLowerCase();
        const desc = stripHtml(c.description).toLowerCase();
        return title.includes(q) || desc.includes(q);
      });
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((course) => {
        const catId = course.category?._id || course.category;
        return String(catId) === String(selectedCategory);
      });
    }

    // Status filter
    if (selectedStatus !== "all") {
      result = result.filter(
        (course) => course.currentStatus === selectedStatus
      );
    }

    // Sorting
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
        case "enrollment-start":
          return (
            new Date(a.enrollmentStart || 0) - new Date(b.enrollmentStart || 0)
          );
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredCourses(result);
  }, [courses, searchTerm, selectedCategory, selectedStatus, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSortBy("newest");
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory !== "all") count++;
    if (selectedStatus !== "all") count++;
    return count;
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-sky-50 to-green-50 flex items-center justify-center font-hind">
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
    <div className="md:pt-8 min-h-screen bg-linear-to-b from-sky-50 to-green-50 text-gray-800 font-sans overflow-x-hidden font-hind">
      {/* Animated background */}
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

      {/* Header - উপরের অংশের জায়গা কমানো হয়েছে */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative pt-20 px-4 bg-linear-to-r from-emerald-600 via-green-500 to-teal-500 text-white pb-16 mb-4 overflow-hidden rounded-b-3xl"
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

        <div className="max-w-6xl mx-auto text-center relative z-10 flex flex-col md:flex-row items-center justify-between md:gap-16">
          <div>
            <motion.h1
              className="text-3xl md:text-5xl font-extrabold mb-4"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Discover{" "}
              <span className="text-yellow-300 drop-shadow-lg">Amazing</span>{" "}
              Courses!
              <motion.span
                className="ml-2 inline-block"
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
              className="text-base md:text-lg mb-6 md:mb-0 max-w-2xl mx-auto text-green-100 font-medium leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Learn Quran, Islamic manners and more with fun interactive lessons
              designed for all ages!
            </motion.p>
          </div>

          {/* Search bar - সাইজ কমানো হয়েছে */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-full max-w-xl mx-auto border border-green-200/30"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for fun courses... 🌟"
                className="w-full pl-12 pr-4 py-3 text-gray-800 bg-transparent rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-emerald-200/50 border-0 placeholder-gray-400"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Filters Section - জায়গা কমানো হয়েছে */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <motion.div
          className="rounded-2xl shadow-xl p-4 mb-6 border border-gray-100 backdrop-blur-sm bg-white/95"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Active filters count badge */}
          {getActiveFilterCount() > 0 && (
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xs text-gray-500">Active filters:</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                {getActiveFilterCount()} active
              </span>
            </div>
          )}

          {/* মোবাইলের জন্য ফিল্টার টগল বাটন */}
          <div className="lg:hidden mb-3">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl text-gray-700 font-medium transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <FiFilter className="text-lg" />
                <span>Filters & Sort</span>
                {getActiveFilterCount() > 0 && (
                  <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs">
                    {getActiveFilterCount()}
                  </span>
                )}
              </div>
              {isFilterOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>

          {/* ফিল্টার কন্টেন্ট - ডেস্কটপে সবসময় দেখা যাবে, মোবাইলে টগল করে */}
          <div className={`${isFilterOpen ? "block" : "hidden"} lg:block`}>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* Left side filters */}
              <div className="flex-1 space-y-3">
                {/* Categories */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 mb-2">
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    <motion.button
                      onClick={() => setSelectedCategory("all")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-300 border ${
                        selectedCategory === "all"
                          ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow border-transparent"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                      }`}
                    >
                      <FaRegLaughBeam className="inline mr-1 text-xs" />
                      All
                    </motion.button>

                    {categories.map((category) => (
                      <motion.button
                        key={category._id || category.name}
                        onClick={() => setSelectedCategory(category._id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-300 border ${
                          selectedCategory === category._id
                            ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow border-transparent"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                        }`}
                      >
                        {category.name}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Status filters */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 mb-2">
                    Course Status
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {statusOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <motion.button
                          key={option.value}
                          onClick={() => setSelectedStatus(option.value)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-300 border flex items-center gap-1 ${
                            selectedStatus === option.value
                              ? "bg-linear-to-r from-green-500 to-teal-500 text-white shadow border-transparent"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                          }`}
                        >
                          <Icon size={14} />
                          {option.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right side controls */}
              <div className="lg:w-auto flex flex-col gap-3">
                {/* View and sort controls */}
                <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap">
                  {/* View toggle */}
                  <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-200">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        viewMode === "grid"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      title="Grid view"
                    >
                      <FiGrid size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        viewMode === "list"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      title="List view"
                    >
                      <FiList size={18} />
                    </button>
                  </div>

                  {/* Sort dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-100 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-200 outline-none text-gray-700 font-medium text-sm appearance-none cursor-pointer border border-gray-200 hover:bg-gray-200 transition-colors duration-200 min-w-40"
                  >
                    <option value="newest">🆕 Newest First</option>
                    <option value="oldest">📜 Oldest First</option>
                    <option value="price-low">💰 Price: Low to High</option>
                    <option value="price-high">💎 Price: High to Low</option>
                    <option value="rating">⭐ Highest Rated</option>
                    <option value="duration">⏰ Longest Duration</option>
                    <option value="enrollment-start">
                      📅 Enrollment Start
                    </option>
                  </select>

                  {/* Clear filters */}
                  {getActiveFilterCount() > 0 && (
                    <motion.button
                      onClick={clearFilters}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 px-3 py-2 bg-linear-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:shadow transition-all duration-300 font-medium text-sm shadow whitespace-nowrap"
                    >
                      <FiX size={16} />
                      Clear All
                    </motion.button>
                  )}
                </div>

                {/* Results count */}
                <div className="text-right text-xs text-gray-500">
                  Showing {filteredCourses.length} of {courses.length} courses
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AnimatePresence mode="wait">
          {filteredCourses.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-16"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-gray-100">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FiBookOpen className="text-5xl text-gray-300 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  No courses found 😢
                </h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  {getActiveFilterCount() > 0
                    ? "Try adjusting your filters to find what you're looking for."
                    : "We're preparing amazing courses for you! Check back soon."}
                </p>
                {getActiveFilterCount() > 0 && (
                  <motion.button
                    onClick={clearFilters}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow transition-all duration-300 font-medium text-sm shadow"
                  >
                    Clear All Filters
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
            >
              {/* Status summary (optional) */}
              <div className="mb-4 flex flex-wrap gap-2 justify-end">
                {[
                  "coming_soon",
                  "upcoming",
                  "enrollment_open",
                  "enrollment_closed",
                  "course_started",
                ].map((status) => {
                  const count = filteredCourses.filter(
                    (c) => c.currentStatus === status
                  ).length;
                  if (count === 0) return null;
                  const statusOption = statusOptions.find(
                    (opt) => opt.value === status
                  );
                  const Icon = statusOption?.icon || FiBookOpen;
                  return (
                    <span
                      key={status}
                      className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                    >
                      <Icon size={10} />
                      {statusOption?.label}: {count}
                    </span>
                  );
                })}
              </div>

              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        <button className="bg-linear-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group">
          <FiTrendingUp
            className="group-hover:scale-110 transition-transform duration-300"
            size={20}
          />
        </button>
      </motion.div>
    </div>
  );
};

export default Courses;
