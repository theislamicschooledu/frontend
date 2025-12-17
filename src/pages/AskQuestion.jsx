import React, { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { FiHelpCircle, FiBook, FiSend, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { useNavigate } from "react-router";

const AskQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/qna/questionCategory");
      setCategories(res.data.categories);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Provide more context about your situation, age of children, specific challenges, etc.",
        modules: {
          toolbar: [["bold", "italic", "underline", "strike"], ["clean"]],
        },
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editorContent = quillRef.current.root.innerHTML;

    if (!title || editorContent.length === 0 || !selectedCategory) {
      toast.error("Title, content and category are required!");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", JSON.stringify(editorContent));
      formData.append("category", selectedCategory);

      const res = await api.post("/qna", formData);

      if (res.data.success) {
        toast.success("Question submitted successfully!");
        navigate("/admin/questions");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-green-50 text-gray-800 font-sans">
      {/* Header */}
      <div className="pt-24 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-4 inline-flex items-center mb-6">
              <FiHelpCircle className="text-2xl mr-3" />
              <span className="text-lg font-semibold">Ask a Question</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Get Islamic Parenting Advice
            </h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Share your parenting questions and get guidance from our community
              of experienced parents and Islamic scholars.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Question Form */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Form */}
            <div className="lg:w-2/3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="p-8">
                  <form onSubmit={handleSubmit}>
                    {/* Category Selection */}
                    <div className="mb-8">
                      <label className="flex items-center text-lg font-bold text-gray-800 mb-4">
                        <FiBook className="mr-2 text-green-600" />
                        Select Category
                      </label>
                      {loading ? (
                        <div className="text-center py-4">
                          <p className="text-gray-500">Loading categories...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {categories.map((category) => (
                            <motion.button
                              key={category._id}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedCategory(category._id)}
                              className={`p-2 rounded-xl border-2 transition-all ${
                                selectedCategory === category._id
                                  ? "border-green-500 bg-green-50 text-green-700"
                                  : "border-gray-200 hover:border-green-300 hover:bg-green-25"
                              } cursor-pointer`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  {category.name}
                                </span>
                                {selectedCategory === category._id && (
                                  <FiCheckCircle className="text-green-500" />
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Question Input */}
                    <div className="mb-8">
                      <label className="block text-lg font-bold text-gray-800 mb-4">
                        Your Question
                      </label>
                      <input
                        type="text"
                        placeholder="What would you like to ask about?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent text-lg"
                        maxLength={200}
                      />
                      <div className="text-right text-sm text-gray-500 mt-2">
                        {title.length}/200 characters
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <label className="block text-lg font-bold text-gray-800 mb-4">
                        Question Details
                      </label>
                      <div
                        ref={editorRef}
                        className="bg-gray-100 rounded-xl min-h-[300px] p-3"
                      ></div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: submitting ? 1 : 1.02 }}
                      whileTap={{ scale: submitting ? 1 : 0.98 }}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FiSend className="mr-2" />
                          Submit Question
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Guidelines */}
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <FiCheckCircle className="mr-2 text-green-600" />
                  Question Guidelines
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <span>
                      Be specific about your situation and child's age
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <span>Focus on Islamic parenting principles</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <span>Be respectful in your wording</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <span>Include relevant context for better advice</span>
                  </li>
                </ul>
              </motion.div>

              {/* Tips */}
              <motion.div
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-lg p-6 mb-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-lg font-bold mb-4">
                  Tips for Good Questions
                </h3>
                <div className="space-y-3 text-green-100 text-sm">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-white rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <span>
                      Mention your child's age for age-appropriate advice
                    </span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-white rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <span>Describe what you've already tried</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-white rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <span>Ask about specific Islamic rulings if needed</span>
                  </div>
                </div>
              </motion.div>

              {/* Response Time */}
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Response Time
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Our community typically responds within 24-48 hours. Urgent
                  questions may receive faster responses.
                </p>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    24-48h
                  </div>
                  <div className="text-sm text-green-700">
                    Average response time
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AskQuestion;
