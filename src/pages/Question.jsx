import React, { useCallback, useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link, useParams } from "react-router";
import api from "../utils/axios";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiBookmark,
  FiCalendar,
  FiClock,
  FiMessageSquare,
  FiShare2,
  FiUser,
} from "react-icons/fi";

const Question = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(null);

  const fetchQuestionDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/qna/${id}`);

      setQuestion(res.data.question);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestionDetails();
  }, [fetchQuestionDetails]);

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const roleColors = {
    admin: "bg-purple-100 text-purple-800",
    teacher: "bg-blue-100 text-blue-800",
    student: "bg-green-100 text-green-800",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-green-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-green-50 flex items-center justify-center">
        <p className="text-gray-600">Question not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-green-50 text-gray-800 font-sans">
      {/* Header */}
      <div className="pt-24 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/qa"
              className="inline-flex items-center text-green-100 hover:text-white mb-6 transition mr-16"
            >
              <FiArrowLeft className="mr-2" />
              Back to Questions
            </Link>

            <div className="bg-green-500 text-white text-sm px-4 py-1.5 rounded-full inline-block mb-4">
              {question.category?.name}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {question.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-green-100">
              <div className="flex gap-2 items-center">
                <FiUser className="mr-2" />
                <span>{question.askedBy?.name || "Unknown Author"}</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="mr-2" />
                <span>
                  {new Date(question.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <FiClock className="mr-2" />
                <span>{calculateReadTime(question.description)} min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <section className="py-8 px-2 md:py-16 md:px-6">
        <div className="md:max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Content */}
                <div className="p-8">
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 md:flex-row justify-between items-center mb-8 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <FiUser />
                      <span className="font-medium">
                        {question.askedBy?.name}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          roleColors[question.askedBy?.role]
                        }`}
                      >
                        {question.askedBy?.role?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button className="p-2 text-gray-500 hover:text-green-600 transition">
                        <FiBookmark className="text-lg" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-green-600 transition">
                        <FiShare2 className="text-lg" />
                      </button>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div
                    className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-800 prose-a:text-green-600 hover:prose-a:text-green-700 prose-blockquote:border-green-400 prose-blockquote:bg-green-50 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: question.description }}
                  />
                </div>

                <div className="p-8 pt-0">
                  {/* Answer Content */}
                  <div className="pl-5 border-l-2 border-green-200 mb-4">
                    <p className="text-gray-600">
                      <span className="text-green-600 font-medium">A:</span>{" "}
                      <div
                        className="prose prose-lg max-w-none mb-6"
                        dangerouslySetInnerHTML={{
                          __html: question.answers[0].text,
                        }}
                      />
                    </p>
                    <p className="flex gap-3 items-center">
                      Answered By:{" "}
                      <span className="text-green-600 font-medium">
                        {question.answers[0].answeredBy.name}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          roleColors[question.answers[0].answeredBy.role]
                        }`}
                      >
                        {question.answers[0].answeredBy.role.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>
              </motion.article>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Author Info */}
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  About the Author
                </h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {question.askedBy?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {question.askedBy?.name || "Unknown Author"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {question.askedBy?.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Passionate about Islamic parenting and child development.
                  Sharing insights and experiences to help parents nurture their
                  children with Islamic values.
                </p>
              </motion.div>

              {/* TODO */}
              {/* Related Articles */}
              {/* {relatedBlogs.length > 0 && (
                      <motion.div
                        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                          Related Articles
                        </h3>
                        <div className="space-y-4">
                          {relatedBlogs.map((relatedBlog) => (
                            <Link
                              key={relatedBlog._id}
                              to={`/blogs/${relatedBlog._id}`}
                              className="block group"
                            >
                              <div className="flex gap-3 p-3 rounded-lg hover:bg-green-50 transition">
                                <img
                                  src={relatedBlog.cover}
                                  alt={relatedBlog.title}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div>
                                  <h4 className="font-medium text-gray-800 group-hover:text-green-600 transition text-sm leading-tight mb-1">
                                    {relatedBlog.title.length > 50
                                      ? `${relatedBlog.title.substring(0, 50)}...`
                                      : relatedBlog.title}
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    {new Date(relatedBlog.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )} */}

              {/* Ask Question */}
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

export default Question;
