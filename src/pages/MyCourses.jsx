import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiBook,
  FiClock,
  FiPlay,
  FiSearch,
  FiBarChart2,
  FiCalendar,
  FiAlertCircle,
  FiLoader,
  FiLock
} from "react-icons/fi";
import api from "../utils/axios";

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      // এনরোলমেন্ট API কল - নতুন এন্ডপয়েন্ট
      const { data } = await api.get("/enrollments/my-enrollments");

      console.log(data)
      
      if (data.success) {
        setEnrollments(data.data);
      } else {
        console.error("Failed to fetch enrollments:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch enrollments", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = enrollments.filter((item) =>
    item.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // প্রগ্রেস ক্যালকুলেশন
  const calculateProgress = (enrollment) => {
    if (enrollment.completionStatus === 'completed') return 100;
    return enrollment.progress || 0;
  };

  // বাটন ডিসএবল্ড কিনা চেক
  const isButtonDisabled = (enrollment) => {
    return enrollment.paymentStatus !== 'completed';
  };

  // বাটনের টেক্সট
  const getButtonText = (enrollment) => {
    if (enrollment.paymentStatus === 'pending') {
      return 'Pending Approval';
    }
    if (enrollment.paymentStatus === 'cancelled') {
      return 'Enrollment Cancelled';
    }
    if (enrollment.paymentStatus === 'failed') {
      return 'Payment Failed';
    }
    return calculateProgress(enrollment) > 0 ? 'Continue Learning' : 'Start Learning';
  };

  // বাটনের আইকন
  const getButtonIcon = (enrollment) => {
    if (enrollment.paymentStatus !== 'completed') {
      return <FiLock />;
    }
    return <FiPlay />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <FiLoader className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-20">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <FiBook className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              {searchTerm ? "No matching courses" : "You haven't enrolled yet"}
            </h2>
            {!searchTerm && (
              <Link
                to="/courses"
                className="mt-5 inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition"
              >
                Browse Courses
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all"
              >
                {/* THUMBNAIL */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.course?.thumbnail || "https://via.placeholder.com/300x200?text=No+Image"}
                    alt={item.course?.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />

                  {/* STATUS BADGE */}
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 text-xs font-medium rounded-full text-white shadow ${
                      item.paymentStatus === "completed"
                        ? "bg-green-500"
                        : item.paymentStatus === "pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {item.paymentStatus === "completed"
                      ? "Active"
                      : item.paymentStatus === "pending"
                      ? "Pending"
                      : "Cancelled"}
                  </span>

                  {/* PENDING OVERLAY (যদি প্রয়োজন হয়) */}
                  {item.paymentStatus !== "completed" && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="bg-white/90 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 shadow-lg">
                        <FiAlertCircle className="inline mr-2 text-yellow-500" />
                        {item.paymentStatus === "pending" 
                          ? "Awaiting approval" 
                          : "Access restricted"}
                      </div>
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  {/* PROGRESS BAR (শুধু অ্যাপ্রুভড কোর্সের জন্য) */}
                  {item.paymentStatus === "completed" ? (
                    <div className="w-full">
                      <div className="flex justify-between text-black text-sm">
                        <span>Progress</span>
                        <span>{calculateProgress(item)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                        <div
                          className="bg-green-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${calculateProgress(item)}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full bg-gray-100 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600">
                        {item.paymentStatus === "pending" 
                          ? "⏳ Admin approval pending" 
                          : "🚫 Access denied"}
                      </p>
                    </div>
                  )}

                  {/* COURSE TITLE */}
                  <h3 className="text-lg font-bold text-gray-800 mt-3 line-clamp-2">
                    {item.course?.title || "Course Unavailable"}
                  </h3>

                  {/* STATS */}
                  <div className="flex justify-between text-gray-500 text-sm mt-4 mb-2">
                    <div className="flex items-center gap-1">
                      <FiClock /> {item.course?.duration || 0}h
                    </div>
                    <div className="flex items-center gap-1">
                      <FiBarChart2 /> {item.paymentStatus === "completed" ? calculateProgress(item) : 0}%
                    </div>
                  </div>

                  {/* ENROLLMENT DATE */}
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                    <FiCalendar />
                    Enrolled {new Date(item.enrolledAt || item.createdAt).toLocaleDateString("en-US", {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>

                  {/* ACTION BUTTON */}
                  {isButtonDisabled(item) ? (
                    <button
                      disabled
                      className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-gray-400 text-white rounded-xl font-semibold cursor-not-allowed opacity-60"
                    >
                      {getButtonIcon(item)}
                      {getButtonText(item)}
                    </button>
                  ) : (
                    <Link
                      to={`/learn/${item.course?._id}`}
                      className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow hover:shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      {getButtonIcon(item)}
                      {getButtonText(item)}
                    </Link>
                  )}

                  {/* PAYMENT DETAILS (ছোট তথ্য) */}
                  {item.paymentStatus === "pending" && (
                    <div className="mt-3 text-xs text-center text-gray-500">
                      Transaction ID: {item.transactionId}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;