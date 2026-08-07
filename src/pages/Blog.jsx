import React, { useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiUser,
  FiCalendar,
  FiClock,
  FiArrowLeft,
  FiShare2,
  FiBookmark,
  FiEye,
  FiBookOpen,
  FiMail,
  FiArrowUpRight,
} from "react-icons/fi";
import { FaFeatherAlt, FaQuoteLeft } from "react-icons/fa";
import { useParams, Link } from "react-router";
import toast from "react-hot-toast";
import api from "../utils/axios";

const roleColors = {
  admin: "border-[#ded2ff] bg-[#f2edff] text-[#7654c8]",
  teacher: "border-[#c4e8df] bg-[#e8f8f3] text-[#08736e]",
  student: "border-[#ffd5c5] bg-[#fff0e9] text-[#d95635]",
};

const floatingDecorations = [
  { left: "4%", top: "18%", size: 14, delay: 0.2, duration: 6.5 },
  { left: "17%", top: "70%", size: 10, delay: 1.1, duration: 7.2 },
  { left: "48%", top: "20%", size: 12, delay: 0.7, duration: 6.8 },
  { left: "76%", top: "76%", size: 15, delay: 1.5, duration: 7.4 },
  { left: "92%", top: "28%", size: 11, delay: 0.9, duration: 6.9 },
];

const Blog = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(null);
  const hasIncrementedView = useRef(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/blogs/publishedBlog/${id}`);

        if (response.data.success) {
          setBlog(response.data.blogs);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    const incrementView = async () => {
      if (hasIncrementedView.current) return;
      hasIncrementedView.current = true;

      try {
        await api.patch(`/blogs/publishedBlog/${id}/view`);
      } catch (error) {
        console.error("Error incrementing blog view:", error);
      }
    };

    if (id) {
      fetchBlog();
      incrementView();
    }
  }, [id]);

  useEffect(() => {
    hasIncrementedView.current = false;
  }, [id]);

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="font-hind flex min-h-screen items-center justify-center bg-[#fffaf1] px-4">
        <div className="relative w-full max-w-sm overflow-hidden rounded-4xl border border-emerald-100 bg-white p-8 text-center shadow-[0_24px_70px_rgba(15,118,110,0.12)]">
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#ffe0d0]" />
          <div className="absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-emerald-100/80" />

          <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-11 w-11 rounded-full border-[3px] border-emerald-100 border-t-emerald-600"
            />
            <FiBookOpen className="absolute text-lg text-emerald-700" />
          </div>

          <motion.h3
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-extrabold text-slate-800"
          >
            Loading Article
          </motion.h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Please wait while we prepare the article for you.
          </p>

          <div className="mt-5 flex justify-center gap-1.5">
            {[0, 1, 2].map((item) => (
              <motion.span
                key={item}
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 0.7,
                  repeat: Infinity,
                  delay: item * 0.15,
                }}
                className="h-2 w-2 rounded-full bg-emerald-500"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="font-hind flex min-h-screen items-center justify-center bg-[#fffaf1] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative w-full max-w-md overflow-hidden rounded-4xl border border-orange-100 bg-white p-8 text-center shadow-[0_24px_70px_rgba(234,88,12,0.12)]"
        >
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-orange-100" />
          <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50">
            <FiBookOpen className="text-4xl text-orange-400" />
          </div>
          <h2 className="relative text-2xl font-extrabold text-slate-800">
            Blog Post Not Found
          </h2>
          <p className="relative mt-3 text-sm leading-6 text-slate-500">
            The article may have been removed or is no longer available.
          </p>
          <Link
            to="/blogs"
            className="relative mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            <FiArrowLeft />
            Back to Blogs
          </Link>
        </motion.div>
      </div>
    );
  }

  const authorRole = blog.author?.role;
  const formattedDate = new Date(blog.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const readTime = calculateReadTime(blog.content);

  return (
    <div className="font-hind min-h-screen overflow-hidden bg-[#fffaf1] text-slate-800">
      {/* Decorative page background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-25 top-[30%] h-64 w-64 rounded-full bg-teal-100/40 blur-3xl" />
        <div className="absolute -right-25 top-[62%] h-72 w-72 rounded-full bg-orange-100/50 blur-3xl" />
      </div>

      {/* Compact Article Hero */}
      <section className="relative z-10 overflow-hidden border-b border-emerald-100/80 bg-[#edf9f4]">
        <div className="absolute -left-16 top-10 h-40 w-40 rounded-full border-28 border-white/60" />
        <div className="absolute -right-12 -top-10 h-48 w-48 rounded-full bg-[#ffd9c7]/75" />
        <div className="absolute -bottom-13 right-[24%] h-24 w-24 rotate-12 rounded-4xl bg-[#e6dcff]/70" />

        {floatingDecorations.map((item, index) => (
          <motion.span
            key={index}
            className="absolute rounded-full bg-emerald-500/15"
            style={{
              left: item.left,
              top: item.top,
              width: item.size,
              height: item.size,
            }}
            animate={{ y: [0, -8, 0], scale: [1, 1.12, 1] }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
            }}
          />
        ))}

        <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-5xl"
          >
            <Link
              to="/blogs"
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/75 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur transition hover:bg-white hover:text-emerald-800"
            >
              <FiArrowLeft />
              Back to Blogs
            </Link>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                <FaFeatherAlt />
                {blog.category?.name || "Article"}
              </span>
              <span className="rounded-full border border-white bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 backdrop-blur">
                Islamic Parenting Blog
              </span>
            </div>

            <h1 className="max-w-5xl text-3xl font-black leading-[1.2] text-slate-900 sm:text-4xl lg:text-[3rem]">
              {blog.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600 sm:text-sm">
              <div className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-3 py-2 backdrop-blur">
                <FiUser className="text-emerald-700" />
                {blog.author?.name || "Unknown Author"}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-3 py-2 backdrop-blur">
                <FiCalendar className="text-[#d95635]" />
                {formattedDate}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-3 py-2 backdrop-blur">
                <FiClock className="text-[#7654c8]" />
                {readTime} min read
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-3 py-2 backdrop-blur">
                <FiEye className="text-amber-600" />
                {blog.views / 2 || 0} views
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="relative z-10 px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-11">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <main className="min-w-0">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="overflow-hidden rounded-[1.75rem] border border-emerald-100/80 bg-white shadow-[0_20px_60px_rgba(15,118,110,0.10)] sm:rounded-4xl"
            >
              {/* Featured Image */}
              <div className="relative overflow-hidden bg-slate-100">
                {blog.cover ? (
                  <img
                    src={blog.cover}
                    alt={blog.title}
                    className="h-56 w-full object-cover sm:h-80 lg:h-107.5"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-linear-to-br from-emerald-100 via-[#fff4df] to-[#eee8ff] sm:h-80 lg:h-107.5">
                    <FiBookOpen className="text-5xl text-emerald-600/50" />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/25 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-slate-950/35 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md sm:bottom-5 sm:left-5">
                  <FiBookOpen />
                  Featured Article
                </div>
              </div>

              {/* Article Body */}
              <div className="p-4 sm:p-7 lg:p-10">
                <div className="mb-7 flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-700 font-black text-white shadow-sm">
                      {blog.author?.name?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-slate-800">
                        {blog.author?.name || "Unknown Author"}
                      </p>
                      <span
                        className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
                          roleColors[authorRole] ||
                          "border-slate-200 bg-slate-100 text-slate-600"
                        }`}
                      >
                        {authorRole || "Author"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                      aria-label="Bookmark article"
                    >
                      <FiBookmark />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                      aria-label="Share article"
                    >
                      <FiShare2 />
                    </button>
                  </div>
                </div>

                <div className="mb-8 flex gap-3 rounded-2xl border border-[#e4dafd] bg-[#f7f3ff] p-4 text-sm leading-6 text-slate-600 sm:p-5">
                  <FaQuoteLeft className="mt-1 shrink-0 text-lg text-[#7654c8]" />
                  <p>
                    Explore this article carefully and reflect on the practical
                    lessons that can support meaningful learning and family
                    life.
                  </p>
                </div>

                <div
                  className="prose prose-slate max-w-none text-[15px] leading-8 prose-headings:font-extrabold prose-headings:leading-tight prose-headings:text-slate-900 prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-xl prose-p:my-5 prose-p:leading-8 prose-a:font-bold prose-a:text-emerald-700 hover:prose-a:text-emerald-800 prose-strong:text-slate-900 prose-ul:my-5 prose-ol:my-5 prose-li:my-2 prose-li:text-slate-600 prose-img:my-7 prose-img:rounded-2xl prose-img:shadow-lg prose-blockquote:my-7 prose-blockquote:rounded-2xl prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50 prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:not-italic prose-blockquote:text-slate-700 sm:text-base sm:leading-8"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-[#f1faf6] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                      Continue Exploring
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-800">
                      Read more thoughtful articles
                    </h3>
                  </div>
                  <Link
                    to="/blogs"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
                  >
                    Browse Blogs
                    <FiArrowUpRight />
                  </Link>
                </div>
              </div>
            </motion.article>
          </main>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_50px_rgba(15,118,110,0.09)]"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-100/70" />
              <div className="relative">
                <div className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                  <FiUser />
                  About the Author
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.35rem] bg-linear-to-br from-emerald-500 to-teal-700 text-xl font-black text-white shadow-lg">
                    {blog.author?.name?.charAt(0) || "U"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-extrabold text-slate-800">
                      {blog.author?.name || "Unknown Author"}
                    </h3>
                    <span
                      className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
                        roleColors[authorRole] ||
                        "border-slate-200 bg-slate-100 text-slate-600"
                      }`}
                    >
                      {authorRole || "Author"}
                    </span>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-600">
                  Passionate about Islamic parenting and child development.
                  Sharing insights and experiences to help parents nurture their
                  children with Islamic values.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="rounded-[1.75rem] border border-[#ded2ff] bg-[#f7f3ff] p-5"
            >
              <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#7654c8]">
                <FiBookOpen />
                Article Details
              </div>
              <div className="space-y-2.5">
                {[
                  {
                    icon: FiCalendar,
                    label: "Published",
                    value: formattedDate,
                  },
                  {
                    icon: FiClock,
                    label: "Read time",
                    value: `${readTime} min`,
                  },
                  {
                    icon: FiEye,
                    label: "Views",
                    value: `${blog.views / 2 || 0}`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 rounded-xl bg-white/75 px-3 py-2.5"
                  >
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <item.icon className="text-[#7654c8]" />
                      {item.label}
                    </span>
                    <span className="text-right text-xs font-extrabold text-slate-700">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.36 }}
              className="relative overflow-hidden rounded-[1.75rem] bg-[#08736e] p-5 text-white shadow-[0_20px_55px_rgba(8,115,110,0.22)]"
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-[#ffb990]/20" />
              <div className="relative">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                  <FiMail className="text-xl" />
                </div>
                <h3 className="text-xl font-extrabold">
                  Enjoying this article?
                </h3>
                <p className="mt-2 text-sm leading-6 text-emerald-50/85">
                  Subscribe to receive more thoughtful parenting insights and
                  educational articles.
                </p>
                <div className="mt-5 space-y-2.5">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-[#ffd2b8]"
                  />
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#ffb88f] px-4 py-3 text-sm font-black text-[#66301d] transition hover:bg-[#ffc7a6]"
                  >
                    Subscribe
                    <FiArrowUpRight />
                  </button>
                </div>
              </div>
            </motion.div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Blog;
