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
      const { data } = await api.get("/payments/enrollments");
      if (data.success) {
        setEnrollments(data.enrollments);
      }
    } catch (error) {
      console.error("Failed to fetch enrollments", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = enrollments.filter((e) =>
    e.course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
          <div className="relative w-72">
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
              {searchTerm ? "No matching courses" : "You haven’t enrolled yet"}
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
                {/* THUMB */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.course.thumbnail || ""}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />

                  {/* BADGE */}
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 text-xs rounded-full text-white shadow ${
                      item.paymentStatus === "completed"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {item.paymentStatus === "completed"
                      ? "Enrolled"
                      : "Pending"}
                  </span>

                  
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  {/* PROGRESS */}
                  <div className="w-full">
                    <div className="flex justify-between text-black text-sm">
                      <span>Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                      <div
                        className="bg-green-400 h-2 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mt-3 line-clamp-2">
                    {item.course.title}
                  </h3>

                  {/* Stats */}
                  <div className="flex justify-between text-gray-500 text-sm mt-4 mb-2">
                    <div className="flex items-center gap-1">
                      <FiClock /> {item.course.duration || 0}h
                    </div>
                    <div className="flex items-center gap-1">
                      <FiBarChart2 /> {item.progress}%
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                    <FiCalendar />
                    Enrolled{" "}
                    {new Date(item.enrolledAt).toLocaleDateString("en-US")}
                  </div>

                  {/* ACTION */}
                  <Link
                    to={`/learn/${item.course._id}`}
                    className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition"
                  >
                    <FiPlay />
                    {item.progress > 0 ? "Continue" : "Start Learning"}
                  </Link>
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