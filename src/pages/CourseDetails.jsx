// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiStar,
  FiClock,
  FiBook,
  FiPlay,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiDownload,
  FiBookOpen,
  FiUsers,
  FiAward,
  FiShare2,
  FiHeart,
  FiInfo,
  FiX,
} from "react-icons/fi";
import {
  FaChalkboardTeacher,
  FaRegClock,
  FaGraduationCap,
} from "react-icons/fa";
import { IoIosTrendingUp } from "react-icons/io";
import { MdWorkspacePremium } from "react-icons/md";
import api from "../utils/axios";
import PaymentModal from "../components/PaymentModal";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../hooks/useLanguage";

const floatingDecorations = [
  { left: "4%", top: "12%", size: 18, delay: 0.2, duration: 6.2 },
  { left: "12%", top: "72%", size: 13, delay: 1.1, duration: 7.1 },
  { left: "32%", top: "28%", size: 15, delay: 0.5, duration: 6.8 },
  { left: "57%", top: "82%", size: 17, delay: 1.5, duration: 7.4 },
  { left: "77%", top: "19%", size: 14, delay: 0.8, duration: 6.5 },
  { left: "92%", top: "63%", size: 20, delay: 1.8, duration: 7.2 },
];

const CourseStatusBadge = ({ status }) => {
  const { t } = useLanguage();

  const getStatusConfig = (currentStatus) => {
    switch (currentStatus) {
      case "coming_soon":
        return {
          text: t("courseDetails.status.comingSoon"),
          bg: "bg-[#f1ebff]",
          textColor: "text-[#7654c8]",
          border: "border-[#d9ccff]",
          icon: FiClock,
        };
      case "upcoming":
        return {
          text: t("courseDetails.status.upcoming"),
          bg: "bg-[#e9f5ff]",
          textColor: "text-[#2574a9]",
          border: "border-[#c7e5fb]",
          icon: FiCalendar,
        };
      case "enrollment_open":
        return {
          text: t("courseDetails.status.enrollmentOpen"),
          bg: "bg-[#e5f8f2]",
          textColor: "text-[#08736e]",
          border: "border-[#bde9dd]",
          icon: FiUsers,
        };
      case "enrollment_closed":
        return {
          text: t("courseDetails.status.enrollmentClosed"),
          bg: "bg-[#fff0e9]",
          textColor: "text-[#d95635]",
          border: "border-[#ffd1c2]",
          icon: FiX,
        };
      case "course_started":
        return {
          text: t("courseDetails.status.courseStarted"),
          bg: "bg-[#e6f7f6]",
          textColor: "text-[#08736e]",
          border: "border-[#bce8e3]",
          icon: FaGraduationCap,
        };
      default:
        return {
          text: t("courseDetails.status.published"),
          bg: "bg-slate-100",
          textColor: "text-slate-600",
          border: "border-slate-200",
          icon: FiBookOpen,
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black shadow-sm ${config.bg} ${config.textColor} ${config.border}`}
    >
      <Icon size={13} />
      {config.text}
    </span>
  );
};

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedLectures, setExpandedLectures] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const { user } = useAuth();
  const { language, t } = useLanguage();
  const locale = language === "bn" ? "bn-BD" : "en-US";
  const formatNumber = (value) => Number(value).toLocaleString(locale);

  const fetchCourseDetails = useCallback(async () => {
    setLoading(true);
    try {
      const courseRes = await api.get(`/courses/details/${id}`);

      if (courseRes.data.success) {
        const courseData = courseRes.data.data || courseRes.data.course;

        setCourse(courseData);
        setLectures(courseData.lectures || []);
        setTeachers(courseData.teachers || []);

        const expanded = {};
        (courseData.lectures || []).forEach((lec) => {
          expanded[lec._id] = false;
        });
        setExpandedLectures(expanded);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || t("courseDetails.loadFailed"),
      );
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await api.get(`/courses/${id}/reviews`);
      if (res.data.success) {
        setReviews(res.data.data?.reviews || []);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  }, [id]);

  const fetchEnrollment = useCallback(async () => {
    try {
      const res = await api.get("/enrollments/my-enrollments");
      const data = res.data.data || res.data;

      const findCourse = data.find((d) => d.course?._id === id);
      if (findCourse && findCourse.paymentStatus === "completed") {
        setEnrolled(true);
      } else {
        setEnrolled(false);
      }
    } catch (error) {
      console.log("Enrollment check failed:", error);
      setEnrolled(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourseDetails();
    fetchReviews();
    if (user) fetchEnrollment();
  }, [fetchCourseDetails, fetchEnrollment, fetchReviews, user]);

  const toggleLecture = (lectureId) => {
    setExpandedLectures((prev) => ({
      ...prev,
      [lectureId]: !prev[lectureId],
    }));
  };

  const getTimeRemaining = (enrollmentEnd) => {
    if (!enrollmentEnd) return t("courseDetails.enrollmentOpen");

    const now = new Date();
    const end = new Date(enrollmentEnd);
    const diff = end - now;

    if (diff <= 0) return t("courseDetails.enrollmentClosed");

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0)
      return t("courseDetails.daysLeft", { count: formatNumber(days) });

    const hours = Math.floor(diff / (1000 * 60 * 60));
    return t("courseDetails.hoursLeft", { count: formatNumber(hours) });
  };

  const formatDuration = (weeks) => {
    if (!weeks) return t("courseDetails.durationNotSpecified");
    if (weeks < 1)
      return t("courseDetails.durationDays", {
        count: formatNumber(Math.round(weeks * 7)),
      });
    return t("courseDetails.durationWeeks", { count: formatNumber(weeks) });
  };

  const handleEnrollClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error(t("courseDetails.loginToEnroll"));
      navigate("/login", { state: { from: `/course/${id}` } });
      return;
    }

    if (course.currentStatus !== "enrollment_open") {
      toast(
        course.currentStatus === "coming_soon"
          ? t("courseDetails.comingSoonEnrollMessage")
          : course.currentStatus === "enrollment_closed"
            ? t("courseDetails.enrollmentClosedMessage")
            : course.currentStatus === "course_started"
              ? t("courseDetails.courseStartedMessage")
              : t("courseDetails.enrollmentUnavailable"),
      );
      return;
    }

    setShowPaymentModal(true);
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error(t("courseDetails.loginToWishlist"));
      navigate("/login", { state: { from: `/course/${id}` } });
      return;
    }

    try {
      const res = await api.post(`/wishlist/toggle/${id}`);
      if (res.data.success) {
        setWishlisted(res.data.isInWishlist);
        toast.success(
          res.data.isInWishlist
            ? t("courseDetails.addedToWishlist")
            : t("courseDetails.removedFromWishlist"),
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(t("courseDetails.wishlistFailed"));
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`${
              i < fullStars
                ? "text-[#f6b91a] fill-current"
                : hasHalfStar && i === fullStars
                  ? "text-[#f6b91a] fill-current opacity-75"
                  : "text-slate-300"
            }`}
            size={16}
          />
        ))}
        <span className="ml-2 text-sm font-bold text-[#073b46]">
          {rating?.toFixed(1) || "0.0"}
        </span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("courseDetails.notSet");
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return t("courseDetails.invalidDate");
    }
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fff9e7] font-hind">
        <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-[#bcebe6]/55 blur-3xl" />
        <div className="absolute -right-24 bottom-12 h-80 w-80 rounded-full bg-[#ffd7cb]/60 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mx-5 rounded-4xl border-4 border-white bg-white/90 px-10 py-11 text-center shadow-[0_24px_70px_rgba(7,59,70,0.12)] backdrop-blur-sm"
        >
          <div className="relative mx-auto mb-5 h-20 w-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-[#ffd36e] border-t-[#ff6542]"
            />
            <div className="absolute inset-3 grid place-items-center rounded-full bg-[#fff4c9] text-[#073b46]">
              <FiBookOpen size={24} />
            </div>
          </div>
          <h2 className="text-2xl font-black text-[#073b46]">
            {t("courseDetails.loadingTitle")}
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {t("courseDetails.loadingDescription")}
          </p>
        </motion.div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fff9e7] px-4 font-hind">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#bcebe6]/50 blur-3xl" />
        <div className="absolute -right-20 bottom-16 h-80 w-80 rounded-full bg-[#ffd7cb]/60 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 w-full max-w-md rounded-4xl border-4 border-white bg-white p-8 text-center shadow-[0_24px_70px_rgba(7,59,70,0.12)]"
        >
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-[#fff0e9] text-[#ff6542]">
            <FiBookOpen size={34} />
          </div>
          <h3 className="text-2xl font-black text-[#073b46]">
            {t("courseDetails.notFoundTitle")}
          </h3>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
            {t("courseDetails.notFoundDescription")}
          </p>
          <button
            onClick={() => navigate("/courses")}
            className="mt-6 rounded-2xl bg-[#073b46] px-6 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#0b505d]"
          >
            {t("courseDetails.browseCourses")}
          </button>
        </motion.div>
      </div>
    );
  }

  const canEnroll = course.currentStatus === "enrollment_open";
  const isComingSoon = course.currentStatus === "coming_soon";

  const tabs = [
    {
      id: "overview",
      label: t("courseDetails.tabs.overview"),
      icon: FiBook,
      mobileLabel: t("courseDetails.tabs.overview"),
    },
    {
      id: "curriculum",
      label: t("courseDetails.tabs.curriculum"),
      icon: FiPlay,
      mobileLabel: t("courseDetails.tabs.curriculumMobile"),
    },
    {
      id: "instructors",
      label: t("courseDetails.tabs.instructors"),
      icon: FaChalkboardTeacher,
      mobileLabel: t("courseDetails.tabs.instructorsMobile"),
    },
    {
      id: "reviews",
      label: t("courseDetails.tabs.reviews"),
      icon: FiStar,
      mobileLabel: t("courseDetails.tabs.reviews"),
    },
  ];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-linear-to-b from-[#fff9e7] via-[#eef9ff] to-[#f2fbf6] font-hind text-slate-800">
      {/* Page background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {floatingDecorations.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-[#ffd36e]/45"
            style={{ left: item.left, top: item.top }}
            animate={{
              y: [0, -13, 0],
              rotate: [0, 14, -8, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
          >
            <FiStar size={item.size} />
          </motion.div>
        ))}
      </div>

      {/* Course header */}
      <section className="relative isolate z-10 overflow-hidden bg-[#fff4c9] pb-9 pt-10 sm:pb-11 sm:pt-12 lg:pb-12 lg:pt-14">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#ff6542]/12" />
        <div className="absolute -right-24 top-8 h-80 w-80 rounded-full bg-[#62d6c7]/24" />
        <div className="absolute -bottom-20 left-[42%] h-52 w-52 rounded-full bg-[#8b6fe8]/10" />

        <motion.div
          aria-hidden="true"
          animate={{ y: [0, -9, 0], rotate: [0, 7, 0] }}
          transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[5%] top-16 hidden h-12 w-12 place-items-center rounded-2xl border-4 border-white bg-[#ff6542] text-white shadow-lg lg:grid"
        >
          <FiBookOpen size={23} />
        </motion.div>

        <motion.div
          aria-hidden="true"
          animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 6.1, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[4%] top-20 hidden h-11 w-11 place-items-center rounded-full border-4 border-white bg-[#8b6fe8] text-white shadow-lg lg:grid"
        >
          <FiStar size={21} />
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-12 lg:gap-9">
            {/* Course information */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-8 lg:pt-3"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#073b46]/10 bg-white/70 px-3.5 py-2 text-xs font-bold text-[#073b46] shadow-sm backdrop-blur-sm">
                  <button
                    onClick={() => navigate("/courses")}
                    className="transition hover:text-[#ff6542]"
                  >
                    {t("courseDetails.courses")}
                  </button>
                  <span className="text-[#ff6542]">/</span>
                  <span className="max-w-44 truncate text-slate-500 sm:max-w-64">
                    {course.category?.name || t("courseDetails.uncategorized")}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <CourseStatusBadge status={course.currentStatus} />
                  {course.featured && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ffd36e] bg-[#fff7d8] px-3 py-1.5 text-xs font-black text-[#9a6500] shadow-sm">
                      <IoIosTrendingUp size={14} />
                      {t("courseDetails.featured")}
                    </span>
                  )}
                </div>
              </div>

              <h1 className="max-w-4xl text-3xl font-black leading-[1.12] tracking-tight text-[#073b46] sm:text-4xl lg:text-5xl">
                {course.title}
              </h1>

              <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-slate-600 sm:text-base lg:text-lg">
                {course.description
                  ?.replace(/<[^>]*>/g, "")
                  .substring(0, window.innerWidth < 640 ? 100 : 200)}
                {course.description?.length >
                  (window.innerWidth < 640 ? 100 : 200) && "..."}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
                <div className="flex items-center gap-2 rounded-2xl border-2 border-white bg-white/72 px-3 py-2.5 text-xs font-bold text-[#073b46] shadow-sm backdrop-blur-sm sm:text-sm">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#fff4d2] text-[#e5a300]">
                    <FiStar size={16} className="fill-current" />
                  </span>
                  <div>
                    <span className="font-black">
                      {course.averageRating?.toFixed(1) || "0.0"}
                    </span>
                    <span className="ml-1 text-slate-500">
                      ({course.ratingCount || 0})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border-2 border-white bg-white/72 px-3 py-2.5 text-xs font-bold text-[#073b46] shadow-sm backdrop-blur-sm sm:text-sm">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#e5f8f2] text-[#08736e]">
                    <FiUsers size={16} />
                  </span>
                  <span>
                    {t("courseDetails.students", {
                      count: formatNumber(course.studentCount || 0),
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border-2 border-white bg-white/72 px-3 py-2.5 text-xs font-bold text-[#073b46] shadow-sm backdrop-blur-sm sm:text-sm">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#f1ebff] text-[#7654c8]">
                    <FiClock size={16} />
                  </span>
                  <span>{formatDuration(course.duration)}</span>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border-2 border-white bg-white/72 px-3 py-2.5 text-xs font-bold text-[#073b46] shadow-sm backdrop-blur-sm sm:text-sm">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#fff0e9] text-[#ff6542]">
                    <FiBook size={16} />
                  </span>
                  <span>
                    {t("courseDetails.lectures", {
                      count: formatNumber(lectures.length),
                    })}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Enrollment card */}
            <motion.aside
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.65,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`rounded-4xl border-4 bg-white p-3 shadow-[0_24px_65px_rgba(7,59,70,0.14)] lg:col-span-4 ${
                isComingSoon ? "border-[#d8ccff]" : "border-white"
              }`}
            >
              <div className="relative overflow-hidden rounded-3xl bg-[#eef9ff]">
                {course.thumbnail ? (
                  <>
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-40 w-full object-cover sm:h-48 lg:h-44"
                      onError={(e) => {
                        e.target.src = "/default-course.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#073b46]/50 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="flex h-40 w-full items-center justify-center bg-linear-to-br from-[#62d6c7] to-[#8b6fe8] sm:h-48 lg:h-44">
                    <FiBookOpen className="text-5xl text-white" />
                  </div>
                )}

                <button
                  onClick={toggleWishlist}
                  className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-2xl border-2 border-white/80 backdrop-blur-md transition hover:scale-105 ${
                    wishlisted
                      ? "bg-[#ff6542] text-white"
                      : "bg-white/85 text-[#073b46] hover:text-[#ff6542]"
                  }`}
                  aria-label={t("courseDetails.toggleWishlist")}
                >
                  <FiHeart className={wishlisted ? "fill-current" : ""} />
                </button>

                <div className="absolute bottom-3 left-3">
                  <CourseStatusBadge status={course.currentStatus} />
                </div>
              </div>

              <div className="p-2.5 pt-4 sm:p-3 sm:pt-4">
                {isComingSoon && (
                  <div className="mb-3 flex items-start gap-2.5 rounded-2xl border border-[#d8ccff] bg-[#f5f1ff] p-3">
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-[#7654c8]">
                      <FiInfo size={16} />
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-[#6544b4]">
                        {t("courseDetails.status.comingSoon")}
                      </h4>
                      <p className="mt-0.5 text-xs font-medium leading-5 text-[#7654c8]">
                        {t("courseDetails.comingSoonDescription")}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                      {t("courseDetails.courseFee")}
                    </p>
                    <p className="mt-1 text-3xl font-black text-[#073b46]">
                      ৳{course.price || 0}
                    </p>
                  </div>

                  {canEnroll && course.enrollmentEnd && (
                    <div className="rounded-2xl bg-[#fff0e9] px-3 py-2 text-right text-xs font-black text-[#d95635]">
                      <span className="flex items-center gap-1.5">
                        <FaRegClock />
                        {getTimeRemaining(course.enrollmentEnd)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2.5">
                  {enrolled ? (
                    <>
                      <button
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#08736e] px-4 py-3 text-sm font-black text-white shadow-[0_12px_28px_rgba(8,115,110,0.24)] transition hover:-translate-y-0.5 hover:bg-[#096660]"
                        onClick={() => navigate(`/learn/${course._id}`)}
                      >
                        <FiPlay />
                        {t("courseDetails.continueLearning")}
                      </button>
                      <button className="w-full rounded-2xl border-2 border-[#073b46]/12 bg-[#f8fbfa] px-4 py-3 text-sm font-black text-[#073b46] transition hover:border-[#62d6c7] hover:bg-[#eef9f7]">
                        {t("courseDetails.shareCourse")}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleEnrollClick}
                        className={`w-full rounded-2xl px-4 py-3 text-sm font-black text-white shadow-lg transition ${
                          !canEnroll
                            ? "cursor-not-allowed bg-slate-400"
                            : "bg-[#ff6542] shadow-[0_12px_28px_rgba(255,101,66,0.24)] hover:-translate-y-0.5 hover:bg-[#ed5837]"
                        }`}
                        disabled={!canEnroll}
                      >
                        {isComingSoon
                          ? t("courseDetails.status.comingSoon")
                          : course.currentStatus === "enrollment_closed"
                            ? t("courseDetails.status.enrollmentClosed")
                            : course.currentStatus === "course_started"
                              ? t("courseDetails.status.courseStarted")
                              : t("courseDetails.enrollNow")}
                      </button>

                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={toggleWishlist}
                          className={`flex items-center justify-center gap-1.5 rounded-2xl border-2 px-3 py-2.5 text-xs font-black transition sm:text-sm ${
                            wishlisted
                              ? "border-[#ffb7a6] bg-[#fff0e9] text-[#d95635]"
                              : "border-[#073b46]/10 bg-[#f8fbfa] text-[#073b46] hover:border-[#ffb7a6] hover:text-[#d95635]"
                          }`}
                        >
                          <FiHeart
                            className={wishlisted ? "fill-current" : ""}
                          />
                          {wishlisted
                            ? t("courseDetails.wishlisted")
                            : t("courseDetails.wishlist")}
                        </button>
                        <button className="flex items-center justify-center gap-1.5 rounded-2xl border-2 border-[#073b46]/10 bg-[#f8fbfa] px-3 py-2.5 text-xs font-black text-[#073b46] transition hover:border-[#bce8e3] hover:text-[#08736e] sm:text-sm">
                          <FiShare2 />
                          {t("courseDetails.share")}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-3 rounded-2xl bg-[#fff8dc] px-3 py-2.5 text-center text-xs font-black text-[#8b6410]">
                  {t("courseDetails.guarantee")}
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* Course content */}
      <section className="relative z-10 py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <div className="overflow-hidden rounded-4xl border-4 border-white bg-white shadow-[0_20px_60px_rgba(7,59,70,0.09)]">
                {/* Tabs */}
                <div className="border-b border-slate-100 bg-[#fbfdfc] p-2.5 sm:p-3">
                  <div className="grid grid-cols-4 gap-1.5 overflow-x-auto sm:flex sm:gap-2">
                    {tabs.map((tab) => {
                      const IconComponent = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex min-w-0 items-center justify-center gap-1.5 rounded-2xl px-2 py-2.5 text-[11px] font-black transition-all duration-300 sm:min-w-32 sm:px-4 sm:text-sm ${
                            activeTab === tab.id
                              ? "bg-[#073b46] text-white shadow-[0_10px_24px_rgba(7,59,70,0.18)]"
                              : "text-slate-500 hover:bg-[#eef9f7] hover:text-[#08736e]"
                          }`}
                        >
                          <IconComponent className="shrink-0 text-sm sm:text-base" />
                          <span className="hidden sm:inline">{tab.label}</span>
                          <span className="truncate sm:hidden">
                            {tab.mobileLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-5 sm:p-7 lg:p-8">
                  <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -14 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-7"
                      >
                        <div>
                          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e5f8f2] px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[#08736e]">
                            <FiBookOpen />
                            {t("courseDetails.overviewBadge")}
                          </div>
                          <h2 className="text-2xl font-black text-[#073b46] sm:text-3xl">
                            {t("courseDetails.aboutCourse")}
                          </h2>
                          <div
                            className="prose prose-sm mt-4 max-w-none leading-7 text-slate-600 sm:prose-base prose-headings:font-black prose-headings:text-[#073b46] prose-a:text-[#08736e] prose-strong:text-[#073b46]"
                            dangerouslySetInnerHTML={{
                              __html:
                                course.description ||
                                `<p>${t("courseDetails.noDescription")}</p>`,
                            }}
                          />
                        </div>

                        {/* Features Section */}
                        {course.features && course.features.length > 0 && (
                          <div className="relative overflow-hidden rounded-3xl border border-[#d9eee8] bg-[#f2fbf8] p-5 sm:p-6">
                            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#62d6c7]/16" />
                            <div className="absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-[#ffd36e]/20" />

                            <div className="relative">
                              <h3 className="flex items-center gap-2 text-xl font-black text-[#073b46] sm:text-2xl">
                                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#08736e] text-white shadow-md">
                                  <FiAward />
                                </span>
                                {t("courseDetails.whatYouWillLearn")}
                              </h3>

                              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {course.features.map((item, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -14 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.06 }}
                                    className="flex items-start gap-3 rounded-2xl border-2 border-white bg-white p-3.5 shadow-sm"
                                  >
                                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#ff6542] text-white">
                                      <FiCheck size={14} />
                                    </span>
                                    <span className="text-sm font-bold leading-6 text-slate-700 sm:text-base">
                                      {item}
                                    </span>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Coming Soon Notice */}
                        {isComingSoon && (
                          <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-3 rounded-3xl border-2 border-[#d8ccff] bg-[#f5f1ff] p-5"
                          >
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[#7654c8] shadow-sm">
                              <FiInfo size={20} />
                            </span>
                            <div>
                              <h4 className="text-lg font-black text-[#6544b4] sm:text-xl">
                                {t("courseDetails.preparationNoticeTitle")}
                              </h4>
                              <p className="mt-1 text-sm font-medium leading-6 text-[#7654c8] sm:text-base">
                                {t(
                                  "courseDetails.preparationNoticeDescription",
                                )}
                              </p>
                              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-black text-[#6544b4]">
                                <span>{t("courseDetails.statusLabel")}</span>
                                <span>{t("courseDetails.inDevelopment")}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "instructors" && (
                      <motion.div
                        key="instructors"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -14 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mb-5">
                          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#f1ebff] px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[#7654c8]">
                            <FaChalkboardTeacher />
                            {t("courseDetails.courseMentors")}
                          </div>
                          <h2 className="text-2xl font-black text-[#073b46] sm:text-3xl">
                            {t("courseDetails.meetInstructors")}
                          </h2>
                        </div>

                        <div className="space-y-4">
                          {teachers.length > 0 ? (
                            teachers.map((teacher, index) => (
                              <motion.div
                                key={teacher._id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.07 }}
                                className="relative overflow-hidden rounded-3xl border border-[#dfeeea] bg-linear-to-r from-[#f2fbf8] to-[#f7f3ff] p-4 sm:p-5"
                              >
                                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#8b6fe8]/10" />
                                <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5">
                                  <div className="relative shrink-0">
                                    <img
                                      src={
                                        teacher.avatar ||
                                        `https://ui-avatars.com/api/?name=${teacher.name}&background=random`
                                      }
                                      alt={teacher.name}
                                      className="h-24 w-24 rounded-3xl border-4 border-white object-cover shadow-lg sm:h-28 sm:w-28"
                                      onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${teacher.name}&background=random`;
                                      }}
                                    />
                                    <span className="absolute -bottom-2 -right-2 grid h-9 w-9 place-items-center rounded-2xl border-2 border-white bg-[#8b6fe8] text-white shadow-md">
                                      <FaChalkboardTeacher size={15} />
                                    </span>
                                  </div>

                                  <div className="text-center sm:text-left">
                                    <h3 className="text-xl font-black text-[#073b46] sm:text-2xl">
                                      {teacher.name}
                                    </h3>
                                    <p className="mt-1 text-sm font-black text-[#7654c8] sm:text-base">
                                      {teacher.expertise ||
                                        t("courseDetails.expertInstructor")}
                                    </p>
                                    <p className="mt-2 text-sm font-medium leading-6 text-slate-600 sm:text-base">
                                      {teacher.bio ||
                                        t(
                                          "courseDetails.instructorBioFallback",
                                        )}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center">
                              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white text-slate-300 shadow-sm">
                                <FaChalkboardTeacher size={30} />
                              </div>
                              <p className="mt-4 text-sm font-bold text-slate-500 sm:text-base">
                                {t("courseDetails.noInstructors")}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "reviews" && (
                      <motion.div
                        key="reviews"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -14 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-[#fff8dc] p-5 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[#8b6410] shadow-sm">
                              <FiStar className="fill-current" />
                              {t("courseDetails.learnerFeedback")}
                            </div>
                            <h2 className="text-2xl font-black text-[#073b46] sm:text-3xl">
                              {t("courseDetails.studentReviews")}
                            </h2>
                          </div>

                          <div className="flex items-center gap-4 rounded-2xl bg-white px-4 py-3 shadow-sm">
                            <div className="text-4xl font-black text-[#073b46]">
                              {course.averageRating?.toFixed(1) || "0.0"}
                            </div>
                            <div>
                              {renderStars(course.averageRating || 0)}
                              <p className="mt-1 text-xs font-bold text-slate-400">
                                {t("courseDetails.reviewsCount", {
                                  count: formatNumber(course.ratingCount || 0),
                                })}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                              <motion.div
                                key={review._id || index}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.06 }}
                                className="rounded-3xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#bce8e3] hover:shadow-lg sm:p-5"
                              >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={
                                        review.user?.avatar ||
                                        `https://ui-avatars.com/api/?name=${review.user?.name}&background=random`
                                      }
                                      alt={review.user?.name}
                                      className="h-12 w-12 rounded-2xl object-cover ring-4 ring-[#eef9f7]"
                                      onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${review.user?.name}&background=random`;
                                      }}
                                    />
                                    <div>
                                      <h3 className="font-black text-[#073b46]">
                                        {review.user?.name ||
                                          t("courseDetails.anonymous")}
                                      </h3>
                                      <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                                        {renderStars(review.rating)}
                                        <span className="text-xs font-bold text-slate-400">
                                          {review.createdAt
                                            ? new Date(
                                                review.createdAt,
                                              ).toLocaleDateString(locale)
                                            : ""}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {review.rating >= 4 && (
                                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#bde9dd] bg-[#e5f8f2] px-3 py-1.5 text-xs font-black text-[#08736e]">
                                      <MdWorkspacePremium />
                                      {t("courseDetails.verified")}
                                    </span>
                                  )}
                                </div>

                                <p className="mt-4 text-sm font-medium leading-7 text-slate-600 sm:text-base">
                                  {review.comment}
                                </p>
                              </motion.div>
                            ))
                          ) : (
                            <div className="rounded-3xl border-2 border-dashed border-[#eadfa9] bg-[#fffdf2] py-12 text-center">
                              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white text-[#e4c25f] shadow-sm">
                                <FiStar size={30} />
                              </div>
                              <h3 className="mt-4 text-lg font-black text-[#073b46]">
                                {t("courseDetails.noReviews")}
                              </h3>
                              <p className="mt-1 text-sm font-medium text-slate-500">
                                {t("courseDetails.feedbackPlaceholder")}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "curriculum" && (
                      <motion.div
                        key="curriculum"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -14 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                          <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#fff0e9] px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[#d95635]">
                              <FiPlay />
                              {t("courseDetails.courseLessons")}
                            </div>
                            <h2 className="text-2xl font-black text-[#073b46] sm:text-3xl">
                              {t("courseDetails.courseCurriculum")}
                            </h2>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-[#e5f8f2] px-3 py-1.5 text-xs font-black text-[#08736e]">
                              {t("courseDetails.lectures", {
                                count: formatNumber(lectures.length),
                              })}
                            </span>
                            <span className="rounded-full bg-[#f1ebff] px-3 py-1.5 text-xs font-black text-[#7654c8]">
                              {formatDuration(course.duration)}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {lectures.length > 0 ? (
                            lectures.map((lecture, index) => (
                              <motion.div
                                key={lecture._id}
                                initial={{ opacity: 0, x: -14 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`overflow-hidden rounded-3xl border-2 bg-white transition-all duration-300 ${
                                  expandedLectures[lecture._id]
                                    ? "border-[#bce8e3] shadow-[0_12px_30px_rgba(8,115,110,0.09)]"
                                    : "border-slate-100 hover:border-[#d8ece7] hover:shadow-md"
                                }`}
                              >
                                <button
                                  type="button"
                                  className="flex w-full items-center justify-between gap-3 p-3.5 text-left sm:p-4"
                                  onClick={() => toggleLecture(lecture._id)}
                                >
                                  <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                                    <span
                                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-sm font-black sm:h-11 sm:w-11 ${
                                        enrolled
                                          ? "bg-[#e5f8f2] text-[#08736e]"
                                          : "bg-[#fff0e9] text-[#d95635]"
                                      }`}
                                    >
                                      {index + 1}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                      <h3 className="truncate text-sm font-black text-[#073b46] sm:text-base">
                                        {lecture.title}
                                      </h3>
                                      {lecture.duration && (
                                        <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                          <FiClock />
                                          {t("courseDetails.lectureMinutes", {
                                            count: formatNumber(
                                              lecture.duration,
                                            ),
                                          })}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <span
                                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-2xl transition ${
                                      expandedLectures[lecture._id]
                                        ? "bg-[#073b46] text-white"
                                        : "bg-slate-100 text-slate-500"
                                    }`}
                                  >
                                    {expandedLectures[lecture._id] ? (
                                      <FiChevronUp />
                                    ) : (
                                      <FiChevronDown />
                                    )}
                                  </span>
                                </button>

                                <AnimatePresence>
                                  {expandedLectures[lecture._id] && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                    >
                                      <div className="mx-3.5 border-t border-slate-100 pb-4 pt-4 sm:mx-4">
                                        <p className="text-sm font-medium leading-7 text-slate-600 sm:text-base">
                                          {lecture.description ||
                                            t("courseDetails.noDescription")}
                                        </p>

                                        {lecture.resources &&
                                          lecture.resources.length > 0 && (
                                            <div className="mt-4 rounded-2xl bg-[#f8fbfa] p-3">
                                              <h4 className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                                                {t("courseDetails.resources")}
                                              </h4>
                                              <div className="flex flex-wrap gap-2">
                                                {lecture.resources.map(
                                                  (resource, idx) => (
                                                    <a
                                                      key={idx}
                                                      href={resource.fileUrl}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="inline-flex items-center gap-2 rounded-xl border border-[#dcece8] bg-white px-3 py-2 text-xs font-black text-[#08736e] transition hover:-translate-y-0.5 hover:border-[#62d6c7] hover:shadow-sm"
                                                    >
                                                      <FiDownload size={14} />
                                                      {resource.title}
                                                    </a>
                                                  ),
                                                )}
                                              </div>
                                            </div>
                                          )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            ))
                          ) : (
                            <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center">
                              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white text-slate-300 shadow-sm">
                                <FiBook size={30} />
                              </div>
                              <p className="mt-4 text-sm font-bold text-slate-500 sm:text-base">
                                {isComingSoon
                                  ? t("courseDetails.contentPreparing")
                                  : t("courseDetails.noLectures")}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:col-span-4 lg:block">
              <div className="sticky top-24 space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-4xl border-4 border-white bg-white p-5 shadow-[0_18px_50px_rgba(7,59,70,0.09)]"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff0e9] text-[#ff6542]">
                      <FiAward size={20} />
                    </span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                        {t("courseDetails.learningBenefits")}
                      </p>
                      <h3 className="text-xl font-black text-[#073b46]">
                        {t("courseDetails.courseIncludes")}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {[
                      {
                        icon: FiPlay,
                        text: t("courseDetails.videoContent", {
                          duration: formatDuration(course.duration),
                        }),
                        iconClass: "bg-[#fff0e9] text-[#d95635]",
                      },
                      {
                        icon: FiDownload,
                        text: t("courseDetails.downloadableResources"),
                        iconClass: "bg-[#e5f8f2] text-[#08736e]",
                      },
                      {
                        icon: FiBook,
                        text: t("courseDetails.lifetimeAccess"),
                        iconClass: "bg-[#f1ebff] text-[#7654c8]",
                      },
                      {
                        icon: FiCalendar,
                        text: t("courseDetails.mobileTvAccess"),
                        iconClass: "bg-[#e9f5ff] text-[#2574a9]",
                      },
                      {
                        icon: FiAward,
                        text: t("courseDetails.certificate"),
                        iconClass: "bg-[#fff8dc] text-[#a17400]",
                      },
                      {
                        icon: FiUsers,
                        text: t("courseDetails.instructorSupport"),
                        iconClass: "bg-[#e5f8f2] text-[#08736e]",
                      },
                    ].map((feature, index) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 rounded-2xl px-2 py-2.5 transition hover:bg-[#f8fbfa]"
                        >
                          <span
                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${feature.iconClass}`}
                          >
                            <FeatureIcon size={16} />
                          </span>
                          <span className="text-sm font-bold text-slate-600">
                            {feature.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Course Timeline */}
                {!isComingSoon &&
                  (course.enrollmentStart ||
                    course.enrollmentEnd ||
                    course.courseStart) && (
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="rounded-4xl border-4 border-white bg-white p-5 shadow-[0_18px_50px_rgba(7,59,70,0.09)]"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f1ebff] text-[#7654c8]">
                          <FiCalendar size={20} />
                        </span>
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                            {t("courseDetails.importantDates")}
                          </p>
                          <h3 className="text-xl font-black text-[#073b46]">
                            {t("courseDetails.courseTimeline")}
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {[
                          {
                            label: t("courseDetails.enrollmentStarts"),
                            date: course.enrollmentStart,
                            dot: "bg-[#62d6c7]",
                            value: "text-[#08736e]",
                          },
                          {
                            label: t("courseDetails.enrollmentEnds"),
                            date: course.enrollmentEnd,
                            dot: "bg-[#ffd36e]",
                            value: "text-[#9a6500]",
                          },
                          {
                            label: t("courseDetails.courseStarts"),
                            date: course.courseStart,
                            dot: "bg-[#8b6fe8]",
                            value: "text-[#7654c8]",
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-3 rounded-2xl bg-[#f8fbfa] px-3.5 py-3"
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.dot}`}
                              />
                              <span className="text-xs font-bold text-slate-500">
                                {item.label}
                              </span>
                            </div>
                            <span
                              className={`text-xs font-black ${item.value}`}
                            >
                              {formatDate(item.date)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        course={course}
        onSuccess={() => {
          setShowPaymentModal(false);
          setEnrolled(true);
          fetchCourseDetails();
          toast.success(t("courseDetails.enrolledSuccess"));
        }}
      />
    </main>
  );
};

export default CourseDetails;
