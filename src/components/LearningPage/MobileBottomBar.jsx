import React from "react";
import { FiMenu, FiHome } from "react-icons/fi";

const MobileBottomBar = ({ sidebarOpen, setSidebarOpen, progress, navigate }) => {
  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-gray-800/70 backdrop-blur rounded-2xl p-3 flex items-center justify-between gap-3 border border-gray-700/50">
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-700/40 flex items-center justify-center gap-2"
        >
          <FiMenu /> Contents
        </button>

        <div className="flex-1 text-center">
          <div className="text-xs text-gray-300">Progress</div>
          <div className="text-green-400 font-semibold">{progress}%</div>
        </div>

        <button
          onClick={() => navigate("/my-courses")}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-700/40 flex items-center justify-center gap-2"
        >
          <FiHome /> Courses
        </button>
      </div>
    </div>
  );
};

export default MobileBottomBar;