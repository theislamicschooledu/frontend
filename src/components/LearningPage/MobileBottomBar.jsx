import React from "react";
import { FiMenu, FiHome } from "react-icons/fi";
import { useLanguage } from "../../hooks/useLanguage";

const MobileBottomBar = ({ sidebarOpen, setSidebarOpen, progress, navigate }) => {
  const { language, t } = useLanguage();
  const locale = language === "bn" ? "bn-BD" : "en-US";

  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-gray-800/70 backdrop-blur rounded-2xl p-3 flex items-center justify-between gap-3 border border-gray-700/50">
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-700/40 flex items-center justify-center gap-2"
        >
          <FiMenu /> {t("learningPage.mobile.contents")}
        </button>

        <div className="flex-1 text-center">
          <div className="text-xs text-gray-300">
            {t("learningPage.mobile.progress")}
          </div>
          <div className="text-green-400 font-semibold">
            {Number(progress || 0).toLocaleString(locale)}%
          </div>
        </div>

        <button
          onClick={() => navigate("/my-courses")}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-700/40 flex items-center justify-center gap-2"
        >
          <FiHome /> {t("learningPage.mobile.courses")}
        </button>
      </div>
    </div>
  );
};

export default MobileBottomBar;
