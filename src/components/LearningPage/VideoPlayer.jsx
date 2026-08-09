import React from "react";
import { FiYoutube } from "react-icons/fi";
import { useLanguage } from "../../hooks/useLanguage";

const VideoPlayer = ({
  lecture,
  getYouTubeEmbedUrl,
  videoError,
  setVideoError,
  openVideoInNewTab,
  videoRef,
  handleVideoIframeError,
}) => {
  const { t } = useLanguage();

  if (!lecture || !lecture.videoUrl) {
    return (
      <div className="flex items-center justify-center h-64 lg:h-[60vh] bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl">
        <div className="text-center text-gray-300">
          <FiYoutube className="mx-auto text-5xl mb-3" />
          <div className="text-lg font-semibold">
            {t("learningPage.video.noVideoTitle")}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {t("learningPage.video.noVideoDescription")}
          </div>
        </div>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(lecture.videoUrl);

  if (!embedUrl) {
    return (
      <div className="flex items-center justify-center h-64 lg:h-[60vh] bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl">
        <div className="text-center text-gray-300">
          <FiYoutube className="mx-auto text-5xl mb-3" />
          <div className="text-lg font-semibold">
            {t("learningPage.video.invalidUrlTitle")}
          </div>
          <div className="text-sm text-gray-400 mt-1 mb-4">
            {t("learningPage.video.invalidUrlDescription")}
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={openVideoInNewTab}
              className="px-4 py-2 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 text-white"
            >
              {t("learningPage.video.openOriginal")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (videoError) {
    return (
      <div className="flex items-center justify-center h-64 lg:h-[60vh] bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl">
        <div className="text-center text-gray-300">
          <FiYoutube className="mx-auto text-5xl mb-3 text-red-400" />
          <div className="text-lg font-semibold">
            {t("learningPage.video.unavailableTitle")}
          </div>
          <div className="text-sm text-gray-400 mt-1 mb-4">
            {t("learningPage.video.unavailableDescription")}
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setVideoError(false)}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white"
            >
              {t("common.tryAgain")}
            </button>
            <button
              onClick={openVideoInNewTab}
              className="px-4 py-2 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 text-white"
            >
              {t("learningPage.video.openYoutube")}
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
          title={lecture.title || t("learningPage.video.lectureVideo")}
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
