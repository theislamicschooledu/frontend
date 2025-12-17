import { useCallback, useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiShare,
  FiCalendar,
  FiUser,
  FiLoader,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import api from "../../../utils/axios";
import { Link, useParams } from "react-router";
import ConfirmModal from "../../../components/ConfirmModal";
import toast from "react-hot-toast";

import Quill from "quill";
import "quill/dist/quill.snow.css";

const QuestionDetailsAdmin = () => {
  const [localLoading, setLocalLoading] = useState(false);
  const [question, setQuestion] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [answerId, setAnswerId] = useState("");
  const [editingAnswerId, setEditingAnswerId] = useState(null);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { id } = useParams();

  const fetchQuestion = useCallback(async () => {
    setLocalLoading(true);
    try {
      const res = await api.get(`/admin/qna/${id}`);
      setQuestion(res.data.question);
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      setLocalLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  useEffect(() => {
    if (question && editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write your answer here...",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "clean"],
          ],
        },
      });
    }
  }, [question]);

  const openModal = (id, action) => {
    setAnswerId(id);
    setModalAction(action);
    setModalOpen(true);
  };

  const confirmAction = async () => {
    if (modalAction === "delete") {
      setLocalLoading(true);
      try {
        await api.delete(`/qna/${id}`);
        toast.success("🗑️ Question deleted successfully");
        setLocalLoading(false);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLocalLoading(false);
      }
    }

    if (modalAction === "published") {
      setLocalLoading(true);
      try {
        const res = await api.put(`/admin/qnaStatus/${id}`, {
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
        setLocalLoading(false);
      }
    }

    if (modalAction === "pending") {
      setLocalLoading(true);
      try {
        await api.put(`/admin/qnaStatus/${id}`, {
          status: "pending",
        });
        toast.success("🕒 Question marked as pending");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLocalLoading(false);
      }
    }

    if (modalAction === "rejected") {
      setLocalLoading(true);
      try {
        await api.put(`/admin/qnaStatus/${id}`, {
          status: "rejected",
        });
        toast.success("❌ Question rejected");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLocalLoading(false);
      }
    }

    if (modalAction === "featured") {
      setLocalLoading(true);
      try {
        await api.put(`/admin/qnaFeature/${id}`, {
          featured: true,
        });
        toast.success("🌟 Question featured successfully");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLocalLoading(false);
      }
    }

    if (modalAction === "unFeatured") {
      setLocalLoading(true);
      try {
        await api.put(`/admin/qnaFeature/${id}`, {
          featured: false,
        });
        toast.success("⭐ Question unFeatured successfully");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLocalLoading(false);
      }
    }

    if (modalAction === "deleteAnswer") {
      setLocalLoading(true);
      try {
        const res = await api.delete(`/qna/${id}/answers/${answerId}`);
        if (res.data.success) {
          setLocalLoading(false);
          toast.success(res.data.message);
        } else {
          setLocalLoading(false);
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLocalLoading(false);
      }
    }

    if (modalAction === "approveAnswer") {
      setLocalLoading(true);
      try {
        const res = await api.put(`/admin/${id}/answers/${answerId}/approve`, {
          status: true,
        });
        toast.success(res.data.message);
        setLocalLoading(false);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLocalLoading(false);
      }
    }
    if (modalAction === "unapprovedAnswer") {
      setLocalLoading(true);
      try {
        const res = await api.put(`/admin/${id}/answers/${answerId}/approve`, {
          status: false,
        });
        if (res.data.success) {
          toast.success("answer unapproved");
        } else {
          toast.error(res.data.message);
        }
        setLocalLoading(false);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLocalLoading(false);
      }
    }

    fetchQuestion();
    setModalOpen(false);
    setModalAction(null);
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
      case "approveAnswer":
        return {
          title: "Approve Answer",
          message: "Approve this Answer?",
        };
      case "unapprovedAnswer":
        return {
          title: "Unapproved Answer",
          message: "Unapproved this answer and make it pending?",
        };
      case "deleteAnswer":
        return {
          title: "Delete Answer",
          message: "Are you sure to delete?",
        };
      default:
        return { title: "", message: "" };
    }
  };

  const handleEditAnswer = (answerId, text) => {
    setEditingAnswerId(answerId);
    if (quillRef.current) {
      quillRef.current.root.innerHTML = text;
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleSubmitAnswer = async () => {
    const editorContent = quillRef.current?.root.innerHTML.trim();

    if (!editorContent || editorContent === "<p><br></p>") {
      toast.error("Answer cannot be empty");
      return;
    }

    setLocalLoading(true);
    try {
      if (editingAnswerId) {
        // 🛠 Update existing answer
        const res = await api.put(`/qna/${id}/answers/${editingAnswerId}`, {
          text: editorContent,
        });
        if (res.data.success) {
          toast.success(res.data.message || "Answer updated successfully");
          setEditingAnswerId(null);
          quillRef.current.root.innerHTML = "";
          fetchQuestion();
        }
      } else {
        // 🆕 Post new answer
        const res = await api.post(`/qna/${id}/answers`, {
          text: editorContent,
        });
        if (res.data.success) {
          toast.success(res.data.message);
          quillRef.current.root.innerHTML = "";
          fetchQuestion();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLocalLoading(false);
    }
  };

  if (localLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <FiLoader className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (!question || !question.title) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Question not found!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition"
              >
                <FiArrowLeft className="mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Question Details
                </h1>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Question Details Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      question.status === "published"
                        ? "bg-green-100 text-green-800"
                        : question.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {question.status?.toUpperCase()}
                  </span>
                  {question.featured && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-500">
                  <FiShare />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-6 leading-tight">
                {question.title}
              </h2>

              <div
                className="prose prose-lg max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: question.description }}
              />

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-6 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <FiUser className="text-gray-400" />
                    <span className="font-medium">
                      {question.askedBy?.name || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="text-gray-400" />
                    <span>
                      {new Date(question.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Answers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-6"
            >
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 leading-tight">
                  Answers
                </h2>
                {question?.answers.map((answer) => (
                  <div
                    key={answer._id}
                    className={`flex flex-col md:flex-row justify-between gap-6 px-4 py-3 mb-4  rounded-lg ${
                      answer.isApproved
                        ? "bg-green-100 border-2 border-green-200"
                        : "bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <div
                      className="prose prose-lg text-gray-600 max-w-none mb-6"
                      dangerouslySetInnerHTML={{ __html: answer.text }}
                    />
                    <div>
                      <div>
                        <p className="font-bold text-sm">Answered By: </p>
                        <div className="flex gap-2 items-center">
                          <p className="text-gray-500 text-xs">
                            {answer.answeredBy.name}
                          </p>
                          <p className="bg-blue-500 text-white px-2 text-xs rounded-full">
                            {answer.answeredBy.role.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="mb-2">
                        <p className="font-bold text-sm">Answered At:</p>
                        <p className="font-semibold text-gray-500 text-xs">
                          {new Date(answer.createdAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                      <div className="flex justify-between gap-2">
                        <button
                          onClick={() =>
                            handleEditAnswer(answer._id, answer.text)
                          }
                          className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                        >
                          <FiEdit /> Edit
                        </button>

                        {answer.isApproved ? (
                          <button
                            onClick={() =>
                              openModal(answer._id, "unapprovedAnswer")
                            }
                            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 cursor-pointer"
                          >
                            <FiXCircle /> Unapproved
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              openModal(answer._id, "approveAnswer")
                            }
                            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
                          >
                            <FiCheckCircle /> Approve
                          </button>
                        )}
                        <button
                          onClick={() => openModal(answer._id, "deleteAnswer")}
                          className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mb-8">
                  <div
                    ref={editorRef}
                    className="quill-editor bg-white border border-gray-300 rounded-xl min-h-[200px] p-2"
                  />
                </div>
                <motion.button
                  type="submit"
                  onClick={handleSubmitAnswer}
                  disabled={localLoading}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full flex justify-center items-center py-3 ${
                    editingAnswerId
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white rounded-xl transition shadow-md ${
                    localLoading
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {localLoading
                    ? "Submitting..."
                    : editingAnswerId
                    ? "Update Answer"
                    : "Submit Answer"}
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Question Info
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold text-xs text-gray-800">
                    {question.category?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      question.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {question.status}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600">Created At</span>
                  <span className="font-semibold text-sm text-gray-800">
                    {new Date(question.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Actions</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Link
                    to={`/qa/update/${question._id}`}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    <FiEdit /> Edit
                  </Link>
                  <button
                    onClick={() => openModal(question._id, "delete")}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
                <div className="flex justify-between flex-wrap gap-2">
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
                <div className="flex flex-col">
                  <span className="text-gray-600">Last Update</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {new Date(question.updatedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default QuestionDetailsAdmin;
