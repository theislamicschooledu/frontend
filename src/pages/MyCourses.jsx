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
  FiLock,
  FiXCircle,
  FiInfo,
  FiX
} from "react-icons/fi";
import api from "../utils/axios";

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRejection, setSelectedRejection] = useState(null);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const { data } = await api.get("/enrollments/my-enrollments");

      console.log(data)
      
      if (data.success) {
        setEnrollments(data.data);
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

  const calculateProgress = (enrollment) => {
    if (enrollment.completionStatus === 'completed') return 100;
    return enrollment.progress || 0;
  };

  const isButtonDisabled = (enrollment) => {
    return enrollment.paymentStatus !== 'completed';
  };

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

  const getButtonIcon = (enrollment) => {
    if (enrollment.paymentStatus !== 'completed') {
      return <FiLock />;
    }
    return <FiPlay />;
  };

  const RejectionModal = () => {
    if (!selectedRejection) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl max-w-md w-full p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
              <FiXCircle />
              Enrollment Rejected
            </h3>
            <button
              onClick={() => setSelectedRejection(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Course:</p>
            <p className="font-semibold">{selectedRejection.course?.title}</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2 flex items-center gap-2">
              <FiAlertCircle className="text-red-500" />
              <span className="font-medium">Rejection Reason:</span>
            </p>
            <p className="text-gray-800">
              {selectedRejection.paymentDetails?.rejectionReason || 
               "No specific reason provided"}
            </p>
          </div>

          {selectedRejection.paymentDetails?.rejectedAt && (
            <div className="text-sm text-gray-500 mb-4">
              Rejected on: {new Date(selectedRejection.paymentDetails.rejectedAt).toLocaleDateString('bn-BD', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800 flex items-start gap-2">
              <FiInfo className="shrink-0 mt-0.5" />
              <span> 
                সাপোর্ট টিমের সাথে যোগাযোগ করুন।
              </span>
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to={`/course/${selectedRejection.course?._id}`}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition"
              onClick={() => setSelectedRejection(null)}
            >
              Try Again
            </Link>
            <button
              onClick={() => setSelectedRejection(null)}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    );
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
      {/* Rejection Modal */}
      <RejectionModal />

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

                  {/* CANCELLED OVERLAY */}
                  {item.paymentStatus === "cancelled" && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                      <button
                        onClick={() => setSelectedRejection(item)}
                        className="bg-white/90 hover:bg-white text-red-600 rounded-lg px-4 py-2 text-sm font-medium shadow-lg transition-all flex items-center gap-2"
                      >
                        <FiAlertCircle />
                        View Reason
                      </button>
                    </div>
                  )}

                  {/* PENDING OVERLAY */}
                  {item.paymentStatus === "pending" && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="bg-white/90 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 shadow-lg">
                        <FiClock className="inline mr-2 text-yellow-500" />
                        Awaiting approval
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
                      <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                        {item.paymentStatus === "pending" ? (
                          <>
                            <FiClock className="text-yellow-500" />
                            ⏳ Admin approval pending
                          </>
                        ) : item.paymentStatus === "cancelled" ? (
                          <>
                            <FiXCircle className="text-red-500" />
                            <span>🚫 Access denied</span>
                            <button
                              onClick={() => setSelectedRejection(item)}
                              className="text-red-600 underline text-xs ml-1 hover:no-underline"
                            >
                              (Why?)
                            </button>
                          </>
                        ) : null}
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

                  {/* PAYMENT DETAILS */}
                  {item.paymentStatus === "pending" && (
                    <div className="mt-3 text-xs text-center text-gray-500">
                      Transaction ID: {item.transactionId}
                    </div>
                  )}

                  {item.paymentStatus === "cancelled" && (
                    <div className="mt-3 text-xs text-center">
                      <button
                        onClick={() => setSelectedRejection(item)}
                        className="text-red-600 hover:text-red-700 underline"
                      >
                        দেখুন কেন রিজেক্ট করা হয়েছে
                      </button>
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