import React, { useCallback, useEffect, useMemo, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiBookOpen,
  FiHelpCircle,
  FiMessageCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { FaExclamationCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../utils/axios";

const cardThemes = [
  {
    accent: "bg-[#ff6542]",
    text: "text-[#e85031]",
    badge: "bg-[#fff0eb] text-[#d94e32]",
    soft: "bg-[#fff7df]",
    glow: "bg-[#ffd36e]/30",
    border: "group-hover:border-[#ff6542]/35",
  },
  {
    accent: "bg-[#08736e]",
    text: "text-[#08736e]",
    badge: "bg-[#e6f7f5] text-[#08736e]",
    soft: "bg-[#eef9f7]",
    glow: "bg-[#7fd5cf]/25",
    border: "group-hover:border-[#08736e]/35",
  },
  {
    accent: "bg-[#704a91]",
    text: "text-[#704a91]",
    badge: "bg-[#f3ebfb] text-[#704a91]",
    soft: "bg-[#f8f3fc]",
    glow: "bg-[#c7a9e2]/25",
    border: "group-hover:border-[#704a91]/35",
  },
];

const sectionTransition = {
  duration: 0.72,
  ease: [0.22, 1, 0.36, 1],
};

const stripHtml = (content = "") => {
  try {
    return String(content)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    return "";
  }
};

const createExcerpt = (content, maxLength = 180) => {
  const plainText = stripHtml(content);

  if (!plainText) return "";
  if (plainText.length <= maxLength) return plainText;

  return `${plainText.slice(0, maxLength).trim()}...`;
};

const QuestionSkeleton = ({ index }) => {
  const theme = cardThemes[index % cardThemes.length];

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#073b46]/10 bg-white shadow-[0_18px_55px_rgba(7,59,70,0.09)]">
      <div className="relative p-6 sm:p-7">
        <div
          aria-hidden="true"
          className={`absolute -right-12 -top-12 h-36 w-36 rounded-full ${theme.glow} blur-2xl`}
        />

        <div className="relative flex items-center justify-between gap-4">
          <div className="h-7 w-28 animate-pulse rounded-full bg-slate-200" />
          <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-100" />
        </div>

        <div className="relative mt-6 flex gap-4">
          <div className="h-11 w-11 shrink-0 animate-pulse rounded-2xl bg-slate-200" />
          <div className="w-full space-y-2 pt-1">
            <div className="h-6 w-full animate-pulse rounded-full bg-slate-200" />
            <div className="h-6 w-4/5 animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>

        <div className="relative mt-6 rounded-2xl bg-[#f7faf9] p-5">
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
          </div>

          <div className="mt-5 h-10 w-32 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
};

const PopularQuestion = () => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  const shouldReduceMotion = useReducedMotion();

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/qna/featuredQuestion");
      const questionsData = res.data?.questions;

      if (res.data?.success || Array.isArray(questionsData)) {
        setQuestions(Array.isArray(questionsData) ? questionsData : []);
      } else {
        setError("প্রশ্নগুলো লোড করা যায়নি।");
        toast.error("নির্বাচিত প্রশ্নগুলো লোড করা সম্ভব হয়নি");
      }
    } catch (fetchError) {
      console.error("Error fetching questions:", fetchError);

      const message =
        fetchError?.response?.data?.message ||
        fetchError?.message ||
        "প্রশ্নগুলো লোড করা যায়নি।";

      setError(message);

      if (!fetchError?.response?.status || fetchError.response.status >= 500) {
        toast.error("নেটওয়ার্কে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const listVariants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: shouldReduceMotion ? 0 : 0.12,
          delayChildren: shouldReduceMotion ? 0 : 0.08,
        },
      },
    }),
    [shouldReduceMotion],
  );

  const cardVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : 38,
        scale: shouldReduceMotion ? 1 : 0.97,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: sectionTransition,
      },
    }),
    [shouldReduceMotion],
  );

  const renderLoadingState = () => (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid gap-7 lg:grid-cols-3"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <QuestionSkeleton key={index} index={index} />
      ))}
    </motion.div>
  );

  const renderErrorState = () => (
    <motion.div
      key="error"
      initial={{
        opacity: 0,
        y: shouldReduceMotion ? 0 : 20,
        scale: shouldReduceMotion ? 1 : 0.97,
      }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={sectionTransition}
      className="relative overflow-hidden rounded-4xl border border-red-100 bg-white px-6 py-14 text-center shadow-[0_20px_65px_rgba(7,59,70,0.1)]"
    >
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#fff0eb]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-[#fff8db]"
      />

      <motion.div
        animate={
          shouldReduceMotion ? undefined : { rotate: [0, -8, 8, -5, 5, 0] }
        }
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0eb]"
      >
        <FaExclamationCircle className="text-4xl text-[#ff6542]" />
      </motion.div>

      <h3 className="relative mt-6 text-2xl font-black text-[#073b46]">
        প্রশ্নগুলো লোড করা যায়নি
      </h3>

      <p className="relative mx-auto mt-3 max-w-lg leading-7 text-slate-500">
        {String(error || "")
          .toLowerCase()
          .includes("network")
          ? "আপনার ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।"
          : "এই মুহূর্তে নির্বাচিত প্রশ্নগুলো দেখাতে সমস্যা হচ্ছে।"}
      </p>

      <motion.button
        type="button"
        onClick={fetchQuestions}
        whileHover={shouldReduceMotion ? undefined : { y: -3 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
        className="relative mt-7 inline-flex items-center gap-2 rounded-xl bg-[#073b46] px-6 py-3 font-bold text-white shadow-[0_12px_28px_rgba(7,59,70,0.22)] transition-colors hover:bg-[#0b4d59] focus:outline-none focus:ring-4 focus:ring-[#073b46]/15"
      >
        <FiRefreshCw />
        আবার চেষ্টা করুন
      </motion.button>
    </motion.div>
  );

  const renderEmptyState = () => (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={sectionTransition}
      className="relative overflow-hidden rounded-4xl border border-[#073b46]/10 bg-white px-6 py-14 text-center shadow-[0_20px_65px_rgba(7,59,70,0.1)]"
    >
      <div
        aria-hidden="true"
        className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#fff3bd]"
      />

      <motion.div
        animate={
          shouldReduceMotion ? undefined : { y: [0, -8, 0], rotate: [0, 4, 0] }
        }
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff3bd]"
      >
        <FiHelpCircle className="text-4xl text-[#073b46]" />
      </motion.div>

      <h3 className="relative mt-6 text-2xl font-black text-[#073b46]">
        এখনো কোনো প্রশ্ন পাওয়া যায়নি
      </h3>

      <p className="relative mx-auto mt-3 max-w-lg leading-7 text-slate-500">
        এই মুহূর্তে দেখানোর মতো কোনো নির্বাচিত প্রশ্ন নেই। নতুন প্রশ্ন ও উত্তরের
        জন্য পরে আবার দেখুন।
      </p>
    </motion.div>
  );

  const renderQuestions = () => (
    <motion.div
      key="questions"
      variants={listVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      className="grid gap-7 lg:grid-cols-3"
    >
      {questions.map((item, index) => {
        const theme = cardThemes[index % cardThemes.length];
        const questionId = item?._id || item?.id;
        const firstAnswer = item?.answers?.[0];
        const answerText = firstAnswer?.text;
        const answerExcerpt = createExcerpt(answerText);

        // API/ডেটাবেস থেকে আসা মানগুলো অনুবাদ বা পরিবর্তন করা হচ্ছে না।
        const questionTitle = item?.title || "শিরোনামহীন প্রশ্ন";
        const categoryName = item?.category?.name || "সাধারণ";

        return (
          <motion.article
            key={questionId || index}
            variants={cardVariants}
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    y: -10,
                    transition: { duration: 0.3 },
                  }
            }
            className={`group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[#073b46]/10 bg-white shadow-[0_18px_55px_rgba(7,59,70,0.09)] transition-[border-color,box-shadow] duration-300 hover:shadow-[0_30px_75px_rgba(7,59,70,0.17)] ${theme.border}`}
          >
            <div
              aria-hidden="true"
              className={`absolute -right-14 -top-14 h-44 w-44 rounded-full ${theme.glow} blur-2xl transition-transform duration-500 group-hover:scale-125`}
            />

            <div className="relative flex h-full flex-col p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <span
                  className={`max-w-[75%] truncate rounded-full px-3.5 py-1.5 text-xs font-extrabold shadow-sm ${theme.badge}`}
                  title={categoryName}
                >
                  {categoryName}
                </span>

                <motion.span
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { y: [0, -5, 0], rotate: [0, 4, 0] }
                  }
                  transition={{
                    duration: 3.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.12,
                  }}
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${theme.soft} text-[#073b46] shadow-sm`}
                >
                  <FiBookOpen className="text-xl" />
                </motion.span>
              </div>

              <div className="mt-6 flex items-start gap-3.5">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${theme.accent} text-lg font-black text-white shadow-md`}
                >
                  প্র
                </span>

                <h3 className="pt-1 text-xl font-black leading-[1.45] text-[#073b46] transition-colors duration-300 group-hover:text-[#ef5739]">
                  {questionTitle}
                </h3>
              </div>

              <div className="mt-6 flex flex-1 flex-col rounded-[22px] border border-[#073b46]/5 bg-[#f8fbfa] p-5">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl ${theme.soft} ${theme.text} font-black`}
                  >
                    উ
                  </span>
                  <span className="text-xs font-extrabold text-slate-400">
                    উত্তর
                  </span>
                </div>

                {answerExcerpt ? (
                  <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-600">
                    {answerExcerpt}
                  </p>
                ) : (
                  <div className="mt-4 flex flex-1 items-center rounded-2xl border border-dashed border-[#073b46]/10 bg-white/80 px-4 py-5">
                    <p className="text-sm italic leading-6 text-slate-500">
                      এই প্রশ্নের কোনো উত্তর এখনো যুক্ত করা হয়নি।
                    </p>
                  </div>
                )}

                <div className="mt-auto pt-5">
                  {questionId ? (
                    <Link
                      to={`/qa/${questionId}`}
                      aria-label={`${questionTitle} বিস্তারিত দেখুন`}
                      className="group/link inline-flex items-center gap-2 rounded-xl border-2 border-[#ff6542] px-4 py-2.5 text-sm font-black text-[#ef5739] transition-all duration-300 hover:bg-[#ff6542] hover:text-white focus:outline-none focus:ring-4 focus:ring-orange-100"
                    >
                      {answerExcerpt ? "বিস্তারিত পড়ুন" : "প্রথম উত্তরটি দিন"}
                      <FiArrowUpRight className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    </Link>
                  ) : (
                    <span className="inline-flex rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-400">
                      বিস্তারিত পাওয়া যাচ্ছে না
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`absolute bottom-0 left-1/2 h-1 w-20 -translate-x-1/2 rounded-t-full ${theme.accent} transition-all duration-300 group-hover:w-40`}
            />
          </motion.article>
        );
      })}
    </motion.div>
  );

  return (
    <section
      id="popular-questions"
      className="relative isolate overflow-hidden bg-white py-16 font-hind sm:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-[#fff6cf] blur-3xl" />
        <div className="absolute -right-32 bottom-16 h-80 w-80 rounded-full bg-[#dff4f1] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#073b46_1px,transparent_1px)] bg-size-[24px_24px]" />

        <motion.span
          animate={shouldReduceMotion ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[6%] top-[47%] hidden h-4 w-4 rounded-full bg-[#ff6542]/30 lg:block"
        />

        <span className="absolute right-[7%] top-[22%] hidden h-6 w-6 rounded-full border-4 border-[#073b46]/10 lg:block" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-12 grid items-center gap-8 lg:mb-16 lg:grid-cols-[1fr_340px]">
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={sectionTransition}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fff3bd] px-4 py-2 text-xs font-black text-[#073b46]">
              <FiMessageCircle className="text-[#ff6542]" />
              নির্বাচিত প্রশ্নোত্তর
            </div>

            <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[1.15] tracking-tight text-[#073b46] sm:text-5xl lg:text-[56px]">
              জানুন, বুঝুন এবং
              <span className="relative ml-3 inline-block text-[#ff6542]">
                জ্ঞান ভাগ করুন
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.45 }}
                  className="absolute -bottom-2 left-0 h-1.5 w-full origin-left rounded-full bg-[#ffd36e]"
                />
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              শিক্ষার্থী ও অভিভাবকদের গুরুত্বপূর্ণ প্রশ্ন, প্রয়োজনীয় উত্তর এবং
              উপকারী আলোচনা এক জায়গায় খুঁজে নিন।
            </p>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: shouldReduceMotion ? 0 : 35,
              scale: shouldReduceMotion ? 1 : 0.9,
            }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...sectionTransition, delay: 0.1 }}
            className="relative mx-auto hidden h-64 w-full max-w-95 lg:block" // h-52 থেকে h-64, max-w-85 থেকে max-w-95
          >
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: [0, -10, 0],
                      rotate: [-3, 3, -3],
                    }
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-0 right-0 w-full" // w-46 থেকে w-full
            >
              <img
                src="/question.png"
                alt=""
                aria-hidden="true"
                className="w-full max-w-162.5 mx-auto object-contain drop-shadow-[0_20px_20px_rgba(7,59,70,0.20)]" // সাইজ বড় করা হয়েছে
              />
            </motion.div>

            {/* ফ্লোটিং ডেকোরেশন - স্টিকার/ব্যাজ */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: [0, -8, 0],
                      rotate: [0, 5, -5, 0],
                    }
              }
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
              className="absolute left-0 top-2 rounded-3xl border-2 border-[#073b46] bg-[#fff3bd] px-5 py-4 shadow-[8px_8px_0_#073b46]"
            >
              <p className="text-xs font-black text-[#ff6542]">প্রশ্ন করুন</p>
              <p className="mt-1 text-xl font-black text-[#073b46]">
                উত্তর জানুন
              </p>
            </motion.div>

            {/* পালসেটিং ডট - বড় করা হলো */}
            <motion.span
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }
              }
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute right-10 top-4 h-6 w-6 rounded-full bg-[#ff6542] shadow-[0_0_20px_rgba(255,101,66,0.4)]" // h-4 থেকে h-6, w-4 থেকে w-6
            />

            {/* নতুন ডেকোরেশন: ফ্লোটিং + চিহ্ন */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      rotate: [0, 15, 0],
                      scale: [1, 1.1, 1],
                      y: [0, -5, 0],
                    }
              }
              transition={{
                duration: 3.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
              className="absolute bottom-16 left-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl text-[#08736e] shadow-[0_10px_25px_rgba(7,59,70,0.12)]"
            >
              💡
            </motion.div>

            {/* নতুন ডেকোরেশন: সেকেন্ডারি ডট */}
            <motion.span
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.8, 0.3],
                    }
              }
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.9,
              }}
              className="absolute bottom-28 right-12 h-3 w-3 rounded-full bg-[#08736e]/40"
            />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {loading
            ? renderLoadingState()
            : error
              ? renderErrorState()
              : !questions?.length
                ? renderEmptyState()
                : renderQuestions()}
        </AnimatePresence>

        {!loading && !error && questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...sectionTransition, delay: 0.2 }}
            className="mt-12 flex justify-center"
          >
            <Link
              to="/qa"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#073b46] px-7 py-3.5 text-sm font-black text-white shadow-[0_12px_30px_rgba(7,59,70,0.2)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#0b4d59] hover:shadow-[0_18px_38px_rgba(7,59,70,0.25)] focus:outline-none focus:ring-4 focus:ring-[#073b46]/15"
            >
              সব প্রশ্ন দেখুন
              <FiArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PopularQuestion;
