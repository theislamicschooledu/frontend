import React from "react";
import { motion } from "framer-motion";
import {
  FiBook,
  FiBookOpen,
  FiClock,
  FiEye,
  FiHeart,
  FiStar,
  FiUsers,
  FiTrendingUp,
  FiCheckCircle
} from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Link } from "react-router";

const formatPrice = (val) =>
  val || val === 0 ? Number(val).toLocaleString() : "0";

const CourseCard = ({ course, index }) => {
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

  const difficultyColors = {
    beginner: "from-emerald-500 to-teal-500",
    intermediate: "from-amber-500 to-orange-500",
    advanced: "from-rose-500 to-pink-500",
    expert: "from-purple-500 to-indigo-500"
  };

  const difficulty = course.difficulty?.toLowerCase() || "beginner";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -12, 
        scale: 1.03,
        transition: { duration: 0.3 }
      }}
      className="group relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl shadow-2xl hover:shadow-3xl overflow-hidden transition-all duration-500 border border-gray-200/50 font-hind flex flex-col backdrop-blur-sm"
      role="article"
    >
      {/* Background accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${difficultyColors[difficulty]} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Premium badge */}
      {course.isPremium && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-1.5 animate-pulse">
            <FiStar size={12} />
            <span>PREMIUM</span>
          </div>
        </div>
      )}

      {/* Heart button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-red-50 group/heart"
      >
        <FiHeart 
          size={18} 
          className="text-gray-600 group-hover/heart:text-red-500 transition-colors duration-300" 
        />
      </motion.button>

      {/* Thumbnail section */}
      <div className="relative h-56 overflow-hidden">
        {course.thumbnail ? (
          <>
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-500" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <FiBookOpen className="text-5xl text-white opacity-90" />
          </div>
        )}

        {/* Enrollment badge */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-2xl flex items-center gap-2 backdrop-blur-sm">
            <FiClock size={14} />
            <span>{getTimeRemaining(course.enrollmentEnd)}</span>
          </div>
        </div>

        {/* Rating overlay */}
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-2xl border border-white/10">
          <div className="relative">
            <FiStar className="text-yellow-400" size={16} />
            <div className="absolute inset-0 bg-yellow-400/20 blur-sm" />
          </div>
          <span className="font-bold">{course.averageRating?.toFixed(1) || "0.0"}</span>
          <span className="text-gray-300 text-xs">({course.totalReviews || 0})</span>
        </div>
      </div>

      {/* Content section */}
      <div className="p-7 flex-1 flex flex-col relative">
        {/* Category badge */}
        <div className="mb-4">
          <span className={`inline-block bg-gradient-to-r ${difficultyColors[difficulty]} text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg`}>
            {course.category?.name || "Uncategorized"}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-500 leading-tight">
          {course.title}
        </h3>

        {/* Description */}
        {course.shortDescription && (
          <p className="text-gray-600 mb-5 line-clamp-2 text-sm leading-relaxed">
            {course.shortDescription}
          </p>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-gradient-to-br from-blue-50 to-white p-3 rounded-xl border border-blue-100 flex items-center gap-3 group/stat">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2.5 rounded-lg">
              <FiClock className="text-white" size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="font-bold text-gray-900">{course.duration ?? 0} hours</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-white p-3 rounded-xl border border-emerald-100 flex items-center gap-3 group/stat">
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-2.5 rounded-lg">
              <FiBook className="text-white" size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Lectures</p>
              <p className="font-bold text-gray-900">{course.lectures?.length ?? 0}</p>
            </div>
          </div>
        </div>

        {/* Teachers section */}
        {course.teachers && course.teachers.length > 0 && (
          <div className="mb-5 p-4 bg-gradient-to-r from-gray-50/80 to-white/80 rounded-2xl border border-gray-200/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FaChalkboardTeacher className="text-purple-600" size={18} />
                <span className="text-sm font-bold text-gray-700">Instructors</span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {course.teachers.length} {course.teachers.length > 1 ? "experts" : "expert"}
              </span>
            </div>
            <div className="flex -space-x-3">
              {course.teachers.slice(0, 5).map((teacher, idx) => (
                <div key={teacher._id || idx} className="relative group/teacher">
                  <img
                    src={teacher.avatar || "/default-teacher.jpg"}
                    alt={teacher.name || "Teacher"}
                    className="w-12 h-12 rounded-full border-3 border-white shadow-xl object-cover group-hover/teacher:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/teacher:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none">
                    {teacher.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills badges */}
        {course.skills && course.skills.length > 0 && (
          <div className="mb-5">
            <div className="flex flex-wrap gap-2">
              {course.skills.slice(0, 3).map((skill, idx) => (
                <span 
                  key={idx}
                  className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 flex items-center gap-1.5"
                >
                  <FiCheckCircle size={12} className="text-green-500" />
                  {skill}
                </span>
              ))}
              {course.skills.length > 3 && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium">
                  +{course.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price and CTA */}
        <div className="mt-auto pt-5 border-t border-gray-200/50">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {formatPrice(course.price)}
                </span>
                <span className="text-gray-500 text-sm ml-1.5">TK</span>
              </div>
              {course.originalPrice && course.originalPrice > course.price && (
                <span className="text-gray-400 text-sm line-through">
                  {formatPrice(course.originalPrice)} TK
                </span>
              )}
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={`/course/${course._id}`}
                className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-7 py-3.5 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 shadow-xl flex items-center gap-3 group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                <FiEye
                  size={18}
                  className="relative z-10 group-hover/btn:scale-110 transition-transform duration-300"
                />
                <span className="relative z-10">View Details</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;