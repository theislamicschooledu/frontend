import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiArrowRight,
  FiBookOpen,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiFilter,
  FiGrid,
  FiList,
  FiSearch,
  FiStar,
  FiTrendingUp,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { FaGraduationCap, FaRegLaughBeam } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import api from "../utils/axios";
import SkeletonCard from "../components/SkeletonCard";
import CourseCard from "../components/CourseCard";
import CourseListItem from "../components/CourseListItem";
import { useLanguage } from "../hooks/useLanguage";

// Utility: safely strip HTML
const stripHtml = (html) => (html ? String(html).replace(/<[^>]*>/g, "") : "");

const floatingDecorations = [
  { left: "5%", top: "12%", size: 20, delay: 0.2, duration: 5.8 },
  { left: "13%", top: "72%", size: 14, delay: 1.1, duration: 6.5 },
  { left: "28%", top: "28%", size: 16, delay: 0.6, duration: 7.2 },
  { left: "46%", top: "84%", size: 18, delay: 1.6, duration: 6.2 },
  { left: "63%", top: "18%", size: 15, delay: 0.9, duration: 7.5 },
  { left: "78%", top: "69%", size: 22, delay: 1.4, duration: 6.8 },
  { left: "90%", top: "31%", size: 17, delay: 0.4, duration: 7.1 },
  { left: "96%", top: "82%", size: 13, delay: 1.9, duration: 5.9 },
];

const Courses = () => {
  const { language, t } = useLanguage();
  const locale = language === "bn" ? "bn-BD" : "en-US";
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Status options for filtering
  const statusOptions = [
    { value: "all", label: t("coursesPage.status.all"), icon: FiBookOpen },
    {
      value: "coming_soon",
      label: t("coursesPage.status.comingSoon"),
      icon: FiClock,
    },
    {
      value: "upcoming",
      label: t("coursesPage.status.upcoming"),
      icon: FiCalendar,
    },
    {
      value: "enrollment_open",
      label: t("coursesPage.status.enrollmentOpen"),
      icon: FiUsers,
    },
    {
      value: "enrollment_closed",
      label: t("coursesPage.status.enrollmentClosed"),
      icon: FiX,
    },
    {
      value: "course_started",
      label: t("coursesPage.status.courseStarted"),
      icon: FaGraduationCap,
    },
  ];

  // Fetch courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/courses/published");
      const data = res?.data;

      if (data?.success && Array.isArray(data.data)) {
        const sorted = data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setCourses(sorted);
        setFilteredCourses(sorted);
      } else if (data?.success && Array.isArray(data.courses)) {
        const sorted = data.courses.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setCourses(sorted);
        setFilteredCourses(sorted);
      } else {
        setCourses([]);
        setFilteredCourses([]);
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        t("coursesPage.loadFailed");
      toast.error(msg);
      console.error("Courses fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/courses/category");
      const data = res?.data;

      if (data?.success && Array.isArray(data.data)) {
        setCategories(data.data);
      } else if (data?.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        t("coursesPage.categoriesLoadFailed");
      toast.error(msg);
      console.error("Categories fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter / search / sort logic
  useEffect(() => {
    let result = [...courses];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((c) => {
        const title = String(c.title || "").toLowerCase();
        const desc = stripHtml(c.description).toLowerCase();
        return title.includes(q) || desc.includes(q);
      });
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((course) => {
        const catId = course.category?._id || course.category;
        return String(catId) === String(selectedCategory);
      });
    }

    // Status filter
    if (selectedStatus !== "all") {
      result = result.filter(
        (course) => course.currentStatus === selectedStatus,
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "rating":
          return (b.averageRating || 0) - (a.averageRating || 0);
        case "duration":
          return (b.duration || 0) - (a.duration || 0);
        case "enrollment-start":
          return (
            new Date(a.enrollmentStart || 0) - new Date(b.enrollmentStart || 0)
          );
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredCourses(result);
  }, [courses, searchTerm, selectedCategory, selectedStatus, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSortBy("newest");
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory !== "all") count++;
    if (selectedStatus !== "all") count++;
    return count;
  };

  if (loading && courses.length === 0) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fff9e7] font-hind">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#bcebe6]/45 blur-3xl" />
        <div className="absolute -right-20 bottom-16 h-80 w-80 rounded-full bg-[#ffd7cb]/55 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mx-5 rounded-4xl border-4 border-white bg-white/90 px-10 py-12 text-center shadow-[0_24px_70px_rgba(7,59,70,0.12)] backdrop-blur-sm"
        >
          <div className="relative mx-auto mb-6 h-20 w-20">
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
            {t("coursesPage.loadingTitle")}
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base">
            {t("coursesPage.loadingDescription")}
          </p>
        </motion.div>
      </div>
    );
  }

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
            className="absolute text-[#ffd36e]/50"
            style={{ left: item.left, top: item.top }}
            animate={{
              y: [0, -14, 0],
              rotate: [0, 16, -8, 0],
              scale: [1, 1.12, 1],
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

      {/* Hero section */}
      <section className="relative isolate z-10 overflow-hidden bg-[#fff4c9] pb-16 pt-12 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
        <div
          aria-hidden="true"
          className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-[#ff6542]/14 blur-sm"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#62d6c7]/25 blur-sm"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-5 left-[48%] h-40 w-40 rounded-full bg-[#8b6fe8]/12"
        />

        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[7%] top-16 hidden h-14 w-14 place-items-center rounded-3xl border-4 border-white bg-[#ff6542] text-white shadow-lg md:grid"
        >
          <FiBookOpen size={27} />
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[8%] top-20 hidden h-12 w-12 place-items-center rounded-full border-4 border-white bg-[#8b6fe8] text-white shadow-lg md:grid"
        >
          <HiSparkles size={25} />
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#073b46]/10 bg-white/75 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#073b46] shadow-sm backdrop-blur-sm">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#ff6542] text-white">
                <HiSparkles size={14} />
              </span>
              {t("coursesPage.badge")}
            </div>

            <h1 className="text-3xl font-black leading-[1.08] tracking-tight text-[#073b46] sm:text-4xl lg:text-5xl">
              {t("coursesPage.headingPrefix")}
              <span className="relative ml-2 inline-block text-[#ff6542]">
                {t("coursesPage.headingAccent")}
                <svg
                  viewBox="0 0 220 18"
                  aria-hidden="true"
                  className="absolute -bottom-3 left-0 h-4 w-full text-[#ffd36e]"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 12C55 3 127 3 217 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-6 text-slate-600 sm:text-base sm:leading-7">
              {t("coursesPage.description")}
            </p>
          </motion.div>

          {/* Search box */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto mt-6 max-w-3xl"
          >
            <div className="relative rounded-3xl border-4 border-white bg-white p-1.5 shadow-[0_18px_48px_rgba(7,59,70,0.13)]">
              <div className="relative flex items-center">
                <span className="absolute left-3.5 grid h-10 w-10 place-items-center rounded-xl bg-[#eef9f7] text-[#08736e] sm:left-4">
                  <FiSearch size={21} />
                </span>

                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t("coursesPage.searchPlaceholder")}
                  className="w-full rounded-2xl bg-[#f8fbfa] py-3.5 pl-16 pr-12 text-sm font-semibold text-[#073b46] outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-[#62d6c7]/20 sm:py-4 sm:pl-18 sm:text-base"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    aria-label={t("coursesPage.clearSearch")}
                    className="absolute right-4 grid h-9 w-9 place-items-center rounded-full bg-[#fff0eb] text-[#ff6542] transition hover:rotate-90 hover:bg-[#ff6542] hover:text-white"
                  >
                    <FiX size={17} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 110"
          preserveAspectRatio="none"
          className="absolute -bottom-px left-0 h-10 w-full sm:h-14"
        >
          <path
            d="M0 52C158 94 334 101 500 66C692 26 809 15 1002 54C1167 87 1308 91 1440 42V110H0Z"
            fill="#eef9ff"
          />
        </svg>
      </section>

      {/* Filter and controls */}
      <section className="relative z-20 mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:-mt-10 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.25 }}
          className="overflow-hidden rounded-3xl border-4 border-white bg-white/95 shadow-[0_18px_48px_rgba(7,59,70,0.10)] backdrop-blur-md"
        >
          {/* Filter heading */}
          <div className="flex flex-col gap-3 border-b border-[#073b46]/10 bg-[#fffdf5] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#073b46] text-white shadow-md">
                <FiFilter size={20} />
              </span>
              <div>
                <h2 className="text-base font-black text-[#073b46] sm:text-lg">
                  {t("coursesPage.filterTitle")}
                </h2>
                <p className="mt-0.5 hidden text-xs font-medium text-slate-500 sm:block">
                  {t("coursesPage.filterDescription")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#eef9f7] px-3 py-2 text-xs font-extrabold text-[#08736e]">
                <FiBookOpen size={14} />
                {t("coursesPage.coursesFound", {
                  count: Number(filteredCourses.length).toLocaleString(locale),
                })}
              </span>

              {getActiveFilterCount() > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff0eb] px-3 py-2 text-xs font-extrabold text-[#e85031]">
                  <FiStar size={13} />
                  {t("coursesPage.activeFilters", {
                    count: Number(getActiveFilterCount()).toLocaleString(
                      locale,
                    ),
                  })}
                </span>
              )}
            </div>
          </div>

          {/* Mobile filter toggle */}
          <div className="p-3 lg:hidden">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex w-full items-center justify-between rounded-2xl border border-[#073b46]/10 bg-[#f5faf9] px-4 py-3 font-extrabold text-[#073b46] transition hover:bg-[#eef9f7]"
            >
              <span className="flex items-center gap-2.5">
                <FiFilter className="text-[#08736e]" size={18} />
                {t("coursesPage.filtersAndSort")}
                {getActiveFilterCount() > 0 && (
                  <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[#ff6542] px-1.5 text-xs text-white">
                    {getActiveFilterCount()}
                  </span>
                )}
              </span>
              {isFilterOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>

          {/* Filter content */}
          <div className={`${isFilterOpen ? "block" : "hidden"} lg:block`}>
            <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto]">
              {/* Categories and status */}
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff6542]" />
                    <h3 className="text-xs font-black uppercase tracking-[0.14em] text-[#073b46]">
                      {t("coursesPage.categories")}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      type="button"
                      onClick={() => setSelectedCategory("all")}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold transition-all duration-300 ${
                        selectedCategory === "all"
                          ? "border-[#704a91] bg-[#704a91] text-white shadow-[0_8px_20px_rgba(112,74,145,0.22)]"
                          : "border-[#073b46]/10 bg-[#f8f5fb] text-[#604174] hover:border-[#704a91]/30 hover:bg-[#f2eafb]"
                      }`}
                    >
                      <FaRegLaughBeam size={14} />
                      {t("coursesPage.all")}
                    </motion.button>

                    {categories.map((category) => (
                      <motion.button
                        type="button"
                        key={category._id || category.name}
                        onClick={() => setSelectedCategory(category._id)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className={`rounded-full border px-3 py-1.5 text-xs font-extrabold transition-all duration-300 ${
                          selectedCategory === category._id
                            ? "border-[#704a91] bg-[#704a91] text-white shadow-[0_8px_20px_rgba(112,74,145,0.22)]"
                            : "border-[#073b46]/10 bg-[#f8f5fb] text-[#604174] hover:border-[#704a91]/30 hover:bg-[#f2eafb]"
                        }`}
                      >
                        {category.name}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#08736e]" />
                    <h3 className="text-xs font-black uppercase tracking-[0.14em] text-[#073b46]">
                      {t("coursesPage.courseStatus")}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((option) => {
                      const Icon = option.icon;

                      return (
                        <motion.button
                          type="button"
                          key={option.value}
                          onClick={() => setSelectedStatus(option.value)}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold transition-all duration-300 ${
                            selectedStatus === option.value
                              ? "border-[#08736e] bg-[#08736e] text-white shadow-[0_8px_20px_rgba(8,115,110,0.22)]"
                              : "border-[#073b46]/10 bg-[#eef9f7] text-[#08736e] hover:border-[#08736e]/30 hover:bg-[#e2f5f2]"
                          }`}
                        >
                          <Icon size={14} />
                          {option.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* View, sort and clear */}
              <div className="flex flex-col gap-3 border-t border-[#073b46]/10 pt-4 lg:min-w-60 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                <div>
                  <p className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#073b46]">
                    {t("coursesPage.viewStyle")}
                  </p>
                  <div className="grid grid-cols-2 rounded-xl border border-[#073b46]/10 bg-[#f4f8f7] p-1">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-extrabold transition-all ${
                        viewMode === "grid"
                          ? "bg-white text-[#ff6542] shadow-sm"
                          : "text-slate-500 hover:text-[#073b46]"
                      }`}
                      title={t("coursesPage.gridView")}
                    >
                      <FiGrid size={17} />
                      {t("coursesPage.grid")}
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-extrabold transition-all ${
                        viewMode === "list"
                          ? "bg-white text-[#ff6542] shadow-sm"
                          : "text-slate-500 hover:text-[#073b46]"
                      }`}
                      title={t("coursesPage.listView")}
                    >
                      <FiList size={17} />
                      {t("coursesPage.list")}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="course-sort"
                    className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-[#073b46]"
                  >
                    {t("coursesPage.sortCourses")}
                  </label>
                  <div className="relative">
                    <select
                      id="course-sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full cursor-pointer appearance-none rounded-xl border border-[#073b46]/10 bg-[#fff9e7] px-3.5 py-2.5 pr-9 text-xs font-extrabold text-[#073b46] outline-none transition focus:border-[#ffd36e] focus:ring-4 focus:ring-[#ffd36e]/25"
                    >
                      <option value="newest">
                        {t("coursesPage.sort.newest")}
                      </option>
                      <option value="oldest">
                        {t("coursesPage.sort.oldest")}
                      </option>
                      <option value="price-low">
                        {t("coursesPage.sort.priceLow")}
                      </option>
                      <option value="price-high">
                        {t("coursesPage.sort.priceHigh")}
                      </option>
                      <option value="rating">
                        {t("coursesPage.sort.rating")}
                      </option>
                      <option value="duration">
                        {t("coursesPage.sort.duration")}
                      </option>
                      <option value="enrollment-start">
                        {t("coursesPage.sort.enrollmentStart")}
                      </option>
                    </select>
                    <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#073b46]" />
                  </div>
                </div>

                {getActiveFilterCount() > 0 && (
                  <motion.button
                    type="button"
                    onClick={clearFilters}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff6542] px-4 py-2.5 text-xs font-extrabold text-white shadow-[0_8px_18px_rgba(255,101,66,0.22)] transition hover:bg-[#ed5738]"
                  >
                    <FiX size={17} />
                    {t("coursesPage.clearAllFilters")}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Courses section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pb-28">
        <AnimatePresence mode="wait">
          {filteredCourses.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 25, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.55 }}
              className="relative mx-auto max-w-2xl overflow-hidden rounded-4xl border-4 border-white bg-white px-6 py-14 text-center shadow-[0_22px_65px_rgba(7,59,70,0.11)] sm:px-10"
            >
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#fff0eb]" />
              <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-[#eef9f7]" />

              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, -4, 4, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative mx-auto grid h-24 w-24 place-items-center rounded-4xl border-4 border-white bg-[#fff4c9] text-[#ff6542] shadow-lg"
              >
                <FiBookOpen size={40} />
              </motion.div>

              <h3 className="relative mt-7 text-2xl font-black text-[#073b46] sm:text-3xl">
                {t("coursesPage.noCoursesFound")}
              </h3>
              <p className="relative mx-auto mt-3 max-w-lg text-sm font-medium leading-7 text-slate-500 sm:text-base">
                {getActiveFilterCount() > 0
                  ? t("coursesPage.noMatch")
                  : t("coursesPage.preparingCourses")}
              </p>

              {getActiveFilterCount() > 0 && (
                <motion.button
                  type="button"
                  onClick={clearFilters}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#ff6542] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(255,101,66,0.25)]"
                >
                  {t("coursesPage.clearAllFilters")}
                  <FiArrowRight size={17} />
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="courses"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Status summary */}
              <div className="mb-4 flex flex-wrap gap-2">
                {[
                  "coming_soon",
                  "upcoming",
                  "enrollment_open",
                  "enrollment_closed",
                  "course_started",
                ].map((status) => {
                  const count = filteredCourses.filter(
                    (course) => course.currentStatus === status,
                  ).length;

                  if (count === 0) return null;

                  const statusOption = statusOptions.find(
                    (option) => option.value === status,
                  );
                  const Icon = statusOption?.icon || FiBookOpen;

                  return (
                    <span
                      key={status}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#073b46]/10 bg-white px-2.5 py-1.5 text-[11px] font-extrabold text-slate-600 shadow-sm"
                    >
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#eef9f7] text-[#08736e]">
                        <Icon size={12} />
                      </span>
                      {statusOption?.label}
                      <strong className="text-[#073b46]">
                        {Number(count).toLocaleString(locale)}
                      </strong>
                    </span>
                  );
                })}
              </div>

              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3"
                    : "space-y-5"
                }
              >
                {loading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <SkeletonCard key={index} view={viewMode} />
                    ))
                  : filteredCourses.map((course, index) =>
                      viewMode === "grid" ? (
                        <CourseCard
                          key={course._id || index}
                          course={course}
                          index={index}
                        />
                      ) : (
                        <CourseListItem
                          key={course._id || index}
                          course={course}
                          index={index}
                        />
                      ),
                    )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Floating action button */}
      <motion.div
        className="fixed bottom-6 right-5 z-50 sm:right-7"
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{ y: -4, rotate: 4 }}
        whileTap={{ scale: 0.92 }}
      >
        <button
          type="button"
          aria-label={t("coursesPage.trendingCourses")}
          className="group grid h-14 w-14 place-items-center rounded-2xl border-4 border-white bg-[#073b46] text-white shadow-[0_16px_35px_rgba(7,59,70,0.28)] transition hover:bg-[#ff6542] sm:h-16 sm:w-16"
        >
          <FiTrendingUp
            className="transition-transform duration-300 group-hover:scale-110"
            size={22}
          />
        </button>
      </motion.div>
    </main>
  );
};

export default Courses;
