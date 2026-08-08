import React, { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import {
  FiArrowLeft,
  FiBook,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiHelpCircle,
  FiInfo,
  FiSend,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { useNavigate } from "react-router";
import { useLanguage } from "../hooks/useLanguage";

const AskQuestion = () => {
  const { language, t } = useLanguage();
  const locale = language === "bn" ? "bn-BD" : "en-US";
  const formatNumber = (value) => Number(value || 0).toLocaleString(locale);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/qna/questionCategory");
      setCategories(res.data.categories);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          t("askQuestionPage.categoriesLoadFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: t("askQuestionPage.editorPlaceholder"),
        modules: {
          toolbar: [["bold", "italic", "underline", "strike"], ["clean"]],
        },
      });
    }
  }, [t]);

  useEffect(() => {
    if (quillRef.current?.root) {
      quillRef.current.root.dataset.placeholder = t(
        "askQuestionPage.editorPlaceholder",
      );
    }
  }, [language, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editorContent = quillRef.current.root.innerHTML;
    const editorText = quillRef.current.getText().trim();

    if (!title.trim() || !editorText || !selectedCategory) {
      toast.error(t("askQuestionPage.validationRequired"));
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", JSON.stringify(editorContent));
      formData.append("category", selectedCategory);

      const res = await api.post("/qna", formData);

      if (res.data.success) {
        toast.success(t("askQuestionPage.submitted"));
        navigate("/qa");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || t("askQuestionPage.submitFailed"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const guidelines = [
    t("askQuestionPage.guidelines.context"),
    t("askQuestionPage.guidelines.respectful"),
    t("askQuestionPage.guidelines.oneTopic"),
    t("askQuestionPage.guidelines.privacy"),
  ];

  const tips = [
    t("askQuestionPage.tips.context"),
    t("askQuestionPage.tips.attempts"),
    t("askQuestionPage.tips.guidance"),
  ];

  return (
    <div className="font-hind min-h-screen overflow-hidden bg-[#f8f5ed] text-[#263c35]">
      {/* Compact Hero */}
      <section className="relative overflow-hidden border-b border-[#e8dfce] pt-8">
        <div className="absolute inset-0 bg-linear-to-br from-[#fffaf0] via-[#f4fbf7] to-[#edf7f4]" />
        <div className="absolute -left-24 top-12 h-56 w-56 rounded-full bg-[#f6c85f]/18 blur-3xl" />
        <div className="absolute -right-20 top-8 h-64 w-64 rounded-full bg-[#9d8be8]/16 blur-3xl" />

        <motion.div
          className="absolute left-[7%] top-28 hidden h-12 w-12 rotate-12 items-center justify-center rounded-2xl bg-[#ffe8dd] text-[#df7650] shadow-sm md:flex"
          animate={{ y: [0, -8, 0], rotate: [12, 18, 12] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <FiEdit3 className="text-xl" />
        </motion.div>

        <motion.div
          className="absolute right-[8%] top-28 hidden h-11 w-11 -rotate-12 items-center justify-center rounded-full bg-[#e9e5ff] text-[#7865c9] shadow-sm lg:flex"
          animate={{ y: [0, 9, 0], rotate: [-12, -5, -12] }}
          transition={{ duration: 4.8, repeat: Infinity }}
        >
          <FiHelpCircle className="text-xl" />
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8 lg:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mx-auto max-w-4xl text-center"
          >
            <button
              type="button"
              onClick={() => navigate("/qa")}
              className="inline-flex items-center gap-2 rounded-full border border-[#d7e9e2] bg-white/80 px-3 py-1.5 text-xs font-bold text-[#16745f] shadow-sm backdrop-blur transition hover:bg-white"
            >
              <FiArrowLeft />
              {t("askQuestionPage.backAll")}
            </button>

            <div className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full bg-[#eef8f4] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#16745f]">
              <FiHelpCircle />
              {t("askQuestionPage.badge")}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-[1.18] text-[#263c35] sm:text-4xl lg:text-[3.1rem]">
              {t("askQuestionPage.headingPrefix")}
              <span className="relative ml-2 inline-block text-[#16745f]">
                {t("askQuestionPage.headingAccent")}
                <span className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 rounded-full bg-[#f7c969]/45" />
              </span>
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#687a73] sm:text-base">
              {t("askQuestionPage.heroDescription")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-7 sm:py-9">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_310px]">
            {/* Main Form */}
            <motion.main
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="min-w-0"
            >
              <div className="overflow-hidden rounded-[1.7rem] border border-[#e5ded0] bg-white shadow-[0_18px_50px_rgba(45,75,65,0.08)]">
                <div className="border-b border-[#eee8dc] bg-[#fffdf8] px-5 py-4 sm:px-7 sm:py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0e8] text-[#d9704b]">
                      <FiEdit3 className="text-xl" />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d9704b]">
                        {t("askQuestionPage.formBadge")}
                      </p>
                      <h2 className="mt-1 text-xl font-extrabold text-[#263c35] sm:text-2xl">
                        {t("askQuestionPage.formTitle")}
                      </h2>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-5 sm:p-7 lg:p-8">
                  {/* Category Selection */}
                  <div>
                    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <label className="flex items-center gap-2 text-base font-extrabold text-[#263c35] sm:text-lg">
                          <FiBook className="text-[#16745f]" />
                          {t("askQuestionPage.categoryLabel")}
                        </label>
                        <p className="mt-1 text-xs leading-5 text-[#7b8983] sm:text-sm">
                          {t("askQuestionPage.categoryHelp")}
                        </p>
                      </div>

                      {selectedCategory && (
                        <span className="w-fit rounded-full bg-[#e5f4ee] px-3 py-1 text-xs font-bold text-[#16745f]">
                          {t("askQuestionPage.selected")}
                        </span>
                      )}
                    </div>

                    {loading ? (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <div
                            key={index}
                            className="h-12 animate-pulse rounded-xl bg-[#f0f2ed]"
                          />
                        ))}
                      </div>
                    ) : categories.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                        {categories.map((category) => {
                          const isSelected = selectedCategory === category._id;

                          return (
                            <motion.button
                              key={category._id}
                              type="button"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedCategory(category._id)}
                              className={`group flex min-h-12 items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-bold transition ${
                                isSelected
                                  ? "border-[#16745f] bg-[#eaf6f1] text-[#16745f] shadow-[0_8px_20px_rgba(22,116,95,0.10)]"
                                  : "border-[#e0e5e0] bg-[#fafbf8] text-[#53665e] hover:border-[#8bcdbd] hover:bg-[#f2f9f6] hover:text-[#16745f]"
                              }`}
                            >
                              <span className="line-clamp-2">
                                {category.name}
                              </span>

                              <span
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition ${
                                  isSelected
                                    ? "bg-[#16745f] text-white"
                                    : "bg-[#edf1ee] text-[#9aa6a1] group-hover:bg-[#dff0e9] group-hover:text-[#16745f]"
                                }`}
                              >
                                <FiCheckCircle className="text-sm" />
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-[#d9dfda] bg-[#fafbf8] p-5 text-center text-sm text-[#71817b]">
                        {t("askQuestionPage.noCategories")}
                      </div>
                    )}
                  </div>

                  {/* Question Title */}
                  <div className="mt-7">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <label
                        htmlFor="question-title"
                        className="flex items-center gap-2 text-base font-extrabold text-[#263c35] sm:text-lg"
                      >
                        <FiHelpCircle className="text-[#d9704b]" />
                        {t("askQuestionPage.questionTitle")}
                      </label>

                      <span
                        className={`text-xs font-bold ${
                          title.length >= 180
                            ? "text-[#d9704b]"
                            : "text-[#8b9893]"
                        }`}
                      >
                        {formatNumber(title.length)}/{formatNumber(200)}
                      </span>
                    </div>

                    <input
                      id="question-title"
                      type="text"
                      placeholder={t("askQuestionPage.titlePlaceholder")}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-13 w-full rounded-xl border border-[#dfe5e0] bg-[#fafbf8] px-4 text-base font-medium text-[#263c35] outline-none transition placeholder:text-[#9ba6a2] focus:border-[#8bcdbd] focus:bg-white focus:ring-4 focus:ring-[#8bcdbd]/15"
                      maxLength={200}
                    />
                  </div>

                  {/* Description */}
                  <div className="mt-7">
                    <div className="mb-3">
                      <label className="flex items-center gap-2 text-base font-extrabold text-[#263c35] sm:text-lg">
                        <FiEdit3 className="text-[#7865c9]" />
                        {t("askQuestionPage.descriptionLabel")}
                      </label>
                      <p className="mt-1 text-xs leading-5 text-[#7b8983] sm:text-sm">
                        {t("askQuestionPage.descriptionHelp")}
                      </p>
                    </div>

                    <div className="overflow-hidden rounded-[1.25rem] border border-[#dfe5e0] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] [&_.ql-container.ql-snow]:min-h-64 [&_.ql-container.ql-snow]:border-0 [&_.ql-editor]:min-h-64 [&_.ql-editor]:p-4 [&_.ql-editor]:text-base [&_.ql-editor]:leading-8 [&_.ql-editor]:text-[#52645d] [&_.ql-editor.ql-blank:before]:left-4 [&_.ql-editor.ql-blank:before]:right-4 [&_.ql-editor.ql-blank:before]:text-[#9ba6a2] [&_.ql-toolbar.ql-snow]:border-0 [&_.ql-toolbar.ql-snow]:border-b [&_.ql-toolbar.ql-snow]:border-[#e6ebe7] [&_.ql-toolbar.ql-snow]:bg-[#f8faf7]">
                      <div ref={editorRef} />
                    </div>
                  </div>

                  {/* Notice */}
                  <div className="mt-6 flex items-start gap-3 rounded-[1.15rem] border border-[#f0dfba] bg-[#fff9eb] p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f7c969]/25 text-[#b27b16]">
                      <FiInfo />
                    </div>
                    <p className="text-xs leading-6 text-[#78694b] sm:text-sm">
                      {t("askQuestionPage.notice")}
                    </p>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ y: submitting ? 0 : -2 }}
                    whileTap={{ scale: submitting ? 1 : 0.99 }}
                    className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#16745f] px-6 text-base font-extrabold text-white shadow-[0_14px_30px_rgba(22,116,95,0.22)] transition hover:bg-[#115f4e] disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    {submitting ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                        {t("askQuestionPage.submitting")}
                      </>
                    ) : (
                      <>
                        <FiSend />
                        {t("askQuestionPage.submit")}
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.main>

            {/* Sidebar */}
            <aside className="space-y-5">
              <div className="space-y-5 lg:sticky lg:top-24">
                <motion.div
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.12 }}
                  className="rounded-[1.55rem] border border-[#e5ded0] bg-white p-5 shadow-[0_14px_40px_rgba(45,75,65,0.07)]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8b77ce]">
                        {t("askQuestionPage.guidelinesBadge")}
                      </p>
                      <h3 className="mt-1 text-lg font-extrabold text-[#263c35]">
                        {t("askQuestionPage.guidelinesTitle")}
                      </h3>
                    </div>

                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eeeafd] text-[#7865c9]">
                      <FiShield />
                    </span>
                  </div>

                  <ul className="mt-5 space-y-3.5">
                    {guidelines.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-6 text-[#63736c]"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e5f4ee] text-[#16745f]">
                          <FiCheckCircle className="text-xs" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.22 }}
                  className="relative overflow-hidden rounded-[1.55rem] bg-[#263c35] p-6 text-white shadow-[0_18px_45px_rgba(38,60,53,0.20)]"
                >
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#f7c969]/18" />
                  <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-[#ef8f6d]/12" />

                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f7c969]">
                      <FiUsers className="text-xl" />
                    </div>

                    <h3 className="mt-5 text-xl font-extrabold">
                      {t("askQuestionPage.tipsTitle")}
                    </h3>

                    <div className="mt-4 space-y-3">
                      {tips.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-3 text-sm leading-6 text-white/75"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f7c969]" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.32 }}
                  className="rounded-[1.55rem] border border-[#e5ded0] bg-white p-5 shadow-[0_14px_40px_rgba(45,75,65,0.07)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0e8] text-[#d9704b]">
                      <FiClock />
                    </span>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d9704b]">
                        {t("askQuestionPage.responseTimeBadge")}
                      </p>
                      <h3 className="mt-1 font-extrabold text-[#263c35]">
                        {t("askQuestionPage.responseTimeTitle")}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[1.15rem] bg-[#f8faf7] p-4 text-center">
                    <div className="text-3xl font-extrabold text-[#16745f]">
                      {t("askQuestionPage.responseTimeValue")}
                    </div>
                    <p className="mt-1 text-xs font-semibold text-[#71817b]">
                      {t("askQuestionPage.averageResponseTime")}
                    </p>
                  </div>

                  <p className="mt-3 text-xs leading-6 text-[#7b8983]">
                    {t("askQuestionPage.responseTimeNote")}
                  </p>
                </motion.div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AskQuestion;
