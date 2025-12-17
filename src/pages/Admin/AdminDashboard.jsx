// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiUsers,
  FiBook,
  FiBarChart2,
  FiUserCheck,
  FiStar,
  FiEdit,
  FiPlus,
  FiTrendingUp,
  FiChevronRight,
  FiFileText,
  FiTrash2,
} from "react-icons/fi";
import { ImBlog } from "react-icons/im";
import { MdOutlineQuestionMark } from "react-icons/md";
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Link } from "react-router";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const [totalStudent, setTotalStudent] = useState(0);
  const [totalTeacher, setTotalTeacher] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [courses, setCourses] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [documentations, setDocumentations] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    directorVoice: { name: "", designation: "", text: "" },
    teacherVoice: { name: "", designation: "", text: "" },
    studentVoice: { name: "", designation: "", text: "" },
    parentVoice: { name: "", designation: "", text: "" },
  });
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get("/auth/users");
      const count = res.data.userCount;
      setTotalStudent(count.totalStudent);
      setTotalTeacher(count.totalTeacher);
    };

    const fetchCourses = async () => {
      const res = await api.get("/courses");
      setTotalCourses(res.data.length);
      const sliceCourse = res.data.slice(0, 5);
      setCourses(sliceCourse);
    };

    const fetchBlogs = async () => {
      const res = await api.get("/admin/blogs");
      setTotalBlogs(res.data.length);
      const sliceBlog = res.data.slice(0, 5);
      setBlogs(sliceBlog);
    };

    const fetchQuestions = async () => {
      const res = await api.get("/qna");
      const sliceQuestion = res.data.questions.slice(0, 5);
      setQuestions(sliceQuestion);
    };

    const fetchDocumentations = async () => {
      try {
        const res = await api.get("/documentation");
        setDocumentations(res.data.data || []);
      } catch (error) {
        console.error("Error fetching documentations:", error);
      }
    };

    fetchUser();
    fetchCourses();
    fetchBlogs();
    fetchQuestions();
    fetchDocumentations();
  }, []);

  // Handle form input changes
  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Handle image upload
  const handleImageUpload = (section, file) => {
    setImages((prev) => ({
      ...prev,
      [section]: file,
    }));
  };

  // Create new documentation
  const handleCreateDocumentation = async () => {
    try {
      setLoading(true);

      const formDataToSend = new FormData();

      // Add sections data
      Object.keys(formData).forEach((section) => {
        formDataToSend.append(
          `sections[${section}][name]`,
          formData[section].name
        );
        formDataToSend.append(
          `sections[${section}][designation]`,
          formData[section].designation
        );
        formDataToSend.append(
          `sections[${section}][text]`,
          formData[section].text
        );

        // Add image if exists
        if (images[section]) {
          formDataToSend.append(section, images[section]);
        }
      });

      const res = await api.post("/documentation", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Documentation created successfully!");
        setDocumentations([...documentations, res.data.data]);
        setIsCreateModalOpen(false);
        resetForm();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to create documentation"
      );
    } finally {
      setLoading(false);
    }
  };

  // Update documentation
  const handleUpdateDocumentation = async () => {
    try {
      setLoading(true);

      const formDataToSend = new FormData();

      // Add sections data
      Object.keys(formData).forEach((section) => {
        formDataToSend.append(
          `sections[${section}][name]`,
          formData[section].name
        );
        formDataToSend.append(
          `sections[${section}][designation]`,
          formData[section].designation
        );
        formDataToSend.append(
          `sections[${section}][text]`,
          formData[section].text
        );

        // Add image if exists
        if (images[section]) {
          formDataToSend.append(section, images[section]);
        }
      });

      const res = await api.put(
        `/documentation/${selectedDoc._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("Documentation updated successfully!");
        setDocumentations(
          documentations.map((doc) =>
            doc._id === selectedDoc._id ? res.data.data : doc
          )
        );
        setIsEditModalOpen(false);
        resetForm();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to update documentation"
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete documentation
  const handleDeleteDocumentation = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this documentation?"))
      return;

    try {
      const res = await api.delete(`/api/documentation/${docId}`);
      if (res.data.success) {
        toast.success("Documentation deleted successfully!");
        setDocumentations(documentations.filter((doc) => doc._id !== docId));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to delete documentation"
      );
    }
  };

  // Delete section from documentation
  const handleDeleteSection = async (docId, sectionName) => {
    if (
      !window.confirm(`Are you sure you want to delete ${sectionName} section?`)
    )
      return;

    try {
      const res = await api.delete(
        `/documentation/${docId}/section/${sectionName}`
      );
      if (res.data.success) {
        toast.success("Section deleted successfully!");
        // Refresh documentations
        const updatedRes = await api.get("/documentation");
        setDocumentations(updatedRes.data.data || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete section");
    }
  };

  // Edit documentation
  const handleEdit = (doc) => {
    setSelectedDoc(doc);
    const sections = doc.sections || {};
    const newFormData = {};

    ["directorVoice", "teacherVoice", "studentVoice", "parentVoice"].forEach(
      (section) => {
        newFormData[section] = sections[section] || {
          name: "",
          designation: "",
          text: "",
        };
      }
    );

    setFormData(newFormData);
    setIsEditModalOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      directorVoice: { name: "", designation: "", text: "" },
      teacherVoice: { name: "", designation: "", text: "" },
      studentVoice: { name: "", designation: "", text: "" },
      parentVoice: { name: "", designation: "", text: "" },
    });
    setImages({});
    setSelectedDoc(null);
  };

  const stats = [
    {
      title: "Total Students",
      value: totalStudent,
      icon: FiUsers,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
    },
    {
      title: "Total Courses",
      value: totalCourses,
      icon: FiBook,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
    },
    {
      title: "Active Teachers",
      value: totalTeacher,
      icon: FiUserCheck,
      color: "from-purple-500 to-fuchsia-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-fuchsia-50",
    },
    {
      title: "Total Blogs",
      value: totalBlogs,
      icon: ImBlog,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
    },
    {
      title: "Total Questions",
      value: totalBlogs,
      icon: MdOutlineQuestionMark,
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-rose-50 to-pink-50",
    },
  ];

  const statusColors = {
    published: "bg-green-100 text-green-700 border border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    rejected: "bg-red-100 text-red-700 border border-red-200",
    featured: "bg-amber-100 text-amber-700 border border-amber-200",
    default: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  // Documentation sections for display
  const documentationSections = [
    { key: "directorVoice", label: "Director Voice", icon: "👨‍💼" },
    { key: "teacherVoice", label: "Teacher Voice", icon: "👩‍🏫" },
    { key: "studentVoice", label: "Student Voice", icon: "👨‍🎓" },
    { key: "parentVoice", label: "Parent Voice", icon: "👨‍👦" },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/30">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, Admin! Here's what's happening today.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ${stat.bgColor} border border-gray-100`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </h3>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-md`}
                >
                  <stat.icon size={24} />
                </div>
              </div>
            </div>
            <div
              className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}
            ></div>
          </motion.div>
        ))}
      </div>

      {/* Content Grid - Updated to include Documentation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Recent Blogs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-1"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                Recent Blogs
              </h2>
              <Link
                to={"/admin/blogs"}
                className="text-emerald-600 text-sm font-medium hover:text-emerald-700 flex items-center gap-1 transition-colors"
              >
                View All
                <FiChevronRight size={16} />
              </Link>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {blogs?.map((blog) => (
              <Link
                to={`/admin/blogs/${blog._id}`}
                key={blog._id}
                className="flex items-center justify-between p-3 bg-gray-50/50 hover:bg-emerald-50 rounded-xl transition-all duration-200 group border border-transparent hover:border-emerald-100"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-emerald-700">
                      {blog.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(blog.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[blog.status] || statusColors.default
                  } flex-shrink-0 ml-2`}
                >
                  {blog.status}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Questions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-1"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                Recent Questions
              </h2>
              <Link
                to={"/admin/questions"}
                className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                View All
                <FiChevronRight size={16} />
              </Link>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {questions?.map((question) => (
              <Link
                to={`/admin/questions/${question._id}`}
                key={question._id}
                className="flex items-center justify-between p-3 bg-gray-50/50 hover:bg-blue-50 rounded-xl transition-all duration-200 group border border-transparent hover:border-blue-100"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700">
                    {question.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(question.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[question.status] || statusColors.default
                  } flex-shrink-0 ml-3`}
                >
                  {question.status}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Course Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-1"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                Course Performance
              </h2>
              <Link
                to={"/admin/courses"}
                className="text-purple-600 text-sm font-medium hover:text-purple-700 flex items-center gap-1 transition-colors"
              >
                View All
                <FiChevronRight size={16} />
              </Link>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {courses?.map((course, i) => (
              <Link
                to={`/admin/courses/${course._id}`}
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50/50 hover:bg-purple-50 rounded-xl transition-all duration-200 group border border-transparent hover:border-purple-100"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-purple-700">
                    {course.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-xs text-gray-500">
                      <FiStar className="text-yellow-400 mr-1" />
                      <span>{course.averageRating || 0}</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <span className="text-xs text-gray-500">
                      {course.studentCount || 0} students
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[course.status] || statusColors.default
                  } flex-shrink-0 ml-3`}
                >
                  {course.status}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Documentation Management */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-1"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FiFileText className="text-indigo-600" />
                Documentation
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center gap-1 transition-colors"
              >
                <FiPlus size={16} />
                Add New
              </button>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {documentations.length > 0 ? (
              documentations.map((doc) => (
                <motion.div
                  key={doc._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-gray-200 rounded-xl p-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Documentation #{doc._id.slice(-6)}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(doc)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteDocumentation(doc._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {documentationSections.map((section) => {
                      const sectionData = doc.sections?.[section.key];
                      return sectionData ? (
                        <div
                          key={section.key}
                          className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg"
                        >
                          <span className="text-lg">{section.icon}</span>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">
                                {section.label}
                              </span>
                              <button
                                onClick={() =>
                                  handleDeleteSection(doc._id, section.key)
                                }
                                className="text-xs text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                            <p className="text-xs text-gray-600 truncate">
                              {sectionData.name} - {sectionData.designation}
                            </p>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <FiFileText className="mx-auto text-gray-400 mb-3" size={32} />
                <p className="text-gray-500 text-sm">No documentation found</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-3 text-indigo-600 text-sm font-medium hover:text-indigo-700"
                >
                  Create your first documentation
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          {
            title: "Manage Students",
            icon: FiUsers,
            actionIcon: FiEdit,
            gradient: "from-emerald-500 to-green-500",
            description: "Add, edit, or remove student accounts",
            to: "/admin/users",
          },
          {
            title: "Create Course",
            icon: FiBook,
            actionIcon: FiPlus,
            gradient: "from-blue-500 to-cyan-500",
            description: "Design and publish new courses",
            to: "/admin/courses/add",
          },
          {
            title: "Create Blog",
            icon: FiBarChart2,
            actionIcon: FiTrendingUp,
            gradient: "from-purple-500 to-fuchsia-500",
            description: "Publish your thought and experience",
            to: "/admin/blogs/add",
          },
          {
            title: "Manage Documentation",
            icon: FiFileText,
            actionIcon: FiPlus,
            gradient: "from-indigo-500 to-violet-500",
            description: "Add or edit documentation sections",
            to: "#",
            onClick: () => setIsCreateModalOpen(true),
          },
        ].map((card, idx) =>
          card.to === "#" ? (
            <button key={idx} onClick={card.onClick} className="text-left">
              <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden bg-gradient-to-r ${card.gradient} text-white rounded-2xl shadow-lg p-6 cursor-pointer group hover:shadow-xl transition-all duration-300`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <card.icon size={28} className="opacity-90" />
                    <card.actionIcon
                      size={20}
                      className="opacity-80 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm opacity-90">{card.description}</p>
                </div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            </button>
          ) : (
            <Link to={card.to} key={idx}>
              <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden bg-gradient-to-r ${card.gradient} text-white rounded-2xl shadow-lg p-6 cursor-pointer group hover:shadow-xl transition-all duration-300`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <card.icon size={28} className="opacity-90" />
                    <card.actionIcon
                      size={20}
                      className="opacity-80 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm opacity-90">{card.description}</p>
                </div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            </Link>
          )
        )}
      </motion.div>

      {/* Create Documentation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                Create Documentation
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Add voice sections for director, teacher, student, and parent
              </p>
            </div>

            <div className="p-6 space-y-6">
              {documentationSections.map((section) => (
                <div
                  key={section.key}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{section.icon}</span>
                    <h4 className="font-medium text-gray-900">
                      {section.label}
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData[section.key].name}
                        onChange={(e) =>
                          handleInputChange(section.key, "name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={formData[section.key].designation}
                        onChange={(e) =>
                          handleInputChange(
                            section.key,
                            "designation",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter designation"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Text
                      </label>
                      <textarea
                        value={formData[section.key].text}
                        onChange={(e) =>
                          handleInputChange(section.key, "text", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="3"
                        placeholder="Enter text content"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(section.key, e.target.files[0])
                          }
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        {images[section.key] && (
                          <span className="text-sm text-green-600">
                            ✓ Selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDocumentation}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  "Create Documentation"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Documentation Modal */}
      {isEditModalOpen && selectedDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit Documentation
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Update voice sections
              </p>
            </div>

            <div className="p-6 space-y-6">
              {documentationSections.map((section) => {
                const sectionData = selectedDoc.sections?.[section.key];
                return (
                  <div
                    key={section.key}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{section.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {section.label}
                        </h4>
                        {sectionData?.image && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">
                              Current Image:
                            </p>
                            <img
                              src={sectionData.image}
                              alt={section.label}
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={formData[section.key].name}
                          onChange={(e) =>
                            handleInputChange(
                              section.key,
                              "name",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Designation
                        </label>
                        <input
                          type="text"
                          value={formData[section.key].designation}
                          onChange={(e) =>
                            handleInputChange(
                              section.key,
                              "designation",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter designation"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Text
                        </label>
                        <textarea
                          value={formData[section.key].text}
                          onChange={(e) =>
                            handleInputChange(
                              section.key,
                              "text",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          rows="3"
                          placeholder="Enter text content"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Image (Optional)
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(section.key, e.target.files[0])
                            }
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                          />
                          {images[section.key] && (
                            <span className="text-sm text-green-600">
                              ✓ New image selected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Leave empty to keep current image
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDocumentation}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  "Update Documentation"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
};

export default AdminDashboard;
