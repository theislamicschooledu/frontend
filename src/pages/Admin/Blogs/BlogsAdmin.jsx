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

const BlogsAdmin = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [modalAction, setModalAction] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/blogs");
      setBlogs(data);
    } catch (err) {
      toast.error("Failed to load blogs", err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (id, action) => {
    setSelectedBlogId(id);
    setModalAction(action);
    setModalOpen(true);
  };

  const confirmAction = async () => {
    if (modalAction === "delete") {
      setLoading(true);
      try {
        await api.delete(`/blogs/${selectedBlogId}`);
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
        await api.put(`/admin/blogStatus/${selectedBlogId}`, {
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
        await api.put(`/admin/blogStatus/${selectedBlogId}`, {
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
        await api.put(`/admin/blogStatus/${selectedBlogId}`, {
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
        await api.put(`/admin/blogFeature/${selectedBlogId}`, {
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
        await api.put(`/admin/blogFeature/${selectedBlogId}`, {
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
    setSelectedBlogId(null);
    setModalAction(null);
    fetchBlogs();
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

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      blog.status === filterStatus ||
      (filterStatus === "featured" && blog.featured === true);

    return matchesSearch && matchesStatus;
  });

  const statusCounts = blogs.reduce(
    (acc, blog) => {
      acc.all += 1;
      if (blog.status === "published") acc.published += 1;
      if (blog.status === "pending") acc.pending += 1;
      if (blog.status === "rejected") acc.rejected += 1;
      if (blog.featured) acc.featured += 1;
      return acc;
    },
    { all: 0, published: 0, pending: 0, rejected: 0, featured: 0 }
  );

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
      {/* Page Title */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Blog Management</h1>
          <p className="text-gray-600">Manage all blog posts</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={"/admin/blogs/category"}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            <FiPlus className="mr-2" />
            Add Blog Category
          </Link>
          <Link
            to={"/admin/blogs/add"}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            <FiPlus className="mr-2" />
            Add New Blog
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search blogs..."
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

      {/* Blog Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="relative h-40 overflow-hidden">
                {blog.cover ? (
                  <img
                    src={blog.cover}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-green-100 to-emerald-100" />
                )}
                {blog.featured && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-medium">
                    Featured
                  </div>
                )}
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium text-white ${
                    blog.status === "published"
                      ? "bg-green-400"
                      : blog.status === "rejected"
                      ? "bg-red-400"
                      : "bg-yellow-400"
                  }`}
                >
                  {blog.status.charAt(0).toUpperCase() +
                    blog.status.slice(1).toLowerCase()}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  {blog.title}
                </h3>
                <div className="flex justify-between mb-3">
                  <p className="text-sm bg-green-200 px-2 py-0.5 rounded-sm">
                    {blog.author?.name || "Unknown Author"}
                  </p>
                  <p className="text-sm bg-blue-200 px-2 py-0.5 rounded-sm">{blog.category?.name || "N/A"}</p>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: blog.content.slice(1, 400),
                    }}
                  />
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/admin/blogs/${blog._id}`}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                  >
                    <FiEye /> View
                  </Link>
                  <Link
                    to={`/admin/blogs/update/${blog._id}`}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                  >
                    <FiEdit /> Edit
                  </Link>
                  <button
                    onClick={() => openModal(blog._id, "delete")}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer"
                  >
                    <FiTrash2 /> Delete
                  </button>

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
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <FiBookOpen className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No blog posts found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("all");
              fetchBlogs();
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

export default BlogsAdmin;
