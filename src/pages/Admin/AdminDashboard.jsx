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
  FiGlobe,
  FiTarget,
  FiEye,
  FiPhone,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiVideo,
  FiMessageCircle,
  FiSend,
  FiX,
} from "react-icons/fi";
import { ImBlog } from "react-icons/im";
import { MdOutlineQuestionMark } from "react-icons/md";
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Link } from "react-router";
import { toast } from "react-hot-toast";
import { useLanguage } from "../../hooks/useLanguage";

const AdminDashboard = () => {
  const [totalStudent, setTotalStudent] = useState(0);
  const [totalTeacher, setTotalTeacher] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [courses, setCourses] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [documentation, setDocumentation] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    principalVoiceTitle: "",
    principalVoiceText: "",
    ourMission: "",
    ourVision: "",
    onlineFeatures: "",
    ourAchievement: "",
    helpline: "",
    email: "",
    headOffice: "",
    website: "",
    facebook: "",
    youtube: "",
    whatsapp: "",
    telegram: "",
  });
  const [principalVoicePhoto, setPrincipalVoicePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { language, t } = useLanguage();

  const locale = language === "bn" ? "bn-BD" : "en-US";
  const formatNumber = (value) => Number(value || 0).toLocaleString(locale);
  const statusLabel = (status) => {
    const key = `adminDashboard.status.${status || "default"}`;
    const translated = t(key);
    return translated === key
      ? status || t("adminDashboard.status.default")
      : translated;
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get("/auth/users");
      const count = res.data.userCount;
      setTotalStudent(count.totalStudent);
      setTotalTeacher(count.totalTeacher);
    };

    const fetchCourses = async () => {
      const res = await api.get("/courses");
      setTotalCourses(res.data.count);
      const sliceCourse = res.data.data.slice(0, 5);
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
      const allQuestions = res.data.questions || [];
      setTotalQuestions(allQuestions.length);
      const sliceQuestion = allQuestions.slice(0, 5);
      setQuestions(sliceQuestion);
    };

    const fetchDocumentation = async () => {
      try {
        const res = await api.get("/documentation");
        if (res.data.success) {
          setDocumentation(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching documentation:", error);
        setDocumentation(null);
      }
    };

    fetchUser();
    fetchCourses();
    fetchBlogs();
    fetchQuestions();
    fetchDocumentation();
  }, []);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(t("adminDashboard.toasts.selectImage"));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t("adminDashboard.toasts.imageTooLarge"));
        return;
      }
      setPrincipalVoicePhoto(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      principalVoiceTitle: "",
      principalVoiceText: "",
      ourMission: "",
      ourVision: "",
      onlineFeatures: "",
      ourAchievement: "",
      helpline: "",
      email: "",
      headOffice: "",
      website: "",
      facebook: "",
      youtube: "",
      whatsapp: "",
      telegram: "",
    });
    setPrincipalVoicePhoto(null);
    setImagePreview(null);
  };

  // Load documentation data into form for editing
  const loadDocumentationData = (doc) => {
    if (doc) {
      setFormData({
        principalVoiceTitle: doc.principalVoice?.title || "",
        principalVoiceText: doc.principalVoice?.text || "",
        ourMission: doc.ourMission || "",
        ourVision: doc.ourVision || "",
        onlineFeatures: Array.isArray(doc.onlineFeatures)
          ? doc.onlineFeatures.join(", ")
          : "",
        ourAchievement: Array.isArray(doc.ourAchievement)
          ? doc.ourAchievement.join(", ")
          : "",
        helpline: Array.isArray(doc.contact?.helpline)
          ? doc.contact.helpline.join(", ")
          : "",
        email: Array.isArray(doc.contact?.email)
          ? doc.contact.email.join(", ")
          : "",
        headOffice: doc.contact?.headOffice || "",
        website: Array.isArray(doc.contact?.website)
          ? doc.contact.website.join(", ")
          : "",
        facebook: doc.socialMedia?.facebook || "",
        youtube: doc.socialMedia?.youtube || "",
        whatsapp: doc.socialMedia?.whatsapp || "",
        telegram: doc.socialMedia?.telegram || "",
      });
      setImagePreview(doc.principalVoice?.photo || null);
    }
  };

  // Create or update documentation
  const handleSaveDocumentation = async () => {
    try {
      setLoading(true);

      // Required field validation
      if (!formData.principalVoiceTitle || !formData.principalVoiceText) {
        toast.error(t("adminDashboard.toasts.voiceRequired"));
        return;
      }

      // For update, image is optional. For create, image is required
      if (!documentation && !principalVoicePhoto) {
        toast.error(t("adminDashboard.toasts.photoRequired"));
        return;
      }

      const formDataToSend = new FormData();

      // Add form data
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Add image if exists
      if (principalVoicePhoto) {
        formDataToSend.append("principalVoicePhoto", principalVoicePhoto);
      }

      let res;
      if (documentation) {
        // Update existing documentation
        res = await api.put("/documentation", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Create new documentation
        res = await api.post("/documentation", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (res.data.success) {
        toast.success(res.data.message);
        setDocumentation(res.data.data);
        setIsEditModalOpen(false);
        setIsCreateModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving documentation:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          t("adminDashboard.toasts.saveFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete documentation
  const handleDeleteDocumentation = async () => {
    if (!window.confirm(t("adminDashboard.deleteConfirm"))) {
      return;
    }

    try {
      const res = await api.delete("/documentation");
      if (res.data.success) {
        toast.success(t("adminDashboard.toasts.deleted"));
        setDocumentation(null);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || t("adminDashboard.toasts.deleteFailed")
      );
    }
  };

  // Open edit modal
  const handleEdit = () => {
    if (documentation) {
      loadDocumentationData(documentation);
      setIsEditModalOpen(true);
    }
  };

  // Open create modal
  const handleCreate = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  // Open view modal
  const handleViewDetails = () => {
    setIsViewModalOpen(true);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const stats = [
    {
      title: t("adminDashboard.stats.students"),
      value: totalStudent,
      icon: FiUsers,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-linear-to-br from-blue-50 to-cyan-50",
    },
    {
      title: t("adminDashboard.stats.courses"),
      value: totalCourses,
      icon: FiBook,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-linear-to-br from-green-50 to-emerald-50",
    },
    {
      title: t("adminDashboard.stats.teachers"),
      value: totalTeacher,
      icon: FiUserCheck,
      color: "from-purple-500 to-fuchsia-500",
      bgColor: "bg-linear-to-br from-purple-50 to-fuchsia-50",
    },
    {
      title: t("adminDashboard.stats.blogs"),
      value: totalBlogs,
      icon: ImBlog,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-linear-to-br from-amber-50 to-orange-50",
    },
    {
      title: t("adminDashboard.stats.questions"),
      value: totalQuestions,
      icon: MdOutlineQuestionMark,
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-linear-to-br from-rose-50 to-pink-50",
    },
  ];

  const statusColors = {
    published: "bg-green-100 text-green-700 border border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    rejected: "bg-red-100 text-red-700 border border-red-200",
    featured: "bg-amber-100 text-amber-700 border border-amber-200",
    default: "bg-gray-100 text-gray-700 border border-gray-200",
  };

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
            {t("adminDashboard.title")}
          </h1>
          <p className="text-gray-600 mt-2">
            {t("adminDashboard.subtitle")}
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
                    {formatNumber(stat.value)}
                  </h3>
                </div>
                <div
                  className={`p-3 rounded-xl bg-linear-to-r ${stat.color} text-white shadow-md`}
                >
                  <stat.icon size={24} />
                </div>
              </div>
            </div>
            <div
              className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${stat.color}`}
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
                {t("adminDashboard.recentBlogs")}
              </h2>
              <Link
                to={"/admin/blogs"}
                className="text-emerald-600 text-sm font-medium hover:text-emerald-700 flex items-center gap-1 transition-colors"
              >
                {t("adminDashboard.viewAll")}
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
                      {new Date(blog.createdAt).toLocaleString(locale, {
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
                  } shrink-0 ml-2`}
                >
                  {statusLabel(blog.status)}
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
                {t("adminDashboard.recentQuestions")}
              </h2>
              <Link
                to={"/admin/questions"}
                className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                {t("adminDashboard.viewAll")}
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
                    {new Date(question.createdAt).toLocaleString(locale, {
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
                  } shrink-0 ml-3`}
                >
                  {statusLabel(question.status)}
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
                {t("adminDashboard.coursePerformance")}
              </h2>
              <Link
                to={"/admin/courses"}
                className="text-purple-600 text-sm font-medium hover:text-purple-700 flex items-center gap-1 transition-colors"
              >
                {t("adminDashboard.viewAll")}
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
                      {t("adminDashboard.studentsCount", {
                        count: formatNumber(course.studentCount || 0),
                      })}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[course.status] || statusColors.default
                  } shrink-0 ml-3`}
                >
                  {statusLabel(course.status)}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Documentation Management - Updated with Summary View */}
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
                {t("adminDashboard.documentation.title")}
              </h2>
              <div className="flex gap-2">
                {documentation ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center gap-1 transition-colors px-3 py-1.5 bg-indigo-50 rounded-lg"
                    >
                      <FiEdit size={14} />
                      {t("adminDashboard.actions.edit")}
                    </button>
                    <button
                      onClick={handleDeleteDocumentation}
                      className="text-red-600 text-sm font-medium hover:text-red-700 flex items-center gap-1 transition-colors px-3 py-1.5 bg-red-50 rounded-lg"
                    >
                      <FiTrash2 size={14} />
                      {t("adminDashboard.actions.delete")}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleCreate}
                    className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center gap-1 transition-colors"
                  >
                    <FiPlus size={16} />
                    {t("adminDashboard.actions.create")}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="p-6">
            {documentation ? (
              <div className="space-y-6">
                {/* Status Summary */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">
                      {t("adminDashboard.status.active")}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {t("adminDashboard.documentation.updated", {
                      date: formatDate(documentation.updatedAt),
                    })}
                  </span>
                </div>

                {/* Principal Voice Summary */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="text-xl">👨‍💼</span>
                    {t("adminDashboard.documentation.principalVoice")}
                  </h3>
                  <div className="flex items-center gap-4">
                    {documentation.principalVoice?.photo && (
                      <img
                        src={documentation.principalVoice.photo}
                        alt={t("adminDashboard.documentation.principalAlt")}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {documentation.principalVoice?.title ||
                          t("adminDashboard.documentation.noTitle")}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {documentation.principalVoice?.text ||
                          t("adminDashboard.documentation.noContent")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FiTarget className="text-blue-500" size={16} />
                      <span className="text-xs font-medium text-gray-700">
                        {t("adminDashboard.documentation.mission")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {documentation.ourMission
                        ? `${documentation.ourMission.substring(0, 40)}...`
                        : t("adminDashboard.documentation.notSet")}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FiEye className="text-green-500" size={16} />
                      <span className="text-xs font-medium text-gray-700">
                        {t("adminDashboard.documentation.vision")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {documentation.ourVision
                        ? `${documentation.ourVision.substring(0, 40)}...`
                        : t("adminDashboard.documentation.notSet")}
                    </p>
                  </div>
                </div>

                {/* Features & Achievements Count */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FiGlobe className="text-purple-500" size={16} />
                        <span className="text-xs font-medium text-gray-700">
                          {t("adminDashboard.documentation.features")}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                        {formatNumber(documentation.onlineFeatures?.length || 0)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {t("adminDashboard.documentation.featuresAvailable")}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FiStar className="text-amber-500" size={16} />
                        <span className="text-xs font-medium text-gray-700">
                          {t("adminDashboard.documentation.achievements")}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                        {formatNumber(documentation.ourAchievement?.length || 0)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {t("adminDashboard.documentation.achievementsListed")}
                    </p>
                  </div>
                </div>

                {/* Contact & Social Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FiPhone className="text-red-500" size={16} />
                      <span className="text-xs font-medium text-gray-700">
                        {t("adminDashboard.documentation.contact")}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">
                        📞 {t("adminDashboard.documentation.numberCount", {
                          count: formatNumber(documentation.contact?.helpline?.length || 0),
                        })}
                      </p>
                      <p className="text-xs text-gray-600">
                        ✉️ {t("adminDashboard.documentation.emailCount", {
                          count: formatNumber(documentation.contact?.email?.length || 0),
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FiMessageSquare className="text-blue-500" size={16} />
                      <span className="text-xs font-medium text-gray-700">
                        {t("adminDashboard.documentation.socialMedia")}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {documentation.socialMedia?.facebook && (
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <FiMessageSquare className="text-blue-600" size={12} />
                        </div>
                      )}
                      {documentation.socialMedia?.youtube && (
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                          <FiVideo className="text-red-600" size={12} />
                        </div>
                      )}
                      {documentation.socialMedia?.whatsapp && (
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <FiMessageCircle className="text-green-600" size={12} />
                        </div>
                      )}
                      {documentation.socialMedia?.telegram && (
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <FiSend className="text-blue-600" size={12} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* View Details Button */}
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={handleViewDetails}
                    className="w-full py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <FiEye size={16} />
                    {t("adminDashboard.documentation.viewDetails")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FiFileText className="mx-auto text-gray-400 mb-3" size={32} />
                <p className="text-gray-500 text-sm">
                  {t("adminDashboard.documentation.notFound")}
                </p>
                <button
                  onClick={handleCreate}
                  className="mt-3 text-indigo-600 text-sm font-medium hover:text-indigo-700"
                >
                  {t("adminDashboard.documentation.create")}
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
        className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-fr"
      >
        {[
          {
            title: t("adminDashboard.quick.manageStudents"),
            icon: FiUsers,
            actionIcon: FiEdit,
            gradient: "from-emerald-500 to-green-500",
            description: t("adminDashboard.quick.manageStudentsDescription"),
            to: "/admin/users",
          },
          {
            title: t("adminDashboard.quick.createCourse"),
            icon: FiBook,
            actionIcon: FiPlus,
            gradient: "from-blue-500 to-cyan-500",
            description: t("adminDashboard.quick.createCourseDescription"),
            to: "/admin/courses/add",
          },
          {
            title: t("adminDashboard.quick.createBlog"),
            icon: FiBarChart2,
            actionIcon: FiTrendingUp,
            gradient: "from-purple-500 to-fuchsia-500",
            description: t("adminDashboard.quick.createBlogDescription"),
            to: "/admin/blogs/add",
          },
          {
            title: t("adminDashboard.quick.manageDocumentation"),
            icon: FiFileText,
            actionIcon: documentation ? FiEdit : FiPlus,
            gradient: "from-indigo-500 to-violet-500",
            description: documentation
              ? t("adminDashboard.documentation.edit")
              : t("adminDashboard.documentation.create"),
            to: "#",
            onClick: documentation ? handleEdit : handleCreate,
          },
        ].map((card, idx) => {
          const CardContent = (
            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className={`relative overflow-hidden bg-linear-to-r ${card.gradient} text-white rounded-2xl shadow-lg p-6 cursor-pointer group hover:shadow-xl transition-all duration-300 h-full flex flex-col`}
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <card.icon size={28} className="opacity-90" />
                  <card.actionIcon
                    size={20}
                    className="opacity-80 group-hover:translate-x-1 transition-transform"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-sm opacity-90 grow">{card.description}</p>
              </div>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          );

          return card.to === "#" ? (
            <button key={idx} onClick={card.onClick} className="text-left h-full">
              {CardContent}
            </button>
          ) : (
            <Link to={card.to} key={idx} className="h-full">
              {CardContent}
            </Link>
          );
        })}
      </motion.div>

      {/* View Details Modal */}
      {isViewModalOpen && documentation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {t("adminDashboard.documentation.detailsTitle")}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {t("adminDashboard.documentation.detailsSubtitle")}
                </p>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Principal Voice */}
              <div className="border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">👨‍💼</span>
                  {t("adminDashboard.documentation.principalVoice")}
                </h4>
                <div className="flex flex-col md:flex-row gap-6">
                  {documentation.principalVoice?.photo && (
                    <div className="md:w-1/3">
                      <img
                        src={documentation.principalVoice.photo}
                        alt={t("adminDashboard.documentation.principalAlt")}
                        className="w-full max-w-xs h-auto object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h5 className="text-lg font-semibold text-gray-900 mb-3">
                      {documentation.principalVoice?.title}
                    </h5>
                    <p className="text-gray-600 whitespace-pre-line">
                      {documentation.principalVoice?.text}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mission & Vision */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiTarget className="text-blue-600" />
                    {t("adminDashboard.documentation.ourMission")}
                  </h4>
                  <p className="text-gray-600 whitespace-pre-line">
                    {documentation.ourMission}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiEye className="text-green-600" />
                    {t("adminDashboard.documentation.ourVision")}
                  </h4>
                  <p className="text-gray-600 whitespace-pre-line">
                    {documentation.ourVision}
                  </p>
                </div>
              </div>

              {/* Features & Achievements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiGlobe className="text-purple-600" />
                    {t("adminDashboard.documentation.onlineFeatures")}
                  </h4>
                  <ul className="space-y-2">
                    {documentation.onlineFeatures?.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 shrink-0"></span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiStar className="text-amber-600" />
                    {t("adminDashboard.documentation.ourAchievements")}
                  </h4>
                  <ul className="space-y-2">
                    {documentation.ourAchievement?.map((achievement, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0"></span>
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FiPhone className="text-red-600" />
                  {t("adminDashboard.documentation.contactInformation")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FiPhone className="text-gray-400" />
                        {t("adminDashboard.documentation.helplineNumbers")}
                      </h5>
                      <ul className="space-y-2">
                        {documentation.contact?.helpline?.map((number, index) => (
                          <li
                            key={index}
                            className="text-gray-600 bg-gray-50 p-3 rounded-lg"
                          >
                            {number}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FiMail className="text-gray-400" />
                        {t("adminDashboard.documentation.emailAddresses")}
                      </h5>
                      <ul className="space-y-2">
                        {documentation.contact?.email?.map((email, index) => (
                          <li
                            key={index}
                            className="text-gray-600 bg-gray-50 p-3 rounded-lg"
                          >
                            {email}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FiMapPin className="text-gray-400" />
                        {t("adminDashboard.documentation.headOffice")}
                      </h5>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-line">
                        {documentation.contact?.headOffice}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FiGlobe className="text-gray-400" />
                        {t("adminDashboard.documentation.websites")}
                      </h5>
                      <ul className="space-y-2">
                        {documentation.contact?.website?.map((site, index) => (
                          <li key={index}>
                            <a
                              href={site}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 bg-gray-50 p-3 rounded-lg block hover:bg-blue-50 transition-colors"
                            >
                              {site}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FiMessageSquare className="text-blue-600" />
                  {t("adminDashboard.documentation.socialMediaLinks")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {documentation.socialMedia?.facebook && (
                    <a
                      href={documentation.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                        <FiMessageSquare className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {t("adminDashboard.documentation.facebook")}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {documentation.socialMedia.facebook}
                        </p>
                      </div>
                    </a>
                  )}

                  {documentation.socialMedia?.youtube && (
                    <a
                      href={documentation.socialMedia.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                        <FiVideo className="text-red-600" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {t("adminDashboard.documentation.youtube")}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {documentation.socialMedia.youtube}
                        </p>
                      </div>
                    </a>
                  )}

                  {documentation.socialMedia?.whatsapp && (
                    <a
                      href={`https://wa.me/${documentation.socialMedia.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                        <FiMessageCircle className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {t("adminDashboard.documentation.whatsapp")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {documentation.socialMedia.whatsapp}
                        </p>
                      </div>
                    </a>
                  )}

                  {documentation.socialMedia?.telegram && (
                    <a
                      href={`https://t.me/${documentation.socialMedia.telegram.replace(
                        "@",
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                        <FiSend className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {t("adminDashboard.documentation.telegram")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {documentation.socialMedia.telegram}
                        </p>
                      </div>
                    </a>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div>
                    <span className="font-medium">
                      {t("adminDashboard.documentation.created")}
                    </span>{" "}
                    {formatDate(documentation.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">
                      {t("adminDashboard.documentation.lastUpdated")}
                    </span>{" "}
                    {formatDate(documentation.updatedAt)}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 flex justify-end gap-3">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t("adminDashboard.actions.close")}
              </button>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEdit();
                }}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {t("adminDashboard.documentation.edit")}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create/Edit Documentation Modal - Keep as before */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                {documentation
                  ? t("adminDashboard.documentation.edit")
                  : t("adminDashboard.documentation.create")}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {documentation
                  ? t("adminDashboard.documentation.updateDescription")
                  : t("adminDashboard.documentation.createDescription")}
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Principal Voice Section */}
              <div className="border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">👨‍💼</span>
                  {t("adminDashboard.documentation.principalVoice")}
                </h4>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("adminDashboard.documentation.principalPhotoRequired")}
                      {documentation && (
                        <span className="text-xs text-gray-500 ml-2">
                          {t("adminDashboard.documentation.keepCurrentImage")}
                        </span>
                      )}
                    </label>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="principalPhoto"
                        />
                        <label
                          htmlFor="principalPhoto"
                          className="cursor-pointer block"
                        >
                          {imagePreview ? (
                            <div className="space-y-2">
                              <img
                                src={imagePreview}
                                alt={t("adminDashboard.documentation.previewAlt")}
                                className="mx-auto h-40 w-40 object-cover rounded-lg"
                              />
                              <p className="text-sm text-gray-600">
                                {t("adminDashboard.documentation.clickChangeImage")}
                              </p>
                            </div>
                          ) : (
                            <div className="py-8">
                              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                <FiPlus className="text-gray-400" size={24} />
                              </div>
                              <p className="text-sm text-gray-600">
                                {t("adminDashboard.documentation.clickUploadImage")}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {t("adminDashboard.documentation.imageHelp")}
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                      {documentation?.principalVoice?.photo &&
                        !imagePreview && (
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-2">
                              {t("adminDashboard.documentation.currentImage")}
                            </p>
                            <img
                              src={documentation.principalVoice.photo}
                              alt={t("adminDashboard.documentation.currentPrincipalAlt")}
                              className="mx-auto h-32 w-32 object-cover rounded-lg border border-gray-200"
                            />
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Title and Text */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("adminDashboard.documentation.titleRequired")}
                      </label>
                      <input
                        type="text"
                        value={formData.principalVoiceTitle}
                        onChange={(e) =>
                          handleInputChange(
                            "principalVoiceTitle",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder={t("adminDashboard.documentation.titlePlaceholder")}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("adminDashboard.documentation.textRequired")}
                      </label>
                      <textarea
                        value={formData.principalVoiceText}
                        onChange={(e) =>
                          handleInputChange(
                            "principalVoiceText",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="4"
                        placeholder={t("adminDashboard.documentation.voicePlaceholder")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mission & Vision */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiTarget className="text-blue-600" />
                    {t("adminDashboard.documentation.ourMission")}
                  </h4>
                  <textarea
                    value={formData.ourMission}
                    onChange={(e) =>
                      handleInputChange("ourMission", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows="3"
                    placeholder={t("adminDashboard.documentation.missionPlaceholder")}
                  />
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiEye className="text-green-600" />
                    {t("adminDashboard.documentation.ourVision")}
                  </h4>
                  <textarea
                    value={formData.ourVision}
                    onChange={(e) =>
                      handleInputChange("ourVision", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows="3"
                    placeholder={t("adminDashboard.documentation.visionPlaceholder")}
                  />
                </div>
              </div>

              {/* Features & Achievements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiGlobe className="text-purple-600" />
                    {t("adminDashboard.documentation.onlineFeatures")}
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-2">
                      {t("adminDashboard.documentation.featuresHelp")}
                    </p>
                    <textarea
                      value={formData.onlineFeatures}
                      onChange={(e) =>
                        handleInputChange("onlineFeatures", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows="3"
                      placeholder={t("adminDashboard.documentation.featuresPlaceholder")}
                    />
                    <p className="text-xs text-gray-500">
                      {t("adminDashboard.documentation.featuresExample")}
                    </p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiStar className="text-amber-600" />
                    {t("adminDashboard.documentation.ourAchievements")}
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-2">
                      {t("adminDashboard.documentation.achievementsHelp")}
                    </p>
                    <textarea
                      value={formData.ourAchievement}
                      onChange={(e) =>
                        handleInputChange("ourAchievement", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows="3"
                      placeholder={t("adminDashboard.documentation.achievementsPlaceholder")}
                    />
                    <p className="text-xs text-gray-500">
                      {t("adminDashboard.documentation.achievementsExample")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FiPhone className="text-red-600" />
                  {t("adminDashboard.documentation.contactInformation")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("adminDashboard.documentation.helplineNumbers")}
                      </label>
                      <textarea
                        value={formData.helpline}
                        onChange={(e) =>
                          handleInputChange("helpline", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="2"
                        placeholder={t("adminDashboard.documentation.helplinePlaceholder")}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {t("adminDashboard.documentation.numbersHelp")}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("adminDashboard.documentation.emailAddresses")}
                      </label>
                      <textarea
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="2"
                        placeholder={t("adminDashboard.documentation.emailPlaceholder")}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {t("adminDashboard.documentation.emailsHelp")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("adminDashboard.documentation.headOffice")} Address
                      </label>
                      <textarea
                        value={formData.headOffice}
                        onChange={(e) =>
                          handleInputChange("headOffice", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="2"
                        placeholder={t("adminDashboard.documentation.officePlaceholder")}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("adminDashboard.documentation.websiteUrls")}
                      </label>
                      <textarea
                        value={formData.website}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="2"
                        placeholder={t("adminDashboard.documentation.websitePlaceholder")}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {t("adminDashboard.documentation.urlsHelp")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FiMessageSquare className="text-blue-600" />
                  {t("adminDashboard.documentation.socialMediaLinks")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("adminDashboard.documentation.facebookUrl")}
                      </label>
                      <input
                        type="text"
                        value={formData.facebook}
                        onChange={(e) =>
                          handleInputChange("facebook", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("adminDashboard.documentation.youtubeUrl")}
                      </label>
                      <input
                        type="text"
                        value={formData.youtube}
                        onChange={(e) =>
                          handleInputChange("youtube", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="https://youtube.com/yourchannel"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("adminDashboard.documentation.whatsappNumber")}
                      </label>
                      <input
                        type="text"
                        value={formData.whatsapp}
                        onChange={(e) =>
                          handleInputChange("whatsapp", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="+8801700000000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("adminDashboard.documentation.telegramUsername")}
                      </label>
                      <input
                        type="text"
                        value={formData.telegram}
                        onChange={(e) =>
                          handleInputChange("telegram", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder={t("adminDashboard.documentation.telegramPlaceholder")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => {
                  if (isEditModalOpen) setIsEditModalOpen(false);
                  if (isCreateModalOpen) setIsCreateModalOpen(false);
                  resetForm();
                }}
                className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                {t("adminDashboard.actions.cancel")}
              </button>
              <button
                onClick={handleSaveDocumentation}
                disabled={loading}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {documentation
                      ? t("adminDashboard.documentation.updating")
                      : t("adminDashboard.documentation.creating")}
                  </>
                ) : documentation ? (
                  t("adminDashboard.documentation.update")
                ) : (
                  t("adminDashboard.documentation.create")
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