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
  FiInbox,
  FiLoader,
  FiHelpCircle,
  FiEye,
} from "react-icons/fi";
import { Link } from "react-router";
import api from "../utils/axios";
import toast from "react-hot-toast";

const QnA = () => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("latest");

  const fetchQuestions = async (selectedSort = sortBy) => {
    try {
      const res = await api.get("/qna/publishQuestion", {
        params: {
          sort: selectedSort,
        },
      });

      if (res.data.success) {
        setQuestions(res.data.questions);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
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
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchQuestions(sortBy), fetchCategories()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sortBy]);

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

  // Custom Loader Component for QnA
  const LoadingSpinner = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-sky-50 to-green-50">
      <div className="relative">
        <motion.div
          className="w-20 h-20 border-4 border-green-200 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-green-500 border-r-green-500 rounded-full"></div>
        </motion.div>
        <div className="mt-6 text-center">
          <motion.h3
            className="text-xl font-semibold text-gray-700 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Loading Questions
          </motion.h3>
          <motion.p
            className="text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Fetching questions from our scholars...
          </motion.p>
          <motion.div
            className="flex justify-center space-x-1 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );

  // No Data Component for QnA
  const NoDataComponent = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-sky-50 to-green-50 px-6">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center"
      >
        <div className="mb-6">
          <div className="relative inline-block">
            <FiHelpCircle className="text-6xl text-gray-300 mx-auto" />
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FiLoader className="text-2xl text-green-500" />
            </motion.div>
          </div>
        </div>

        <motion.h2
          className="text-2xl font-bold text-gray-800 mb-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          No Questions Found
        </motion.h2>

        <motion.p
          className="text-gray-600 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {searchTerm || selectedCategory
            ? "No questions match your search criteria. Try different keywords or categories."
            : "There are no published questions available at the moment. Be the first to ask!"}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {(searchTerm || selectedCategory) && (
            <>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
                className="w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors duration-300"
              >
                Clear Filters
              </button>
              <p className="text-sm text-gray-500">
                Showing results for:
                {searchTerm && ` Search: "${searchTerm}"`}
                {selectedCategory &&
                  categories.find((c) => c._id === selectedCategory)?.name &&
                  ` Category: "${categories.find((c) => c._id === selectedCategory)?.name}"`}
              </p>
            </>
          )}

          <Link
            to={"/qa/ask-question"}
            className="block w-full bg-linear-to-r from-green-600 to-emerald-500 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-600 transition-all duration-300"
          >
            <FiMessageSquare className="inline mr-2" />
            Ask Your First Question
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );

  if (loading) return <LoadingSpinner />;

  if (!loading && questions.length === 0) return <NoDataComponent />;

  return (
    <div className="font-hind min-h-screen bg-linear-to-b from-sky-50 to-green-50 text-gray-800 font-sans">
      {/* Header */}
      <div className="pt-24 flex flex-col md:flex-row justify-between items-center bg-linear-to-r from-green-600 to-emerald-500 text-white py-6 px-6">
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
              placeholder="Search questions..."
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
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {sortBy === "most-read"
                        ? "Most Read Questions"
                        : "Recent Questions"}
                    </h2>
                    {filteredQuestion?.length > 0 && (
                      <p className="text-gray-500 text-sm mt-1">
                        {filteredQuestion.length}{" "}
                        {filteredQuestion.length === 1
                          ? "question"
                          : "questions"}{" "}
                        found
                      </p>
                    )}
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    <option value="latest">সর্বশেষ</option>
                    <option value="most-read">সর্বাধিক পাঠিত</option>
                  </select>
                </div>
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
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-12 text-center"
                  >
                    <FiHelpCircle className="text-5xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Matching Questions
                    </h3>
                    <p className="text-gray-500 mb-6">
                      We couldn't find any questions matching your criteria.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory(null);
                        }}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
                      >
                        Reset Filters
                      </button>
                      <Link
                        to={"/qa/ask-question"}
                        className="bg-linear-to-r from-green-600 to-emerald-500 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-600 transition-all duration-300"
                      >
                        Ask New Question
                      </Link>
                    </div>
                  </motion.div>
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
                          <div className="flex justify-between items-start mb-3 gap-3">
                            <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                              {qna.category?.name || "N/A"}
                            </span>

                            <div className="flex flex-col items-end text-sm text-gray-500">
                              <div className="flex items-center">
                                <FiCalendar className="mr-1" />
                                {new Date(qna.createdAt).toLocaleString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  },
                                )}
                              </div>

                              <div className="flex items-center mt-1">
                                <FiEye className="mr-1" />
                                {qna.views/2 || 0} views
                              </div>
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
                                  __html:
                                    qna.answers[0]?.text?.slice(0, 120) ||
                                    "No answer yet",
                                }}
                              />
                            </p>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div className="flex items-center text-sm text-gray-600">
                              <FiUser className="mr-1" />
                              <span>
                                {qna.answers[0] ? (
                                  <>
                                    Answered by{" "}
                                    <span className="text-green-500 font-medium">
                                      {qna.answers[0]?.answeredBy?.name ||
                                        "Scholar"}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-gray-500">
                                    Awaiting answer from scholars
                                  </span>
                                )}
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
                        {questions?.length || 0}
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
                className="bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-lg p-6 text-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <FiMessageSquare className="text-4xl mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Ask a Question</h3>
                <p className="text-green-100 mb-4">
                  Can't find what you're looking for? Ask our scholars.
                </p>
                <Link
                  to={"/qa/ask-question"}
                  className="bg-white text-green-600 px-5 py-2.5 rounded-xl font-medium hover:bg-green-50 transition"
                >
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
