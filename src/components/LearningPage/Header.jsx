import React from "react";
import {
  FiChevronLeft,
  FiClock,
  FiCalendar,
  FiUser,
  FiRefreshCw,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useLanguage } from "../../hooks/useLanguage";

const Header = ({
  course,
  progress,
  completedLectures,
  lectures,
  lastActivity,
  formatDate,
  refreshing,
  refreshData,
  sidebarOpen,
  setSidebarOpen,
  navigate,
}) => {
  const { language, t } = useLanguage();
  const locale = language === "bn" ? "bn-BD" : "en-US";
  const formatNumber = (value) => Number(value || 0).toLocaleString(locale);

  return (
    <header className="sticky top-0 z-40 bg-gray-800/70 backdrop-blur border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              aria-label={t("learningPage.header.toggleSidebar")}
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-2 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-gray-200 lg:hidden"
            >
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>

            <button
              onClick={() => navigate("/my-courses")}
              className="text-sm text-gray-200 flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-700/50"
            >
              <FiChevronLeft />
              <span className="hidden sm:inline">
                {t("learningPage.header.myCourses")}
              </span>
            </button>

            <div className="hidden lg:block">
              <h1 className="text-lg font-semibold truncate max-w-md">
                {course.title}
              </h1>
              <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                <FiClock size={12} />
                {t("learningPage.header.lectureProgress", {
                  completed: formatNumber(completedLectures.length),
                  total: formatNumber(lectures.length),
                  progress: formatNumber(progress),
                })}
                {lastActivity && (
                  <>
                    <FiCalendar size={12} />
                    {t("learningPage.header.lastActivity", {
                      date: formatDate(lastActivity),
                    })}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <div className="w-36 bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-linear-to-r from-green-400 to-blue-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-sm text-gray-300 px-3 py-1 rounded-md bg-gray-800/50 flex items-center gap-2">
                <FiUser size={14} />
                {formatNumber(progress)}%
              </div>
            </div>

            <button
              onClick={refreshData}
              disabled={refreshing}
              className="p-2 bg-gray-700/50 rounded-xl hover:bg-gray-700 disabled:opacity-50"
              title={t("learningPage.header.refreshData")}
              aria-label={t("learningPage.header.refreshData")}
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
