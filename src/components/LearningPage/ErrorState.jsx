import React from "react";
import { FiBook } from "react-icons/fi";
import { useLanguage } from "../../hooks/useLanguage";

const ErrorState = ({ navigate }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-md text-center bg-gray-800/60 p-8 rounded-2xl">
        <FiBook className="mx-auto text-4xl text-gray-300 mb-4" />
        <h3 className="text-2xl font-bold mb-2">
          {t("learningPage.states.notFoundTitle")}
        </h3>
        <p className="text-gray-400 mb-6">
          {t("learningPage.states.notFoundDescription")}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/my-courses")}
            className="px-6 py-2 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 text-white"
          >
            {t("learningPage.states.backToCourses")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
