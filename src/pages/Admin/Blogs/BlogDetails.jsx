import { useCallback, useEffect, useState } from "react";
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

const BlogDetails = () => {
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const { id } = useParams();

  const fetchBlog = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/blogs/${id}`);
      setBlog(res.data);
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const openModal = (id, action) => {
    setModalAction(action);
    setModalOpen(true);
  };

  const confirmAction = async () => {
    if (modalAction === "delete") {
      setLoading(true);
      try {
        await api.delete(`/blogs/${id}`);
        toast.success("🗑️ Blog deleted successfully");
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
        await api.put(`/admin/blogStatus/${id}`, {
          status: "published",
        });
        toast.success("✅ Blog published");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (modalAction === "pending") {
      setLoading(true);
      try {
        await api.put(`/admin/blogStatus/${id}`, {
          status: "pending",
        });
        toast.success("🕒 Blog marked as pending");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (modalAction === "rejected") {
      setLoading(true);
      try {
        await api.put(`/admin/blogStatus/${id}`, {
          status: "rejected",
        });
        toast.success("❌ Blog rejected");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (modalAction === "featured") {
      setLoading(true);
      try {
        await api.put(`/admin/blogFeature/${id}`, {
          featured: true,
        });
        toast.success("🌟 Blog featured successfully");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (modalAction === "unFeatured") {
      setLoading(true);
      try {
        await api.put(`/admin/blogFeature/${id}`, {
          featured: false,
        });
        toast.success("⭐ Blog unFeatured successfully");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    setModalOpen(false);
    setModalAction(null);
    fetchBlog();
  };

  const getModalText = () => {
    switch (modalAction) {
      case "delete":
        return { title: "Delete Blog", message: "Are you sure to delete?" };
      case "published":
        return { title: "Publish Blog", message: "Publish this blog?" };
      case "pending":
        return { title: "Mark Pending", message: "Mark this blog as pending?" };
      case "rejected":
        return { title: "Reject Blog", message: "Reject this blog?" };
      case "featured":
        return { title: "Feature Blog", message: "Feature this blog?" };
      case "unFeatured":
        return { title: "UnFeature Blog", message: "Remove from featured?" };
      default:
        return { title: "", message: "" };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <FiLoader className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (!blog || !blog.title) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Blog not found!
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
                  Blog Details
                </h1>
                <p className="text-gray-600">View and manage blog post</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Blog Details Content */}
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
                      blog.status === "published"
                        ? "bg-green-100 text-green-800"
                        : blog.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {blog.status?.toUpperCase()}
                  </span>
                  {blog.featured && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-500">
                  <FiShare />
                </button>
              </div>

              <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
                {blog.title}
              </h1>

              {blog.cover && (
                <img
                  src={blog.cover}
                  alt="Blog Cover"
                  className="w-full rounded-xl mb-6 shadow-md"
                />
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-6 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <FiUser className="text-gray-400" />
                    <span className="font-medium">
                      {blog.author?.name || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="text-gray-400" />
                    <span>
                      {new Date(blog.createdAt).toLocaleString("en-US", {
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

            {/* Blog Body */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-6"
            >
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
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
                Blog Info
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <span className="text-gray-600">Category</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {blog?.category?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      blog.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {blog.status}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600">Created At:</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {new Date(blog.createdAt).toLocaleString("en-US", {
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
                    to={`/admin/blogs/update/${blog._id}`}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    <FiEdit /> Edit
                  </Link>
                  <button
                    onClick={() => openModal(blog._id, "delete")}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
                <div className="flex justify-between flex-wrap gap-2">
                  {blog.status === "pending" && (
                    <>
                      <button
                        onClick={() => openModal(blog._id, "published")}
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
                      >
                        <FiCheckCircle /> Approve
                      </button>
                      <button
                        onClick={() => openModal(blog._id, "rejected")}
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer"
                      >
                        <FiXCircle /> Reject
                      </button>
                    </>
                  )}

                  {blog.status === "published" && (
                    <>
                      {blog.featured ? (
                        <button
                          onClick={() => openModal(blog._id, "unFeatured")}
                          className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer"
                        >
                          <FiXCircle /> UnFeatured
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => openModal(blog._id, "pending")}
                            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 cursor-pointer"
                          >
                            <FiCheckCircle /> Pending
                          </button>
                          <button
                            onClick={() => openModal(blog._id, "featured")}
                            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
                          >
                            <FiCheckCircle /> Featured
                          </button>
                        </>
                      )}
                    </>
                  )}

                  {blog.status === "rejected" && (
                    <button
                      onClick={() => openModal(blog._id, "pending")}
                      className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 cursor-pointer"
                    >
                      <FiCheckCircle /> Pending
                    </button>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600">Last Update</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {new Date(blog.updatedAt).toLocaleString("en-US", {
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

export default BlogDetails;
