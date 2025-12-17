import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiUser,
  FiArrowRight,
  FiSearch,
  FiMessageSquare,
  FiHeart,
  FiCalendar,
  FiArrowUpRight,
} from "react-icons/fi";
import { Link } from "react-router";
import api from "../utils/axios";
import toast from "react-hot-toast";

const QnA = () => {
  const [loading, setLoading] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/qna/publishQuestion");
      if (res.data.success) {
        setQuestions(res.data.questions);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/qna/questionCategory");
      setCategories(res.data.categories);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchCategories();
  }, []);

  const categoryCounts = questions?.reduce((acc, post) => {
    const catId = post.category?._id;
    if (catId) {
      acc[catId] = (acc[catId] || 0) + 1;
    }
    return acc;
  }, {});

  const filteredQuestion = questions?.filter((blog) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      blog.title.toLowerCase().includes(term) ||
      blog.description.toLowerCase().includes(term);

    const matchesCategory = selectedCategory
      ? blog.category?._id === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-green-50 text-gray-800 font-sans">
      {/* Header */}
      <div className="pt-24 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-green-600 to-emerald-500 text-white py-6 px-6">
        <motion.h1
          className="text-2xl md:text-4xl font-extrabold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Islamic Questions & Answers
        </motion.h1>

        {/* Search */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg w-full md:w-96"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <FiSearch className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-black bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </motion.div>
      </div>

      {/* QnA Content */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-bold text-gray-800">
                  Recent Questions
                </h2>
                <Link
                  to={"/qa/ask-question"}
                  className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700 transition flex items-center"
                >
                  Ask Question
                  <FiMessageSquare className="ml-2" />
                </Link>
              </div>

              <div className="space-y-6">
                {filteredQuestion?.length === 0 ? (
                  <p className="text-gray-500 text-center py-10">
                    No question found.
                  </p>
                ) : (
                  <>
                    {filteredQuestion?.map((qna, index) => (
                      <motion.div
                        key={qna._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                              {qna.category?.name || "N/A"}
                            </span>
                            <div className="flex items-center text-sm text-gray-500">
                              <FiCalendar className="mr-1" />
                              {new Date(qna.createdAt).toLocaleString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          </div>

                          <h3 className="font-semibold text-lg mb-3 flex items-start">
                            <span className="text-green-600 mr-2">Q:</span>
                            {qna.title}
                          </h3>
                          <div className="pl-5 border-l-2 border-green-200 mb-4">
                            <p className="text-gray-600">
                              <span className="text-green-600 font-medium">
                                A:
                              </span>{" "}
                              <div
                                className="prose prose-lg max-w-none mb-6"
                                dangerouslySetInnerHTML={{
                                  __html: qna.answers[0].text.slice(0, 120),
                                }}
                              />
                            </p>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div className="flex items-center text-sm text-gray-600">
                              <FiUser className="mr-1" />
                              <span>
                                Answered by{" "}
                                <span className="text-green-500 font-medium">
                                  {qna.answers[0].answeredBy.name}
                                </span>
                              </span>
                            </div>
                            <Link
                              to={`/qa/${qna._id}`}
                              className="text-green-600 font-medium flex items-center hover:underline"
                            >
                              Read More
                              <FiArrowUpRight className="ml-1" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Categories
                </h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`flex items-center justify-between w-full py-2 transition ${
                        selectedCategory === null
                          ? "text-green-600 font-semibold"
                          : "text-gray-600 hover:text-green-600"
                      } cursor-pointer`}
                    >
                      <span>All</span>
                      <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">
                        {questions?.length}
                      </span>
                    </button>
                  </li>
                  {categories?.map((category, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => setSelectedCategory(category._id)}
                        className={`flex items-center justify-between w-full py-2 transition ${
                          selectedCategory === category._id
                            ? "text-green-600 font-semibold"
                            : "text-gray-600 hover:text-green-600"
                        } cursor-pointer`}
                      >
                        <span>{category.name}</span>
                        <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">
                          {categoryCounts[category._id] || 0}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-lg p-6 text-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <FiMessageSquare className="text-4xl mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Ask a Question</h3>
                <p className="text-green-100 mb-4">
                  Can't find what you're looking for? Ask our scholars.
                </p>
                <Link to={'/qa/ask-question'} className="bg-white text-green-600 px-5 py-2.5 rounded-xl font-medium hover:bg-green-50 transition">
                  Ask Now
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QnA;
