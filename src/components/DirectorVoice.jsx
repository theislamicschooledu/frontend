import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import TypingAnimation from "./TypingAnimation";
import { FiBook, FiUser } from "react-icons/fi";
import api from "../utils/axios";

const DirectorVoice = () => {
  const [directorVoice, setDirectorVoice] = useState(null);
  const fetchVoice = async () => {
    try {
      const res = await api.get("/documentation");
      setDirectorVoice(res?.data?.data[0]?.sections?.directorVoice);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVoice();
  }, []);

  return (
    <section
      id="director-message"
      className="relative pb-16 pt-16 px-6 bg-gradient-to-b from-white via-blue-50/40 to-blue-100/60 overflow-hidden"
    >
      {/* Floating Background Icons */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-300 drop-shadow-xl"
            style={{
              left: `${5 + i * 10}%`,
              top: `${20 + Math.random() * 50}%`,
            }}
            animate={{
              y: [0, -25, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 10 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            <FiBook size={40} />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 tracking-tight">
            পরিচালকের বাণী
          </h2>
          <div className="w-28 h-1 bg-green-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Director Image */}
          <motion.div
            className="lg:w-1/3 flex justify-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="w-60 h-60 md:w-72 md:h-72 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden">
                <img src={directorVoice?.image} alt={directorVoice?.designation} className="w-full" />
              </div>

              {/* Floating Name Box */}
              <motion.div
                className="absolute -bottom-5 -right-6 bg-white/70 backdrop-blur-lg p-5 rounded-2xl shadow-lg border border-white/40"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <div className="text-center">
                  <h3 className="font-bold text-green-700">{directorVoice?.name}</h3>
                  <p className="text-sm text-gray-600">{directorVoice?.designation}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Message Box */}
          <motion.div
            className="lg:w-2/3"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="p-6 md:p-10 rounded-3xl bg-white/60 backdrop-blur-lg shadow-xl border border-white/40 transition-all">
              <div className="text-gray-700 text-lg leading-relaxed text-justify">
                <TypingAnimation
                  text={directorVoice?.text}
                  speed={20}
                  delay={800}
                  className={"text-base md:text-lg"}
                />
              </div>

              {/* Signature */}
              <motion.div
                className="mt-10 pt-6 border-t border-gray-300/60 text-right"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-800 font-semibold text-lg">
                  মুজাহিদুল ইসলাম
                </p>
                <p className="text-gray-500 text-sm">প্রতিষ্ঠাতা ও পরিচালক</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DirectorVoice;
