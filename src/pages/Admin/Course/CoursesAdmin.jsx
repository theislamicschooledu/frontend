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
  FiStar,
  FiList,
  FiUsers,
  FiCalendar,
  FiClock,
  FiInfo,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../utils/axios";
import ConfirmModal from "../../../components/ConfirmModal";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useLanguage } from "../../../hooks/useLanguage";

const CoursesAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const { language, t } = useLanguage();
  const locale = language === "bn" ? "bn-BD" : "en-US";
  const formatNumber = (value) => Number(value || 0).toLocaleString(locale);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/courses");

      if (data.success) setCourses(data.data);
    } catch (err) {
      console.error(err);
      toast.error(t("adminCourse.list.toasts.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  const openModal = (id, action) => {
    setSelectedCourseId(id);
    setModalAction(action);
    setModalOpen(true);
  };

  const confirmAction = async () => {
    setLoading(true);
    try {
      const selectedCourse = courses.find((c) => c._id === selectedCourseId);

      switch (modalAction) {
        case "delete":
          await api.delete(`/courses/${selectedCourseId}`);
          toast.success(t("adminCourse.list.toasts.deleted"));
          break;

        case "publish":
          // Regular publish - requires all dates
          if (
            !selectedCourse.enrollmentStart ||
            !selectedCourse.enrollmentEnd ||
            !selectedCourse.courseStart
          ) {
            toast.error(
              t("adminCourse.list.toasts.datesRequiredPublish"),
            );
            setLoading(false);
            setModalOpen(false);
            setSelectedCourseId(null);
            setModalAction(null);
            return;
          }

          await api.put(`/courses/${selectedCourseId}`, {
            status: "published",
            isUpcoming: false,
          });
          toast.success(t("adminCourse.list.toasts.published"));
          break;

        case "publish_as_upcoming":
          // Publish as upcoming - dates optional
          await api.put(`/courses/${selectedCourseId}`, {
            status: "published",
            isUpcoming: true,
          });
          toast.success(t("adminCourse.list.toasts.publishedUpcoming"));
          break;

        case "pending":
          await api.put(`/courses/${selectedCourseId}`, {
            status: "pending",
          });
          toast.success(t("adminCourse.list.toasts.markedPending"));
          break;

        case "reject":
          await api.put(`/courses/${selectedCourseId}`, {
            status: "rejected",
          });
          toast.success(t("adminCourse.list.toasts.rejected"));
          break;

        case "feature":
          await api.put(`/courses/${selectedCourseId}`, {
            featured: true,
          });
          toast.success(t("adminCourse.list.toasts.featured"));
          break;

        case "unfeature":
          await api.put(`/courses/${selectedCourseId}`, {
            featured: false,
          });
          toast.success(t("adminCourse.list.toasts.unfeatured"));
          break;

        case "mark_upcoming":
          // Mark existing course as upcoming
          await api.put(`/courses/${selectedCourseId}`, {
            isUpcoming: true,
            status: "published",
          });
          toast.success(t("adminCourse.list.toasts.markedUpcoming"));
          break;

        case "remove_upcoming":
          // Remove upcoming status - requires all dates
          if (
            !selectedCourse.enrollmentStart ||
            !selectedCourse.enrollmentEnd ||
            !selectedCourse.courseStart
          ) {
            toast.error(t("adminCourse.list.toasts.datesRequiredRemoveUpcoming"));
            setLoading(false);
            setModalOpen(false);
            setSelectedCourseId(null);
            setModalAction(null);
            return;
          }

          await api.put(`/courses/${selectedCourseId}`, {
            isUpcoming: false,
            status: "published",
          });
          toast.success(t("adminCourse.list.toasts.removedUpcoming"));
          break;

        default:
          break;
      }
      fetchCourses();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || t("adminCourse.list.toasts.actionFailed");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setModalOpen(false);
      setSelectedCourseId(null);
      setModalAction(null);
    }
  };

  const getModalText = () => {
    switch (modalAction) {
      case "delete":
        return {
          title: t("adminCourse.list.modal.deleteTitle"),
          message: t("adminCourse.list.modal.deleteMessage"),
        };
      case "publish":
        return {
          title: t("adminCourse.list.modal.publishTitle"),
          message: t("adminCourse.list.modal.publishMessage"),
        };
      case "publish_as_upcoming":
        return {
          title: t("adminCourse.list.modal.publishUpcomingTitle"),
          message: t("adminCourse.list.modal.publishUpcomingMessage"),
        };
      case "pending":
        return {
          title: t("adminCourse.list.modal.pendingTitle"),
          message: t("adminCourse.list.modal.pendingMessage"),
        };
      case "reject":
        return {
          title: t("adminCourse.list.modal.rejectTitle"),
          message: t("adminCourse.list.modal.rejectMessage"),
        };
      case "feature":
        return {
          title: t("adminCourse.list.modal.featureTitle"),
          message: t("adminCourse.list.modal.featureMessage"),
        };
      case "unfeature":
        return {
          title: t("adminCourse.list.modal.unfeatureTitle"),
          message: t("adminCourse.list.modal.unfeatureMessage"),
        };
      case "mark_upcoming":
        return {
          title: t("adminCourse.list.modal.upcomingTitle"),
          message: t("adminCourse.list.modal.upcomingMessage"),
        };
      case "remove_upcoming":
        return {
          title: t("adminCourse.list.modal.removeUpcomingTitle"),
          message: t("adminCourse.list.modal.removeUpcomingMessage"),
        };
      default:
        return { title: "", message: "" };
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description &&
        course.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" ||
      course.status === filterStatus ||
      (filterStatus === "featured" && course.featured === true) ||
      (filterStatus === "upcoming" && course.isUpcoming === true);

    return matchesSearch && matchesStatus;
  });

  const statusCounts = courses.reduce(
    (acc, course) => {
      acc.all += 1;
      if (course.status === "published") acc.published += 1;
      if (course.status === "pending") acc.pending += 1;
      if (course.status === "rejected") acc.rejected += 1;
      if (course.isUpcoming === true) acc.upcoming += 1;
      if (course.featured) acc.featured += 1;

      return acc;
    },
    { all: 0, published: 0, pending: 0, rejected: 0, upcoming: 0, featured: 0 },
  );

  const getStatusColor = (status, isUpcoming = false) => {
    if (isUpcoming) {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }

    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (course) => {
    if (course.isUpcoming === true) {
      return t("adminCourse.common.upcoming");
    }
    return t(`adminCourse.common.${course.status || "unknown"}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("adminCourse.common.notSet");
    try {
      return new Date(dateString).toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return t("adminCourse.common.invalidDate");
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
      {/* Page Title */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {t("adminCourse.list.title")}
          </h1>
          <p className="text-gray-600">{t("adminCourse.list.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={"/admin/courses/category"}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            <FiPlus className="mr-2" />
            {t("adminCourse.list.addCategory")}
          </Link>
          <Link
            to={`/admin/courses/add`}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            <FiPlus className="mr-2" />
            {t("adminCourse.list.addCourse")}
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t("adminCourse.list.searchPlaceholder")}
            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-wrap gap-3">
          {[
            "all",
            "published",
            "pending",
            "rejected",
            "upcoming",
            "featured",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filterStatus === status
                  ? status === "published"
                    ? "bg-green-600 text-white"
                    : status === "pending"
                      ? "bg-yellow-500 text-white"
                      : status === "rejected"
                        ? "bg-red-600 text-white"
                        : status === "upcoming"
                          ? "bg-blue-600 text-white"
                          : status === "featured"
                            ? "bg-amber-500 text-white"
                            : "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t(`adminCourse.common.${status}`)}{" "}
              ({statusCounts[status] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">
            {formatNumber(statusCounts.all)}
          </div>
          <div className="text-sm text-gray-600">{t("adminCourse.list.totalCourses")}</div>
        </div>
        <div className="bg-green-50 rounded-2xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-800">
            {formatNumber(statusCounts.published)}
          </div>
          <div className="text-sm text-green-600">{t("adminCourse.common.published")}</div>
        </div>
        <div className="bg-yellow-50 rounded-2xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-800">
            {formatNumber(statusCounts.pending)}
          </div>
          <div className="text-sm text-yellow-600">{t("adminCourse.common.pending")}</div>
        </div>
        <div className="bg-blue-50 rounded-2xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-800">
            {formatNumber(statusCounts.upcoming)}
          </div>
          <div className="text-sm text-blue-600">{t("adminCourse.common.upcoming")}</div>
        </div>
        <div className="bg-amber-50 rounded-2xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-amber-800">
            {formatNumber(statusCounts.featured)}
          </div>
          <div className="text-sm text-amber-600">{t("adminCourse.common.featured")}</div>
        </div>
        <div className="bg-red-50 rounded-2xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-800">
            {formatNumber(statusCounts.rejected)}
          </div>
          <div className="text-sm text-red-600">{t("adminCourse.common.rejected")}</div>
        </div>
      </div>

      {/* Course List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
            <div className="col-span-4">{t("adminCourse.list.courseInfo")}</div>
            <div className="col-span-2 text-center">{t("adminCourse.list.categoryType")}</div>
            <div className="col-span-2 text-center">{t("adminCourse.list.stats")}</div>
            <div className="col-span-2 text-center">{t("adminCourse.list.statusDates")}</div>
            <div className="col-span-2 text-center">{t("adminCourse.common.actions")}</div>
          </div>

          {/* Course List Items */}
          <div className="divide-y divide-gray-100">
            {filteredCourses.map((course, index) => {
              const isUpcoming = course.isUpcoming === true;
              return (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Course Information */}
                  <div className="col-span-4 flex items-start space-x-4">
                    <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-linear-to-r from-green-100 to-emerald-100">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-r from-green-100 to-emerald-100">
                          <FiBookOpen className="text-green-600 text-xl" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {course.title}
                        </h3>
                        {course.featured && (
                          <FiStar className="text-amber-500 shrink-0" />
                        )}
                        {isUpcoming && (
                          <FiInfo className="text-blue-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {course.description ? (
                          <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: course.description?.slice(0, 120) + "...",
                            }}
                          />
                        ) : (
                          t("adminCourse.list.noDescription")
                        )}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <FiCalendar className="text-gray-400" />
                          <span>{formatDate(course.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-green-700">
                            ${course.price || 0}
                          </span>
                        </div>
                        {course.duration && (
                          <div className="flex items-center space-x-1">
                            <FiClock className="text-gray-400" />
                            <span>{t("adminCourse.list.hours", { count: formatNumber(course.duration) })}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Category & Type */}
                  <div className="col-span-2 flex flex-col items-center justify-center space-y-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {course.category?.name || t("adminCourse.common.uncategorized")}
                    </span>
                    {isUpcoming && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {t("adminCourse.common.upcoming")}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center space-x-1">
                          <FaChalkboardTeacher className="text-gray-400" />
                          <span className="font-semibold">
                            {formatNumber(course.teachers?.length || 0)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{t("adminCourse.list.teachers")}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center space-x-1">
                          <FiList className="text-gray-400" />
                          <span className="font-semibold">
                            {formatNumber(course.lectureCount ||
                              course.lectures?.length ||
                              0)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{t("adminCourse.list.lectures")}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center space-x-1">
                          <FiUsers className="text-gray-400" />
                          <span className="font-semibold">
                            {formatNumber(course.studentCount || 0)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{t("adminCourse.list.students")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Dates */}
                  <div className="col-span-2 flex flex-col items-center justify-center space-y-2">
                    <div className="flex flex-col items-center space-y-1">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          course.status,
                          isUpcoming,
                        )}`}
                      >
                        {getStatusText(course)}
                      </span>
                      {course.featured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          {t("adminCourse.common.featured")}
                        </span>
                      )}
                    </div>
                    {isUpcoming ? (
                      <div className="text-center">
                        {course.enrollmentStart ||
                        course.enrollmentEnd ||
                        course.courseStart ? (
                          <div className="text-xs text-blue-600">
                            <div>{t("adminCourse.list.tentativeDates")}</div>
                            {course.enrollmentStart && (
                              <div>
                                {t("adminCourse.common.enrollmentStart")}: {formatDate(course.enrollmentStart)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-blue-600 italic">
                            {t("adminCourse.details.datesNotSet")}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        {course.enrollmentStart && course.enrollmentEnd ? (
                          <>
                            <div className="text-xs text-gray-500">
                              {formatDate(course.enrollmentStart)} -{" "}
                              {formatDate(course.enrollmentEnd)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {t("adminCourse.common.courseStart")}: {formatDate(course.courseStart)}
                            </div>
                          </>
                        ) : (
                          <span className="text-xs text-red-500 italic">
                            {t("adminCourse.list.datesRequired")}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-center space-x-1">
                    <Link
                      to={`/admin/courses/${course._id}`}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                      title={t("adminCourse.list.viewDetails")}
                    >
                      <FiEye className="text-lg" />
                    </Link>
                    <Link
                      to={`/admin/courses/update/${course._id}`}
                      className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title={t("adminCourse.list.editCourse")}
                    >
                      <FiEdit className="text-lg" />
                    </Link>
                    <button
                      onClick={() => openModal(course._id, "delete")}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title={t("adminCourse.list.deleteCourse")}
                    >
                      <FiTrash2 className="text-lg" />
                    </button>

                    {/* Status Actions */}
                    <div className="flex flex-col space-y-1 ml-2">
                      {!isUpcoming ? (
                        <>
                          {course.status === "pending" && (
                            <>
                              <button
                                onClick={() => openModal(course._id, "publish")}
                                className="p-1 text-green-400 hover:text-green-600 hover:bg-green-50 rounded transition"
                                title={t("adminCourse.list.publishRegular")}
                              >
                                <FiCheckCircle className="text-sm" />
                              </button>
                              <button
                                onClick={() =>
                                  openModal(course._id, "publish_as_upcoming")
                                }
                                className="p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                title={t("adminCourse.list.publishUpcoming")}
                              >
                                <FiInfo className="text-sm" />
                              </button>
                              <button
                                onClick={() => openModal(course._id, "reject")}
                                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                title={t("adminCourse.list.rejectCourse")}
                              >
                                <FiXCircle className="text-sm" />
                              </button>
                            </>
                          )}

                          {course.status === "published" && (
                            <>
                              <button
                                onClick={() => openModal(course._id, "pending")}
                                className="p-1 text-yellow-400 hover:text-yellow-600 hover:bg-yellow-50 rounded transition"
                                title={t("adminCourse.list.markPending")}
                              >
                                <FiCheckCircle className="text-sm" />
                              </button>
                              <button
                                onClick={() =>
                                  openModal(course._id, "mark_upcoming")
                                }
                                className="p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                title={t("adminCourse.list.markUpcoming")}
                              >
                                <FiInfo className="text-sm" />
                              </button>
                              {course.featured ? (
                                <button
                                  onClick={() =>
                                    openModal(course._id, "unfeature")
                                  }
                                  className="p-1 text-amber-400 hover:text-amber-600 hover:bg-amber-50 rounded transition"
                                  title={t("adminCourse.list.removeFeatured")}
                                >
                                  <FiStar className="text-sm" />
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    openModal(course._id, "feature")
                                  }
                                  className="p-1 text-green-400 hover:text-green-600 hover:bg-green-50 rounded transition"
                                  title={t("adminCourse.list.markFeatured")}
                                >
                                  <FiStar className="text-sm" />
                                </button>
                              )}
                            </>
                          )}

                          {course.status === "rejected" && (
                            <>
                              <button
                                onClick={() => openModal(course._id, "publish")}
                                className="p-1 text-green-400 hover:text-green-600 hover:bg-green-50 rounded transition"
                                title={t("adminCourse.list.publishRegular")}
                              >
                                <FiCheckCircle className="text-sm" />
                              </button>
                              <button
                                onClick={() =>
                                  openModal(course._id, "publish_as_upcoming")
                                }
                                className="p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                title={t("adminCourse.list.publishUpcoming")}
                              >
                                <FiInfo className="text-sm" />
                              </button>
                              <button
                                onClick={() => openModal(course._id, "pending")}
                                className="p-1 text-yellow-400 hover:text-yellow-600 hover:bg-yellow-50 rounded transition"
                                title={t("adminCourse.list.markPending")}
                              >
                                <FiCheckCircle className="text-sm" />
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        // Actions for Upcoming courses
                        <>
                          <button
                            onClick={() => openModal(course._id, "publish")}
                            className="p-1 text-green-400 hover:text-green-600 hover:bg-green-50 rounded transition"
                            title={t("adminCourse.list.publishRegular")}
                          >
                            <FiCheckCircle className="text-sm" />
                          </button>
                          <button
                            onClick={() =>
                              openModal(course._id, "remove_upcoming")
                            }
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition"
                            title={t("adminCourse.list.removeUpcoming")}
                          >
                            <FiXCircle className="text-sm" />
                          </button>
                          {course.featured ? (
                            <button
                              onClick={() => openModal(course._id, "unfeature")}
                              className="p-1 text-amber-400 hover:text-amber-600 hover:bg-amber-50 rounded transition"
                              title={t("adminCourse.list.removeFeatured")}
                            >
                              <FiStar className="text-sm" />
                            </button>
                          ) : (
                            <button
                              onClick={() => openModal(course._id, "feature")}
                              className="p-1 text-green-400 hover:text-green-600 hover:bg-green-50 rounded transition"
                              title={t("adminCourse.list.markFeatured")}
                            >
                              <FiStar className="text-sm" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <FiBookOpen className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            {t("adminCourse.list.noCourses")}
          </h3>
          <p className="text-gray-500 mb-4">
            {t("adminCourse.list.noCoursesDesc")}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition"
            >
              {t("adminCourse.list.clearFilters")}
            </button>
            <Link
              to="/admin/courses/add"
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              <FiPlus className="inline mr-2" />
              {t("adminCourse.list.addCourse")}
            </Link>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAction}
        title={getModalText().title}
        message={getModalText().message}
        type={
          modalAction === "reject" || modalAction === "delete"
            ? "danger"
            : modalAction === "mark_upcoming" ||
                modalAction === "publish_as_upcoming" ||
                modalAction === "remove_upcoming"
              ? "info"
              : "success"
        }
      />
    </main>
  );
};

export default CoursesAdmin;
