import React from "react";

const LoadingState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <div className="text-gray-300">Loading course content...</div>
      </div>
    </div>
  );
};

export default LoadingState;