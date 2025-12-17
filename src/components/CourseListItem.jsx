import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FiBook, FiBookOpen, FiClock, FiEye, FiHeart, FiStar } from "react-icons/fi";
import { FaChalkboardTeacher, FaRocket } from "react-icons/fa";
import { Link } from "react-router";

const stripHtml = (html) => (html ? String(html).replace(/<[^>]*>/g, "") : "");
const formatPrice = (val) =>
  val || val === 0 ? Number(val).toLocaleString() : "0";

const CourseListItem = ({ course, index }) => {
  const getTimeRemaining = (enrollmentEnd) => {
    if (!enrollmentEnd) return "No deadline";
    const now = new Date();
    const end = new Date(enrollmentEnd);
    const diff = end - now;
    if (Number.isNaN(diff)) return "Invalid date";
    if (diff <= 0) return "Enrollment Closed";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes} min left`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ x: 4, scale: 1.01 }}
      className="group bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 font-hind overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="lg:w-72 lg:h-52 h-48 relative overflow-hidden">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <FiBookOpen className="text-3xl text-white opacity-80" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              {getTimeRemaining(course.enrollmentEnd)}
            </div>
          </div>

          <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full text-gray-600 hover:text-red-500 transition-all duration-300 hover:scale-110 shadow-lg">
            <FiHeart size={16} />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              {/* Header with category and rating */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                <div className="flex items-center gap-3 mb-3 lg:mb-0">
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                    {course.category?.name || "Uncategorized"}
                  </span>
                  <div className="flex items-center text-amber-500 text-sm bg-amber-50 px-3 py-1.5 rounded-full">
                    <FiStar size={14} />
                    <span className="text-gray-800 ml-1 font-bold">
                      {course.averageRating?.toFixed(1) || "0.0"}
                    </span>
                    <span className="text-gray-500 text-xs ml-1">
                      ({course.ratingCount ?? 0})
                    </span>
                  </div>
                </div>
              </div>

              {/* Title and description */}
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                {course.title}
              </h3>

              <p className="text-gray-600 mb-5 line-clamp-2 text-sm leading-relaxed">
                {stripHtml(course.description) || "No description available"}
              </p>

              {/* Course stats */}
              <div className="flex flex-wrap gap-3 mb-5">
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl">
                  <FiClock className="text-blue-500" size={16} />
                  <span className="text-sm font-semibold text-gray-700">
                    {course.duration ?? 0}h
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-2xl">
                  <FiBook className="text-green-500" size={16} />
                  <span className="text-sm font-semibold text-gray-700">
                    {course.lectures?.length ?? 0} lectures
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-2xl">
                  <FaChalkboardTeacher className="text-purple-500" size={16} />
                  <span className="text-sm font-semibold text-gray-700">
                    {course.teachers?.length ?? 1} instructors
                  </span>
                </div>
              </div>
            </div>

            {/* Footer with price and actions */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pt-5 border-t border-gray-100 gap-4">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(course.price)}
                </span>
                <span className="text-gray-500 text-sm ml-1 mt-1">TK</span>
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/course/${course._id}`}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 shadow-lg group/btn"
                >
                  <FiEye size={16} className="group-hover/btn:scale-110 transition-transform duration-300" />
                  Preview
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseListItem;
