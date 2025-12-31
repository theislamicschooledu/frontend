import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiBook, FiRefreshCw, FiHelpCircle } from "react-icons/fi";
import { FaExclamationCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { Link } from "react-router-dom";

const PopularQuestion = () => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/qna/featuredQuestion");

      if (res.data.success) {
        setQuestions(res.data.questions || []);
      } else {
        setError("Failed to load questions");
        toast.error("Unable to load featured questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError(
        error?.response?.data?.message ||
          error.message ||
          "Failed to load questions"
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
    fetchQuestions();
  }, []);

  // লোডিং স্টেট
  if (loading) {
    return (
      <div className="space-y-6 font-hind">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="shadow-lg rounded-2xl overflow-hidden animate-pulse"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-24 h-6 bg-gray-200 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-gray-200 rounded mr-2"></div>
                  <div className="w-full h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="pl-5 border-l-2 border-gray-200 space-y-3">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-gray-200 rounded mr-2"></div>
                    <div className="w-full h-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-24 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // এরর স্টেট
  if (error) {
    return (
      <div className="shadow-lg rounded-2xl overflow-hidden bg-white p-8 text-center">
        <FaExclamationCircle className="text-5xl text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Failed to Load Questions
        </h3>
        <p className="text-gray-500 mb-6">
          {error.includes("Network") ? 
            "Please check your internet connection." : 
            "We're having trouble loading the questions."}
        </p>
        <motion.button
          onClick={fetchQuestions}
          className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiRefreshCw />
          Try Again
        </motion.button>
      </div>
    );
  }

  // কোনো প্রশ্ন নেই এমন স্টেট
  if (!questions || questions.length === 0) {
    return (
      <div className="shadow-lg rounded-2xl overflow-hidden bg-white p-8 text-center">
        <FiHelpCircle className="text-5xl text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Questions Available
        </h3>
        <p className="text-gray-500 mb-2">
          We don't have any featured questions to show at the moment.
        </p>
        <p className="text-gray-400 text-sm">
          Check back later for new questions and answers
        </p>
      </div>
    );
  }

  // সফলভাবে ডাটা লোড হয়েছে
  return (
    <div className="space-y-6 font-hind">
      {questions.map((item, idx) => {
        // প্রথম উত্তরটি নিরাপদে অ্যাক্সেস করা
        const firstAnswer = item.answers?.[0];
        const hasAnswer = firstAnswer?.text;

        return (
          <motion.div
            key={item._id || item.id || idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition bg-white"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                {item.category?.name ? (
                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                    {item.category.name}
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                    General
                  </span>
                )}
                <button className="text-green-600 p-1 rounded-full hover:bg-green-100 transition">
                  <FiBook size={16} />
                </button>
              </div>
              <h3 className="font-semibold text-lg mb-2 flex items-start">
                <span className="text-green-600 mr-2">Q:</span>
                <span className="flex-1">{item.title || "Untitled Question"}</span>
              </h3>
              <div className="text-gray-600 pl-5 border-l-2 border-green-200">
                <span className="text-green-600 font-medium">A:</span>
                {hasAnswer ? (
                  <>
                    <div
                      className="prose prose-lg max-w-none mb-4 text-gray-600 line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: firstAnswer.text.slice(0, 120) + 
                                (firstAnswer.text.length > 120 ? "..." : ""),
                      }}
                    />
                    <Link
                      to={`/qa/${item._id}`}
                      className="text-green-600 font-medium flex items-center hover:underline"
                    >
                      Read More
                      <FiArrowUpRight className="ml-1" />
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 italic my-2">
                      No answer available yet
                    </p>
                    <Link
                      to={`/qa/${item._id}`}
                      className="text-green-600 font-medium flex items-center hover:underline"
                    >
                      Be the first to answer
                      <FiArrowUpRight className="ml-1" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PopularQuestion;