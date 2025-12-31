import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiRefreshCw } from "react-icons/fi";
import { FaChalkboardTeacher, FaExclamationCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../utils/axios";

const Instructors = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/auth/teachers");
      
      if (res.data.success || res.data.teachers) {
        const teachersData = res.data.teachers || [];
        const topThree = teachersData.slice(0, 3);
        setTeachers(topThree);
      } else {
        setError("Failed to load instructors data");
        toast.error("Unable to load instructors");
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setError(
        error?.response?.data?.message ||
          error.message ||
          "Failed to load instructors"
      );
      // গুরুতর এরর এর ক্ষেত্রে শুধু toast দেখানো
      if (!error?.response?.status || error.response.status >= 500) {
        toast.error(
          error?.response?.data?.message ||
            "Network error. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const color = [
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
    "from-amber-400 to-amber-600",
  ];

  // লোডিং স্টেট
  if (loading) {
    return (
      <section id="instructors" className="relative px-6 z-10 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className={`h-24 bg-linear-to-r ${color[idx - 1]} bg-gray-200`}></div>
                <div className="px-6 pb-6 relative">
                  <div className="flex justify-center -mt-14 mb-4">
                    <div className="w-28 h-28 rounded-full bg-gray-200 border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded mb-3 mx-auto w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 mx-auto w-1/2"></div>
                  <div className="h-16 bg-gray-200 rounded mb-5"></div>
                  <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // এরর স্টেট
  if (error) {
    return (
      <section id="instructors" className="relative px-6 z-10 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <FaExclamationCircle className="text-5xl text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Unable to Load Instructors
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {error.includes("Network") ? 
                "Please check your internet connection and try again." : 
                "We're having trouble loading our instructors. Please try again."}
            </p>
            <motion.button
              onClick={fetchTeachers}
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiRefreshCw />
              Try Again
            </motion.button>
          </div>
        </div>
      </section>
    );
  }

  // কোনো ইনস্ট্রাক্টর নেই এমন স্টেট
  if (!teachers || teachers.length === 0) {
    return (
      <section id="instructors" className="relative px-6 z-10 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <FaChalkboardTeacher className="text-5xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Instructors Available
            </h3>
            <p className="text-gray-500 mb-2">
              We don't have any instructors to show at the moment.
            </p>
            <p className="text-gray-400 text-sm">
              Check back later for updates
            </p>
          </div>
        </div>
      </section>
    );
  }

  // সফলভাবে ডাটা লোড হয়েছে
  return (
    <section id="instructors" className="relative px-6 z-10 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {teachers.map((inst, idx) => (
            <motion.div
              key={inst._id || inst.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
            >
              <div className={`h-24 bg-linear-to-r ${color[idx]} relative`}>
                <motion.div
                  className="absolute -bottom-6 right-6 text-4xl"
                  whileHover={{ scale: 1.3, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaChalkboardTeacher className="text-green-500" />
                </motion.div>
              </div>
              <div className="px-6 pb-6 relative">
                <div className="flex justify-center -mt-14 mb-4">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={inst.avatar || "/default-avatar.png"}
                      alt={inst.name}
                      className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                    <motion.div
                      className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full"
                      whileHover={{ scale: 1.2 }}
                    >
                      <FiUser size={16} />
                    </motion.div>
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-1">
                  {inst.name || "Instructor"}
                </h3>
                <p className="text-green-600 text-center font-medium mb-3">
                  {inst.role || "Teacher"}
                </p>
                <p className="text-gray-600 text-center text-sm mb-5">
                  {inst.bio || "No biography available"}
                </p>
                <div className="flex justify-center">
                  <motion.button
                    className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-green-100 hover:text-green-700 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Profile
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Instructors;