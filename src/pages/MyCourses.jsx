import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import {
  FiAlertCircle,
  FiArrowRight,
  FiBarChart2,
  FiBook,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiInfo,
  FiLoader,
  FiLock,
  FiPlay,
  FiSearch,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import api from "../utils/axios";

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRejection, setSelectedRejection] = useState(null);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const { data } = await api.get("/enrollments/my-enrollments");

      if (data.success) {
        setEnrollments(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch enrollments", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = enrollments.filter((item) =>
    item.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const calculateProgress = (enrollment) => {
    if (enrollment.completionStatus === "completed") return 100;
    return enrollment.progress || 0;
  };

  const isButtonDisabled = (enrollment) => {
    return enrollment.paymentStatus !== "completed";
  };

  const getButtonText = (enrollment) => {
    if (enrollment.paymentStatus === "pending") {
      return "Pending Approval";
    }

    if (enrollment.paymentStatus === "cancelled") {
      return "Enrollment Cancelled";
    }

    if (enrollment.paymentStatus === "failed") {
      return "Payment Failed";
    }

    return calculateProgress(enrollment) > 0
      ? "Continue Learning"
      : "Start Learning";
  };

  const getButtonIcon = (enrollment) => {
    if (enrollment.paymentStatus !== "completed") {
      return <FiLock />;
    }

    return <FiPlay />;
  };

  const statusConfig = {
    completed: {
      label: "Active",
      badge: "bg-[#e7f5ef] text-[#16745f]",
      dot: "bg-[#46a88d]",
      overlay: "",
    },
    pending: {
      label: "Pending",
      badge: "bg-[#fff6df] text-[#a87318]",
      dot: "bg-[#e7ad3e]",
      overlay: "bg-[#263c35]/28",
    },
    cancelled: {
      label: "Cancelled",
      badge: "bg-[#fff0e9] text-[#c6573a]",
      dot: "bg-[#df7650]",
      overlay: "bg-[#263c35]/48",
    },
    failed: {
      label: "Failed",
      badge: "bg-[#fff0e9] text-[#c6573a]",
      dot: "bg-[#df7650]",
      overlay: "bg-[#263c35]/48",
    },
  };

  const activeCourses = enrollments.filter(
    (item) => item.paymentStatus === "completed",
  ).length;

  const pendingCourses = enrollments.filter(
    (item) => item.paymentStatus === "pending",
  ).length;

  const averageProgress =
    activeCourses > 0
      ? Math.round(
          enrollments
            .filter((item) => item.paymentStatus === "completed")
            .reduce((sum, item) => sum + calculateProgress(item), 0) /
            activeCourses,
        )
      : 0;

  const RejectionModal = () => (
    <AnimatePresence>
      {selectedRejection && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-[#14231e]/65 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rejection-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 27 }}
            className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#fffdf8] shadow-[0_28px_90px_rgba(12,36,29,0.3)]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-[#fff8f3] via-[#fffdf8] to-[#f1edff]" />
              <div className="absolute -right-12 -top-14 h-36 w-36 rounded-full bg-[#ef8f6d]/18" />
              <div className="absolute -left-14 top-10 h-32 w-32 rounded-full bg-[#f7c969]/15" />
            </div>

            <div className="relative px-6 pb-5 pt-6 sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0e9] text-[#d86545] ring-1 ring-[#f3c8b8]">
                  <FiXCircle className="text-2xl" />
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRejection(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2e6e2] bg-white/80 text-[#71817b] transition hover:border-[#efb49f] hover:bg-[#fff2eb] hover:text-[#d9704b]"
                  aria-label="Close rejection details"
                >
                  <FiX />
                </button>
              </div>

              <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#c6573a]">
                Enrollment Status
              </p>
              <h3
                id="rejection-modal-title"
                className="mt-2 text-2xl font-extrabold text-[#263c35]"
              >
                এনরোলমেন্ট রিজেক্ট করা হয়েছে
              </h3>

              <div className="mt-5 rounded-[1.15rem] border border-[#e7e1d6] bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#8a9691]">
                  Course
                </p>
                <p className="mt-1 font-extrabold leading-6 text-[#263c35]">
                  {selectedRejection.course?.title}
                </p>
              </div>

              <div className="mt-4 rounded-[1.15rem] border border-[#f1d8ce] bg-[#fff7f2] p-4">
                <p className="flex items-center gap-2 text-sm font-extrabold text-[#b85437]">
                  <FiAlertCircle />
                  রিজেক্ট করার কারণ
                </p>
                <p className="mt-2 text-sm leading-7 text-[#76594f]">
                  {selectedRejection.paymentDetails?.rejectionReason ||
                    "কোনো নির্দিষ্ট কারণ প্রদান করা হয়নি।"}
                </p>
              </div>

              {selectedRejection.paymentDetails?.rejectedAt && (
                <div className="mt-4 flex items-start gap-3 rounded-[1.15rem] border border-[#eee5cb] bg-[#fffaf0] p-4">
                  <FiCalendar className="mt-0.5 shrink-0 text-[#a87318]" />
                  <div>
                    <p className="text-xs font-bold text-[#856d3b]">
                      রিজেক্ট করার সময়
                    </p>
                    <p className="mt-1 text-sm text-[#796b50]">
                      {new Date(
                        selectedRejection.paymentDetails.rejectedAt,
                      ).toLocaleDateString("bn-BD", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-start gap-3 rounded-[1.15rem] border border-[#d4e9e1] bg-[#f1f9f6] p-4">
                <FiInfo className="mt-0.5 shrink-0 text-[#16745f]" />
                <p className="text-sm leading-6 text-[#4f7065]">
                  প্রয়োজন হলে সাপোর্ট টিমের সঙ্গে যোগাযোগ করুন অথবা কোর্স পেজ
                  থেকে পুনরায় এনরোলমেন্টের চেষ্টা করুন।
                </p>
              </div>
            </div>

            <div className="relative border-t border-[#e9e2d6] bg-white/75 px-6 py-5 backdrop-blur-sm sm:px-7">
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setSelectedRejection(null)}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-[#dfe5e0] bg-white px-5 text-sm font-extrabold text-[#53665e] transition hover:bg-[#f7faf8]"
                >
                  বন্ধ করুন
                </button>

                <Link
                  to={`/course/${selectedRejection.course?._id}`}
                  onClick={() => setSelectedRejection(null)}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#d96343] px-5 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(217,99,67,0.22)] transition hover:bg-[#bd4f32]"
                >
                  আবার চেষ্টা করুন
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="font-hind min-h-screen bg-[#f8f5ed] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm rounded-4xl border border-[#e6dfcf] bg-white p-8 text-center shadow-[0_20px_60px_rgba(45,75,65,0.10)]"
        >
          <div className="relative mx-auto mb-5 h-16 w-16">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-[#dcebe4]"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-[#16745f] border-t-[#16745f]" />
            </motion.div>

            <div className="absolute inset-3 flex items-center justify-center rounded-full bg-[#eef8f4]">
              <FiBook className="text-xl text-[#16745f]" />
            </div>
          </div>

          <h3 className="text-xl font-extrabold text-[#263c35]">
            আপনার কোর্সগুলো লোড হচ্ছে
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#6d7c76]">
            এনরোলমেন্ট ও শেখার অগ্রগতি প্রস্তুত করা হচ্ছে।
          </p>

          <div className="mt-5 flex justify-center gap-1.5">
            {[0, 1, 2].map((item) => (
              <motion.span
                key={item}
                className="h-2 w-2 rounded-full bg-[#ef8f6d]"
                animate={{ y: [0, -7, 0] }}
                transition={{
                  duration: 0.7,
                  repeat: Infinity,
                  delay: item * 0.16,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="font-hind min-h-screen overflow-hidden bg-[#f8f5ed] text-[#263c35]">
      <RejectionModal />

      {/* Compact hero */}
      <section className="relative overflow-hidden border-b border-[#e8dfce] pt-8">
        <div className="absolute inset-0 bg-linear-to-br from-[#fffaf0] via-[#f4fbf7] to-[#edf7f4]" />
        <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-[#f6c85f]/18 blur-3xl" />
        <div className="absolute -right-20 top-6 h-64 w-64 rounded-full bg-[#9d8be8]/16 blur-3xl" />

        <motion.div
          className="absolute left-[7%] top-28 hidden h-12 w-12 rotate-12 items-center justify-center rounded-2xl bg-[#ffe8dd] text-[#df7650] shadow-sm md:flex"
          animate={{ y: [0, -8, 0], rotate: [12, 18, 12] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <FiPlay className="text-xl" />
        </motion.div>

        <motion.div
          className="absolute right-[8%] top-28 hidden h-11 w-11 -rotate-12 items-center justify-center rounded-full bg-[#e9e5ff] text-[#7865c9] shadow-sm lg:flex"
          animate={{ y: [0, 9, 0], rotate: [-12, -5, -12] }}
          transition={{ duration: 4.8, repeat: Infinity }}
        >
          <FiBook className="text-xl" />
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8 lg:pb-10">
          <div className="grid items-end gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d7e9e2] bg-white/80 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#16745f] shadow-sm backdrop-blur">
                <FiBook />
                Learning Dashboard
              </span>

              <h1 className="mt-4 text-3xl font-extrabold leading-[1.16] text-[#263c35] sm:text-4xl lg:text-[3.1rem]">
                আপনার শেখার
                <span className="relative ml-2 inline-block text-[#16745f]">
                  যাত্রা চালিয়ে যান
                  <span className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 rounded-full bg-[#f7c969]/45" />
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#687a73] sm:text-base">
                আপনার সক্রিয় কোর্স, পেমেন্ট স্ট্যাটাস এবং শেখার অগ্রগতি এক জায়গা
                থেকে দেখুন।
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="rounded-3xl border border-white/80 bg-white/90 p-2 shadow-[0_18px_50px_rgba(42,73,62,0.11)] backdrop-blur"
            >
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#7d8c86]" />
                <input
                  type="text"
                  placeholder="কোর্সের নাম লিখে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 w-full rounded-[1.1rem] bg-[#f8faf7] pl-11 pr-11 text-sm text-[#263c35] outline-none transition placeholder:text-[#9aa6a1] focus:bg-white focus:ring-2 focus:ring-[#8bcdbd]/45"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#7d8c86] transition hover:bg-[#f0ebe2] hover:text-[#d96f4a]"
                    aria-label="Clear course search"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Summary stats */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {[
              {
                label: "মোট কোর্স",
                value: enrollments.length,
                icon: FiBook,
                bg: "bg-[#fff0e8]",
                text: "text-[#d9704b]",
              },
              {
                label: "সক্রিয়",
                value: activeCourses,
                icon: FiPlay,
                bg: "bg-[#e5f4ee]",
                text: "text-[#16745f]",
              },
              {
                label: "পেন্ডিং",
                value: pendingCourses,
                icon: FiClock,
                bg: "bg-[#fff6df]",
                text: "text-[#a87318]",
              },
              {
                label: "গড় অগ্রগতি",
                value: `${averageProgress}%`,
                icon: FiBarChart2,
                bg: "bg-[#eeeafd]",
                text: "text-[#6e5bb4]",
              },
            ].map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-[1.25rem] border border-white/75 bg-white/82 p-3 shadow-[0_10px_28px_rgba(45,75,65,0.06)] backdrop-blur"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg} ${stat.text}`}
                    >
                      <Icon />
                    </span>
                    <div>
                      <p className="text-lg font-extrabold text-[#263c35]">
                        {stat.value}
                      </p>
                      <p className="text-[11px] font-semibold text-[#7c8984]">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-7 sm:py-9">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-xl rounded-[1.8rem] border border-[#e5ded0] bg-white p-8 text-center shadow-[0_18px_50px_rgba(45,75,65,0.08)] sm:p-11"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-[#eef8f4] text-[#16745f]">
                {searchTerm ? (
                  <FiSearch className="text-3xl" />
                ) : (
                  <FiBook className="text-3xl" />
                )}
              </div>

              <h2 className="mt-5 text-2xl font-extrabold text-[#263c35]">
                {searchTerm
                  ? "মিলছে এমন কোনো কোর্স পাওয়া যায়নি"
                  : "আপনি এখনো কোনো কোর্সে এনরোল করেননি"}
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#6d7c76]">
                {searchTerm
                  ? "অন্য কোনো শব্দ ব্যবহার করে আবার খুঁজুন অথবা সার্চটি পরিষ্কার করুন।"
                  : "আপনার পছন্দের কোর্স নির্বাচন করে আজই শেখার যাত্রা শুরু করুন।"}
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8dfd9] px-5 py-3 font-extrabold text-[#40554d] transition hover:border-[#ef8f6d] hover:text-[#d96f4a]"
                  >
                    <FiX />
                    সার্চ পরিষ্কার করুন
                  </button>
                )}

                {!searchTerm && (
                  <Link
                    to="/courses"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16745f] px-6 py-3 font-extrabold text-white shadow-[0_12px_30px_rgba(22,116,95,0.22)] transition hover:-translate-y-0.5 hover:bg-[#115f4e]"
                  >
                    কোর্স দেখুন
                    <FiArrowRight />
                  </Link>
                )}
              </div>
            </motion.div>
          ) : (
            <>
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#d9704b]">
                    Course Collection
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold text-[#263c35]">
                    আমার কোর্সসমূহ
                  </h2>
                </div>

                <span className="w-fit rounded-full bg-[#eef8f4] px-3 py-1.5 text-xs font-extrabold text-[#16745f]">
                  {filtered.length}টি কোর্স
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((item, index) => {
                  const progress = calculateProgress(item);
                  const status =
                    statusConfig[item.paymentStatus] || statusConfig.failed;

                  return (
                    <motion.article
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.42,
                        delay: Math.min(index * 0.07, 0.35),
                      }}
                      whileHover={{ y: -5 }}
                      className="group overflow-hidden rounded-[1.65rem] border border-[#e5ded0] bg-white shadow-[0_15px_42px_rgba(45,75,65,0.08)] transition hover:border-[#cfe5dc] hover:shadow-[0_22px_55px_rgba(45,75,65,0.13)]"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-48 overflow-hidden bg-[#edf2ee]">
                        <img
                          src={
                            item.course?.thumbnail ||
                            "https://via.placeholder.com/300x200?text=No+Image"
                          }
                          alt={item.course?.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/300x200?text=No+Image";
                          }}
                        />

                        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#1f352d]/65 to-transparent" />

                        <span
                          className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-extrabold shadow-sm backdrop-blur ${status.badge}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                          />
                          {status.label}
                        </span>

                        {item.paymentStatus === "cancelled" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#263c35]/48 p-4 backdrop-blur-[2px]">
                            <button
                              type="button"
                              onClick={() => setSelectedRejection(item)}
                              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-[#c6573a] shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5"
                            >
                              <FiAlertCircle />
                              কারণ দেখুন
                            </button>
                          </div>
                        )}

                        {item.paymentStatus === "pending" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#263c35]/26 p-4 backdrop-blur-[1px]">
                            <div className="inline-flex items-center gap-2 rounded-xl bg-white/94 px-4 py-2.5 text-sm font-extrabold text-[#8b681f] shadow-lg">
                              <FiClock className="text-[#d89d2d]" />
                              অনুমোদনের অপেক্ষায়
                            </div>
                          </div>
                        )}

                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-white">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold">
                            <FiClock />
                            {item.course?.duration || 0}h
                          </span>

                          {item.paymentStatus === "completed" && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold">
                              <FiBarChart2 />
                              {progress}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        {item.paymentStatus === "completed" ? (
                          <div>
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-[#71817b]">Progress</span>
                              <span className="text-[#16745f]">
                                {progress}%
                              </span>
                            </div>

                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8eee9]">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{
                                  duration: 0.75,
                                  delay: 0.15 + index * 0.04,
                                }}
                                className="h-full rounded-full bg-linear-to-r from-[#16745f] to-[#72baa7]"
                              />
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`rounded-xl border p-3 text-center text-xs font-bold ${
                              item.paymentStatus === "pending"
                                ? "border-[#efe0b8] bg-[#fffaf0] text-[#8d6c28]"
                                : "border-[#f1d8ce] bg-[#fff7f2] text-[#b45b41]"
                            }`}
                          >
                            {item.paymentStatus === "pending" ? (
                              <span className="inline-flex items-center gap-2">
                                <FiClock />
                                Admin approval pending
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setSelectedRejection(item)}
                                className="inline-flex items-center gap-2 font-extrabold underline decoration-dotted underline-offset-4"
                              >
                                <FiXCircle />
                                Access denied — কারণ দেখুন
                              </button>
                            )}
                          </div>
                        )}

                        <h3 className="mt-4 line-clamp-2 min-h-14 text-lg font-extrabold leading-7 text-[#263c35] transition group-hover:text-[#16745f]">
                          {item.course?.title || "Course Unavailable"}
                        </h3>

                        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#86928d]">
                          <FiCalendar />
                          Enrolled{" "}
                          {new Date(
                            item.enrolledAt || item.createdAt,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>

                        <div className="mt-5 border-t border-[#eee8dc] pt-4">
                          {isButtonDisabled(item) ? (
                            <button
                              type="button"
                              disabled
                              className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#d9dfda] px-4 text-sm font-extrabold text-[#7a8882] opacity-85"
                            >
                              {getButtonIcon(item)}
                              {getButtonText(item)}
                            </button>
                          ) : (
                            <Link
                              to={`/learn/${item.course?._id}`}
                              className="group/button inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#16745f] px-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(22,116,95,0.22)] transition hover:-translate-y-0.5 hover:bg-[#115f4e]"
                            >
                              {getButtonIcon(item)}
                              {getButtonText(item)}
                              <FiArrowRight className="transition group-hover/button:translate-x-1" />
                            </Link>
                          )}

                          {item.paymentStatus === "pending" && (
                            <p className="mt-3 truncate text-center text-[11px] font-semibold text-[#8a9691]">
                              Transaction ID: {item.transactionId}
                            </p>
                          )}

                          {item.paymentStatus === "cancelled" && (
                            <button
                              type="button"
                              onClick={() => setSelectedRejection(item)}
                              className="mt-3 w-full text-center text-xs font-extrabold text-[#c6573a] underline decoration-dotted underline-offset-4 transition hover:text-[#a8432a]"
                            >
                              কেন রিজেক্ট করা হয়েছে দেখুন
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyCourses;
