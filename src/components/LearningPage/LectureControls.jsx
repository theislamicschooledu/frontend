import React from "react";
import { FiCheck, FiClock, FiExternalLink, FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
  isVideoPlayable
}) => {
  return (
    <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/40">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg lg:text-2xl font-semibold truncate">
            {currentLecture?.title || "Select a lecture"}
          </h2>
          <div className="text-xs text-gray-400 mt-1 flex items-center gap-3">
            <span>
              Lecture {currentIndex + 1} of {lectures.length} •{" "}
              {course.category?.name || "UnCategorized"}
            </span>
            {currentLecture?.duration && (
              <span className="flex items-center gap-1">
                <FiClock size={12} /> {currentLecture.duration} min
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 lg:mt-0 flex items-center gap-3">
          {isVideoPlayable(currentLecture?.videoUrl) && (
            <button
              onClick={() => toggleLectureCompletion(currentLecture._id)}
              disabled={markingComplete}
              className={`px-4 py-2 rounded-xl shadow-md transition-all duration-200 ${
                isCurrentLectureCompleted
                  ? "bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-300 border border-green-600/30"
                  : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:from-green-600 hover:to-emerald-600"
              } ${
                markingComplete ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                {markingComplete ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiCheck />
                    {isCurrentLectureCompleted
                      ? "✓ Completed"
                      : "Mark Complete"}
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
              <FiExternalLink /> Open in YouTube
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
              <FiChevronLeft /> Previous
            </div>
          </button>

          <button
            disabled={!hasNextLecture}
            onClick={goToNextLecture}
            className={`px-4 py-2 rounded-xl w-full sm:w-auto transition ${
              hasNextLecture
                ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg active:scale-95"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center gap-2 justify-center">
              Next <FiChevronRight />
            </div>
          </button>
        </div>

        <div className="text-center sm:text-right">
          <div className="text-xs text-gray-400">Course Progress</div>
          <div className="text-green-400 font-semibold">
            {progress}% • {completedLectures.length}/{lectures.length} lectures
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureControls;