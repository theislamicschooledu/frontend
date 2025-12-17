import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../utils/axios";

const Instructors = () => {
  const [teachers, setTeachers] = useState(null);

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/auth/teachers");
      const teachers = res.data.teachers;
      const topThree = teachers.slice(0, 3);

      setTeachers(topThree);
    } catch (error) {
      toast.error(error);
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
  return (
    <section
      id="instructors"
      className="relative px-6 z-10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {teachers?.map((inst, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
            >
              <div className={`h-24 bg-gradient-to-r ${color[idx]} relative`}>
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
                      src={inst.avatar}
                      alt={inst.name}
                      className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
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
                  {inst.name}
                </h3>
                <p className="text-green-600 text-center font-medium mb-3">
                  {inst.role}
                </p>
                <p className="text-gray-600 text-center text-sm mb-5">
                  {inst.bio}
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
