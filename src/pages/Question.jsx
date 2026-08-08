import React, { useEffect, useState, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link, useParams } from "react-router";
import api from "../utils/axios";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiBookmark,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiHelpCircle,
  FiMessageSquare,
  FiShare2,
  FiUser,
  FiArrowRight,
  FiBookOpen,
} from "react-icons/fi";
import { useLanguage } from "../hooks/useLanguage";

const Question = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const locale = language === "bn" ? "bn-BD" : "en-US";
  const formatNumber = (value) => Number(value || 0).toLocaleString(locale);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(null);
  const hasIncrementedView = useRef(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/qna/${id}`);

        if (res.data.success) {
          setQuestion(res.data.question);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching question:", error);
        toast.error(t("questionDetailsPage.loadFailed"));
      } finally {
        setLoading(false);
      }
    };

    const incrementView = async () => {
      if (hasIncrementedView.current) return;
      hasIncrementedView.current = true;

      try {
        await api.patch(`/qna/publishQuestion/${id}/view`);
      } catch (error) {
        console.error("Error incrementing question view:", error);
      }
    };

    if (id) {
      fetchQuestion();
      incrementView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    hasIncrementedView.current = false;
  }, [id]);

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.replace(/<[^>]*>/g, "").split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const roleColors = {
    admin: "bg-[#eeeafd] text-[#6e5bb4]",
    teacher: "bg-[#e7f2ff] text-[#3979a9]",
    student: "bg-[#e5f4ee] text-[#16745f]",
  };

  const supportedRoles = ["admin", "teacher", "student", "user", "scholar"];

  const getRoleLabel = (role, fallback = "user") => {
    const safeRole = supportedRoles.includes(role) ? role : fallback;
    return t(`questionDetailsPage.roles.${safeRole}`);
  };

  const firstAnswer = question?.answers?.[0];

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
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-[#1c8c73] border-t-[#1c8c73]" />
            </motion.div>

            <div className="absolute inset-3 flex items-center justify-center rounded-full bg-[#eef8f4]">
              <FiHelpCircle className="text-xl text-[#16745f]" />
            </div>
          </div>

          <h3 className="text-xl font-extrabold text-[#263c35]">
            {t("questionDetailsPage.loadingTitle")}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#6d7c76]">
            {t("questionDetailsPage.loadingDescription")}
          </p>
        </motion.div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="font-hind min-h-screen bg-[#f8f5ed] flex items-center justify-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-4xl border border-[#e6dfcf] bg-white p-8 text-center shadow-[0_20px_60px_rgba(45,75,65,0.10)]"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-[#fff0e8] text-[#d9704b]">
            <FiHelpCircle className="text-4xl" />
          </div>

          <h2 className="mt-5 text-2xl font-extrabold text-[#263c35]">
            {t("questionDetailsPage.notFoundTitle")}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#6d7c76]">
            {t("questionDetailsPage.notFoundDescription")}
          </p>

          <Link
            to="/qa"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#16745f] px-5 py-3 font-bold text-white transition hover:bg-[#115f4e]"
          >
            <FiArrowLeft />
            {t("questionDetailsPage.backToList")}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="font-hind min-h-screen overflow-hidden bg-[#f8f5ed] text-[#263c35]">
      <section className="relative overflow-hidden border-b border-[#e8dfce] pt-8">
        <div className="absolute inset-0 bg-linear-to-br from-[#fffaf0] via-[#f4fbf7] to-[#edf7f4]" />
        <div className="absolute -left-24 top-16 h-56 w-56 rounded-full bg-[#f6c85f]/18 blur-3xl" />
        <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-[#9d8be8]/16 blur-3xl" />

        <motion.div
          className="absolute left-[7%] top-28 hidden h-12 w-12 rotate-12 items-center justify-center rounded-2xl bg-[#ffe8dd] text-[#df7650] shadow-sm md:flex"
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
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mx-auto max-w-5xl"
          >
            <Link
              to="/qa"
              className="inline-flex items-center gap-2 rounded-full border border-[#d7e9e2] bg-white/80 px-3 py-1.5 text-xs font-bold text-[#16745f] shadow-sm backdrop-blur transition hover:bg-white"
            >
              <FiArrowLeft />
              {t("questionDetailsPage.allQuestions")}
            </Link>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef8f4] px-3 py-1.5 text-xs font-bold text-[#16745f]">
                <FiBookOpen />
                {question.category?.name ||
                  t("questionDetailsPage.uncategorized")}
              </span>

              {firstAnswer && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eeeafd] px-3 py-1.5 text-xs font-bold text-[#6e5bb4]">
                  <FiCheckCircle />
                  {t("questionDetailsPage.answeredBadge")}
                </span>
              )}
            </div>

            <h1 className="mt-4 max-w-5xl text-3xl font-extrabold leading-[1.2] text-[#263c35] sm:text-4xl lg:text-[3.15rem]">
              {question.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-[#71817b] sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <FiUser />
                {question.askedBy?.name ||
                  t("questionDetailsPage.unknownAuthor")}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <FiCalendar />
                {new Date(question.createdAt).toLocaleString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <FiClock />
                {t("questionDetailsPage.minRead", {
                  count: formatNumber(calculateReadTime(question.description)),
                })}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <FiEye />
                {t("questionDetailsPage.views", {
                  count: formatNumber(question.views / 2 || 0),
                })}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-7 sm:py-9">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_310px]">
            <main className="min-w-0">
              <motion.article
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden rounded-[1.7rem] border border-[#e5ded0] bg-white shadow-[0_18px_50px_rgba(45,75,65,0.08)]"
              >
                <div className="border-b border-[#eee8dc] bg-[#fffdf8] p-5 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0e8] text-lg font-extrabold text-[#d9704b]">
                        Q
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d9704b]">
                          {t("questionDetailsPage.questionLabel")}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[#687a73]">
                          <span>
                            {question.askedBy?.name ||
                              t("questionDetailsPage.unknownAuthor")}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                              roleColors[question.askedBy?.role] ||
                              "bg-[#edf1ee] text-[#62726b]"
                            }`}
                          >
                            {getRoleLabel(question.askedBy?.role)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e1e5e1] text-[#687a73] transition hover:border-[#8bcdbd] hover:bg-[#eef8f4] hover:text-[#16745f]"
                        aria-label={t("questionDetailsPage.bookmark")}
                      >
                        <FiBookmark />
                      </button>

                      <button
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e1e5e1] text-[#687a73] transition hover:border-[#efb49f] hover:bg-[#fff4ee] hover:text-[#d9704b]"
                        aria-label={t("questionDetailsPage.share")}
                      >
                        <FiShare2 />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-7 lg:p-8">
                  <div
                    className="prose prose-base max-w-none text-[#52645d] prose-headings:font-extrabold prose-headings:text-[#263c35] prose-p:leading-8 prose-a:text-[#16745f] prose-strong:text-[#314941] prose-li:leading-8 prose-blockquote:rounded-2xl prose-blockquote:border-[#ef8f6d] prose-blockquote:bg-[#fff7f2] prose-blockquote:px-5 prose-blockquote:py-3 sm:prose-lg"
                    dangerouslySetInnerHTML={{
                      __html: question.description,
                    }}
                  />
                </div>

                <div className="border-t border-[#eee8dc] bg-[#f8fbf9] p-5 sm:p-7 lg:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e5f4ee] text-lg font-extrabold text-[#16745f]">
                      A
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#16745f]">
                        {t("questionDetailsPage.scholarAnswerBadge")}
                      </p>
                      <h2 className="mt-1 text-xl font-extrabold text-[#263c35]">
                        {t("questionDetailsPage.answer")}
                      </h2>
                    </div>
                  </div>

                  {firstAnswer ? (
                    <>
                      <div
                        className="prose prose-base mt-5 max-w-none text-[#52645d] prose-headings:font-extrabold prose-headings:text-[#263c35] prose-p:leading-8 prose-a:text-[#16745f] prose-strong:text-[#314941] prose-li:leading-8 prose-blockquote:rounded-2xl prose-blockquote:border-[#8bcdbd] prose-blockquote:bg-white prose-blockquote:px-5 prose-blockquote:py-3 sm:prose-lg"
                        dangerouslySetInnerHTML={{
                          __html: firstAnswer.text,
                        }}
                      />

                      <div className="mt-6 flex flex-col gap-3 rounded-[1.2rem] border border-[#dfeae5] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16745f] font-extrabold text-white">
                            {firstAnswer.answeredBy?.name?.charAt(0) || "S"}
                          </div>

                          <div>
                            <p className="text-xs text-[#7a8983]">
                              {t("questionDetailsPage.answeredBy")}
                            </p>
                            <p className="font-extrabold text-[#263c35]">
                              {firstAnswer.answeredBy?.name ||
                                t("questionDetailsPage.scholar")}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                            roleColors[firstAnswer.answeredBy?.role] ||
                            "bg-[#e5f4ee] text-[#16745f]"
                          }`}
                        >
                          {getRoleLabel(
                            firstAnswer.answeredBy?.role,
                            "scholar",
                          )}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="mt-5 rounded-[1.2rem] border border-dashed border-[#cfded7] bg-white p-6 text-center">
                      <FiClock className="mx-auto text-3xl text-[#8aa49a]" />
                      <h3 className="mt-3 font-extrabold text-[#263c35]">
                        {t("questionDetailsPage.answerPendingTitle")}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#71817b]">
                        {t("questionDetailsPage.answerPendingDescription")}
                      </p>
                    </div>
                  )}
                </div>
              </motion.article>
            </main>

            <aside className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="rounded-[1.55rem] border border-[#e5ded0] bg-white p-5 shadow-[0_14px_40px_rgba(45,75,65,0.07)] lg:sticky lg:top-24"
              >
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8b77ce]">
                  {t("questionDetailsPage.askedBy")}
                </p>
                <h3 className="mt-1 text-lg font-extrabold text-[#263c35]">
                  {t("questionDetailsPage.asker")}
                </h3>

                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#16745f] to-[#5eb49d] text-xl font-extrabold text-white shadow-[0_8px_20px_rgba(22,116,95,0.20)]">
                    {question.askedBy?.name?.charAt(0) || "U"}
                  </div>

                  <div className="min-w-0">
                    <h4 className="truncate font-extrabold text-[#263c35]">
                      {question.askedBy?.name ||
                        t("questionDetailsPage.unknownAuthor")}
                    </h4>
                    <span
                      className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        roleColors[question.askedBy?.role] ||
                        "bg-[#edf1ee] text-[#62726b]"
                      }`}
                    >
                      {getRoleLabel(question.askedBy?.role)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-3 rounded-[1.15rem] bg-[#f8faf7] p-4">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[#71817b]">
                      {t("questionDetailsPage.category")}
                    </span>
                    <span className="text-right font-bold text-[#263c35]">
                      {question.category?.name ||
                        t("questionDetailsPage.uncategorized")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[#71817b]">
                      {t("questionDetailsPage.readTime")}
                    </span>
                    <span className="font-bold text-[#263c35]">
                      {t("questionDetailsPage.minutes", {
                        count: formatNumber(
                          calculateReadTime(question.description),
                        ),
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[#71817b]">
                      {t("questionDetailsPage.viewsLabel")}
                    </span>
                    <span className="font-bold text-[#263c35]">
                      {formatNumber(question.views / 2 || 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[#71817b]">
                      {t("questionDetailsPage.status")}
                    </span>
                    <span
                      className={`font-bold ${
                        firstAnswer ? "text-[#16745f]" : "text-[#d9704b]"
                      }`}
                    >
                      {firstAnswer
                        ? t("questionDetailsPage.answered")
                        : t("questionDetailsPage.awaiting")}
                    </span>
                  </div>
                </div>
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
                    {t("questionDetailsPage.ctaTitle")}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    {t("questionDetailsPage.ctaDescription")}
                  </p>

                  <Link
                    to="/qa/ask-question"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#f7c969] px-4 py-3 text-sm font-extrabold text-[#263c35] transition hover:-translate-y-0.5 hover:bg-[#ffda7f]"
                  >
                    {t("questionDetailsPage.askNow")}
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

export default Question;
