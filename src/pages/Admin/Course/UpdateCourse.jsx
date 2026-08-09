import React, { useCallback, useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import api from "../../../utils/axios";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiImage,
  FiSave,
  FiUpload,
  FiCalendar,
  FiClock,
  FiStar,
  FiEdit,
  FiPlus,
  FiX,
  FiCheck,
  FiInfo,
  FiAlertCircle
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useLanguage } from "../../../hooks/useLanguage";

const UpdateCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [enrollmentStart, setEnrollmentStart] = useState("");
  const [enrollmentEnd, setEnrollmentEnd] = useState("");
  const [courseStart, setCourseStart] = useState("");
  const [duration, setDuration] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState("pending");
  const [features, setFeatures] = useState([""]);
  const [newFeature, setNewFeature] = useState("");
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [dateError, setDateError] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");

  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const locale = language === "bn" ? "bn-BD" : "en-US";
  const formatNumber = (value) => Number(value || 0).toLocaleString(locale);

  // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16);
    } catch (error) {
      return "";
    }
  };

  // Fetch course data - ফিক্সড API endpoint
  const fetchCourse = useCallback(async () => {
    try {
      const res = await api.get(`/courses/details/${id}`);

      if (res.data.success) {
        const courseData = res.data.data || res.data.course;
        setCourse(courseData);
        setTitle(courseData.title || "");
        setPrice(courseData.price?.toString() || "");
        setSelectedCategory(courseData.category?._id || courseData.category || "");
        setSelectedTeachers(
          courseData.teachers?.map((teacher) => teacher._id || teacher) || []
        );
        
        // Check if course is upcoming
        const isUpcomingCourse = courseData.isUpcoming === true;
        setIsUpcoming(isUpcomingCourse);
        setCurrentStatus(courseData.currentStatus || courseData.status);
        
        // Set dates if available
        if (courseData.enrollmentStart) {
          setEnrollmentStart(formatDateForInput(courseData.enrollmentStart));
        }
        if (courseData.enrollmentEnd) {
          setEnrollmentEnd(formatDateForInput(courseData.enrollmentEnd));
        }
        if (courseData.courseStart) {
          setCourseStart(formatDateForInput(courseData.courseStart));
        }
        
        setDuration(courseData.duration?.toString() || "");
        setFeatured(courseData.featured || false);
        setStatus(courseData.status || "pending");
        setPreview(courseData.thumbnail || null);
        
        // Set features from course data
        setFeatures(
          courseData.features && courseData.features.length > 0 
            ? courseData.features 
            : [""]
        );

        // Set Quill content after editor is initialized
        if (quillRef.current) {
          quillRef.current.root.innerHTML = courseData.description || "";
        }
      } else {
        toast.error(res?.data?.message || t("adminCourse.form.toasts.loadCourseFailed"));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setFetchLoading(false);
    }
  }, [id]);

  // Fetch categories - ফিক্সড API রেসপন্স
  const fetchCategories = async () => {
    try {
      const res = await api.get("/courses/category");
      if (res.data.success) {
        setCategories(res.data.data || res.data.categories || []);
      } else {
        toast.error(res?.data?.message || t("adminCourse.form.toasts.loadCategoriesFailed"));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Fetch teachers
  const fetchTeachers = async () => {
    try {
      const res = await api.get("/auth/teachers");
      if (res.data.success) {
        setTeachers(res.data.data || res.data.teachers || []);
      } else {
        toast.error(res?.data?.message || t("adminCourse.form.toasts.loadTeachersFailed"));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTeachers();
    fetchCourse();
  }, [fetchCourse]);

  // Handle upcoming toggle effect
  useEffect(() => {
    if (isUpcoming) {
      // If enabling upcoming, status should be published
      setStatus("published");
    }
  }, [isUpcoming]);

  // Validate dates when they change
  useEffect(() => {
    if (!isUpcoming && enrollmentStart && enrollmentEnd && courseStart) {
      const start = new Date(enrollmentStart);
      const end = new Date(enrollmentEnd);
      const courseStartDate = new Date(courseStart);

      if (start > end) {
        setDateError(t("adminCourse.form.toasts.enrollmentOrder"));
      } else if (end > courseStartDate) {
        setDateError(t("adminCourse.form.toasts.courseStartOrder"));
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
  }, [enrollmentStart, enrollmentEnd, courseStart, isUpcoming, t]);

  // Initialize Quill editor
  useEffect(() => {
    const initializeEditor = () => {
      if (editorRef.current && !quillRef.current) {
        quillRef.current = new Quill(editorRef.current, {
          theme: "snow",
          placeholder: t("adminCourse.form.descriptionPlaceholder"),
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "clean"],
            ],
          },
        });

        if (course?.description) {
          quillRef.current.root.innerHTML = course.description;
        }
      }
    };

    const timer = setTimeout(initializeEditor, 100);

    return () => {
      clearTimeout(timer);
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, [course?.description, t]);

  useEffect(() => {
    if (quillRef.current?.root) {
      quillRef.current.root.dataset.placeholder = t("adminCourse.form.descriptionPlaceholder");
    }
  }, [language, t]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t("adminCourse.form.toasts.imageType"));
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("adminCourse.form.toasts.imageSize"));
      return;
    }

    setCover(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleTeacherSelection = (teacherId) => {
    setSelectedTeachers((prev) => {
      if (prev.includes(teacherId)) {
        return prev.filter((id) => id !== teacherId);
      } else {
        return [...prev, teacherId];
      }
    });
  };

  // Features related functions
  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures(prev => {
        const filtered = prev.filter(f => f.trim() !== "");
        return [...filtered, newFeature.trim()];
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    setFeatures(prev => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.length > 0 ? filtered : [""];
    });
  };

  const updateFeature = (index, value) => {
    setFeatures(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleFeatureKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  const validateForm = () => {
    const editorContent = quillRef.current?.root.innerHTML || "";

    if (!title.trim()) {
      toast.error(t("adminCourse.form.toasts.titleRequired"));
      return false;
    }

    if (!price || parseFloat(price) <= 0) {
      toast.error(t("adminCourse.form.toasts.priceRequired"));
      return false;
    }

    if (!editorContent.trim() || editorContent === "<p><br></p>") {
      toast.error(t("adminCourse.form.toasts.descriptionRequired"));
      return false;
    }

    if (!selectedCategory) {
      toast.error(t("adminCourse.form.toasts.categoryRequired"));
      return false;
    }

    if (!duration || parseInt(duration) <= 0) {
      toast.error(t("adminCourse.form.toasts.durationRequired"));
      return false;
    }

    // Date validations for non-upcoming courses
    if (!isUpcoming) {
      if (!enrollmentStart) {
        toast.error(t("adminCourse.form.toasts.enrollmentStartRequired"));
        return false;
      }

      if (!enrollmentEnd) {
        toast.error(t("adminCourse.form.toasts.enrollmentEndRequired"));
        return false;
      }

      if (!courseStart) {
        toast.error(t("adminCourse.form.toasts.courseStartRequired"));
        return false;
      }

      const start = new Date(enrollmentStart);
      const end = new Date(enrollmentEnd);
      const courseStartDate = new Date(courseStart);

      if (isNaN(start.getTime()) || isNaN(end.getTime()) || isNaN(courseStartDate.getTime())) {
        toast.error(t("adminCourse.form.toasts.invalidDate"));
        return false;
      }

      if (start > end) {
        toast.error(t("adminCourse.form.toasts.enrollmentOrder"));
        return false;
      }

      if (end > courseStartDate) {
        toast.error(t("adminCourse.form.toasts.courseStartOrder"));
        return false;
      }
    }

    if (selectedTeachers.length === 0) {
      toast.error(t("adminCourse.form.toasts.teacherRequired"));
      return false;
    }

    // Validate features
    const validFeatures = features.filter(feature => feature && feature.trim() !== "");
    if (validFeatures.length === 0) {
      toast.error(t("adminCourse.form.toasts.featureRequired"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const editorContent = quillRef.current.root.innerHTML;

      const formData = new FormData();

      // Required fields
      formData.append("title", title.trim());
      formData.append("price", parseFloat(price).toString());
      formData.append("description", editorContent);
      formData.append("category", selectedCategory);
      formData.append("duration", parseInt(duration).toString());
      formData.append("status", status);
      formData.append("featured", featured ? "true" : "false");
      formData.append("isUpcoming", isUpcoming ? "true" : "false");

      // Handle dates based on upcoming status
      if (enrollmentStart) {
        formData.append("enrollmentStart", new Date(enrollmentStart).toISOString());
      }
      if (enrollmentEnd) {
        formData.append("enrollmentEnd", new Date(enrollmentEnd).toISOString());
      }
      if (courseStart) {
        formData.append("courseStart", new Date(courseStart).toISOString());
      }

      // Append teachers as array
      selectedTeachers.forEach(teacherId => {
        formData.append("teachers", teacherId);
      });

      // Append features as array
      const validFeatures = features.filter(feature => feature && feature.trim() !== "");
      validFeatures.forEach(feature => {
        formData.append("features", feature.trim());
      });

      // Handle thumbnail
      if (cover) {
        formData.append("thumbnail", cover);
      }

      const { data } = await api.put(`/courses/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (data.success) {
        toast.success(t("adminCourse.form.toasts.updated"));
        navigate("/admin/courses");
      }
    } catch (error) {
      console.error("Update error:", error.response?.data);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0] || 
                          t("adminCourse.form.toasts.updateFailed");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("adminCourse.form.loadingCourse")}</p>
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
          type="button"
          onClick={() => navigate("/admin/courses")}
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-white rounded-xl transition"
        >
          <FiArrowLeft className="mr-2" /> {t("adminCourse.common.backToCourses")}
        </button>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {t("adminCourse.form.updateTitle")}
          </h1>
          <p className="text-gray-600 mt-1">{course?.title}</p>
        </div>
      </motion.div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4"
      >
        {/* Left Section - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              {t("adminCourse.form.courseTitle")}
            </h2>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("adminCourse.form.titlePlaceholder")}
              className="w-full p-4 text-lg bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
              required
            />
          </motion.div>

          {/* Coming Soon Toggle */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FiInfo className="mr-2" /> {t("adminCourse.common.comingSoonCourse")}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {t("adminCourse.form.upcomingHelp")}
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isUpcoming}
                    onChange={(e) => setIsUpcoming(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`block w-14 h-8 rounded-full transition ${
                    isUpcoming ? "bg-purple-500" : "bg-gray-300"
                  }`}></div>
                  <div className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    isUpcoming ? "transform translate-x-6" : ""
                  }`}></div>
                </div>
                <span className="ml-3 text-gray-700 font-medium">
                  {isUpcoming ? t("adminCourse.common.enabled") : t("adminCourse.common.disabled")}
                </span>
              </label>
            </div>
            
            {isUpcoming && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-start">
                  <FiInfo className="text-purple-500 mt-1 mr-3 shrink-0" />
                  <div>
                    <p className="text-purple-800 font-medium">{t("adminCourse.form.comingSoonActive")}</p>
                    <p className="text-purple-600 text-sm mt-1">
                      {t("adminCourse.form.comingSoonActiveDesc")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Basic Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-3">{t("adminCourse.form.category")}</h2>
              <select
                className="w-full p-4 text-lg bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              >
                <option value="" disabled>
                  {t("adminCourse.form.selectCategory")}
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                {t("adminCourse.form.price")}
              </h2>
              <div className="relative">
                <span className="absolute left-4 top-4 text-gray-500">৳</span>
                <input
                  type="number"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full p-4 pl-8 text-lg bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                  required
                />
              </div>
            </motion.div>

            {/* Duration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                <FiClock className="mr-2" /> {t("adminCourse.form.durationWeeks")}
              </h2>
              <input
                type="number"
                name="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder={t("adminCourse.form.durationPlaceholder")}
                min="1"
                className="w-full p-4 text-lg bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                required
              />
            </motion.div>

            {/* Status - only for non-upcoming courses */}
            {!isUpcoming && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-3">{t("adminCourse.form.status")}</h2>
                <select
                  className="w-full p-4 text-lg bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">{t("adminCourse.common.pending")}</option>
                  <option value="published">{t("adminCourse.common.published")}</option>
                </select>
              </motion.div>
            )}
          </div>

          {/* Course Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.07 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FiCheck className="text-green-600" />
              {t("adminCourse.form.features")}
            </h2>
            <p className="text-gray-600 mb-4">{t("adminCourse.form.featuresDesc")}</p>
            
            {/* Existing Features List */}
            <div className="space-y-3 mb-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-xl p-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={t("adminCourse.form.featurePlaceholder")}
                      className="flex-1 bg-transparent outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Feature */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={handleFeatureKeyPress}
                placeholder={t("adminCourse.form.addFeaturePlaceholder")}
                className="flex-1 p-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
              />
              <button
                type="button"
                onClick={addFeature}
                disabled={!newFeature.trim()}
                className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FiPlus size={18} />
                {t("adminCourse.form.add")}
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-3">
              {t("adminCourse.form.featureHelp")}
            </p>
          </motion.div>

          {/* Course Dates Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <FiCalendar className="mr-2" /> {t("adminCourse.form.courseDates")} {!isUpcoming && "*"}
            </h2>
            
            {isUpcoming ? (
              <div className="border-2 border-dashed border-purple-200 bg-purple-50 rounded-xl p-4">
                <div className="flex items-start">
                  <FiInfo className="text-purple-500 mt-1 mr-3 shrink-0" />
                  <div>
                    <p className="text-purple-800 font-medium">{t("adminCourse.form.datesOptionalTitle")}</p>
                    <p className="text-purple-600 text-sm mt-1">
                      {t("adminCourse.form.datesOptionalDesc")}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("adminCourse.form.enrollmentStart")}
                        </label>
                        <input
                          type="datetime-local"
                          value={enrollmentStart}
                          onChange={(e) => setEnrollmentStart(e.target.value)}
                          className="w-full p-3 bg-white rounded-xl focus:ring-2 focus:ring-purple-300 outline-none border border-purple-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("adminCourse.form.enrollmentEnd")}
                        </label>
                        <input
                          type="datetime-local"
                          value={enrollmentEnd}
                          onChange={(e) => setEnrollmentEnd(e.target.value)}
                          className="w-full p-3 bg-white rounded-xl focus:ring-2 focus:ring-purple-300 outline-none border border-purple-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("adminCourse.form.courseStart")}
                        </label>
                        <input
                          type="datetime-local"
                          value={courseStart}
                          onChange={(e) => setCourseStart(e.target.value)}
                          className="w-full p-3 bg-white rounded-xl focus:ring-2 focus:ring-purple-300 outline-none border border-purple-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("adminCourse.form.enrollmentStart")} *
                    </label>
                    <input
                      type="datetime-local"
                      value={enrollmentStart}
                      onChange={(e) => setEnrollmentStart(e.target.value)}
                      className="w-full p-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("adminCourse.form.enrollmentEnd")} *
                    </label>
                    <input
                      type="datetime-local"
                      value={enrollmentEnd}
                      onChange={(e) => setEnrollmentEnd(e.target.value)}
                      className="w-full p-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("adminCourse.form.courseStart")} *
                    </label>
                    <input
                      type="datetime-local"
                      value={courseStart}
                      onChange={(e) => setCourseStart(e.target.value)}
                      className="w-full p-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                      required
                    />
                  </div>
                </div>
                
                {/* Date Validation Error */}
                {dateError && (
                  <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl">
                    <FiAlertCircle size={18} />
                    <span className="text-sm">{dateError}</span>
                  </div>
                )}
              </>
            )}
          </motion.div>

          {/* Teachers Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              {t("adminCourse.form.selectTeachers")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <label
                    key={teacher._id}
                    className={`flex items-center p-3 border rounded-xl cursor-pointer transition ${
                      selectedTeachers.includes(teacher._id)
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTeachers.includes(teacher._id)}
                      onChange={() => handleTeacherSelection(teacher._id)}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                      selectedTeachers.includes(teacher._id)
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300"
                    }`}>
                      {selectedTeachers.includes(teacher._id) && (
                        <FiCheck className="text-white text-xs" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{teacher.name}</p>
                      <p className="text-sm text-gray-600">{teacher.email}</p>
                    </div>
                  </label>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4 col-span-2">
                  {t("adminCourse.form.noTeachers")}
                </p>
              )}
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              {t("adminCourse.form.description")}
            </h2>
            <div
              ref={editorRef}
              className="bg-gray-100 rounded-xl min-h-64 p-4 quill-editor"
            ></div>
            <style jsx>{`
              .quill-editor .ql-editor {
                min-height: 200px;
                font-size: 16px;
              }
            `}</style>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* {t("adminCourse.form.coverImage")} */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t("adminCourse.form.coverImage")}
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-4">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt={t("adminCourse.form.previewAlt")}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.target.src = "/default-course.jpg";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCover(null);
                      setPreview(course?.thumbnail || null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <div className="py-8">
                  <FiImage className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">{t("adminCourse.form.uploadCover")}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {t("adminCourse.form.imageHelp")}
                  </p>
                </div>
              )}

              <label className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition cursor-pointer">
                <FiUpload className="mr-2" />
                {preview && preview !== course?.thumbnail ? t("adminCourse.form.changeImage") : t("adminCourse.form.uploadImage")}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  name="cover"
                  className="hidden"
                />
              </label>
              {course?.thumbnail && (
                <p className="text-xs text-gray-500 mt-2">
                  {t("adminCourse.form.originalImageKept")}
                </p>
              )}
            </div>
          </motion.div>

          {/* Course Options */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FiStar className="mr-2" /> {t("adminCourse.form.courseOptions")}
            </h2>
            
            {/* Featured Course */}
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`block w-14 h-8 rounded-full transition ${
                    featured ? "bg-amber-500" : "bg-gray-300"
                  }`}></div>
                  <div className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    featured ? "transform translate-x-6" : ""
                  }`}></div>
                </div>
                <span className="ml-3 text-gray-700 font-medium">
                  {t("adminCourse.form.featuredCourse")}
                </span>
              </label>
              <p className="text-sm text-gray-500 mt-2">
                {t("adminCourse.form.featuredHelp")}
              </p>
            </div>

            {/* Course Mode Indicator */}
            <div className={`mt-4 p-4 rounded-xl ${
              isUpcoming ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50 border border-gray-200'
            }`}>
              <h3 className="font-medium text-gray-800 mb-2">{t("adminCourse.form.courseMode")}</h3>
              <div className={`inline-flex items-center px-3 py-1 rounded-full ${
                isUpcoming ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  isUpcoming ? 'bg-purple-500' : 'bg-green-500'
                }`}></span>
                {isUpcoming ? t("adminCourse.common.comingSoonCourse") : t("adminCourse.common.regularCourse")}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {isUpcoming 
                  ? t("adminCourse.form.comingSoonModeDesc")
                  : t("adminCourse.form.regularModeDesc")}
              </p>
            </div>
          </motion.div>

          {/* Course Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t("adminCourse.details.courseInformation")}
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t("adminCourse.form.courseId")}</span>
                <span className="font-medium text-gray-800">{id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("adminCourse.form.currentStatus")}</span>
                <span className={`font-medium px-2 py-1 rounded ${
                  isUpcoming ? 'bg-purple-100 text-purple-800' :
                  status === 'published' ? 'bg-green-100 text-green-800' :
                  status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {isUpcoming ? t("adminCourse.common.comingSoon") : (status ? t(`adminCourse.common.${status}`) : "N/A")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("adminCourse.form.created")}</span>
                <span className="font-medium">
                  {course?.createdAt ? new Date(course.createdAt).toLocaleDateString(locale) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("adminCourse.form.lastUpdated")}</span>
                <span className="font-medium">
                  {course?.updatedAt ? new Date(course.updatedAt).toLocaleDateString(locale) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("adminCourse.form.lectures")}</span>
                <span className="font-medium">
                  {formatNumber(course?.lectures?.length || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("adminCourse.form.students")}</span>
                <span className="font-medium">
                  {formatNumber(course?.studentCount || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("adminCourse.form.rating")}</span>
                <span className="font-medium">
                  {course?.averageRating?.toFixed(1) || 0} ⭐ ({t("adminCourse.common.reviewsCount", { count: formatNumber(course?.ratingCount || 0) })})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("adminCourse.form.activeFeatures")}</span>
                <span className="font-medium">
                  {features.filter(f => f && f.trim()).length}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex justify-center items-center py-4 mb-8 ${
              isUpcoming ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'
            } text-white rounded-xl transition shadow-md ${
              loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isUpcoming ? t("adminCourse.form.updatingComingSoon") : t("adminCourse.form.updating")}
              </div>
            ) : (
              <>
                <FiSave className="mr-2" /> 
                {isUpcoming ? t("adminCourse.form.updateComingSoon") : t("adminCourse.form.update")}
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCourse;