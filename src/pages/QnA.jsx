import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiUser,
  FiSearch,
  FiMessageSquare,
  FiCalendar,
  FiArrowUpRight,
  FiLoader,
  FiHelpCircle,
  FiEye,
  FiSliders,
  FiX,
  FiBookOpen,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";
import { Link } from "react-router";
import api from "../utils/axios";
import toast from "react-hot-toast";

const QnA = () => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("latest");

  const fetchQuestions = async (selectedSort = sortBy) => {
    try {
      const res = await api.get("/qna/publishQuestion", {
        params: {
          sort: selectedSort,
        },
      });

      if (res.data.success) {
        setQuestions(res.data.questions);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/qna/questionCategory");
      setCategories(res.data.categories);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchQuestions(sortBy), fetchCategories()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const categoryCounts = questions?.reduce((acc, post) => {
    const catId = post.category?._id;
    if (catId) {
      acc[catId] = (acc[catId] || 0) + 1;
    }
    return acc;
  }, {});

  const filteredQuestion = questions?.filter((blog) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      blog.title.toLowerCase().includes(term) ||
      blog.description.toLowerCase().includes(term);

    const matchesCategory = selectedCategory
      ? blog.category?._id === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
  };

  const hasActiveFilters = Boolean(searchTerm || selectedCategory);

  const selectedCategoryName = categories.find(
    (category) => category._id === selectedCategory,
  )?.name;

  const LoadingSpinner = () => (
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
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-[#1c8c73] border-t-[#1c8c73]" />
          </motion.div>

          <div className="absolute inset-3 flex items-center justify-center rounded-full bg-[#eef8f4]">
            <FiHelpCircle className="text-xl text-[#16745f]" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-[#263c35]">
          প্রশ্নগুলো লোড হচ্ছে
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#6d7c76]">
          আমাদের আলেমদের উত্তরসহ প্রকাশিত প্রশ্নগুলো প্রস্তুত করা হচ্ছে।
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

  const NoDataComponent = () => (
    <div className="font-hind min-h-screen bg-[#f8f5ed] flex items-center justify-center px-4 py-24">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-lg overflow-hidden rounded-4xl border border-[#e6dfcf] bg-white p-7 text-center shadow-[0_20px_60px_rgba(45,75,65,0.10)] sm:p-10"
      >
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#f7c969]/20" />
        <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-[#8bcdbd]/20" />

        <div className="relative">
          <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-[#eef8f4]">
            <FiHelpCircle className="text-4xl text-[#16806a]" />
            <motion.div
              className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#fff3df] text-[#dd7a50]"
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              <FiLoader />
            </motion.div>
          </div>

          <h2 className="text-2xl font-extrabold text-[#263c35]">
            কোনো প্রশ্ন পাওয়া যায়নি
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#6d7c76] sm:text-base">
            {hasActiveFilters
              ? "আপনার সার্চ বা নির্বাচিত ক্যাটাগরির সঙ্গে মিলছে এমন কোনো প্রশ্ন পাওয়া যায়নি।"
              : "এখনো কোনো প্রকাশিত প্রশ্ন নেই। আপনি চাইলে প্রথম প্রশ্নটি করতে পারেন।"}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8dfd9] bg-white px-5 py-3 font-semibold text-[#40554d] transition hover:border-[#ef8f6d] hover:text-[#d96f4a]"
              >
                <FiX />
                ফিল্টার মুছুন
              </button>
            )}

            <Link
              to="/qa/ask-question"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16745f] px-5 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(22,116,95,0.22)] transition hover:-translate-y-0.5 hover:bg-[#115f4e]"
            >
              <FiMessageSquare />
              প্রশ্ন করুন
            </Link>
          </div>

          {hasActiveFilters && (
            <p className="mt-5 text-xs leading-5 text-[#8a9691]">
              {searchTerm && `সার্চ: “${searchTerm}”`}
              {searchTerm && selectedCategoryName && " • "}
              {selectedCategoryName && `ক্যাটাগরি: “${selectedCategoryName}”`}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );

  if (loading) return <LoadingSpinner />;

  if (!loading && questions.length === 0) return <NoDataComponent />;

  return (
    <div className="font-hind min-h-screen overflow-hidden bg-[#f8f5ed] text-[#263c35]">
      <section className="relative overflow-hidden border-b border-[#e8dfce] pt-8">
        <div className="absolute inset-0 bg-linear-to-br from-[#fffaf0] via-[#f4fbf7] to-[#edf7f4]" />
        <div className="absolute -left-24 top-16 h-56 w-56 rounded-full bg-[#f6c85f]/18 blur-3xl" />
        <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-[#9d8be8]/16 blur-3xl" />

        <motion.div
          className="absolute left-[7%] top-24 hidden h-12 w-12 rotate-12 items-center justify-center rounded-2xl bg-[#ffe8dd] text-[#df7650] shadow-sm md:flex"
          animate={{ y: [0, -8, 0], rotate: [12, 18, 12] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <FiMessageSquare className="text-xl" />
        </motion.div>

        <motion.div
          className="absolute right-[8%] top-32 hidden h-11 w-11 -rotate-12 items-center justify-center rounded-full bg-[#e9e5ff] text-[#7865c9] shadow-sm lg:flex"
          animate={{ y: [0, 9, 0], rotate: [-12, -5, -12] }}
          transition={{ duration: 4.8, repeat: Infinity }}
        >
          <FiHelpCircle className="text-xl" />
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8 lg:pb-10">
          <div className="grid items-end gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d7e9e2] bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#16745f] shadow-sm backdrop-blur">
                <FiBookOpen />
                Islamic Knowledge Hub
              </span>

              <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-[1.15] text-[#263c35] sm:text-4xl lg:text-[3.15rem]">
                প্রশ্ন করুন, নির্ভরযোগ্য
                <span className="relative ml-2 inline-block text-[#16745f]">
                  উত্তর জানুন
                  <span className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 rounded-full bg-[#f7c969]/45" />
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#687a73] sm:text-base">
                ইসলাম, ইবাদত, পরিবার ও দৈনন্দিন জীবনের গুরুত্বপূর্ণ বিষয়ে
                প্রকাশিত প্রশ্ন ও আলেমদের উত্তর খুঁজে দেখুন।
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
                  placeholder="প্রশ্ন বা বিষয় লিখে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 w-full rounded-[1.1rem] bg-[#f8faf7] pl-11 pr-11 text-sm text-[#263c35] outline-none transition placeholder:text-[#9aa6a1] focus:bg-white focus:ring-2 focus:ring-[#8bcdbd]/45"
                />

                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#7d8c86] transition hover:bg-[#f0ebe2] hover:text-[#d96f4a]"
                    aria-label="Clear search"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-7 sm:py-9">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_310px]">
            <main className="min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 rounded-[1.4rem] border border-[#e5ded0] bg-white/90 p-3 shadow-[0_12px_35px_rgba(45,75,65,0.07)] sm:p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d97853]">
                      Question Collection
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-extrabold text-[#263c35] sm:text-2xl">
                        {sortBy === "most-read"
                          ? "সর্বাধিক পাঠিত প্রশ্ন"
                          : "সাম্প্রতিক প্রশ্ন"}
                      </h2>
                      <span className="rounded-full bg-[#eef8f4] px-2.5 py-1 text-xs font-bold text-[#16745f]">
                        {filteredQuestion?.length || 0}টি
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative">
                      <FiSliders className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7d8c86]" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="h-10 w-full appearance-none rounded-xl border border-[#dde4df] bg-[#f8faf7] py-2 pl-9 pr-9 text-sm font-semibold text-[#40554d] outline-none transition focus:border-[#8bcdbd] focus:ring-2 focus:ring-[#8bcdbd]/25 sm:w-auto"
                      >
                        <option value="latest">সর্বশেষ</option>
                        <option value="most-read">সর্বাধিক পাঠিত</option>
                      </select>
                    </div>

                    <Link
                      to="/qa/ask-question"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#16745f] px-4 text-sm font-bold text-white shadow-[0_10px_24px_rgba(22,116,95,0.20)] transition hover:-translate-y-0.5 hover:bg-[#115f4e]"
                    >
                      প্রশ্ন করুন
                      <FiMessageSquare />
                    </Link>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#eee8dc] pt-3">
                    <span className="text-xs font-semibold text-[#7a8882]">
                      Active filters:
                    </span>

                    {searchTerm && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#fff2e9] px-3 py-1 text-xs font-semibold text-[#cc6d48]">
                        Search: {searchTerm}
                      </span>
                    )}

                    {selectedCategoryName && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#eeeafd] px-3 py-1 text-xs font-semibold text-[#6e5bb4]">
                        {selectedCategoryName}
                      </span>
                    )}

                    <button
                      onClick={clearFilters}
                      className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-[#d46c49] transition hover:text-[#b94f2d]"
                    >
                      <FiX />
                      Clear
                    </button>
                  </div>
                )}
              </motion.div>

              {filteredQuestion?.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[1.7rem] border border-[#e5ded0] bg-white p-8 text-center shadow-[0_16px_45px_rgba(45,75,65,0.08)] sm:p-12"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eef8f4] text-[#16806a]">
                    <FiHelpCircle className="text-3xl" />
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold text-[#263c35]">
                    মিলছে এমন প্রশ্ন নেই
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#6d7c76]">
                    সার্চ শব্দ বা ক্যাটাগরি পরিবর্তন করে আবার চেষ্টা করুন, অথবা
                    নতুন একটি প্রশ্ন পাঠান।
                  </p>

                  <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8dfd9] px-5 py-2.5 font-semibold text-[#40554d] transition hover:border-[#ef8f6d] hover:text-[#d96f4a]"
                    >
                      <FiX />
                      ফিল্টার রিসেট
                    </button>

                    <Link
                      to="/qa/ask-question"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16745f] px-5 py-2.5 font-semibold text-white transition hover:bg-[#115f4e]"
                    >
                      নতুন প্রশ্ন করুন
                      <FiArrowRight />
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {filteredQuestion?.map((qna, index) => (
                    <motion.article
                      key={qna._id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: Math.min(index * 0.06, 0.32),
                      }}
                      whileHover={{ y: -3 }}
                      className="group relative overflow-hidden rounded-[1.55rem] border border-[#e5ded0] bg-white shadow-[0_14px_40px_rgba(45,75,65,0.07)] transition duration-300 hover:border-[#cfe5dc] hover:shadow-[0_20px_48px_rgba(45,75,65,0.12)]"
                    >
                      <div className="absolute inset-y-0 left-0 w-1.5 bg-linear-to-b from-[#ef8f6d] via-[#f4bd5a] to-[#6bb7a4]" />

                      <div className="p-5 pl-6 sm:p-6 sm:pl-8">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#eef8f4] px-3 py-1 text-xs font-bold text-[#16745f]">
                            <FiBookOpen />
                            {qna.category?.name || "N/A"}
                          </span>

                          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[#7e8c86]">
                            <span className="inline-flex items-center gap-1.5">
                              <FiCalendar />
                              {new Date(qna.createdAt).toLocaleString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <FiEye />
                              {qna.views / 2 || 0} views
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff0e8] text-sm font-extrabold text-[#da7651]">
                            Q
                          </span>
                          <h3 className="pt-1 text-lg font-extrabold leading-7 text-[#263c35] transition group-hover:text-[#16745f] sm:text-xl">
                            {qna.title}
                          </h3>
                        </div>

                        <div className="mt-4 rounded-[1.2rem] border border-[#e7eee9] bg-[#f8fbf9] p-4">
                          <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e5f4ee] text-sm font-extrabold text-[#16745f]">
                              A
                            </span>

                            <div className="min-w-0 flex-1">
                              <div
                                className="prose prose-sm max-w-none text-[#65756f] prose-p:m-0 prose-p:leading-7 prose-strong:text-[#314941]"
                                dangerouslySetInnerHTML={{
                                  __html:
                                    qna.answers[0]?.text?.slice(0, 120) ||
                                    "No answer yet",
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 border-t border-[#eee8dc] pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-2 text-xs text-[#71817b] sm:text-sm">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eeeafd] text-[#7865c9]">
                              {qna.answers[0] ? <FiCheckCircle /> : <FiUser />}
                            </div>

                            <span>
                              {qna.answers[0] ? (
                                <>
                                  উত্তর দিয়েছেন{" "}
                                  <strong className="font-bold text-[#16745f]">
                                    {qna.answers[0]?.answeredBy?.name ||
                                      "Scholar"}
                                  </strong>
                                </>
                              ) : (
                                "আলেমের উত্তরের অপেক্ষায়"
                              )}
                            </span>
                          </div>

                          <Link
                            to={`/qa/${qna._id}`}
                            className="inline-flex items-center gap-2 self-start text-sm font-extrabold text-[#d9704b] transition hover:gap-3 hover:text-[#b95434] sm:self-auto"
                          >
                            বিস্তারিত পড়ুন
                            <FiArrowUpRight />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </main>

            <aside className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="rounded-[1.55rem] border border-[#e5ded0] bg-white p-5 shadow-[0_14px_40px_rgba(45,75,65,0.07)] lg:sticky lg:top-24"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8b77ce]">
                      Browse Topics
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold text-[#263c35]">
                      ক্যাটাগরি
                    </h3>
                  </div>

                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eeeafd] text-[#7865c9]">
                    <FiBookOpen />
                  </span>
                </div>

                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                      selectedCategory === null
                        ? "bg-[#16745f] text-white shadow-[0_8px_20px_rgba(22,116,95,0.16)]"
                        : "text-[#53665e] hover:bg-[#f3f7f4] hover:text-[#16745f]"
                    }`}
                  >
                    <span>সব প্রশ্ন</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        selectedCategory === null
                          ? "bg-white/18 text-white"
                          : "bg-[#edf1ee] text-[#708078]"
                      }`}
                    >
                      {questions?.length || 0}
                    </span>
                  </button>

                  {categories?.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => setSelectedCategory(category._id)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                        selectedCategory === category._id
                          ? "bg-[#16745f] text-white shadow-[0_8px_20px_rgba(22,116,95,0.16)]"
                          : "text-[#53665e] hover:bg-[#f3f7f4] hover:text-[#16745f]"
                      }`}
                    >
                      <span className="line-clamp-1">{category.name}</span>
                      <span
                        className={`ml-3 rounded-full px-2 py-0.5 text-xs ${
                          selectedCategory === category._id
                            ? "bg-white/18 text-white"
                            : "bg-[#edf1ee] text-[#708078]"
                        }`}
                      >
                        {categoryCounts[category._id] || 0}
                      </span>
                    </button>
                  ))}
                </div>

                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#e0ded5] py-2.5 text-sm font-bold text-[#d46c49] transition hover:border-[#ef8f6d] hover:bg-[#fff7f2]"
                  >
                    <FiX />
                    ক্যাটাগরি মুছুন
                  </button>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="relative overflow-hidden rounded-[1.55rem] bg-[#263c35] p-6 text-white shadow-[0_18px_45px_rgba(38,60,53,0.20)]"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#f7c969]/18" />
                <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-[#ef8f6d]/12" />

                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f7c969]">
                    <FiMessageSquare className="text-xl" />
                  </div>

                  <h3 className="mt-5 text-xl font-extrabold">
                    আপনার প্রশ্নটি খুঁজে পাচ্ছেন না?
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    আপনার প্রশ্নটি পাঠান। যাচাইয়ের পর আমাদের আলেমরা উত্তর প্রদান
                    করবেন।
                  </p>

                  <Link
                    to="/qa/ask-question"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#f7c969] px-4 py-3 text-sm font-extrabold text-[#263c35] transition hover:-translate-y-0.5 hover:bg-[#ffda7f]"
                  >
                    এখনই প্রশ্ন করুন
                    <FiArrowRight />
                  </Link>
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QnA;
