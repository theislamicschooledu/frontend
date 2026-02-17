import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiPlus,
  FiCheckCircle,
  FiXCircle,
  FiStar,
  FiList,
  FiUsers,
  FiCalendar,
  FiClock,
  FiInfo
} from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../utils/axios";
import { FaChalkboardTeacher } from "react-icons/fa";

const CoursesTeacher = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses/teacher/my-courses"); // API endpoint আপডেট
      
      // Check if response has the correct structure
      if (res.data && res.data.success) {
        setCourses(res.data.data || []);
      } else if (Array.isArray(res.data)) {
        // If response is directly an array
        setCourses(res.data);
      } else {
        setCourses([]);
        console.error("Unexpected response structure:", res.data);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to load courses";
      toast.error(errorMessage);
      console.error("Fetch courses error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if course is upcoming
  const isCourseUpcoming = (course) => {
    return course.isUpcoming === true;
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === "all" ||
      course.status === filterStatus ||
      (filterStatus === "featured" && course.featured === true) ||
      (filterStatus === "upcoming" && isCourseUpcoming(course));

    return matchesSearch && matchesStatus;
  });

  const statusCounts = courses.reduce(
    (acc, course) => {
      acc.all += 1;
      if (course.status === "published") acc.published += 1;
      if (course.status === "pending") acc.pending += 1;
      if (course.status === "rejected") acc.rejected += 1;
      if (course.isUpcoming === true) acc.upcoming += 1;
      if (course.featured) acc.featured += 1;
      
      return acc;
    },
    { all: 0, published: 0, pending: 0, rejected: 0, upcoming: 0, featured: 0 }
  );

  const getStatusColor = (status, isUpcoming = false) => {
    if (isUpcoming) {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
    
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (course) => {
    if (course.isUpcoming === true) {
      return "Upcoming";
    }
    return course.status?.charAt(0).toUpperCase() + course.status?.slice(1).toLowerCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not Set";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
      {/* Page Title */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            My Courses
          </h1>
          <p className="text-gray-600">
            Manage your courses on the platform
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{statusCounts.all}</div>
          <div className="text-sm text-gray-600">Total Courses</div>
        </div>
        <div className="bg-green-50 rounded-2xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-800">{statusCounts.published}</div>
          <div className="text-sm text-green-600">Published</div>
        </div>
        <div className="bg-yellow-50 rounded-2xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-800">{statusCounts.pending}</div>
          <div className="text-sm text-yellow-600">Pending</div>
        </div>
        <div className="bg-blue-50 rounded-2xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-800">{statusCounts.upcoming}</div>
          <div className="text-sm text-blue-600">Upcoming</div>
        </div>
        <div className="bg-amber-50 rounded-2xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-amber-800">{statusCounts.featured}</div>
          <div className="text-sm text-amber-600">Featured</div>
        </div>
        <div className="bg-red-50 rounded-2xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-800">{statusCounts.rejected}</div>
          <div className="text-sm text-red-600">Rejected</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses by title or description..."
            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-wrap gap-3">
          {["all", "published", "pending", "rejected", "upcoming", "featured"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filterStatus === status
                    ? status === "published"
                      ? "bg-green-600 text-white"
                      : status === "pending"
                      ? "bg-yellow-500 text-white"
                      : status === "rejected"
                      ? "bg-red-600 text-white"
                      : status === "upcoming"
                      ? "bg-blue-600 text-white"
                      : status === "featured"
                      ? "bg-amber-500 text-white"
                      : "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')} (
                {statusCounts[status] || 0})
              </button>
            )
          )}
        </div>
      </div>

      {/* Course List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
            <div className="col-span-4">Course Information</div>
            <div className="col-span-2 text-center">Category & Type</div>
            <div className="col-span-2 text-center">Stats</div>
            <div className="col-span-2 text-center">Status & Dates</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          {/* Course List Items */}
          <div className="divide-y divide-gray-100">
            {filteredCourses.map((course, index) => {
              const isUpcoming = course.isUpcoming === true;
              return (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                {/* Course Information */}
                <div className="col-span-4 flex items-start space-x-4">
                  <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-linear-to-r from-green-100 to-emerald-100">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-r from-green-100 to-emerald-100">
                        <FiBookOpen className="text-green-600 text-xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {course.title}
                      </h3>
                      {course.featured && (
                        <FiStar className="text-amber-500 shrink-0" />
                      )}
                      {isUpcoming && (
                        <FiInfo className="text-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {course.description ? (
                        <div
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: course.description?.slice(0, 120) + "...",
                          }}
                        />
                      ) : (
                        "No description available"
                      )}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="text-gray-400" />
                        <span>{formatDate(course.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-green-700">
                          ${course.price || 0}
                        </span>
                      </div>
                      {course.duration && (
                        <div className="flex items-center space-x-1">
                          <FiClock className="text-gray-400" />
                          <span>{course.duration} hours</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Category & Type */}
                <div className="col-span-2 flex flex-col items-center justify-center space-y-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {course.category?.name || "Uncategorized"}
                  </span>
                  {isUpcoming && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      Upcoming
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center space-x-1">
                        <FiList className="text-gray-400" />
                        <span className="font-semibold">
                          {course.lectures?.length || 0}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Lectures</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center space-x-1">
                        <FiUsers className="text-gray-400" />
                        <span className="font-semibold">
                          {course.studentCount || 0}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Students</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center space-x-1">
                        <FiStar className="text-amber-400" />
                        <span className="font-semibold">
                          {course.averageRating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Rating</span>
                    </div>
                  </div>
                </div>

                {/* Status & Dates */}
                <div className="col-span-2 flex flex-col items-center justify-center space-y-2">
                  <div className="flex flex-col items-center space-y-1">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        course.status,
                        isUpcoming
                      )}`}
                    >
                      {getStatusText(course)}
                    </span>
                    {course.featured && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Featured
                      </span>
                    )}
                  </div>
                  {isUpcoming ? (
                    <div className="text-center">
                      {course.enrollmentStart || course.enrollmentEnd || course.courseStart ? (
                        <div className="text-xs text-blue-600">
                          <div>Tentative Dates:</div>
                          {course.enrollmentStart && (
                            <div>Start: {formatDate(course.enrollmentStart)}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-blue-600 italic">
                          Dates not set
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      {course.enrollmentStart && course.enrollmentEnd ? (
                        <>
                          <div className="text-xs text-gray-500">
                            {formatDate(course.enrollmentStart)} - {formatDate(course.enrollmentEnd)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Starts: {formatDate(course.courseStart)}
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-red-500 italic">
                          Dates required
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-center space-x-1">
                  <Link
                    to={`/teacher/courses/${course._id}`}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    title="View Course Details"
                  >
                    <FiEye className="text-lg" />
                  </Link>
                  
                  {/* Teacher edit permission logic */}
                  {/* Teacher can edit if: status is not published OR course is upcoming */}
                  {(course.status !== "published" || isUpcoming) && (
                    <Link
                      to={`/teacher/courses/update/${course._id}`}
                      className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit Course"
                    >
                      <FiEdit className="text-lg" />
                    </Link>
                  )}
                </div>
              </motion.div>
            )})}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <FiBookOpen className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No courses found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterStatus !== "all" 
              ? "Try adjusting your search or filters" 
              : "You haven't created any courses yet"}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default CoursesTeacher;