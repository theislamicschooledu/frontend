import { useEffect, useState, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { useNavigate, useParams } from "react-router";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import api from "../utils/axios";

const UpdateQuestion = () => {
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestion = async () => {
      setLocalLoading(true);
      try {
        const res = await api.get(`/qna/${id}`);
        const q = res.data.question;
        setTitle(q.title);
        setSelectedCategory(q.category || "");
        if (quillRef.current) {
          quillRef.current.root.innerHTML = q.description || "";
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLocalLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/qna/questionCategory");
        
        setCategories(res.data.categories);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Update your question details here...",
        modules: {
          toolbar: [["bold", "italic", "underline", "strike"], ["clean"]],
        },
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const description = quillRef.current.root.innerHTML;

    if (!title || !description || !selectedCategory) {
      toast.error("Title, description, and category are required!");
      return;
    }

    setLocalLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", JSON.stringify(description));
      formData.append("category", selectedCategory);

      const res = await api.put(`/qna/${id}`, formData);

      if (res.data.success) {
        toast.success(res.data.message || "Question updated successfully!");
        navigate("/admin/questions");
      } else {
        toast.error(res.data.message || "Failed to update!");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 pt-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <button
            onClick={() => window.history.back()}
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-white rounded-xl transition"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
          <h2 className="text-2xl sm:text-2xl font-bold text-gray-800">
            Update Question
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="px-8 pt-8">
                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* Left Section */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white rounded-2xl shadow-lg p-6"
                    >
                      <h2 className="text-xl font-bold text-gray-800 mb-3">
                        Title
                      </h2>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter your question title..."
                        className="w-full p-4 text-lg bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                        required
                      />
                    </motion.div>

                    {/* Category */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 }}
                      className="bg-white rounded-2xl shadow-lg p-6"
                    >
                      <h2 className="text-xl font-bold text-gray-800 mb-3">
                        Select Category
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {categories.map((cat) => (
                          <button
                            key={cat._id}
                            type="button"
                            onClick={() => setSelectedCategory(cat._id)}
                            className={`flex items-center justify-between px-4 py-2 rounded-xl border-2 transition-all ${
                              selectedCategory === cat._id
                                ? "border-green-500 bg-green-50 text-green-700"
                                : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                            }`}
                          >
                            <span>{cat.name}</span>
                            {selectedCategory === cat._id && (
                              <FiCheckCircle className="text-green-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white rounded-2xl shadow-lg p-6"
                    >
                      <h2 className="text-xl font-bold text-gray-800 mb-3">
                        Description
                      </h2>
                      <div
                        ref={editorRef}
                        className="bg-gray-100 rounded-xl min-h-[250px] p-3"
                      ></div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={localLoading}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full flex justify-center items-center py-3 mb-8 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-md ${
                        localLoading
                          ? "opacity-60 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      {localLoading ? "Saving..." : "Save Changes"}
                    </motion.button>
                  </div>
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
                  <span>Be specific about your situation and child's age</span>
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
                <div className="text-2xl font-bold text-green-600">24-48h</div>
                <div className="text-sm text-green-700">
                  Average response time
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateQuestion;
