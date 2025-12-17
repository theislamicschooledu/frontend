import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiSearch,
  FiEye,
  FiPlus,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../utils/axios";
import { AiFillQuestionCircle } from "react-icons/ai";

const QnaTeacher = () => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/qna");
      setQuestions(data.questions);
    } catch (err) {
      toast.error("Failed to load questions", err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      question.status === filterStatus ||
      (filterStatus === "featured" && question.featured === true);

    return matchesSearch && matchesStatus;
  });

  const statusCounts = questions.reduce(
    (acc, question) => {
      acc.all += 1;
      if (question.status === "published") acc.published += 1;
      if (question.status === "pending") acc.pending += 1;
      if (question.status === "rejected") acc.rejected += 1;
      if (question.featured) acc.featured += 1;
      return acc;
    },
    { all: 0, published: 0, pending: 0, rejected: 0, featured: 0 }
  );

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
      {/* Page Title */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          Question Management
        </h1>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search question..."
            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-wrap gap-3">
          {["all", "published", "pending", "rejected", "featured"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filterStatus === status
                    ? status === "published"
                      ? "bg-green-600 text-white"
                      : status === "pending"
                      ? "bg-yellow-400 text-white"
                      : status === "rejected"
                      ? "bg-red-600 text-white"
                      : status === "featured"
                      ? "bg-amber-500 text-white"
                      : "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} (
                {statusCounts[status]})
              </button>
            )
          )}
        </div>
      </div>

      {/* Question Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading questions...</p>
      ) : filteredQuestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((question, index) => (
            <motion.div
              key={question._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="relative h-10 overflow-hidden">
                {question.featured && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-medium">
                    Featured
                  </div>
                )}
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium text-white ${
                    question.status === "published"
                      ? "bg-green-400"
                      : question.status === "rejected"
                      ? "bg-red-400"
                      : "bg-yellow-400"
                  }`}
                >
                  {question.status.charAt(0).toUpperCase() +
                    question.status.slice(1).toLowerCase()}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {question.title}
                </h3>
                <div className="flex justify-between mb-3">
                  <p className="flex  items-center  gap-2 text-sm text-gray-600">
                    <AiFillQuestionCircle size={16} />
                    <span>{question.askedBy?.name || "Unknown Author"}</span>
                  </p>
                  <p className="text-sm bg-blue-200 px-2 py-0.5 rounded-sm">
                    {question.category?.name || "N/A"}
                  </p>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: question.description.slice(1, 400),
                    }}
                  />
                </p>

                {/* Actions */}
                <div className="flex justify-center items-center">
                  <Link
                    to={`/teacher/questions/${question._id}`}
                    className="flex items-center gap-2 px-3 py-3 rounded-sm text-sm font-medium bg-green-500 text-white hover:bg-green-700 cursor-pointer"
                  >
                    <FiEye /> View and give answer
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <FiBookOpen className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No question posts found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("all");
              fetchQuestions();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            Clear Filters
          </button>
        </div>
      )}
    </main>
  );
};

export default QnaTeacher;
