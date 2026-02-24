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
        toast.error(res?.data?.message || "Failed to load course");
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
        toast.error(res?.data?.message || "Failed to load categories");
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
        toast.error(res?.data?.message || "Failed to load teachers");
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
        setDateError("Enrollment end date must be after start date");
      } else if (end > courseStartDate) {
        setDateError("Course must start on or after enrollment ends");
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
  }, [enrollmentStart, enrollmentEnd, courseStart, isUpcoming]);

  // Initialize Quill editor
  useEffect(() => {
    const initializeEditor = () => {
      if (editorRef.current && !quillRef.current) {
        quillRef.current = new Quill(editorRef.current, {
          theme: "snow",
          placeholder: "Update your course description here...",
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
  }, [course?.description]);

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
      toast.error("Only JPG, PNG, and WEBP images are allowed");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
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
      toast.error("Title is required!");
      return false;
    }

    if (!price || parseFloat(price) <= 0) {
      toast.error("Valid price is required!");
      return false;
    }

    if (!editorContent.trim() || editorContent === "<p><br></p>") {
      toast.error("Description is required!");
      return false;
    }

    if (!selectedCategory) {
      toast.error("Category is required!");
      return false;
    }

    if (!duration || parseInt(duration) <= 0) {
      toast.error("Duration must be a positive number!");
      return false;
    }

    // Date validations for non-upcoming courses
    if (!isUpcoming) {
      if (!enrollmentStart) {
        toast.error("Enrollment start date is required!");
        return false;
      }

      if (!enrollmentEnd) {
        toast.error("Enrollment end date is required!");
        return false;
      }

      if (!courseStart) {
        toast.error("Course start date is required!");
        return false;
      }

      const start = new Date(enrollmentStart);
      const end = new Date(enrollmentEnd);
      const courseStartDate = new Date(courseStart);

      if (isNaN(start.getTime()) || isNaN(end.getTime()) || isNaN(courseStartDate.getTime())) {
        toast.error("Invalid date format!");
        return false;
      }

      if (start > end) {
        toast.error("Enrollment end date must be after start date!");
        return false;
      }

      if (end > courseStartDate) {
        toast.error("Course must start on or after enrollment ends!");
        return false;
      }
    }

    if (selectedTeachers.length === 0) {
      toast.error("Please select at least one teacher!");
      return false;
    }

    // Validate features
    const validFeatures = features.filter(feature => feature && feature.trim() !== "");
    if (validFeatures.length === 0) {
      toast.error("Please add at least one course feature!");
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
        toast.success(`✅ ${isUpcoming ? "Coming Soon" : ""} Course updated successfully!`);
        navigate("/admin/courses");
      }
    } catch (error) {
      console.error("Update error:", error.response?.data);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0] || 
                          "Failed to update course";
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course data...</p>
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
          <FiArrowLeft className="mr-2" /> Back to Courses
        </button>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Edit Course
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
              Course Title *
            </h2>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter course title..."
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
                  <FiInfo className="mr-2" /> Coming Soon Course
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Enable to mark as "Coming Soon" course (dates are optional)
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
                  {isUpcoming ? "Enabled" : "Disabled"}
                </span>
              </label>
            </div>
            
            {isUpcoming && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-start">
                  <FiInfo className="text-purple-500 mt-1 mr-3 shrink-0" />
                  <div>
                    <p className="text-purple-800 font-medium">Coming Soon Mode Active</p>
                    <p className="text-purple-600 text-sm mt-1">
                      This course will be marked as "Coming Soon". Dates are optional and can be added or updated.
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
              <h2 className="text-xl font-bold text-gray-800 mb-3">Category *</h2>
              <select
                className="w-full p-4 text-lg bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a category
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
                Price (৳) *
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
                <FiClock className="mr-2" /> Duration (weeks) *
              </h2>
              <input
                type="number"
                name="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Course duration in weeks..."
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
                <h2 className="text-xl font-bold text-gray-800 mb-3">Status</h2>
                <select
                  className="w-full p-4 text-lg bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
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
              Course Features *
            </h2>
            <p className="text-gray-600 mb-4">Update course features and benefits</p>
            
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
                      placeholder="Enter feature..."
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
                placeholder="Add a new feature..."
                className="flex-1 p-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
              />
              <button
                type="button"
                onClick={addFeature}
                disabled={!newFeature.trim()}
                className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FiPlus size={18} />
                Add
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-3">
              Press Enter or click Add to include features like "Lifetime Access", "Certificate", etc.
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
              <FiCalendar className="mr-2" /> Course Dates {!isUpcoming && "*"}
            </h2>
            
            {isUpcoming ? (
              <div className="border-2 border-dashed border-purple-200 bg-purple-50 rounded-xl p-4">
                <div className="flex items-start">
                  <FiInfo className="text-purple-500 mt-1 mr-3 shrink-0" />
                  <div>
                    <p className="text-purple-800 font-medium">Dates Optional for Coming Soon Course</p>
                    <p className="text-purple-600 text-sm mt-1">
                      You can add or update dates. They are optional for coming soon courses.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enrollment Start
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
                          Enrollment End
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
                          Course Start
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
                      Enrollment Start *
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
                      Enrollment End *
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
                      Course Start *
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
              Select Teachers *
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
                  No teachers available
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
              Course Description *
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
          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Cover Image
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-4">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
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
                  <p className="text-gray-600 mb-2">Upload cover image</p>
                  <p className="text-sm text-gray-500 mb-4">
                    JPG, PNG, or WEBP up to 5MB
                  </p>
                </div>
              )}

              <label className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition cursor-pointer">
                <FiUpload className="mr-2" />
                {preview && preview !== course?.thumbnail ? "Change Image" : "Upload Image"}
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
                  Original image will be kept if no new image is uploaded
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
              <FiStar className="mr-2" /> Course Options
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
                  Featured Course
                </span>
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Featured courses will be highlighted on the homepage
              </p>
            </div>

            {/* Course Mode Indicator */}
            <div className={`mt-4 p-4 rounded-xl ${
              isUpcoming ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50 border border-gray-200'
            }`}>
              <h3 className="font-medium text-gray-800 mb-2">Course Mode:</h3>
              <div className={`inline-flex items-center px-3 py-1 rounded-full ${
                isUpcoming ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  isUpcoming ? 'bg-purple-500' : 'bg-green-500'
                }`}></span>
                {isUpcoming ? "Coming Soon Course" : "Regular Course"}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {isUpcoming 
                  ? "This course will show as 'Coming Soon' and dates are optional."
                  : "This course requires all dates to be set."}
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
              Course Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Course ID:</span>
                <span className="font-medium text-gray-800">{id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Status:</span>
                <span className={`font-medium px-2 py-1 rounded ${
                  isUpcoming ? 'bg-purple-100 text-purple-800' :
                  status === 'published' ? 'bg-green-100 text-green-800' :
                  status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {isUpcoming ? 'Coming Soon' : (status || 'N/A')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {course?.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">
                  {course?.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lectures:</span>
                <span className="font-medium">
                  {course?.lectures?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Students:</span>
                <span className="font-medium">
                  {course?.studentCount || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating:</span>
                <span className="font-medium">
                  {course?.averageRating?.toFixed(1) || 0} ⭐ ({course?.ratingCount || 0} reviews)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Features:</span>
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
                {isUpcoming ? "Updating Coming Soon Course..." : "Updating Course..."}
              </div>
            ) : (
              <>
                <FiSave className="mr-2" /> 
                {isUpcoming ? "Update Coming Soon Course" : "Update Course"}
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCourse;