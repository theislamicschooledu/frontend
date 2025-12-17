import React from "react";
import { FiDownload } from "react-icons/fi";

const ResourcesSection = ({ resources }) => {
  return (
    <section className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/40">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <FiDownload className="text-white" />
        </div>
        <h3 className="text-lg font-semibold">
          Lecture Resources
        </h3>
        <span className="text-sm text-gray-400">
          ({resources.length})
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {resources.map((res, i) => (
          <a
            key={i}
            href={res.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/40 hover:bg-gray-700/50 transition group"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white group-hover:scale-105 transition">
              <FiDownload />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">
                {res.title}
              </div>
              <div className="text-xs text-gray-400">
                Click to download
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default ResourcesSection;