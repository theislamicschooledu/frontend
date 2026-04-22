import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiRefreshCw } from "react-icons/fi";
import { FaChalkboardTeacher, FaExclamationCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../utils/axios";

const Instructors = ({ limit = 3 }) => {
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
        setTeachers(limit ? teachersData.slice(0, limit) : teachersData);
      } else {
        setError("Failed to load instructors data");
        toast.error("Unable to load instructors");
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setError(
        error?.response?.data?.message ||
          error.message ||
          "Failed to load instructors",
      );

      if (!error?.response?.status || error.response.status >= 500) {
        toast.error(
          error?.response?.data?.message ||
            "Network error. Please try again later.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [limit]);

  const color = [
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
    "from-amber-400 to-amber-600",
    "from-emerald-400 to-emerald-600",
    "from-rose-400 to-rose-600",
    "from-cyan-400 to-cyan-600",
  ];

  if (loading) {
    const skeletonCount = limit || 6;

    return (
      <section id="instructors" className="relative px-6 z-10 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: skeletonCount }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                <div
                  className={`h-24 bg-linear-to-r ${color[idx % color.length]}`}
                />
                <div className="px-6 pb-6 relative">
                  <div className="flex justify-center -mt-14 mb-4">
                    <div className="w-28 h-28 rounded-full bg-gray-200 border-4 border-white shadow-lg" />
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-2/3 mx-auto mb-5" />
                  <div className="h-10 bg-gray-100 rounded-lg w-1/2 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="instructors" className="relative px-6 z-10 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <FaExclamationCircle className="text-5xl text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Failed to Load Instructors
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchTeachers}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
            >
              <FiRefreshCw />
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

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

  return (
    <section id="instructors" className="relative px-6 z-10 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.map((inst, idx) => (
            <motion.div
              key={inst._id || inst.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              <div
                className={`h-24 bg-linear-to-r ${
                  color[idx % color.length]
                } relative`}
              >
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
                    whileHover={{ scale: 1.05 }}
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

                <p className="text-green-600 text-center font-medium mb-3 capitalize">
                  {inst.role === "admin" ? "Admin" : "Teacher"}
                </p>

                <p className="text-gray-600 text-center text-sm mb-5 min-h-10">
                  {inst.address || "ঠিকানা আপাতত যুক্ত করা হয়নি"}
                </p>

                <div className="flex justify-center">
                  <button className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-green-100 hover:text-green-700 transition">
                    View Profile
                  </button>
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
