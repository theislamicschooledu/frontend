// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiStar,
  FiClock,
  FiBook,
  FiPlay,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiDownload,
  FiBookOpen,
  FiUsers,
  FiAward,
  FiShare2,
  FiHeart,
  FiInfo,
  FiX,
} from "react-icons/fi";
import { FaChalkboardTeacher, FaRegClock, FaGraduationCap } from "react-icons/fa";
import { IoIosTrendingUp } from "react-icons/io";
import { MdWorkspacePremium } from "react-icons/md";
import api from "../utils/axios";
import PaymentModal from "../components/PaymentModal";
import { useAuth } from "../hooks/useAuth";

// Course Status Badge Component
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
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${config.bg} ${config.textColor}`}>
      <Icon size={14} />
      {config.text}
    </span>
  );
};

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedLectures, setExpandedLectures] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const { user } = useAuth();

  const fetchCourseDetails = useCallback(async () => {
    setLoading(true);
    try {
      // ফিক্সড: সঠিক API endpoint ব্যবহার করা হয়েছে
      const courseRes = await api.get(`/courses/details/${id}`);

      if (courseRes.data.success) {
        const courseData = courseRes.data.data || courseRes.data.course;

        setCourse(courseData);
        setLectures(courseData.lectures || []);
        setTeachers(courseData.teachers || []);
        
        // লেকচার এক্সপান্ডেড স্টেট সেটআপ
        const expanded = {};
        (courseData.lectures || []).forEach(lec => {
          expanded[lec._id] = false;
        });
        setExpandedLectures(expanded);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load course details"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    try {
      // ফিক্সড: রিভিউ API endpoint
      const res = await api.get(`/reviews/course/${id}`);
      if (res.data.success) {
        setReviews(res.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  }, [id]);

  const fetchEnrollment = useCallback(async () => {
    try {
      const res = await api.get("/enrollments/my-enrollments");
      const data = res.data.data || res.data;
      
      const findCourse = data.find((d) => d.course?._id === id);
      if (findCourse && findCourse.paymentStatus === "completed") {
        setEnrolled(true);
      } else {
        setEnrolled(false);
      }
    } catch (error) {
      console.log("Enrollment check failed:", error);
      setEnrolled(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourseDetails();
    fetchReviews();
    if (user) fetchEnrollment();
  }, [fetchCourseDetails, fetchEnrollment, fetchReviews, user]);

  const toggleLecture = (lectureId) => {
    setExpandedLectures((prev) => ({
      ...prev,
      [lectureId]: !prev[lectureId],
    }));
  };

  const getTimeRemaining = (enrollmentEnd) => {
    if (!enrollmentEnd) return "Enrollment Open";

    const now = new Date();
    const end = new Date(enrollmentEnd);
    const diff = end - now;

    if (diff <= 0) return "Enrollment Closed";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} days left`;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours} hours left`;
  };

  const formatDuration = (weeks) => {
    if (!weeks) return "Not specified";
    if (weeks < 1) return `${Math.round(weeks * 7)} days`;
    return `${weeks} week${weeks > 1 ? "s" : ""}`;
  };

  const handleEnrollClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to enroll");
      navigate("/login", { state: { from: `/course/${id}` } });
      return;
    }

    // Check if enrollment is open
    if (course.currentStatus !== 'enrollment_open') {
      toast(
        course.currentStatus === 'coming_soon' 
          ? "This course is coming soon! Enrollment will open when dates are announced."
          : course.currentStatus === 'enrollment_closed'
          ? "Enrollment for this course is closed."
          : course.currentStatus === 'course_started'
          ? "This course has already started. You can enroll in the next batch."
          : "Enrollment is not available at this time."
      );
      return;
    }

    setShowPaymentModal(true);
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please login to add to wishlist");
      navigate("/login", { state: { from: `/course/${id}` } });
      return;
    }

    try {
      const res = await api.post(`/wishlist/toggle/${id}`);
      if (res.data.success) {
        setWishlisted(res.data.isInWishlist);
        toast.success(
          res.data.isInWishlist ? "Added to wishlist" : "Removed from wishlist"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update wishlist");
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`${
              i < fullStars
                ? "text-yellow-400 fill-current"
                : hasHalfStar && i === fullStars
                ? "text-yellow-400 fill-current opacity-75"
                : "text-gray-300"
            }`}
            size={16}
          />
        ))}
        <span className="ml-2 text-sm font-medium">
          {rating?.toFixed(1) || "0.0"}
        </span>
      </div>
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not Set";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FiBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-600 mb-2">
            Course not found
          </h3>
          <button
            onClick={() => navigate("/courses")}
            className="px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const canEnroll = course.currentStatus === 'enrollment_open';
  const isComingSoon = course.currentStatus === 'coming_soon';

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      {/* Course Header */}
      <div className="pt-16 sm:pt-20 bg-linear-to-br from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
              backgroundSize: "100px 100px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 text-blue-200 text-xs sm:text-sm">
                    <button
                      onClick={() => navigate("/courses")}
                      className="hover:text-white transition-colors"
                    >
                      Courses
                    </button>
                    <span>›</span>
                    <span>{course.category?.name || "Uncategorized"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* ফিক্সড: স্ট্যাটাস ব্যাজ */}
                    <CourseStatusBadge status={course.currentStatus} />
                    
                    {course.featured && (
                      <span className="bg-amber-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1">
                        <IoIosTrendingUp className="text-xs sm:text-sm" />
                        <span className="hidden sm:inline">Featured</span>
                        <span className="sm:hidden">Feat.</span>
                      </span>
                    )}
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                  {course.title}
                </h1>

                <p className="text-sm sm:text-base lg:text-lg text-blue-100 mb-6 sm:mb-8 leading-relaxed max-w-3xl">
                  {course.description
                    ?.replace(/<[^>]*>/g, "")
                    .substring(0, window.innerWidth < 640 ? 100 : 200)}
                  {course.description?.length >
                    (window.innerWidth < 640 ? 100 : 200) && "..."}
                </p>

                <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 text-blue-100">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-xs sm:text-sm">
                    <FiStar className="text-amber-300 text-sm sm:text-base" />
                    <span className="font-semibold">
                      {course.averageRating?.toFixed(1) || "0.0"}
                    </span>
                    <span className="hidden sm:inline">
                      ({course.ratingCount || 0} reviews)
                    </span>
                    <span className="sm:hidden">
                      ({course.ratingCount || 0})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-xs sm:text-sm">
                    <FiUsers className="text-amber-300 text-sm sm:text-base" />
                    <span>{course.studentCount || 0} students</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-xs sm:text-sm">
                    <FiClock className="text-amber-300 text-sm sm:text-base" />
                    <span>{formatDuration(course.duration)}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-xs sm:text-sm">
                    <FiBook className="text-amber-300 text-sm sm:text-base" />
                    <span>{lectures.length} lectures</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Enrollment Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`lg:sticky lg:top-24 bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl p-4 sm:p-6 text-gray-800 ${
                isComingSoon ? "border-2 border-blue-200" : ""
              }`}
            >
              {/* Coming Soon Banner */}
              {isComingSoon && (
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <FiInfo className="text-blue-500 shrink-0" />
                    <div>
                      <h4 className="font-bold text-blue-800 text-sm sm:text-base">
                        Coming Soon
                      </h4>
                      <p className="text-blue-600 text-xs sm:text-sm">
                        This course will be available soon
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4">
                {course.thumbnail ? (
                  <>
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-32 sm:h-40 object-cover"
                      onError={(e) => {
                        e.target.src = "/default-course.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                      <button
                        onClick={toggleWishlist}
                        className={`p-1 sm:p-2 rounded-full backdrop-blur-sm transition-all ${
                          wishlisted
                            ? "bg-red-500 text-white"
                            : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                      >
                        <FiHeart className={`text-sm sm:text-base ${wishlisted ? "fill-current" : ""}`} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-32 sm:h-40 bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <FiBookOpen className="text-3xl sm:text-4xl text-white" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-800">
                    ৳{course.price || 0}
                  </span>
                </div>
              </div>

              {/* Time Remaining - শুধুমাত্র enrollment_open থাকলে দেখাবে */}
              {canEnroll && course.enrollmentEnd && (
                <div className="bg-linear-to-r from-amber-500 to-orange-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl text-center mb-3 sm:mb-4">
                  <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
                    <FaRegClock className="text-xs sm:text-sm" />
                    {getTimeRemaining(course.enrollmentEnd)}
                  </div>
                </div>
              )}

              <div className="space-y-2 sm:space-y-3">
                {enrolled ? (
                  <div className="space-y-2 sm:space-y-3">
                    <button
                      className="w-full bg-linear-to-r from-green-500 to-emerald-500 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                      onClick={() => navigate(`/learn/${course._id}`)}
                    >
                      <FiPlay className="text-sm sm:text-base" />
                      Continue Learning
                    </button>
                    <button className="w-full border border-blue-600 sm:border-2 text-blue-600 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-50 transition-colors text-sm sm:text-base">
                      Share Course
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    <button
                      onClick={handleEnrollClick}
                      className={`w-full py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 duration-200 text-sm sm:text-base ${
                        !canEnroll
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-linear-to-r from-blue-500 to-purple-500 text-white"
                      }`}
                      disabled={!canEnroll}
                    >
                      {isComingSoon 
                        ? "Coming Soon" 
                        : course.currentStatus === 'enrollment_closed'
                        ? "Enrollment Closed"
                        : course.currentStatus === 'course_started'
                        ? "Course Started"
                        : "Enroll Now"}
                    </button>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <button
                        onClick={toggleWishlist}
                        className={`border py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                          wishlisted
                            ? "border-red-500 text-red-500 bg-red-500/10"
                            : "border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600"
                        }`}
                      >
                        <FiHeart
                          className={`${
                            wishlisted ? "fill-current" : ""
                          } text-sm sm:text-base`}
                        />
                        {wishlisted ? "Wishlisted" : "Wishlist"}
                      </button>
                      <button className="border border-gray-300 text-gray-700 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
                        <FiShare2 className="text-sm sm:text-base" />
                        Share
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 rounded-lg sm:rounded-xl text-center">
                <p className="text-xs sm:text-sm text-blue-700 font-medium">
                  🎯 30-Day Money-Back Guarantee
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
              <div className="flex flex-wrap gap-1 sm:gap-2 border-b border-gray-200 pb-3 sm:pb-4 overflow-x-auto scrollbar-hide">
                {[
                  {
                    id: "overview",
                    label: "Overview",
                    icon: FiBook,
                    mobileLabel: "Overview",
                  },
                  {
                    id: "curriculum",
                    label: "Curriculum",
                    icon: FiPlay,
                    mobileLabel: "Curriculum",
                  },
                  {
                    id: "instructors",
                    label: "Instructors",
                    icon: FaChalkboardTeacher,
                    mobileLabel: "Teachers",
                  },
                  {
                    id: "reviews",
                    label: "Reviews",
                    icon: FiStar,
                    mobileLabel: "Reviews",
                  },
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                        activeTab === tab.id
                          ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-md sm:shadow-lg shadow-blue-500/25"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <IconComponent className="text-sm sm:text-base" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden text-xs">
                        {tab.mobileLabel}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 sm:pt-6">
                <AnimatePresence mode="wait">
                  {activeTab === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6 sm:space-y-8"
                    >
                      <div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                          About This Course
                        </h3>
                        <div
                          className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg prose prose-sm sm:prose-lg max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: course.description || "<p>No description available.</p>",
                          }}
                        />
                      </div>

                      {/* Features Section */}
                      {course.features && course.features.length > 0 && (
                        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8">
                          <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                            <FiAward className="text-blue-600 text-base sm:text-xl" />
                            What You'll Learn
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {course.features.map((item, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl shadow-sm"
                              >
                                <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                                  <FiCheck className="text-white text-xs sm:text-sm" />
                                </div>
                                <span className="text-gray-700 font-medium text-sm sm:text-base">
                                  {item}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Coming Soon Notice */}
                      {isComingSoon && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-blue-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6"
                        >
                          <div className="flex items-start gap-3">
                            <FiInfo className="text-blue-500 text-xl mt-1 shrink-0" />
                            <div>
                              <h4 className="font-bold text-blue-800 text-lg sm:text-xl mb-2">
                                Coming Soon
                              </h4>
                              <p className="text-blue-700 mb-3 text-sm sm:text-base">
                                This course is currently in preparation.
                                Enrollment will open once all content is ready
                                and dates are announced.
                              </p>
                              <div className="flex items-center gap-2 text-sm text-blue-600">
                                <span className="font-medium">Status:</span>
                                <span className="bg-blue-100 px-3 py-1 rounded-full">
                                  In Development
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "instructors" && (
                    <motion.div
                      key="instructors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                        Meet Your Instructors
                      </h3>
                      <div className="space-y-4 sm:space-y-6">
                        {teachers.length > 0 ? (
                          teachers.map((teacher, index) => (
                            <motion.div
                              key={teacher._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-linear-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6"
                            >
                              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                                <div className="relative">
                                  <img
                                    src={
                                      teacher.avatar ||
                                      `https://ui-avatars.com/api/?name=${teacher.name}&background=random`
                                    }
                                    alt={teacher.name}
                                    className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl object-cover border-2 sm:border-4 border-white shadow-lg"
                                    onError={(e) => {
                                      e.target.src = `https://ui-avatars.com/api/?name=${teacher.name}&background=random`;
                                    }}
                                  />
                                  <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 bg-blue-500 text-white p-1 sm:p-2 rounded-full">
                                    <FaChalkboardTeacher className="text-sm sm:text-base lg:text-lg" />
                                  </div>
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                  <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2">
                                    {teacher.name}
                                  </h4>
                                  <p className="text-blue-600 font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                                    {teacher.expertise || "Expert Instructor"}
                                  </p>
                                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                                    {teacher.bio ||
                                      "Experienced instructor with passion for teaching."}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-8 sm:py-12">
                            <FaChalkboardTeacher className="text-4xl sm:text-6xl text-gray-300 mx-auto mb-3 sm:mb-4" />
                            <p className="text-gray-500 text-sm sm:text-base">
                              No instructors assigned yet
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "reviews" && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                          Student Reviews
                        </h3>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="text-center">
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">
                              {course.averageRating?.toFixed(1) || "0.0"}
                            </div>
                            <div className="flex justify-center mt-1 sm:mt-2">
                              {renderStars(course.averageRating || 0)}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 mt-1">
                              {course.ratingCount || 0} reviews
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 sm:space-y-6">
                        {reviews.length > 0 ? (
                          reviews.map((review, index) => (
                            <motion.div
                              key={review._id || index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 hover:shadow-md sm:hover:shadow-lg transition-shadow"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                                <div className="flex items-center gap-3 sm:gap-4">
                                  <img
                                    src={
                                      review.user?.avatar ||
                                      `https://ui-avatars.com/api/?name=${review.user?.name}&background=random`
                                    }
                                    alt={review.user?.name}
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                                    onError={(e) => {
                                      e.target.src = `https://ui-avatars.com/api/?name=${review.user?.name}&background=random`;
                                    }}
                                  />
                                  <div>
                                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                                      {review.user?.name || "Anonymous"}
                                    </h4>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                                      {renderStars(review.rating)}
                                      <span className="text-xs sm:text-sm text-gray-500">
                                        {review.createdAt
                                          ? new Date(
                                              review.createdAt
                                            ).toLocaleDateString()
                                          : ""}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {review.rating >= 4 && (
                                  <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1 self-start sm:self-center">
                                    <MdWorkspacePremium className="text-xs sm:text-sm" />
                                    <span className="hidden sm:inline">
                                      Verified
                                    </span>
                                    <span className="sm:hidden">✓</span>
                                  </span>
                                )}
                              </div>

                              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                {review.comment}
                              </p>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-8 sm:py-12 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl lg:rounded-3xl">
                            <FiStar className="text-4xl sm:text-6xl text-gray-300 mx-auto mb-3 sm:mb-4" />
                            <h4 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                              No reviews yet
                            </h4>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "curriculum" && (
                    <motion.div
                      key="curriculum"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                          Course Curriculum
                        </h3>
                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 text-gray-600">
                          <span className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full font-medium text-xs sm:text-sm">
                            {lectures.length} lectures
                          </span>
                          <span className="bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full font-medium text-xs sm:text-sm">
                            {formatDuration(course.duration)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        {lectures.length > 0 ? (
                          lectures.map((lecture, index) => (
                            <motion.div
                              key={lecture._id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:border-blue-300 hover:shadow-md sm:hover:shadow-lg transition-all duration-300"
                            >
                              <div
                                className="flex items-center justify-between p-3 sm:p-4 lg:p-6 cursor-pointer"
                                onClick={() => toggleLecture(lecture._id)}
                              >
                                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1">
                                  <div
                                    className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base ${
                                      enrolled
                                        ? "bg-green-100 text-green-600"
                                        : "bg-blue-100 text-blue-600"
                                    }`}
                                  >
                                    {index + 1}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base lg:text-lg truncate sm:whitespace-normal">
                                      {lecture.title}
                                    </h4>
                                    {lecture.duration && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        Duration: {lecture.duration} min
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3">
                                  {expandedLectures[lecture._id] ? (
                                    <FiChevronUp className="text-gray-400 text-base sm:text-xl" />
                                  ) : (
                                    <FiChevronDown className="text-gray-400 text-base sm:text-xl" />
                                  )}
                                </div>
                              </div>

                              <AnimatePresence>
                                {expandedLectures[lecture._id] && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6"
                                  >
                                    <div className="pt-3 sm:pt-4 border-t border-gray-200">
                                      <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                                        {lecture.description ||
                                          "No description available."}
                                      </p>
                                      {lecture.resources && lecture.resources.length > 0 && (
                                        <div className="mt-3">
                                          <h5 className="font-semibold text-gray-700 mb-2 text-sm">
                                            Resources:
                                          </h5>
                                          <div className="flex flex-wrap gap-2">
                                            {lecture.resources.map((resource, idx) => (
                                              <a
                                                key={idx}
                                                href={resource.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-xs text-gray-700 hover:bg-blue-100 transition-colors"
                                              >
                                                <FiDownload size={14} />
                                                {resource.title}
                                              </a>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-8 sm:py-12 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl lg:rounded-3xl">
                            <FiBook className="text-4xl sm:text-6xl text-gray-300 mx-auto mb-3 sm:mb-4" />
                            <p className="text-gray-500 text-sm sm:text-base">
                              {isComingSoon
                                ? "Course content is being prepared. Check back soon!"
                                : "No lectures added yet"}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 sticky top-24"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FiAward className="text-blue-500" />
                Course Includes
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: FiPlay,
                    text: `${formatDuration(course.duration)} video content`,
                  },
                  { icon: FiDownload, text: "Downloadable resources" },
                  { icon: FiBook, text: "Full lifetime access" },
                  { icon: FiCalendar, text: "Access on mobile and TV" },
                  { icon: FiAward, text: "Certificate of completion" },
                  { icon: FiUsers, text: "Direct instructor support" },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    <feature.icon className="text-blue-500 text-lg" />
                    <span className="text-gray-700 font-medium">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Course Timeline */}
            {!isComingSoon && (course.enrollmentStart || course.enrollmentEnd || course.courseStart) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 sticky top-96"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FiCalendar className="text-purple-500" />
                  Course Timeline
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      label: "Enrollment Starts",
                      date: course.enrollmentStart,
                      color: "text-green-600",
                    },
                    {
                      label: "Enrollment Ends",
                      date: course.enrollmentEnd,
                      color: "text-amber-600",
                    },
                    {
                      label: "Course Starts",
                      date: course.courseStart,
                      color: "text-blue-600",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                    >
                      <span className="text-gray-600 font-medium">
                        {item.label}
                      </span>
                      <span className={`font-semibold ${item.color}`}>
                        {formatDate(item.date)}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        course={course}
        onSuccess={() => {
          setShowPaymentModal(false);
          setEnrolled(true);
          fetchCourseDetails();
          toast.success("Successfully enrolled in the course!");
        }}
      />
    </div>
  );
};

export default CourseDetails;