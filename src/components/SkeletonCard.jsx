import React from "react";

const SkeletonCard = ({ view = "grid" }) => {
  return (
    <div
      className={`bg-white rounded-3xl p-4 shadow-lg border border-gray-100 animate-pulse ${
        view === "list" ? "flex flex-col lg:flex-row gap-4" : ""
      }`}
    >
      <div
        className={`bg-gray-200 rounded-2xl ${
          view === "grid" ? "h-48 w-full mb-4" : "lg:w-64 lg:h-40 h-48 w-full"
        }`}
      />
      <div className={`flex-1 ${view === "list" ? "py-2" : ""}`}>
        <div className="flex justify-between items-start mb-3">
          <div className="h-6 bg-gray-200 rounded-full w-1/3"></div>
          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded w-4/5 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>

        <div className="flex gap-3 mb-4">
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
          <div className="h-6 bg-gray-200 rounded-full w-28"></div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="h-8 bg-gray-200 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
