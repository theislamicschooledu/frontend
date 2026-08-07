import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiUser,
  FiSearch,
  FiBookOpen,
  FiCalendar,
  FiArrowUpRight,
  FiInbox,
  FiLoader,
  FiEye,
  FiFilter,
  FiX,
  FiTrendingUp,
  FiChevronRight,
  FiMail,
  FiClock,
} from "react-icons/fi";
import { FaFeatherAlt, FaRegLightbulb } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { Link } from "react-router";

const Blogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("latest");

  const fetchBlogs = async (selectedSort = sortBy) => {
    try {
      const res = await api.get("/blogs/publishedBlog", {
        params: {
          sort: selectedSort,
        },
      });
      setBlogPosts(res.data.blogs);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const fetchBlogCategory = async () => {
    try {
      const res = await api.get("/blogs/blogCategory");
      setCategories(res.data.categories);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchBlogs(sortBy), fetchBlogCategory()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const categoryCounts = blogPosts.reduce((acc, post) => {
    const catId = post.category?._id;
    if (catId) {
      acc[catId] = (acc[catId] || 0) + 1;
    }
    return acc;
  }, {});

  const filteredBlogs = blogPosts.filter((blog) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      blog.title.toLowerCase().includes(term) ||
      blog.content.toLowerCase().includes(term);

    const matchesCategory = selectedCategory
      ? blog.category?._id === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
  };

  const activeCategoryName = selectedCategory
    ? categories.find((category) => category._id === selectedCategory)?.name
    : null;

  const LoadingSpinner = () => (
    <div className="font-hind min-h-screen flex items-center justify-center bg-[#fffaf1] px-4">
      <div className="relative w-full max-w-sm overflow-hidden rounded-4xl border border-emerald-100 bg-white p-8 text-center shadow-[0_24px_70px_rgba(15,118,110,0.12)]">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-100/80" />
        <div className="absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-teal-100/80" />

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
          className="text-xl font-bold text-slate-800"
        >
          Loading Articles
        </motion.h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Please wait while we prepare the latest articles for you.
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

  const NoDataComponent = () => (
    <div className="font-hind min-h-screen flex items-center justify-center bg-[#fffaf1] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-md overflow-hidden rounded-4xl border border-orange-100 bg-white p-8 text-center shadow-[0_24px_70px_rgba(234,88,12,0.12)]"
      >
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-orange-100" />
        <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50">
          <FiInbox className="text-4xl text-orange-400" />
          <motion.div
            animate={{ rotate: [0, 12, -12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg"
          >
            <FiLoader />
          </motion.div>
        </div>

        <h2 className="relative text-2xl font-extrabold text-slate-800">
          No Articles Found
        </h2>
        <p className="relative mt-3 text-sm leading-6 text-slate-500">
          {searchTerm || selectedCategory
            ? "No articles match your current search and category filters."
            : "There are no published articles available at the moment. Please check back later."}
        </p>

        {(searchTerm || selectedCategory) && (
          <div className="relative mt-6">
            <button
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              <FiX />
              Clear Filters
            </button>
            <p className="mt-3 text-xs text-slate-400">
              {searchTerm && `Search: “${searchTerm}”`}
              {searchTerm && activeCategoryName && " • "}
              {activeCategoryName && `Category: “${activeCategoryName}”`}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );

  if (loading) return <LoadingSpinner />;

  if (!loading && blogPosts.length === 0) return <NoDataComponent />;

  return (
    <div className="font-hind min-h-screen overflow-hidden bg-[#fffaf1] text-slate-800">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-22.5 top-[28%] h-56 w-56 rounded-full bg-teal-100/40 blur-3xl" />
        <div className="absolute -right-20 top-[55%] h-64 w-64 rounded-full bg-orange-100/50 blur-3xl" />
      </div>

      {/* Compact Hero */}
      <section className="relative z-10 overflow-hidden border-b border-emerald-100/80 bg-[#edf9f4]">
        <div className="absolute -left-16 top-12 h-40 w-40 rounded-full border-28 border-white/60" />
        <div className="absolute -right-10 -top-8 h-44 w-44 rounded-full bg-[#ffd9c7]/70" />
        <div className="absolute -bottom-10.5 right-[22%] h-24 w-24 rotate-12 rounded-4xl bg-[#e6dcff]/70" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur">
              <FaFeatherAlt />
              Knowledge, Guidance & Inspiration
            </div>
            <h1 className="max-w-2xl text-3xl font-black leading-tight text-slate-900 sm:text-4xl lg:text-[2.8rem]">
              Islamic Parenting
              <span className="ml-2 text-emerald-700">Blog</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Thoughtful articles, practical guidance and meaningful lessons for
              families, learners and the wider community.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="relative"
          >
            <div className="rounded-3xl border border-white bg-white/90 p-2 shadow-[0_18px_50px_rgba(15,118,110,0.13)] backdrop-blur">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-[1.1rem] bg-slate-50 py-3.5 pl-12 pr-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Clear search"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
        <div className="mx-auto max-w-7xl">
          {/* Compact controls */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-6 flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white/90 p-3 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0e8] text-orange-600">
                <FiBookOpen />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-base font-extrabold text-slate-800 sm:text-lg">
                  {sortBy === "most-read"
                    ? "Most Read Articles"
                    : "Latest Articles"}
                </h2>
                <p className="text-xs text-slate-500">
                  {filteredBlogs.length} of {blogPosts.length} articles
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2.5 text-xs font-bold text-orange-700 transition hover:bg-orange-100"
                >
                  <FiX />
                  Clear
                </button>
              )}

              <div className="relative flex-1 sm:flex-none">
                <FiTrendingUp className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full min-w-40 appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm font-semibold text-slate-700 outline-none transition hover:bg-white focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="latest">সর্বশেষ</option>
                  <option value="most-read">সর্বাধিক পাঠিত</option>
                </select>
                <FiChevronRight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400" />
              </div>
            </div>
          </motion.div>

          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_330px]">
            {/* Blog Grid */}
            <main>
              {filteredBlogs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-4xl border border-dashed border-orange-200 bg-white p-9 text-center shadow-sm"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-3xl text-orange-400">
                    <FiInbox />
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold text-slate-800">
                    No Matching Articles
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Try another search term or select a different category to
                    explore more articles.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    <FiFilter />
                    Reset Filters
                  </button>
                </motion.div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  {filteredBlogs.map((post, index) => (
                    <motion.article
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.06 }}
                      whileHover={{ y: -4 }}
                      className="group flex h-full flex-col overflow-hidden rounded-[1.65rem] border border-slate-200/80 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.07)] transition duration-300 hover:border-emerald-200 hover:shadow-[0_22px_45px_rgba(15,118,110,0.11)]"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={post.cover}
                          alt={post.title}
                          className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/45 via-transparent to-transparent" />
                        <span className="absolute left-3 top-3 rounded-full border border-white/50 bg-white/90 px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur">
                          {post.category?.name || "N/A"}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <FiCalendar className="text-orange-500" />
                            {new Date(post.createdAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <FiEye className="text-purple-500" />
                            {post.views / 2 || 0} views
                          </span>
                        </div>

                        <h3 className="line-clamp-2 text-xl font-extrabold leading-snug text-slate-850 transition group-hover:text-emerald-700">
                          {post.title}
                        </h3>

                        <div
                          className="prose prose-sm mt-3 line-clamp-3 max-w-none text-sm leading-6 text-slate-600"
                          dangerouslySetInnerHTML={{
                            __html: post.content.slice(1, 120),
                          }}
                        />

                        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                          <div className="flex min-w-0 items-center gap-2 text-xs font-semibold text-slate-600">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ece7ff] text-purple-600">
                              <FiUser />
                            </span>
                            <span className="truncate">
                              {post.author?.name || "Unknown Author"}
                            </span>
                          </div>

                          <Link
                            to={`/blogs/${post._id}`}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                          >
                            Read More
                            <FiArrowUpRight />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </main>

            {/* Sidebar */}
            <aside className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="rounded-[1.7rem] border border-slate-200/80 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.06)] lg:sticky lg:top-24"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                      Explore
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-800">
                      Categories
                    </h3>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <FiFilter />
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                      selectedCategory === null
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/15"
                        : "bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <span>All Articles</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        selectedCategory === null
                          ? "bg-white/20 text-white"
                          : "bg-white text-slate-500"
                      }`}
                    >
                      {blogPosts.length}
                    </span>
                  </button>

                  {categories?.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => setSelectedCategory(category._id)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                        selectedCategory === category._id
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/15"
                          : "bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      <span className="truncate">{category.name}</span>
                      <span
                        className={`ml-3 rounded-full px-2 py-0.5 text-xs ${
                          selectedCategory === category._id
                            ? "bg-white/20 text-white"
                            : "bg-white text-slate-500"
                        }`}
                      >
                        {categoryCounts[category._id] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="relative overflow-hidden rounded-[1.7rem] bg-[#174f46] p-5 text-white shadow-[0_18px_40px_rgba(23,79,70,0.22)]"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#f8b48f]/40" />
                <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/10" />

                <div className="relative">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/12 text-xl">
                    <FaRegLightbulb />
                  </div>
                  <h3 className="text-xl font-extrabold">
                    Subscribe to Our Blog
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-emerald-50/80">
                    Receive useful articles and learning updates in your inbox.
                  </p>

                  <div className="mt-5 space-y-2.5">
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700" />
                      <input
                        type="email"
                        placeholder="Your email address"
                        className="w-full rounded-xl bg-white py-3 pl-10 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#f8b48f]"
                      />
                    </div>
                    <button className="w-full rounded-xl bg-[#f8b48f] py-3 text-sm font-extrabold text-[#5f2d16] transition hover:bg-[#ffc5a6]">
                      Subscribe
                    </button>
                  </div>

                  <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-50/60">
                    <FiClock />
                    Occasional updates. No spam.
                  </p>
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
