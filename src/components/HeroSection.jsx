import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  FiHeart,
  FiArrowRight,
  FiStar,
  FiUser,
  FiBook,
  FiAward,
  FiSmile,
} from "react-icons/fi";
import api from "../utils/axios";

const HeroSection = () => {
  const [featuredCourse, setFeaturedCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  // ফিচার্ড কোর্স ফেচ করার ফাংশন
  const fetchFeaturedCourse = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses/featured");

      if (res.data.success) {
        // প্রথম ফিচার্ড কোর্সটি নিব
        setFeaturedCourse(res.data.data[0] || null);
      }
    } catch (error) {
      console.error("Error fetching featured course:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedCourse();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="font-hind relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900 pt-16">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Mosque Silhouette Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-blue-950/50 to-transparent"></div>

        {/* Decorative Circles */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Islamic Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M20 5L5 20L20 35L35 20L20 5z' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            {/* Quranic Verse Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20"
            >
              <FiHeart className="mr-2 text-yellow-300" />
              <span className="text-sm font-arabic">وَرَبُّكَ الْأَكْرَمُ</span>
              <span className="mx-2 text-white/40">|</span>
              <span className="text-sm">আর আপনার রব সর্বশ্রেষ্ঠ দাতা</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4"
            >
              <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-200 to-yellow-400">
                ইসলামী জ্ঞান
              </span>
              <br />
              অর্জনের পূর্ণাঙ্গ প্ল্যাটফর্ম
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base text-blue-50/90 mb-6 max-w-lg"
            >
              কুরআন, হাদিস, ফিকহ ও আরবি ভাষার উপর গুণগতমানসম্পন্ন কোর্স। অভিজ্ঞ
              উস্তাদদের সরাসরি তত্ত্বাবধানে জ্ঞান অর্জনের সুযোগ।
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-6 mb-8"
            >
              {[
                { number: "৫০+", label: "লাইভ কোর্স", icon: FiBook },
                { number: "২৫+", label: "অভিজ্ঞ উস্তাদ", icon: FiUser },
                { number: "১০০০+", label: "শিক্ষার্থী", icon: FiSmile },
              ].map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                    <stat.icon className="w-4 h-4 text-yellow-300" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{stat.number}</div>
                    <div className="text-xs text-blue-50/70">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              <Link to="/courses">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group bg-linear-to-r from-yellow-400 to-yellow-500 text-blue-900 px-6 py-3 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-xl hover:shadow-2xl flex items-center text-sm"
                >
                  কোর্স সমূহ দেখুন
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <Link to="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center text-sm"
                >
                  আমাদের সম্পর্কে
                </motion.button>
              </Link>
            </motion.div>

            {/* Featured Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex items-center gap-3 text-xs text-blue-50/70"
            >
              <FiAward className="text-yellow-300" />
              <span>বিশ্বস্ত ও নির্ভরযোগ্য ইসলামিক প্ল্যাটফর্ম</span>
            </motion.div>
          </motion.div>

          {/* Right Content - Dynamic Featured Course Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block"
          >
            {loading ? (
              // Loading State
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl flex items-center justify-center h-80">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400"></div>
              </div>
            ) : featuredCourse ? (
              // Featured Course Card
              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl"
              >
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Header with Category */}
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto bg-linear-to-br from-yellow-400 to-yellow-500 rounded-xl rotate-45 flex items-center justify-center mb-3">
                      <FiStar className="w-6 h-6 text-blue-900 -rotate-45" />
                    </div>
                    <span className="inline-block px-2 py-1 bg-white/10 rounded-full text-xs text-blue-50/90 mb-2">
                      {featuredCourse.category?.name || "ফিচার্ড কোর্স"}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {featuredCourse.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="flex items-center space-x-1">
                        {getRatingStars(featuredCourse.averageRating || 0)}
                      </div>
                      <span className="text-xs text-blue-50/70">
                        ({featuredCourse.ratingCount || 0} রিভিউ)
                      </span>
                    </div>
                  </div>

                  {/* Course Features */}
                  <div className="space-y-2 mb-4">
                    {/* Duration */}
                    <div className="flex items-center text-white bg-white/5 p-2 rounded-lg text-sm">
                      <svg
                        className="w-4 h-4 text-yellow-300 mr-2 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="flex-1">
                        মেয়াদ: {featuredCourse.duration} দিন
                      </span>
                    </div>

                    {/* Teachers */}
                    <div className="flex items-center text-white bg-white/5 p-2 rounded-lg text-sm">
                      <svg
                        className="w-4 h-4 text-yellow-300 mr-2 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="flex-1">
                        {featuredCourse.teachers?.length || 0} জন অভিজ্ঞ উস্তাদ
                      </span>
                    </div>

                    {/* Lectures */}
                    <div className="flex items-center text-white bg-white/5 p-2 rounded-lg text-sm">
                      <svg
                        className="w-4 h-4 text-yellow-300 mr-2 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <span className="flex-1">
                        মোট {featuredCourse.lectures?.length || 0} টি লেকচার
                      </span>
                    </div>

                    {/* Students */}
                    <div className="flex items-center text-white bg-white/5 p-2 rounded-lg text-sm">
                      <svg
                        className="w-4 h-4 text-yellow-300 mr-2 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <span className="flex-1">
                        {featuredCourse.studentCount || 0} জন শিক্ষার্থী
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center text-white bg-linear-to-r from-yellow-400/20 to-yellow-500/20 p-2 rounded-lg border border-yellow-400/30 text-sm">
                      <svg
                        className="w-4 h-4 text-yellow-300 mr-2 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="flex-1 font-bold text-base">
                        {formatPrice(featuredCourse.price)}
                      </span>
                    </div>
                  </div>

                  {/* Enrollment CTA */}
                  <Link to={`/course/${featuredCourse._id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-linear-to-r from-yellow-400 to-yellow-500 text-blue-900 py-2.5 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all flex items-center justify-center text-sm"
                    >
                      এখনই এনরোল করুন
                      <FiArrowRight className="ml-2" />
                    </motion.button>
                  </Link>

                  {/* Enrollment Deadline */}
                  {featuredCourse.enrollmentEnd && (
                    <p className="text-center text-xs text-blue-50/70 mt-2">
                      ⏰ এনরোলমেন্ট শেষ:{" "}
                      {new Date(
                        featuredCourse.enrollmentEnd,
                      ).toLocaleDateString("bn-BD", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </motion.div>
            ) : (
              // Fallback if no course
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl text-center">
                <FiBook className="w-12 h-12 text-yellow-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">
                  শীঘ্রই আসছে
                </h3>
                <p className="text-xs text-blue-50/70">
                  নতুন কোর্স খুব শীঘ্রই শুরু হচ্ছে
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          className="w-full h-auto"
        >
          <path
            fill="#f0f9ff"
            fillOpacity="1"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
