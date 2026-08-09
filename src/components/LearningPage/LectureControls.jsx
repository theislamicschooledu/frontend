import React from "react";
import {
  FiCheck,
  FiClock,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useLanguage } from "../../hooks/useLanguage";

const LectureControls = ({
  currentLecture,
  course,
  currentIndex,
  lectures,
  isCurrentLectureCompleted,
  markingComplete,
  toggleLectureCompletion,
  openVideoInNewTab,
  hasPrevLecture,
  hasNextLecture,
  goToPrevLecture,
  goToNextLecture,
  progress,
  completedLectures,
  isVideoPlayable,
}) => {
  const { language, t } = useLanguage();
  const locale = language === "bn" ? "bn-BD" : "en-US";
  const formatNumber = (value) => Number(value || 0).toLocaleString(locale);

  return (
    <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/40">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg lg:text-2xl font-semibold truncate">
            {currentLecture?.title || t("learningPage.controls.selectLecture")}
          </h2>
          <div className="text-xs text-gray-400 mt-1 flex items-center gap-3 flex-wrap">
            <span>
              {t("learningPage.controls.lectureOf", {
                current: formatNumber(Math.max(currentIndex + 1, 0)),
                total: formatNumber(lectures.length),
                category:
                  course.category?.name || t("learningPage.common.uncategorized"),
              })}
            </span>
            {currentLecture?.duration && (
              <span className="flex items-center gap-1">
                <FiClock size={12} />
                {t("learningPage.controls.minutes", {
                  count: formatNumber(currentLecture.duration),
                })}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 lg:mt-0 flex items-center gap-3 flex-wrap">
          {isVideoPlayable(currentLecture?.videoUrl) && (
            <button
              onClick={() => toggleLectureCompletion(currentLecture._id)}
              disabled={markingComplete}
              className={`px-4 py-2 rounded-xl shadow-md transition-all duration-200 ${
                isCurrentLectureCompleted
                  ? "bg-linear-to-r from-green-600/20 to-emerald-600/20 text-green-300 border border-green-600/30"
                  : "bg-linear-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:from-green-600 hover:to-emerald-600"
              } ${markingComplete ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center gap-2">
                {markingComplete ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {t("learningPage.controls.saving")}
                  </>
                ) : (
                  <>
                    <FiCheck />
                    {isCurrentLectureCompleted
                      ? t("learningPage.controls.completed")
                      : t("learningPage.controls.markComplete")}
                  </>
                )}
              </div>
            </button>
          )}

          {currentLecture?.videoUrl && (
            <button
              onClick={openVideoInNewTab}
              className="px-3 py-2 rounded-xl bg-gray-700/40 hover:bg-gray-700 flex items-center gap-2 transition"
            >
              <FiExternalLink /> {t("learningPage.controls.openYoutube")}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            disabled={!hasPrevLecture}
            onClick={goToPrevLecture}
            className={`px-4 py-2 rounded-xl w-full sm:w-auto transition ${
              hasPrevLecture
                ? "bg-blue-600/80 hover:bg-blue-600 hover:scale-[1.02] active:scale-95"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center gap-2 justify-center">
              <FiChevronLeft /> {t("learningPage.controls.previous")}
            </div>
          </button>

          <button
            disabled={!hasNextLecture}
            onClick={goToNextLecture}
            className={`px-4 py-2 rounded-xl w-full sm:w-auto transition ${
              hasNextLecture
                ? "bg-linear-to-r from-blue-500 to-purple-600 hover:shadow-lg active:scale-95"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center gap-2 justify-center">
              {t("learningPage.controls.next")} <FiChevronRight />
            </div>
          </button>
        </div>

        <div className="text-center sm:text-right">
          <div className="text-xs text-gray-400">
            {t("learningPage.controls.courseProgress")}
          </div>
          <div className="text-green-400 font-semibold">
            {t("learningPage.controls.progressSummary", {
              progress: formatNumber(progress),
              completed: formatNumber(completedLectures.length),
              total: formatNumber(lectures.length),
            })}
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="h-2 rounded-full bg-linear-to-r from-green-400 to-blue-400 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureControls;
