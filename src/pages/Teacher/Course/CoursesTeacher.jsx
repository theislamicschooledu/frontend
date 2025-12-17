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
} from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../utils/axios";
import ConfirmModal from "../../../components/ConfirmModal";
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
      const res = await api.get("/courses/teacherCourses");
            
      setCourses(res.data.data);
    } catch (err) {
      toast.error("Failed to load courses", err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      course.status === filterStatus ||
      (filterStatus === "featured" && course.featured === true);

    return matchesSearch && matchesStatus;
  });

  const statusCounts = courses.reduce(
    (acc, course) => {
      acc.all += 1;
      if (course.status === "published") acc.published += 1;
      if (course.status === "pending") acc.pending += 1;
      if (course.status === "rejected") acc.rejected += 1;
      if (course.featured) acc.featured += 1;
      return acc;
    },
    { all: 0, published: 0, pending: 0, rejected: 0, featured: 0 }
  );

  const getStatusColor = (status) => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
      {/* Page Title */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Course Management
          </h1>
          <p className="text-gray-600">
            Manage all courses in your IslamicLearn platform
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-wrap gap-3">
          {["all", "published", "pending", "rejected", "featured"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filterStatus === status
                    ? status === "published"
                      ? "bg-green-600 text-white"
                      : status === "pending"
                      ? "bg-yellow-400 text-white"
                      : status === "rejected"
                      ? "bg-red-600 text-white"
                      : status === "featured"
                      ? "bg-amber-500 text-white"
                      : "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} (
                {statusCounts[status]})
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
            <div className="col-span-2 text-center">Category</div>
            <div className="col-span-2 text-center">Stats</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          {/* Course List Items */}
          <div className="divide-y divide-gray-100">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                {/* Course Information */}
                <div className="col-span-4 flex items-start space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-r from-green-100 to-emerald-100">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-green-100 to-emerald-100">
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
                        <FiStar className="text-amber-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: course.description?.slice(0, 120) + "...",
                        }}
                      />
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="text-gray-400" />
                        <span>{formatDate(course.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-green-700">
                          {course.price} tk
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="col-span-2 flex items-center justify-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {course.category?.name || "Uncategorized"}
                  </span>
                </div>

                {/* Stats */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center space-x-1">
                        <FaChalkboardTeacher className="text-gray-400" />
                        <span className="font-semibold">
                          {course.teachers?.length || 0}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Teachers</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center space-x-1">
                        <FiList className="text-gray-400" />
                        <span className="font-semibold">
                          {course.lectures.length || 0}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Lectures</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center space-x-1">
                        <FiStar className="text-amber-400" />
                        <span className="font-semibold">
                          {course.averageRating || "0.0"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Rating</span>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="flex flex-col items-center space-y-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        course.status
                      )}`}
                    >
                      {course.status?.charAt(0).toUpperCase() +
                        course.status?.slice(1).toLowerCase()}
                    </span>
                    {course.featured && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-center space-x-1">
                  <Link
                    to={`/teacher/courses/${course._id}`}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    title="View Course"
                  >
                    <FiEye className="text-lg" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <FiBookOpen className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No course posts found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("all");
              fetchCourses();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            Clear Filters
          </button>
        </div>
      )}
    </main>
  );
};

export default CoursesTeacher;