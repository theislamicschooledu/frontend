import React, { useCallback, useEffect, useMemo, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiBookOpen,
  FiClock,
  FiFileText,
  FiRefreshCw,
  FiUser,
} from "react-icons/fi";
import { FaExclamationCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../utils/axios";

const cardThemes = [
  {
    badge: "bg-[#fff1bc] text-[#c95033]",
    accent: "bg-[#ff6542]",
    soft: "bg-[#fff6d9]",
    border: "group-hover:border-[#ff6542]/40",
  },
  {
    badge: "bg-[#dff4f1] text-[#08736e]",
    accent: "bg-[#08736e]",
    soft: "bg-[#eef9f7]",
    border: "group-hover:border-[#08736e]/40",
  },
  {
    badge: "bg-[#e9def7] text-[#704a91]",
    accent: "bg-[#704a91]",
    soft: "bg-[#f7f1fc]",
    border: "group-hover:border-[#704a91]/40",
  },
  {
    badge: "bg-[#e2edfb] text-[#335f8f]",
    accent: "bg-[#335f8f]",
    soft: "bg-[#f1f6fd]",
    border: "group-hover:border-[#335f8f]/40",
  },
];

const animationTransition = {
  duration: 0.75,
  ease: [0.22, 1, 0.36, 1],
};

const stripHtml = (content = "") => {
  try {
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    return "";
  }
};

const calculateReadTime = (content) => {
  if (!content) return 3;

  try {
    const plainText = stripHtml(content);
    const words = plainText.match(/\S+/g)?.length || 0;

    return Math.max(1, Math.ceil(words / 200));
  } catch {
    return 3;
  }
};

const formatDate = (date) => {
  if (!date) return "সাম্প্রতিক";

  try {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "সাম্প্রতিক";
    }

    return parsedDate.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "সাম্প্রতিক";
  }
};

const createExcerpt = (content, length = 135) => {
  const plainText = stripHtml(content);

  if (!plainText) {
    return "এই লেখাটির কোনো সংক্ষিপ্ত বিবরণ এখনো যোগ করা হয়নি।";
  }

  if (plainText.length <= length) {
    return plainText;
  }

  return `${plainText.slice(0, length).trim()}...`;
};

const BlogSkeleton = ({ index }) => {
  const theme = cardThemes[index % cardThemes.length];

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#073b46]/10 bg-white shadow-[0_18px_50px_rgba(7,59,70,0.09)]">
      <div className="relative h-52 animate-pulse bg-slate-200">
        <div
          className={`absolute left-5 top-5 h-7 w-24 rounded-full ${theme.soft}`}
        />
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200" />
          <div className="h-4 w-20 animate-pulse rounded-full bg-slate-100" />
        </div>

        <div className="mt-5 h-6 w-full animate-pulse rounded-full bg-slate-200" />
        <div className="mt-2 h-6 w-4/5 animate-pulse rounded-full bg-slate-200" />

        <div className="mt-5 space-y-2">
          <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
          <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
          <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-100" />
        </div>

        <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
          <div className="h-9 w-28 animate-pulse rounded-full bg-slate-100" />
          <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
};

const PopularBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  const shouldReduceMotion = useReducedMotion();

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/blogs/featuredBlog");
      const blogsData = res.data?.blogs;

      if (res.data?.success || Array.isArray(blogsData)) {
        setBlogs(Array.isArray(blogsData) ? blogsData : []);
      } else {
        setError("নির্বাচিত ব্লগগুলো লোড করা যায়নি।");
        toast.error("নির্বাচিত ব্লগগুলো লোড করা সম্ভব হয়নি");
      }
    } catch (fetchError) {
      console.error("Error fetching blogs:", fetchError);

      const errorMessage =
        fetchError?.response?.data?.message ||
        fetchError?.message ||
        "ব্লগগুলো লোড করা যায়নি";

      setError(errorMessage);

      if (!fetchError?.response?.status || fetchError.response.status >= 500) {
        toast.error(
          fetchError?.response?.data?.message ||
            "নেটওয়ার্ক সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const gridAnimation = useMemo(
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

  const cardAnimation = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : 45,
        scale: shouldReduceMotion ? 1 : 0.96,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: animationTransition,
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
      className="grid gap-7 md:grid-cols-2 xl:grid-cols-4"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <BlogSkeleton key={index} index={index} />
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
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{ opacity: 0 }}
      transition={animationTransition}
      className="relative overflow-hidden rounded-4xl border border-red-100 bg-white px-6 py-14 text-center shadow-[0_20px_60px_rgba(7,59,70,0.09)]"
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
          shouldReduceMotion
            ? undefined
            : {
                rotate: [0, -8, 8, -5, 5, 0],
              }
        }
        transition={{
          duration: 0.8,
          delay: 0.2,
        }}
        className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0eb]"
      >
        <FaExclamationCircle className="text-4xl text-[#ff6542]" />
      </motion.div>

      <h3 className="relative mt-6 text-2xl font-black text-[#073b46]">
        ব্লগগুলো লোড করা যায়নি
      </h3>

      <p className="relative mx-auto mt-3 max-w-lg leading-7 text-slate-500">
        {error?.toLowerCase().includes("network")
          ? "ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।"
          : error || "নির্বাচিত ব্লগগুলো দেখাতে সাময়িক সমস্যা হচ্ছে।"}
      </p>

      <motion.button
        type="button"
        onClick={fetchBlogs}
        whileHover={
          shouldReduceMotion
            ? undefined
            : {
                y: -3,
              }
        }
        whileTap={
          shouldReduceMotion
            ? undefined
            : {
                scale: 0.97,
              }
        }
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
      initial={{
        opacity: 0,
        y: shouldReduceMotion ? 0 : 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{ opacity: 0 }}
      transition={animationTransition}
      className="relative overflow-hidden rounded-4xl border border-[#073b46]/10 bg-white px-6 py-14 text-center shadow-[0_20px_60px_rgba(7,59,70,0.09)]"
    >
      <div
        aria-hidden="true"
        className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#fff3bd]"
      />

      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                y: [0, -8, 0],
                rotate: [0, 4, 0],
              }
        }
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff3bd]"
      >
        <FiFileText className="text-4xl text-[#073b46]" />
      </motion.div>

      <h3 className="relative mt-6 text-2xl font-black text-[#073b46]">
        এখনো কোনো ব্লগ পাওয়া যায়নি
      </h3>

      <p className="relative mx-auto mt-3 max-w-lg leading-7 text-slate-500">
        এই মুহূর্তে দেখানোর মতো কোনো নির্বাচিত ব্লগ নেই। নতুন লেখা ও শিক্ষামূলক উপকরণের জন্য পরে আবার দেখুন।
      </p>
    </motion.div>
  );

  const renderBlogs = () => (
    <motion.div
      key="blogs"
      variants={gridAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.08,
      }}
      className="grid gap-7 md:grid-cols-2 xl:grid-cols-4"
    >
      {blogs.map((blog, index) => {
        const theme = cardThemes[index % cardThemes.length];
        const blogId = blog?._id || blog?.id;
        const blogTitle = blog?.title || "শিরোনামহীন ব্লগ";
        const authorName = blog?.author?.name || "অজানা লেখক";
        const categoryName = blog?.category?.name || "নির্বাচিত লেখা";

        return (
          <motion.article
            key={blogId || index}
            variants={cardAnimation}
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    y: -12,
                    transition: {
                      duration: 0.3,
                    },
                  }
            }
            className={`group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-[#073b46]/10 bg-white shadow-[0_18px_50px_rgba(7,59,70,0.09)] transition-[border-color,box-shadow,transform] duration-300 hover:shadow-[0_32px_80px_rgba(7,59,70,0.18)] ${theme.border}`}
          >
            <div
              aria-hidden="true"
              className={`absolute inset-x-10 top-0 z-10 h-1 rounded-b-full ${theme.accent} opacity-90 transition-all duration-300 group-hover:inset-x-5`}
            />

            {/* Blog cover */}
            <div className="relative h-56 overflow-hidden bg-[#eef4f3]">
              <motion.img
                src={blog?.cover || "/default-blog-cover.jpg"}
                alt={blogTitle}
                loading="lazy"
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        scale: 1.08,
                      }
                }
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full w-full object-cover transition-[filter] duration-700 group-hover:saturate-110"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/default-blog-cover.jpg";
                }}
              />

              <div className="absolute inset-0 bg-linear-to-t from-[#073b46]/70 via-[#073b46]/5 to-black/10" />

              <div
                className={`absolute left-5 top-5 max-w-[74%] truncate rounded-full border border-white/55 px-3.5 py-1.5 text-xs font-extrabold shadow-sm backdrop-blur-md ${theme.badge}`}
              >
                {categoryName}
              </div>

              <motion.div
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: [0, -5, 0],
                        rotate: [0, 3, 0],
                      }
                }
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.15,
                }}
                className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/50 bg-white/85 text-[#073b46] shadow-lg backdrop-blur-md"
              >
                <FiBookOpen className="text-xl" />
              </motion.div>

              <span className="absolute bottom-4 left-5 rounded-full border border-white/20 bg-[#073b46]/25 px-3 py-1 text-xs font-bold text-white/95 backdrop-blur-sm">
                লেখা {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Blog content */}
            <div className="relative flex flex-1 flex-col p-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-slate-500">
                <span>{formatDate(blog?.createdAt)}</span>

                <span
                  aria-hidden="true"
                  className="h-1 w-1 rounded-full bg-[#ff6542]"
                />

                <span className="inline-flex items-center gap-1.5">
                  <FiClock className="text-[#ff6542]" />
                  {calculateReadTime(blog?.content)} মিনিটে পড়ুন
                </span>
              </div>

              <h3 className="mt-4 line-clamp-2 text-[21px] font-black leading-[1.45] text-[#073b46] transition-colors duration-300 group-hover:text-[#ef5739]">
                {blogTitle}
              </h3>

              <p className="mt-3 line-clamp-3 text-[15px] leading-7 text-slate-600">
                {createExcerpt(blog?.content)}
              </p>

              <div className="mt-auto pt-6">
                <div className="flex items-center justify-between gap-3 border-t border-[#073b46]/8 pt-5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${theme.soft}`}
                    >
                      <FiUser className="text-[#073b46]" />
                    </span>

                    <div className="min-w-0">
                      <span className="block text-[11px] font-semibold text-slate-400">
                        লেখক
                      </span>

                      <span className="block truncate text-sm font-bold text-[#073b46]">
                        {authorName}
                      </span>
                    </div>
                  </div>

                  {blogId ? (
                    <Link
                      to={`/blogs/${blogId}`}
                      aria-label={`${blogTitle} পড়ুন`}
                      className="flex shrink-0 items-center gap-1.5 rounded-xl border-2 border-[#ff6542] bg-[#fff7f4] px-3.5 py-2.5 text-xs font-black text-[#ef5739] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff6542] hover:text-white hover:shadow-md focus:outline-none focus:ring-4 focus:ring-orange-100"
                    >
                      বিস্তারিত পড়ুন
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
                    </Link>
                  ) : (
                    <span className="rounded-xl bg-slate-100 px-3.5 py-2.5 text-xs font-bold text-slate-400">
                      অনুপলভ্য
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
      id="popular-blogs"
      className="relative isolate overflow-hidden bg-linear-to-b from-white via-[#fffdf7] to-[#f6fbfa] py-16 font-hind sm:py-20 lg:py-24"
    >
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-32 top-28 h-80 w-80 rounded-full bg-[#fff6cf] blur-3xl" />
        <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#dff4f1] blur-3xl" />

        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#073b46_1px,transparent_1px)] bg-size-[24px_24px]" />

        <motion.span
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [0, -10, 0],
                }
          }
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[7%] top-[45%] hidden h-4 w-4 rounded-full bg-[#ff6542]/30 lg:block"
        />

        <span className="absolute right-[8%] top-[23%] hidden h-6 w-6 rounded-full border-4 border-[#073b46]/10 lg:block" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section heading */}
        <div className="mb-12 grid items-center gap-8 lg:mb-16 lg:grid-cols-[1fr_340px]">
          <motion.div
            initial={{
              opacity: 0,
              x: shouldReduceMotion ? 0 : -35,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{ once: true }}
            transition={animationTransition}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#073b46]/8 bg-[#fff3bd] px-4 py-2 text-sm font-extrabold text-[#073b46] shadow-sm">
              <FiBookOpen className="text-[#ff6542]" />
              নির্বাচিত ব্লগ
            </div>

            <h2 className="font-baloo mt-5 max-w-3xl text-4xl font-black leading-[1.2] tracking-tight text-[#073b46] sm:text-5xl lg:text-[56px]">
              যে গল্পগুলো অনুপ্রেরণা জাগায়
              <span className="relative mt-1 inline-block text-[#ff6542] sm:ml-3 sm:mt-0">
                কোমল হৃদয়ে।
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: 0.45,
                  }}
                  className="absolute -bottom-2 left-0 h-1.5 w-full origin-left rounded-full bg-[#ffd36e]"
                />
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              শিক্ষার্থী, অভিভাবক ও পরিবারের জন্য তৈরি উপকারী নিবন্ধ, ইসলামি শিক্ষামূলক উপকরণ এবং অর্থবহ গল্পগুলো ঘুরে দেখুন।
            </p>
          </motion.div>

          {/* Bird illustration */}
          <motion.div
            initial={{
              opacity: 0,
              x: shouldReduceMotion ? 0 : 35,
              scale: shouldReduceMotion ? 1 : 0.9,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            viewport={{ once: true }}
            transition={{
              ...animationTransition,
              delay: 0.1,
            }}
            className="relative mx-auto hidden h-52 w-full max-w-85 lg:block"
          >
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: [0, -8, 0],
                      rotate: [-2, 2, -2],
                    }
              }
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-0 right-0 w-46.25"
            >
              <img
                src="/bird.png"
                alt=""
                aria-hidden="true"
                className="w-full object-contain drop-shadow-[0_14px_12px_rgba(7,59,70,0.16)]"
              />
            </motion.div>

            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: [0, -6, 0],
                    }
              }
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-0 top-4 rounded-3xl border-2 border-[#073b46] bg-[#fff3bd] px-5 py-4 shadow-[7px_7px_0_#073b46]"
            >
              <p className="text-sm font-extrabold text-[#ff6542]">
                পড়ুন ও আবিষ্কার করুন
              </p>

              <p className="mt-1 text-xl font-black text-[#073b46]">
                নতুন কিছু শিখুন
              </p>
            </motion.div>

            <motion.span
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: [1, 1.25, 1],
                      opacity: [0.5, 1, 0.5],
                    }
              }
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute right-8 top-5 h-4 w-4 rounded-full bg-[#ff6542]"
            />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {loading
            ? renderLoadingState()
            : error
              ? renderErrorState()
              : !blogs?.length
                ? renderEmptyState()
                : renderBlogs()}
        </AnimatePresence>

        {!loading && !error && blogs.length > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              y: shouldReduceMotion ? 0 : 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              ...animationTransition,
              delay: 0.2,
            }}
            className="mt-12 flex justify-center"
          >
            <Link
              to="/blogs"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#073b46] px-7 py-3.5 text-sm font-black text-white shadow-[0_12px_30px_rgba(7,59,70,0.2)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#0b4d59] hover:shadow-[0_18px_38px_rgba(7,59,70,0.25)] focus:outline-none focus:ring-4 focus:ring-[#073b46]/15"
            >
              সব ব্লগ দেখুন
              <FiArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PopularBlogs;