import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { 
  FiBook, 
  FiDownload, 
  FiHome, 
  FiRefreshCw,
  FiCheck,
  FiYoutube
} from "react-icons/fi";

const Sidebar = ({
  course,
  lectures,
  currentLecture,
  completedLectures,
  progress,
  lastActivity,
  isDesktop,
  isVideoPlayable,
  setCurrentLecture,
  setSidebarOpen,
  setVideoError,
  courseId,
  formatDate,
  refreshing,
  refreshData,
  navigate
}) => {
  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -40, opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="w-80 flex-shrink-0 bg-gray-800/60 rounded-2xl p-4 border border-gray-700/50 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]"
    >
      <div className="flex items-center gap-3 mb-4">
        {course.thumbnail ? (
          <img
            alt={course.title}
            src={course.thumbnail}
            className="w-12 h-12 rounded-xl object-cover shadow-md"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <FiBook className="text-white" />
          </div>
        )}

        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">
            {course.title}
          </div>
          <div className="text-xs text-gray-400 truncate">
            {course.category?.name || "UnCategorized"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-700/40 rounded-xl p-3 text-center">
          <div className="text-green-400 font-semibold">
            {progress}%
          </div>
          <div className="text-xs text-gray-300">Progress</div>
        </div>
        <div className="bg-gray-700/40 rounded-xl p-3 text-center">
          <div className="font-semibold">
            {completedLectures.length}/{lectures.length}
          </div>
          <div className="text-xs text-gray-300">Lectures</div>
        </div>
        <div className="bg-gray-700/40 rounded-xl p-3 text-center">
          <div className="font-semibold">
            {Math.round((course.duration || 0) * (progress / 100))}h
          </div>
          <div className="text-xs text-gray-300">Completed</div>
        </div>
      </div>

      <div
        className="space-y-2 overflow-y-auto"
        style={{
          maxHeight: isDesktop ? "calc(100vh - 320px)" : "auto",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs text-gray-300 uppercase tracking-wide">
            Course Content
          </h4>
          <span className="text-xs text-gray-400">
            {completedLectures.length} of {lectures.length} completed
          </span>
        </div>
        <div className="space-y-2">
          {lectures.map((lecture, idx) => {
            const hasVideo = isVideoPlayable(lecture.videoUrl);
            const isCurrent = currentLecture?._id === lecture._id;
            const isDone = completedLectures.includes(lecture._id);
            return (
              <button
                key={lecture._id}
                onClick={() => {
                  setCurrentLecture(lecture);
                  localStorage.setItem(`last_watched_${courseId}`, lecture._id);
                  if (!isDesktop) setSidebarOpen(false);
                  setVideoError(false);
                }}
                disabled={!hasVideo}
                className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition group ${
                  isCurrent
                    ? "bg-gradient-to-r from-blue-600/20 to-transparent border border-blue-500/20 shadow-sm"
                    : "bg-gray-800/40 hover:bg-gray-700/40"
                } ${
                  !hasVideo ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition ${
                    isDone
                      ? "bg-green-500 text-white"
                      : isCurrent
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-200 group-hover:bg-gray-600"
                  }`}
                >
                  {isDone ? <FiCheck /> : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {lecture.title}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                    {hasVideo ? (
                      <span className="bg-red-600/20 px-2 py-0.5 rounded-md text-red-300 text-xs flex items-center gap-1">
                        <FiYoutube size={12} /> YouTube
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        No video
                      </span>
                    )}
                    {lecture.resources?.length > 0 && (
                      <span className="bg-blue-600/20 px-2 py-0.5 rounded-md text-blue-300 text-xs flex items-center gap-1">
                        <FiDownload size={12} />{" "}
                        {lecture.resources.length}
                      </span>
                    )}
                    {isDone && (
                      <span className="bg-green-600/20 px-2 py-0.5 rounded-md text-green-300 text-xs">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="w-full px-4 py-2 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-gray-100 flex items-center justify-center gap-2"
        >
          <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </button>
        
        <button
          onClick={() => navigate("/my-courses")}
          className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-gray-100 border border-blue-500/30"
        >
          <div className="flex items-center justify-center gap-2">
            <FiHome /> Back to Courses
          </div>
        </button>
        
        <div className="text-xs text-gray-400 text-center pt-2 border-t border-gray-700/30">
          Last updated: {formatDate(lastActivity)}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;