import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiPlus,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../utils/axios";
import ConfirmModal from "../../../components/ConfirmModal";
import { AiFillQuestionCircle } from "react-icons/ai";

const QnaAdmin = () => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [modalAction, setModalAction] = useState(null);

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

  const openModal = (id, action) => {
    setSelectedQuestionId(id);
    setModalAction(action);
    setModalOpen(true);
  };

  const confirmAction = async () => {
    if (modalAction === "delete") {
      setLoading(true);
      try {
        await api.delete(`/qna/${selectedQuestionId}`);
        toast.success("🗑️ Question deleted successfully");
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (modalAction === "published") {
      setLoading(true);
      try {
        const res = await api.put(`/admin/qnaStatus/${selectedQuestionId}`, {
          status: "published",
        });

        if (res.data.success) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        const msg = error.response?.data?.message || "Something went wrong!";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }

    if (modalAction === "pending") {
      setLoading(true);
      try {
        await api.put(`/admin/qnaStatus/${selectedQuestionId}`, {
          status: "pending",
        });
        toast.success("🕒 Question marked as pending");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (modalAction === "rejected") {
      setLoading(true);
      try {
        await api.put(`/admin/qnaStatus/${selectedQuestionId}`, {
          status: "rejected",
        });
        toast.success("❌ Question rejected");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (modalAction === "featured") {
      setLoading(true);
      try {
        await api.put(`/admin/qnaFeature/${selectedQuestionId}`, {
          featured: true,
        });
        toast.success("🌟 Question featured successfully");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (modalAction === "unFeatured") {
      setLoading(true);
      try {
        await api.put(`/admin/qnaFeature/${selectedQuestionId}`, {
          featured: false,
        });
        toast.success("⭐ Question unFeatured successfully");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    setModalOpen(false);
    setSelectedQuestionId(null);
    setModalAction(null);
    fetchQuestions();
  };

  const getModalText = () => {
    switch (modalAction) {
      case "delete":
        return { title: "Delete Question", message: "Are you sure to delete?" };
      case "published":
        return { title: "Publish Question", message: "Publish this question?" };
      case "pending":
        return {
          title: "Mark Pending",
          message: "Mark this question as pending?",
        };
      case "rejected":
        return { title: "Reject Question", message: "Reject this question?" };
      case "featured":
        return { title: "Feature Question", message: "Feature this question?" };
      case "unFeatured":
        return {
          title: "UnFeature Question",
          message: "Remove from featured?",
        };
      default:
        return { title: "", message: "" };
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
        <Link
          to={"/admin/questions/category"}
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          <FiPlus className="mr-2" />
          Add Question Category
        </Link>
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
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/admin/questions/${question._id}`}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                  >
                    <FiEye /> View
                  </Link>
                  <Link
                    to={`/qa/update/${question._id}`}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                  >
                    <FiEdit /> Edit
                  </Link>
                  <button
                    onClick={() => openModal(question._id, "delete")}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer"
                  >
                    <FiTrash2 /> Delete
                  </button>

                  {question.status === "pending" && (
                    <>
                      <button
                        onClick={() => openModal(question._id, "published")}
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
                      >
                        <FiCheckCircle /> Approve
                      </button>
                      <button
                        onClick={() => openModal(question._id, "rejected")}
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer"
                      >
                        <FiXCircle /> Reject
                      </button>
                    </>
                  )}

                  {question.status === "published" && (
                    <>
                      {question.featured ? (
                        <button
                          onClick={() => openModal(question._id, "unFeatured")}
                          className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer"
                        >
                          <FiXCircle /> UnFeatured
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => openModal(question._id, "pending")}
                            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 cursor-pointer"
                          >
                            <FiCheckCircle /> Pending
                          </button>
                          <button
                            onClick={() => openModal(question._id, "featured")}
                            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
                          >
                            <FiCheckCircle /> Featured
                          </button>
                        </>
                      )}
                    </>
                  )}

                  {question.status === "rejected" && (
                    <button
                      onClick={() => openModal(question._id, "pending")}
                      className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 cursor-pointer"
                    >
                      <FiCheckCircle /> Pending
                    </button>
                  )}
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

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAction}
        title={getModalText().title}
        message={getModalText().message}
        type={
          modalAction === "rejected" || modalAction === "delete"
            ? "danger"
            : "success"
        }
      />
    </main>
  );
};

export default QnaAdmin;
