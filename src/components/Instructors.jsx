import React, { useCallback, useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  FiArrowUpRight,
  FiCheckCircle,
  FiMapPin,
  FiRefreshCw,
  FiUser,
} from "react-icons/fi";
import { FaChalkboardTeacher, FaExclamationCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../utils/axios";

const cardThemes = [
  {
    background: "from-[#fff1aa] via-[#ffe6a1] to-[#ffd98f]",
    accent: "bg-[#ff6542]",
    button: "from-[#ff6542] to-[#ff7f62]",
    softAccent: "bg-[#fff0eb]",
    textAccent: "text-[#e85031]",
    pattern: "bg-[#f7bd66]",
  },
  {
    background: "from-[#bce9e3] via-[#a6ded9] to-[#91d3cd]",
    accent: "bg-[#073b46]",
    button: "from-[#073b46] to-[#0b6570]",
    softAccent: "bg-[#e6f7f5]",
    textAccent: "text-[#08736e]",
    pattern: "bg-[#5bb7b1]",
  },
  {
    background: "from-[#ffd3cb] via-[#ffc4b8] to-[#ffb3a4]",
    accent: "bg-[#f05b3d]",
    button: "from-[#ef5b3d] to-[#ff8066]",
    softAccent: "bg-[#fff0ed]",
    textAccent: "text-[#df4f33]",
    pattern: "bg-[#f27a63]",
  },
  {
    background: "from-[#d9e9ff] via-[#c7dcfa] to-[#b8d0ef]",
    accent: "bg-[#335f8f]",
    button: "from-[#335f8f] to-[#557eaa]",
    softAccent: "bg-[#edf5ff]",
    textAccent: "text-[#335f8f]",
    pattern: "bg-[#7da2ce]",
  },
  {
    background: "from-[#e7d7f8] via-[#dac5f0] to-[#cbb1e8]",
    accent: "bg-[#704a91]",
    button: "from-[#704a91] to-[#9369b4]",
    softAccent: "bg-[#f6effd]",
    textAccent: "text-[#704a91]",
    pattern: "bg-[#a982ca]",
  },
  {
    background: "from-[#d9efbb] via-[#cbe6a8] to-[#b8da8d]",
    accent: "bg-[#597b35]",
    button: "from-[#597b35] to-[#789b4f]",
    softAccent: "bg-[#f1f8e9]",
    textAccent: "text-[#597b35]",
    pattern: "bg-[#8eb35d]",
  },
];

const sectionTransition = {
  duration: 0.75,
  ease: [0.22, 1, 0.36, 1],
};

const Instructors = ({ limit = 3, onViewProfile }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const shouldReduceMotion = useReducedMotion();

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/auth/teachers");

      if (res.data?.success || Array.isArray(res.data?.teachers)) {
        const teachersData = res.data?.teachers || [];
        setTeachers(limit ? teachersData.slice(0, limit) : teachersData);
      } else {
        setError(
          "শিক্ষকদের তথ্য এই মুহূর্তে লোড করা যাচ্ছে না। অনুগ্রহ করে আবার চেষ্টা করুন।",
        );
        toast.error("শিক্ষকদের তথ্য লোড করা যায়নি");
      }
    } catch (fetchError) {
      console.error("Error fetching teachers:", fetchError);

      setError(
        "সার্ভারের সঙ্গে সংযোগ করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।",
      );

      if (!fetchError?.response?.status || fetchError.response.status >= 500) {
        toast.error("নেটওয়ার্ক সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।");
      }
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleProfileClick = (teacher) => {
    if (typeof onViewProfile === "function") {
      onViewProfile(teacher);
    }
  };

  const renderSkeletons = () => {
    const skeletonCount = limit || 6;

    return (
      <motion.div
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid gap-7 md:grid-cols-2 lg:grid-cols-3"
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-4xl border border-[#073b46]/10 bg-white shadow-[0_20px_60px_rgba(7,59,70,0.09)]"
          >
            <div
              className={`relative h-40 animate-pulse bg-linear-to-br ${
                cardThemes[index % cardThemes.length].background
              }`}
            >
              <div className="absolute left-6 top-6 h-7 w-28 rounded-full bg-white/50" />
              <div className="absolute right-7 top-7 h-12 w-12 rounded-2xl bg-white/35" />
            </div>

            <div className="relative px-6 pb-7">
              <div className="-mt-16 flex justify-center">
                <div className="h-32 w-32 animate-pulse rounded-full border-[6px] border-white bg-slate-200 shadow-lg" />
              </div>

              <div className="mx-auto mt-5 h-6 w-2/3 animate-pulse rounded-full bg-slate-200" />
              <div className="mx-auto mt-3 h-7 w-24 animate-pulse rounded-full bg-slate-100" />

              <div className="mt-7 rounded-2xl bg-[#f7faf9] px-4 py-4">
                <div className="mx-auto h-4 w-4/5 animate-pulse rounded-full bg-slate-200" />
                <div className="mx-auto mt-2 h-4 w-3/5 animate-pulse rounded-full bg-slate-200" />
              </div>

              <div className="mx-auto mt-6 h-12 w-full animate-pulse rounded-2xl bg-slate-100" />
            </div>
          </div>
        ))}
      </motion.div>
    );
  };

  const renderErrorState = () => (
    <motion.div
      key="error"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={sectionTransition}
      className="relative overflow-hidden rounded-4xl border border-red-100 bg-white px-6 py-14 text-center shadow-[0_24px_70px_rgba(7,59,70,0.1)]"
    >
      <div
        aria-hidden="true"
        className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-red-50"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-orange-50"
      />

      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                rotate: [0, -8, 8, -5, 5, 0],
              }
        }
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/60"
      >
        <FaExclamationCircle className="text-4xl text-[#ff6542]" />
      </motion.div>

      <h3 className="relative mt-6 text-2xl font-black text-[#073b46]">
        শিক্ষকদের তথ্য লোড করা যায়নি
      </h3>

      <p className="relative mx-auto mt-3 max-w-lg leading-7 text-slate-500">
        {error}
      </p>

      <motion.button
        type="button"
        onClick={fetchTeachers}
        whileHover={shouldReduceMotion ? undefined : { y: -3 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
        className="relative mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#073b46] px-6 py-3.5 font-bold text-white shadow-[0_12px_30px_rgba(7,59,70,0.22)] transition hover:bg-[#0b4d59] focus:outline-none focus:ring-4 focus:ring-[#073b46]/15"
      >
        <FiRefreshCw />
        আবার চেষ্টা করুন
      </motion.button>
    </motion.div>
  );

  const renderEmptyState = () => (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={sectionTransition}
      className="relative overflow-hidden rounded-4xl border border-[#073b46]/10 bg-white px-6 py-14 text-center shadow-[0_24px_70px_rgba(7,59,70,0.1)]"
    >
      <div
        aria-hidden="true"
        className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#fff3bd]"
      />

      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                y: [0, -8, 0],
                rotate: [0, 3, 0],
              }
        }
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff3bd] ring-8 ring-[#fff8dc]"
      >
        <FaChalkboardTeacher className="text-4xl text-[#073b46]" />
      </motion.div>

      <h3 className="relative mt-6 text-2xl font-black text-[#073b46]">
        বর্তমানে কোনো শিক্ষক পাওয়া যায়নি
      </h3>

      <p className="relative mx-auto mt-3 max-w-lg leading-7 text-slate-500">
        নতুন শিক্ষক যুক্ত হলে এখানে তাঁদের তথ্য দেখা যাবে। অনুগ্রহ করে পরে আবার
        দেখুন।
      </p>
    </motion.div>
  );

  const renderTeachers = () => (
    <motion.div
      key="teachers"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : 0.12,
            delayChildren: shouldReduceMotion ? 0 : 0.1,
          },
        },
      }}
      className="grid gap-7 md:grid-cols-2 lg:grid-cols-3"
    >
      {teachers.map((teacher, index) => {
        const theme = cardThemes[index % cardThemes.length];
        const teacherName = teacher?.name || "সম্মানিত উস্তাদ";
        const teacherRole = teacher?.role;

        return (
          <motion.article
            key={teacher?._id || teacher?.id || index}
            variants={{
              hidden: {
                opacity: 0,
                y: shouldReduceMotion ? 0 : 45,
                scale: shouldReduceMotion ? 1 : 0.96,
              },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: sectionTransition,
              },
            }}
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    y: -12,
                    transition: { duration: 0.3 },
                  }
            }
            className="group relative overflow-hidden rounded-4xl border border-[#073b46]/10 bg-white shadow-[0_18px_55px_rgba(7,59,70,0.1)] transition-shadow duration-300 hover:shadow-[0_32px_85px_rgba(7,59,70,0.18)]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-4 h-28 rounded-full bg-white/50 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />

            {/* Card top area */}
            <div
              className={`relative h-40 overflow-hidden bg-linear-to-br ${theme.background}`}
            >
              <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent" />

              <motion.div
                aria-hidden="true"
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        x: [0, 9, 0],
                        y: [0, -7, 0],
                      }
                }
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2,
                }}
                className="absolute -left-8 -top-8 h-28 w-28 rounded-full border-18 border-white/25"
              />

              <motion.div
                aria-hidden="true"
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        rotate: [0, 12, 0],
                      }
                }
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`absolute -bottom-9 -right-7 h-28 w-28 rounded-[34px] ${theme.pattern} opacity-40`}
              />

              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/60 bg-white/75 px-3.5 py-2 text-xs font-black text-[#073b46] shadow-sm backdrop-blur-md">
                <span className={`h-2 w-2 rounded-full ${theme.accent}`} />
                নিবেদিত উস্তাদ
              </div>

              <motion.div
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        rotate: 12,
                        scale: 1.1,
                      }
                }
                className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-white/75 text-[#073b46] shadow-sm backdrop-blur-md"
              >
                <FaChalkboardTeacher className="text-xl" />
              </motion.div>
            </div>

            {/* Teacher details */}
            <div className="relative px-6 pb-7">
              <div className="-mt-18 flex justify-center">
                <motion.div
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          scale: 1.05,
                          rotate: -2,
                        }
                  }
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="relative"
                >
                  <div className="rounded-full bg-white p-1.5 shadow-[0_14px_35px_rgba(7,59,70,0.2)] ring-1 ring-[#073b46]/5">
                    <img
                      src={teacher?.avatar || "/default-avatar.png"}
                      alt={teacherName}
                      loading="lazy"
                      className="h-32 w-32 rounded-full bg-slate-100 object-cover"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/default-avatar.png";
                      }}
                    />
                  </div>

                  <motion.div
                    whileHover={
                      shouldReduceMotion
                        ? undefined
                        : {
                            scale: 1.15,
                            rotate: 8,
                          }
                    }
                    className={`absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white ${theme.accent} text-white shadow-md`}
                  >
                    <FiUser size={16} />
                  </motion.div>
                </motion.div>
              </div>

              <div className="mt-5 text-center">
                <h3 className="text-[23px] font-black leading-tight text-[#073b46]">
                  {teacherName}
                </h3>

                <div
                  className={`mx-auto mt-2 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-extrabold ${theme.softAccent} ${theme.textAccent}`}
                >
                  <FiCheckCircle />
                  {teacherRole}
                </div>
              </div>

              <div className="mt-6 flex min-h-19 items-start justify-center gap-2 rounded-2xl border border-[#073b46]/5 bg-[#f8fbfa] px-4 py-4 text-center transition duration-300 group-hover:border-[#073b46]/10 group-hover:bg-white group-hover:shadow-[0_10px_30px_rgba(7,59,70,0.06)]">
                <FiMapPin className="mt-0.5 shrink-0 text-[#ff6542]" />

                <p className="text-sm leading-6 text-slate-600">
                  {teacher?.address || "ঠিকানা আপাতত যুক্ত করা হয়নি"}
                </p>
              </div>

              <motion.button
                type="button"
                onClick={() => handleProfileClick(teacher)}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: -2,
                      }
                }
                whileTap={
                  shouldReduceMotion
                    ? undefined
                    : {
                        scale: 0.97,
                      }
                }
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r ${theme.button} px-5 py-3.5 text-sm font-black text-white shadow-[0_12px_28px_rgba(7,59,70,0.15)] transition duration-300 hover:shadow-[0_16px_35px_rgba(7,59,70,0.22)] focus:outline-none focus:ring-4 focus:ring-orange-100`}
              >
                বিস্তারিত পরিচিতি
                <motion.span
                  className="inline-flex"
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          x: [0, 3, 0],
                          y: [0, -3, 0],
                        }
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <FiArrowUpRight />
                </motion.span>
              </motion.button>
            </div>

            <div
              className={`absolute bottom-0 left-1/2 h-1 w-24 -translate-x-1/2 rounded-t-full ${theme.accent} transition-all duration-300 group-hover:w-48`}
            />
          </motion.article>
        );
      })}
    </motion.div>
  );

  return (
    <section
      id="instructors"
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fbfdfc_48%,#f4faf8_100%)] py-16 font-hind sm:py-20 lg:py-24"
    >
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(7,59,70,0.055)_1px,transparent_0)] bg-size-[28px_28px] opacity-55" />
        <div className="absolute -left-28 top-20 h-80 w-80 rounded-full bg-[#fff3bd]/75 blur-3xl" />
        <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-[#dff4f1]/90 blur-3xl" />
        <div className="absolute left-[7%] top-[42%] hidden h-3 w-3 rounded-full bg-[#ff6542]/40 lg:block" />
        <div className="absolute right-[8%] top-[25%] hidden h-5 w-5 rounded-full border-4 border-[#073b46]/15 lg:block" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section heading */}
        <div className="mb-12 grid items-center gap-8 lg:mb-16 lg:grid-cols-[1fr_340px]">
          <motion.div
            initial={{
              opacity: 0,
              x: shouldReduceMotion ? 0 : -35,
            }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={sectionTransition}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#073b46]/10 bg-white/85 px-4 py-2 text-sm font-black text-[#073b46] shadow-[0_8px_24px_rgba(7,59,70,0.08)] backdrop-blur-md">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff3bd]">
                <FaChalkboardTeacher className="text-[#ff6542]" />
              </span>
              আমাদের সম্মানিত উস্তাদগণ
            </div>

            <h2 className="font-baloo mt-5 max-w-4xl text-4xl font-black leading-[1.2] tracking-tight text-[#073b46] sm:text-5xl lg:text-[56px]">
              যত্নশীল উস্তাদদের কাছ থেকে শিখুন,
              <span className="relative mt-1 inline-block text-[#ff6542] sm:ml-3 sm:mt-0">
                আত্মবিশ্বাসে এগিয়ে যান
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.45 }}
                  className="absolute -bottom-2 left-0 h-1.5 w-full origin-left rounded-full bg-[#ffd36e]"
                />
              </span>
            </h2>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              অভিজ্ঞ, আন্তরিক ও নিবেদিত উস্তাদগণ প্রতিটি পাঠকে সহজ, প্রাণবন্ত ও
              অর্থবহ করে শিক্ষার্থীদের জ্ঞান ও আদর্শে এগিয়ে নেন।
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {["অভিজ্ঞ", "আন্তরিক", "নিবেদিত"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#073b46]/10 bg-white/75 px-3.5 py-2 text-sm font-bold text-[#073b46] shadow-sm backdrop-blur-sm"
                >
                  <FiCheckCircle className="text-[#ff6542]" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Header illustration */}
          <motion.div
            initial={{
              opacity: 0,
              x: shouldReduceMotion ? 0 : 35,
              scale: shouldReduceMotion ? 1 : 0.9,
            }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...sectionTransition, delay: 0.1 }}
            className="relative mx-auto hidden h-64 w-full max-w-95 lg:block" // h-56 থেকে h-64, max-w-85 থেকে max-w-95
          >
            <div className="absolute inset-x-4 bottom-1 h-20 rounded-full bg-[#073b46]/10 blur-2xl" />

            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      rotate: [-2, 3, -2],
                      y: [0, -10, 0],
                    }
              }
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-2 right-0 w-full" // w-47.5 থেকে w-full
            >
              <img
                src="/teacher.png"
                alt=""
                aria-hidden="true"
                className="w-full max-w-187.5 mx-auto object-contain drop-shadow-[0_20px_20px_rgba(7,59,70,0.20)]" // সাইজ বড় করা হয়েছে
              />
            </motion.div>

            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      rotate: [0, 10, 0],
                      scale: [1, 1.1, 1],
                      y: [0, -8, 0],
                    }
              }
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute bottom-5 left-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-[#ff6542] shadow-[0_12px_30px_rgba(7,59,70,0.15)]"
            >
              ✦
            </motion.div>

            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: [1, 1.15, 1],
                      opacity: [0.6, 1, 0.6],
                    }
              }
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              }}
              className="absolute top-2 right-8 flex h-10 w-10 items-center justify-center rounded-full bg-[#fff3bd] text-base text-[#073b46] shadow-[0_8px_20px_rgba(7,59,70,0.10)]"
            >
              ⭐
            </motion.div>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {loading
            ? renderSkeletons()
            : error
              ? renderErrorState()
              : !teachers?.length
                ? renderEmptyState()
                : renderTeachers()}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Instructors;
