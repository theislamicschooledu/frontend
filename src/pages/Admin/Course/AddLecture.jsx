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
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

const AddLecture = () => {
  const { courseId } = useParams();
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  const { user } = useAuth();

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/courseDetails/${courseId}`);

        if (res.data.success) {
          setCourse(res.data.course);
        }
      } catch (error) {
        toast.error("Failed to fetch course details", error);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleResourcesChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file sizes
    const validFiles = files.filter((file) => {
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 50MB per file`);
        return false;
      }
      return true;
    });

    setResources((prev) => [...prev, ...validFiles]);
  };

  const removeResource = (index) => {
    setResources((prev) => prev.filter((_, i) => i !== index));
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

    if (videoUrl) {
      if (!validateVideoUrl(videoUrl)) {
        toast.error("Please enter a valid video URL");
        return;
      }
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("courseId", courseId);
      formData.append("videoUrl", videoUrl);

      resources.forEach((resource) => {
        formData.append("resources", resource);
      });

      const { data } = await api.post("/courses/lectures", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (data.success) {
        toast.success("✅ Lecture created successfully!");
        navigate(`/${user.role}/courses/${courseId}`);
      }
    } catch (error) {
      console.error("Create lecture error:", error);
      toast.error(
        `❌ ${error.response?.data?.message || "Failed to create lecture"}`
      );
    } finally {
      setLoading(false);
    }
  };

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
            Add New Lecture
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
                />

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <FiVideo className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-blue-800 font-medium mb-1">
                        Video URL Instructions
                      </p>
                      <p className="text-blue-600 text-sm">
                        Enter the direct URL to your video file. Supported
                        platforms: YouTube, Vimeo, or any direct video file URL
                        (MP4, WebM, etc.)
                      </p>
                    </div>
                  </div>
                </div>

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

            {/* Resources Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FiFile className="mr-2" /> Resources (Optional)
              </h2>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-4">
                <div className="py-4">
                  <FiFile className="text-3xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload resource files</p>
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

              {/* Resources List */}
              {resources.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">
                    Selected Resources:
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
                        onClick={() => removeResource(index)}
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
                    {course?.lectures?.length || 0}
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
              className={`w-full flex justify-center items-center py-3 mb-12 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-md ${
                loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {loading ? (
                "Creating Lecture..."
              ) : (
                <>
                  <FiSave className="mr-2" /> Create Lecture
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddLecture;
