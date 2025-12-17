import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import api from "../../../utils/axios";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiSave,
  FiUpload,
  FiVideo,
  FiFile,
  FiX,
  FiLink,
  FiTrash2,
  FiDownload,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

const UpdateLecture = () => {
  const { courseId, lectureId } = useParams();
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [resources, setResources] = useState([]);
  const [existingResources, setExistingResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  const {user} = useAuth()

  // Fetch lecture and course details
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        const [courseRes, lectureRes] = await Promise.all([
          api.get(`/courses/courseDetails/${courseId}`),
          api.get(`/courses/lectures/${lectureId}`),
        ]);        

        if (courseRes.data) {
          setCourse(courseRes.data);
        }

        if (lectureRes.data.success) {
          const lecture = lectureRes.data.lecture;
          setTitle(lecture.title);
          setVideoUrl(lecture.videoUrl);
          setExistingResources(lecture.resources || []);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch data");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [courseId, lectureId]);

  const handleResourcesChange = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => {
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 50MB per file`);
        return false;
      }
      return true;
    });

    setResources((prev) => [...prev, ...validFiles]);
  };

  const removeNewResource = (index) => {
    setResources((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingResource = async (resourceId) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) {
      return;
    }

    try {
      const { data } = await api.delete(
        `/courses/lectures/${lectureId}/resources/${resourceId}`
      );

      if (data.success) {
        toast.success("✅ Resource deleted successfully!");
        setExistingResources((prev) =>
          prev.filter((resource) => resource._id !== resourceId)
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to delete resource");
    }
  };

  const validateVideoUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Lecture title is required");
      return;
    }

    if (!videoUrl.trim()) {
      toast.error("Video URL is required");
      return;
    }

    if (!validateVideoUrl(videoUrl)) {
      toast.error("Please enter a valid video URL");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("videoUrl", videoUrl);

      resources.forEach((resource) => {
        formData.append("resources", resource);
      });

      const { data } = await api.put(`/courses/lectures/${lectureId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (data.success) {
        toast.success("✅ Lecture updated successfully!");
        navigate(`/${user.role}/courses/${courseId}`);
      }
    } catch (error) {
      console.error("Update lecture error:", error);
      toast.error(
        `❌ ${error.response?.data?.message || "Failed to update lecture"}`
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lecture data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <button
          onClick={() => navigate(`/${user.role}/courses/${courseId}`)}
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-white rounded-xl transition"
        >
          <FiArrowLeft className="mr-2" /> Back to Course
        </button>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Edit Lecture
          </h1>
          <p className="text-gray-600 mt-1">{course?.title}</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lecture Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Lecture Title
              </h2>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter lecture title..."
                className="w-full p-4 text-lg bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                required
              />
            </motion.div>

            {/* Video URL */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FiLink className="mr-2" /> Video URL
              </h2>

              <div className="space-y-4">
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="w-full p-4 text-lg bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                  required
                />

                {videoUrl && validateVideoUrl(videoUrl) && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <FiVideo className="text-green-500 mr-3" />
                      <span className="text-green-700 font-medium">
                        Valid URL format
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Existing Resources */}
            {existingResources.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FiFile className="mr-2" /> Existing Resources
                </h2>

                <div className="space-y-2">
                  {existingResources.map((resource) => (
                    <div
                      key={resource._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <FiFile className="text-gray-500 mr-3" />
                        <span className="text-sm text-gray-700">
                          {resource.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                        >
                          <FiDownload className="mr-1" /> Download
                        </a>
                        <button
                          type="button"
                          onClick={() => removeExistingResource(resource._id)}
                          className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                        >
                          <FiTrash2 className="mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* New Resources Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FiFile className="mr-2" /> Add New Resources
              </h2>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-4">
                <div className="py-4">
                  <FiFile className="text-3xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Upload new resource files
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    PDF, DOC, PPT, ZIP up to 50MB each
                  </p>
                </div>

                <label className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer">
                  <FiUpload className="mr-2" />
                  Add Resources
                  <input
                    type="file"
                    multiple
                    onChange={handleResourcesChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* New Resources List */}
              {resources.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">
                    New Resources to Upload:
                  </h3>
                  {resources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                    >
                      <div className="flex items-center">
                        <FiFile className="text-gray-500 mr-3" />
                        <span className="text-sm text-gray-700">
                          {resource.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(resource.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewResource(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiX size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Course Information
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Course:</span>
                  <p className="font-medium text-gray-800">{course?.title}</p>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Lectures:</span>
                  <span className="font-medium">
                    {course?.lectureCount || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{course?.duration}h</span>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex justify-center items-center py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-md ${
                loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {loading ? (
                "Updating Lecture..."
              ) : (
                <>
                  <FiSave className="mr-2" /> Update Lecture
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateLecture;
