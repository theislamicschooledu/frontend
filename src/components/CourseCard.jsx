import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useReducedMotion } from "framer-motion";
import {
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiStar,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { FaChalkboardTeacher, FaGraduationCap } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { Link } from "react-router";

const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") return "0";
  return Number(value).toLocaleString("en-US");
};

const formatDate = (date) => {
  if (!date) return "TBD";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "TBD";

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getTimeRemaining = (enrollmentEnd) => {
  if (!enrollmentEnd) return "No deadline";

  const end = new Date(enrollmentEnd);
  const difference = end.getTime() - Date.now();

  if (Number.isNaN(end.getTime())) return "Date coming soon";
  if (difference <= 0) return "Enrollment closed";

  const days = Math.floor(difference / 86_400_000);
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;

  const hours = Math.floor(difference / 3_600_000);
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;

  const minutes = Math.max(1, Math.floor(difference / 60_000));
  return `${minutes} min left`;
};

const STATUS_STYLES = {
  coming_soon: {
    label: "Coming Soon",
    Icon: FiClock,
    badge: "border-purple-200 bg-purple-100/95 text-purple-700",
    dot: "bg-purple-500",
  },
  upcoming: {
    label: "Upcoming",
    Icon: FiCalendar,
    badge: "border-sky-200 bg-sky-100/95 text-sky-700",
    dot: "bg-sky-500",
  },
  enrollment_open: {
    label: "Enrollment Open",
    Icon: FiCheckCircle,
    badge: "border-emerald-200 bg-emerald-100/95 text-emerald-700",
    dot: "bg-emerald-500",
  },
  enrollment_closed: {
    label: "Enrollment Closed",
    Icon: FiX,
    badge: "border-orange-200 bg-orange-100/95 text-orange-700",
    dot: "bg-orange-500",
  },
  course_started: {
    label: "Course Started",
    Icon: FaGraduationCap,
    badge: "border-teal-200 bg-teal-100/95 text-teal-700",
    dot: "bg-teal-500",
  },
  published: {
    label: "Published",
    Icon: FiBookOpen,
    badge: "border-indigo-200 bg-indigo-100/95 text-indigo-700",
    dot: "bg-indigo-500",
  },
};

const DIFFICULTY_STYLES = {
  beginner: {
    label: "Beginner",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  intermediate: {
    label: "Intermediate",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  advanced: {
    label: "Advanced",
    className: "border-rose-200 bg-rose-50 text-rose-700",
  },
  expert: {
    label: "Expert",
    className: "border-violet-200 bg-violet-50 text-violet-700",
  },
};

const CourseStatusBadge = ({ status }) => {
  const config = STATUS_STYLES[status] || STATUS_STYLES.published;
  const { Icon } = config;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-extrabold shadow-sm backdrop-blur-sm sm:text-xs ${config.badge}`}
    >
      <span className={`h-2 w-2 rounded-full ${config.dot}`} />
      <Icon aria-hidden="true" className="shrink-0" size={14} />
      <span>{config.label}</span>
    </span>
  );
};

const CourseCard = ({ course = {}, index = 0 }) => {
  const shouldReduceMotion = useReducedMotion();

  const {
    _id,
    title = "Amazing Islamic Course",
    thumbnail,
    price,
    duration,
    averageRating,
    ratingCount,
    teachers = [],
    category,
    currentStatus,
    isComingSoon,
    enrollmentStart,
    enrollmentEnd,
    courseStart,
    lectures = [],
    featured,
    status,
    originalPrice,
  } = course;

  const effectiveStatus =
    currentStatus || status || (isComingSoon ? "coming_soon" : "published");

  const difficultyKey = course.difficulty?.toLowerCase() || "beginner";
  const difficulty =
    DIFFICULTY_STYLES[difficultyKey] || DIFFICULTY_STYLES.beginner;

  const categoryName = category?.name || "Islamic Learning";
  const teacherCount = teachers.length;
  const lectureCount = lectures.length;
  const reviewCount = Number(ratingCount) || 0;
  const rating = Number(averageRating) || 0;
  const teacherNames = teachers.map((teacher) => teacher.name).filter(Boolean);

  const showEnrollmentBadge =
    !isComingSoon &&
    Boolean(enrollmentEnd) &&
    !["course_started", "enrollment_closed"].includes(effectiveStatus);

  const ctaText =
    effectiveStatus === "enrollment_open" ? "Enroll Now" : "View Course";

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 30, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: {
          duration: 0.5,
          delay: index * 0.07,
          type: "spring",
          stiffness: 110,
          damping: 16,
        },
        whileHover: { y: -10, rotate: -0.4 },
      };

  return (
    <motion.article
      {...motionProps}
      className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-4xl border-4 border-white bg-[#fffdf5] font-hind shadow-[0_18px_45px_rgba(85,60,120,0.16)] transition-shadow duration-300 hover:shadow-[0_26px_60px_rgba(250,116,120,0.24)]"
    >
      {/* Playful background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 top-[42%] h-28 w-28 rounded-full bg-[#ffcb3b]/15 blur-sm transition-transform duration-700 group-hover:scale-125"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-8 bottom-24 h-24 w-24 rounded-full bg-[#62d6c7]/15 blur-sm transition-transform duration-700 group-hover:scale-125"
      />

      {/* Thumbnail */}
      <div className="relative isolate h-52 overflow-hidden bg-[#f7d6ff] sm:h-56">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            onError={(event) => {
              event.currentTarget.src = "/default-course.jpg";
            }}
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-linear-to-br from-[#8b6fe8] via-[#fa7478] to-[#ffcb3b]">
            <div className="absolute left-7 top-8 h-12 w-12 rounded-full bg-white/20" />
            <div className="absolute bottom-5 right-9 h-16 w-16 rounded-full bg-white/15" />
            <FiBookOpen className="relative z-10 text-6xl text-white drop-shadow-md" />
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-[#382352]/75 via-[#382352]/10 to-transparent" />

        {/* Animated sparkles */}
        <HiSparkles className="absolute right-[18%] top-6 text-xl text-yellow-200 drop-shadow-sm motion-safe:animate-[sparkle_2.4s_ease-in-out_infinite]" />
        <HiSparkles className="absolute right-[8%] top-16 text-sm text-white motion-safe:animate-[sparkle_3s_ease-in-out_infinite_0.6s]" />

        <div className="absolute left-3 top-3 z-10 sm:left-4 sm:top-4">
          <CourseStatusBadge status={effectiveStatus} />
        </div>

        {featured && (
          <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-200 bg-[#ffcb3b] px-3 py-1.5 text-[11px] font-extrabold text-[#7b4c00] shadow-md sm:text-xs">
              <FiStar className="fill-current" size={13} />
              Kids’ Favorite
            </span>
          </div>
        )}

        <div className="absolute inset-x-3 bottom-5 z-10 flex items-end justify-between gap-2 sm:inset-x-4">
          {showEnrollmentBadge ? (
            <span className="inline-flex min-w-0 items-center gap-1.5 rounded-xl border border-white/25 bg-[#fa7478]/95 px-3 py-2 text-xs font-extrabold text-white shadow-lg backdrop-blur-sm">
              <FiClock className="shrink-0" size={14} />
              <span className="truncate">
                {getTimeRemaining(enrollmentEnd)}
              </span>
            </span>
          ) : (
            <span />
          )}

          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/25 bg-white/90 px-3 py-2 text-xs font-extrabold text-[#5c3b77] shadow-lg backdrop-blur-sm">
            <FiStar className="fill-[#ffcb3b] text-[#e7a900]" size={15} />
            {rating.toFixed(1)}
            <span className="font-semibold text-slate-500">
              ({reviewCount})
            </span>
          </span>
        </div>

        {/* Soft wave divider */}
        <svg
          aria-hidden="true"
          viewBox="0 0 500 36"
          preserveAspectRatio="none"
          className="absolute -bottom-px left-0 h-8 w-full"
        >
          <path
            d="M0 19C70 2 116 2 184 19s116 17 184 0 87-15 132-4v21H0Z"
            fill="#fffdf5"
          />
        </svg>
      </div>

      {/* Card body */}
      <div className="relative flex flex-1 flex-col px-4 pb-5 pt-2 sm:px-5 sm:pb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#6e3d9d] px-3 py-1 text-[11px] font-extrabold text-white shadow-sm">
            {categoryName}
          </span>
          <span
            className={`rounded-full border px-3 py-1 text-[11px] font-extrabold ${difficulty.className}`}
          >
            {difficulty.label}
          </span>
        </div>

        <h3 className="line-clamp-2 min-h-13 text-xl font-black leading-tight text-[#342244] transition-colors duration-300 group-hover:text-[#e85e61] sm:text-[1.35rem]">
          {title}
        </h3>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="flex min-w-0 items-center gap-2.5 rounded-2xl border border-sky-100 bg-sky-50/80 p-2.5 transition-transform duration-300 group-hover:-rotate-1 sm:p-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sky-500 text-white shadow-sm">
              <FiClock size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-sky-600">
                Duration
              </p>
              <p className="truncate text-sm font-black text-slate-800">
                {duration || 0} weeks
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-2.5 transition-transform duration-300 group-hover:rotate-1 sm:p-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500 text-white shadow-sm">
              <FiBookOpen size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                Lessons
              </p>
              <p className="truncate text-sm font-black text-slate-800">
                {lectureCount}
              </p>
            </div>
          </div>
        </div>

        {/* Instructor */}
        <div className="mt-3 rounded-2xl border border-purple-100 bg-purple-50/70 p-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-white bg-[#8b6fe8] text-white shadow-sm">
              <FaChalkboardTeacher size={18} />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-extrabold uppercase tracking-wide text-purple-500">
                  Your Teacher
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-500">
                  <FiUsers size={12} />
                  {teacherCount || 1}
                </span>
              </div>
              <p className="truncate text-sm font-black text-[#493059]">
                {teacherNames.join(", ") || "Friendly Instructor"}
              </p>
            </div>
          </div>
        </div>

        {/* Dates */}
        {!isComingSoon && (courseStart || enrollmentStart || enrollmentEnd) && (
          <div className="mt-3 grid gap-2 text-xs text-slate-600">
            {courseStart && (
              <div className="flex items-center gap-2 rounded-xl bg-[#fff4c9]/75 px-3 py-2">
                <FaGraduationCap
                  className="shrink-0 text-[#e39d00]"
                  size={14}
                />
                <span className="font-semibold">
                  Class starts: <strong>{formatDate(courseStart)}</strong>
                </span>
              </div>
            )}

            {enrollmentStart && enrollmentEnd && (
              <div className="flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2">
                <FiCalendar className="shrink-0 text-teal-600" size={14} />
                <span className="min-w-0 truncate font-semibold">
                  Enrollment: {formatDate(enrollmentStart)} –{" "}
                  {formatDate(enrollmentEnd)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Price and CTA */}
        <div className="mt-auto pt-5">
          <div className="mb-3 h-px bg-linear-to-r from-transparent via-purple-200 to-transparent" />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Course fee
              </p>
              <div className="flex items-end gap-1.5">
                <span className="text-3xl font-black leading-none text-[#5b3677]">
                  {formatPrice(price)}
                </span>
                <span className="pb-0.5 text-sm font-extrabold text-[#e85e61]">
                  TK
                </span>
              </div>

              {originalPrice && Number(originalPrice) > Number(price) && (
                <span className="mt-1 block text-xs font-semibold text-slate-400 line-through">
                  {formatPrice(originalPrice)} TK
                </span>
              )}
            </div>

            <motion.div
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              className="sm:shrink-0"
            >
              <Link
                to={`/course/${_id}`}
                aria-label={`${ctaText}: ${title}`}
                className="group/button relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-[#e9a900] bg-[#ffcb3b] px-5 py-3 text-sm font-black text-[#7b3d18] shadow-[0_6px_0_#e6a414] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ffd75e] hover:shadow-[0_8px_0_#e6a414] active:translate-y-1 active:shadow-[0_2px_0_#e6a414] sm:w-auto"
              >
                <span className="absolute inset-y-0 -left-12 w-8 rotate-12 bg-white/45 blur-sm transition-transform duration-700 group-hover/button:translate-x-48" />
                <FiEye className="relative z-10" size={17} />
                <span className="relative z-10">{ctaText}</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sparkle {
          0%, 100% {
            transform: translateY(0) rotate(0deg) scale(0.9);
            opacity: 0.65;
          }
          50% {
            transform: translateY(-7px) rotate(18deg) scale(1.15);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .motion-safe\\:animate-\\[sparkle_2\\.4s_ease-in-out_infinite\\],
          .motion-safe\\:animate-\\[sparkle_3s_ease-in-out_infinite_0\\.6s\\] {
            animation: none !important;
          }
        }
      `}</style>
    </motion.article>
  );
};

export default CourseCard;
