import React from "react";
import { FiYoutube } from "react-icons/fi";

const VideoPlayer = ({ 
  lecture, 
  getYouTubeEmbedUrl, 
  videoError, 
  setVideoError, 
  openVideoInNewTab, 
  videoRef,
  handleVideoIframeError 
}) => {
  if (!lecture || !lecture.videoUrl) {
    return (
      <div className="flex items-center justify-center h-64 lg:h-[60vh] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl">
        <div className="text-center text-gray-300">
          <FiYoutube className="mx-auto text-5xl mb-3" />
          <div className="text-lg font-semibold">No Video Available</div>
          <div className="text-sm text-gray-400 mt-1">
            This lecture doesn't have a video attached.
          </div>
        </div>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(lecture.videoUrl);

  if (!embedUrl) {
    return (
      <div className="flex items-center justify-center h-64 lg:h-[60vh] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl">
        <div className="text-center text-gray-300">
          <FiYoutube className="mx-auto text-5xl mb-3" />
          <div className="text-lg font-semibold">Invalid Video URL</div>
          <div className="text-sm text-gray-400 mt-1 mb-4">
            The video url is not recognized.
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={openVideoInNewTab}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            >
              Open Original
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (videoError) {
    return (
      <div className="flex items-center justify-center h-64 lg:h-[60vh] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl">
        <div className="text-center text-gray-300">
          <FiYoutube className="mx-auto text-5xl mb-3 text-red-400" />
          <div className="text-lg font-semibold">Video Unavailable</div>
          <div className="text-sm text-gray-400 mt-1 mb-4">
            The video might be private or blocked.
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setVideoError(false)}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white"
            >
              Try Again
            </button>
            <button
              onClick={openVideoInNewTab}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            >
              Open in YouTube
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl bg-black">
      <div className="relative w-full h-0 pb-[56.25%]">
        <iframe
          ref={videoRef}
          title={lecture.title || "Lecture video"}
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={handleVideoIframeError}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;