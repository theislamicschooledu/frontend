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
  FiCheckCircle,
  FiCalendar,
  FiX
} from "react-icons/fi";
import { FaChalkboardTeacher, FaGraduationCap } from "react-icons/fa";
import { Link } from "react-router";

const formatPrice = (val) =>
  val || val === 0 ? Number(val).toLocaleString() : "0";

// Course Status Badge Component - নতুন যোগ করা হয়েছে
const CourseStatusBadge = ({ status, isUpcoming }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'coming_soon':
        return { 
          text: 'Coming Soon', 
          bg: 'bg-purple-100', 
          textColor: 'text-purple-700', 
          icon: FiClock,
          gradient: 'from-purple-500 to-pink-500'
        };
      case 'upcoming':
        return { 
          text: 'Upcoming', 
          bg: 'bg-blue-100', 
          textColor: 'text-blue-700', 
          icon: FiCalendar,
          gradient: 'from-blue-500 to-cyan-500'
        };
      case 'enrollment_open':
        return { 
          text: 'Enrollment Open', 
          bg: 'bg-green-100', 
          textColor: 'text-green-700', 
          icon: FiUsers,
          gradient: 'from-green-500 to-emerald-500'
        };
      case 'enrollment_closed':
        return { 
          text: 'Enrollment Closed', 
          bg: 'bg-orange-100', 
          textColor: 'text-orange-700', 
          icon: FiX,
          gradient: 'from-orange-500 to-red-500'
        };
      case 'course_started':
        return { 
          text: 'Course Started', 
          bg: 'bg-teal-100', 
          textColor: 'text-teal-700', 
          icon: FaGraduationCap,
          gradient: 'from-teal-500 to-cyan-500'
        };
      default:
        return { 
          text: 'Published', 
          bg: 'bg-gray-100', 
          textColor: 'text-gray-700', 
          icon: FiBookOpen,
          gradient: 'from-gray-500 to-gray-600'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg bg-white/90 backdrop-blur-sm border border-${config.bg}`}>
      <Icon className={config.textColor} size={14} />
      <span className={config.textColor}>{config.text}</span>
    </div>
  );
};

const CourseCard = ({ course, index }) => {
  const {
    _id,
    title,
    thumbnail,
    price,
    description,
    duration,
    averageRating,
    ratingCount,
    teachers,
    category,
    currentStatus,
    isComingSoon,
    enrollmentStart,
    enrollmentEnd,
    courseStart,
    lectures,
    featured,
    status
  } = course;

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

  const categoryName = category?.name || "Uncategorized";
  
  const teacherNames = teachers?.map(t => t.name).join(', ') || 'Instructor';
  const teacherCount = teachers?.length || 0;
  const lectureCount = lectures?.length || 0;
  const reviewCount = ratingCount || 0;
  const showEnrollmentBadge = !isComingSoon && enrollmentEnd && currentStatus !== 'course_started' && currentStatus !== 'enrollment_closed';
  
  const formatDate = (date) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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
      className="group relative bg-linear-to-br from-white via-gray-50 to-gray-100 rounded-3xl shadow-2xl hover:shadow-3xl overflow-hidden transition-all duration-500 border border-gray-200/50 font-hind flex flex-col backdrop-blur-sm"
      role="article"
    >
      {/* Background accent */}
      <div className={`absolute inset-0 bg-linear-to-br ${difficultyColors[difficulty]} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Status Badge */}
      <div className="absolute top-4 left-4 z-10">
        <CourseStatusBadge status={currentStatus} isUpcoming={isComingSoon} />
      </div>

      {/* Thumbnail section */}
      <div className="relative h-56 overflow-hidden">
        {thumbnail ? (
          <>
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                e.target.src = "/default-course.jpg";
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-500" />
          </>
        ) : (
          <div className="w-full h-full bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent" />
            <FiBookOpen className="text-5xl text-white opacity-90" />
          </div>
        )}

        {/* Enrollment badge - শুধুমাত্র তখনই দেখাবে যখন এনরোলমেন্ট ওপেন থাকে */}
        {showEnrollmentBadge && (
          <div className="absolute bottom-4 left-4">
            <div className="bg-linear-to-r from-orange-500 to-rose-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-2xl flex items-center gap-2 backdrop-blur-sm">
              <FiClock size={14} />
              <span>{getTimeRemaining(enrollmentEnd)}</span>
            </div>
          </div>
        )}

        {/* Rating overlay */}
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-2xl border border-white/10">
          <div className="relative">
            <FiStar className="text-yellow-400" size={16} />
            <div className="absolute inset-0 bg-yellow-400/20 blur-sm" />
          </div>
          <span className="font-bold">{averageRating?.toFixed(1) || "0.0"}</span>
          <span className="text-gray-300 text-xs">({reviewCount})</span>
        </div>
      </div>

      {/* Content section */}
      <div className="px-7 py-4 flex-1 flex flex-col relative">
        {/* Category and Difficulty badges */}
        <div className="flex justify-between flex-wrap gap-2 mb-4">
          <span className={`inline-block bg-linear-to-r ${difficultyColors[difficulty]} text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg`}>
            {categoryName}
          </span>
          
          {/* Course start date if available */}
          {!isComingSoon && courseStart && (
            <span className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              <FaGraduationCap size={12} />
              Starts: {formatDate(courseStart)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-500 leading-tight">
          {title}
        </h3>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-linear-to-br from-blue-50 to-white p-3 rounded-xl border border-blue-100 flex items-center gap-3 group/stat">
            <div className="bg-linear-to-r from-blue-500 to-cyan-500 p-2.5 rounded-lg">
              <FiClock className="text-white" size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="font-bold text-gray-900">{duration || 0} weeks</p>
            </div>
          </div>

          <div className="bg-linear-to-br from-emerald-50 to-white p-3 rounded-xl border border-emerald-100 flex items-center gap-3 group/stat">
            <div className="bg-linear-to-r from-emerald-500 to-green-500 p-2.5 rounded-lg">
              <FiBook className="text-white" size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Lectures</p>
              <p className="font-bold text-gray-900">{lectureCount}</p>
            </div>
          </div>
        </div>

        {/* Teachers section */}
        {teachers && teachers.length > 0 && (
          <div className="mb-3 p-4 bg-linear-to-r from-gray-50/80 to-white/80 rounded-2xl border border-gray-200/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FaChalkboardTeacher className="text-purple-600" size={18} />
                <span className="text-sm font-bold text-gray-700">Instructors</span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {teacherCount} {teacherCount > 1 ? "experts" : "expert"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600 truncate max-w-50">
                {teacherNames}
              </span>
            </div>
          </div>
        )}

        {/* Enrollment info for non-coming soon courses */}
        {!isComingSoon && enrollmentStart && enrollmentEnd && (
          <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-blue-500" size={14} />
              <span>Enrollment: {formatDate(enrollmentStart)} - {formatDate(enrollmentEnd)}</span>
            </div>
          </div>
        )}

        {/* Price and CTA */}
        <div className="mt-auto pt-5 border-t border-gray-200/50">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {formatPrice(price)}
                </span>
                <span className="text-gray-500 text-sm ml-1.5">TK</span>
              </div>
              {course.originalPrice && course.originalPrice > price && (
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
                to={`/course/${_id}`}
                className="relative overflow-hidden bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-7 py-3.5 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 shadow-xl flex items-center gap-3 group/btn"
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                <FiEye
                  size={18}
                  className="relative z-10 group-hover/btn:scale-110 transition-transform duration-300"
                />
                <span className="relative z-10">
                  {currentStatus === 'enrollment_open' ? 'Enroll Now' : 'View Details'}
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;