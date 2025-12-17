import React, { useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import api from "../../../utils/axios";
import toast from "react-hot-toast";

import { FiArrowLeft, FiImage, FiSave, FiUpload, FiCalendar, FiClock, FiStar, FiPlus, FiX } from "react-icons/fi";
import { useNavigate } from "react-router";

import Quill from "quill";
import "quill/dist/quill.snow.css";

const AddCourse = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
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
  const [features, setFeatures] = useState([""]); // নতুন state for features
  const [newFeature, setNewFeature] = useState(""); // নতুন state for single feature input
  
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const navigate = useNavigate();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/courses/courseCategory");
      if (res.data.success) {
        setCategories(res.data.categories);
      } else {
        toast.error(res?.data?.message);
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
        setTeachers(res.data.teachers);
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTeachers();
  }, []);

  // Quill editor
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write course description here...",
        modules: {
          toolbar: [["bold", "italic", "underline", "strike"], ["clean"]],
        },
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setCover(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleTeacherSelection = (teacherId) => {
    setSelectedTeachers(prev => {
      if (prev.includes(teacherId)) {
        return prev.filter(id => id !== teacherId);
      } else {
        return [...prev, teacherId];
      }
    });
  };

  // Features related functions
  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const updateFeature = (index, value) => {
    setFeatures(prev => prev.map((feature, i) => i === index ? value : feature));
  };

  const handleFeatureKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  const validateForm = () => {
    const editorContent = quillRef.current?.root.innerHTML || "";
    
    if (!title || editorContent.length === 0 || !selectedCategory) {
      toast.error("Title, description and category are required!");
      return false;
    }

    if (!enrollmentStart || !enrollmentEnd) {
      toast.error("Enrollment start and end dates are required!");
      return false;
    }

    if (new Date(enrollmentStart) >= new Date(enrollmentEnd)) {
      toast.error("Enrollment end date must be after start date!");
      return false;
    }

    if (!courseStart) {
      toast.error("Course start date is required!");
      return false;
    }

    if (!duration || duration <= 0) {
      toast.error("Duration must be a positive number!");
      return false;
    }

    if (selectedTeachers.length === 0) {
      toast.error("Please select at least one teacher!");
      return false;
    }

    // Validate features
    const validFeatures = features.filter(feature => feature.trim() !== "");
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
      formData.append("title", title);
      formData.append("price", price);
      formData.append("description", editorContent);
      formData.append("category", selectedCategory);
      formData.append("enrollmentStart", enrollmentStart);
      formData.append("enrollmentEnd", enrollmentEnd);
      formData.append("courseStart", courseStart);
      formData.append("duration", duration);
      formData.append("status", status);
      formData.append("featured", featured);
      
      // Append features as array
      const validFeatures = features.filter(feature => feature.trim() !== "");
      validFeatures.forEach(feature => {
        formData.append("features", feature);
      });
      
      // Append teachers as array
      selectedTeachers.forEach(teacherId => {
        formData.append("teachers", teacherId);
      });
      
      if (cover) formData.append("thumbnail", cover);

      const { data } = await api.post("/courses", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (data.success) {
        toast.success("✅ Course created successfully!");
        resetForm();
        navigate("/admin/courses");
      }
    } catch (error) {
      toast.error("❌ Failed to create course!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setPrice("");
    if (quillRef.current) quillRef.current.setContents([]);
    setCover(null);
    setPreview(null);
    setSelectedCategory("");
    setSelectedTeachers([]);
    setEnrollmentStart("");
    setEnrollmentEnd("");
    setDuration("");
    setFeatured(false);
    setStatus("pending");
    setFeatures([""]); // Reset features
    setNewFeature(""); // Reset new feature input
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
          onClick={() => window.history.back()}
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-white rounded-xl transition"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Add New Course
        </h1>
      </motion.div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4"
      >
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3">Course Title</h2>
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

          {/* Basic Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-3">Category</h2>
              <select
                className="w-full p-4 text-lg bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              >
                <option value="" disabled>Select a category</option>
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
              <h2 className="text-xl font-bold text-gray-800 mb-3">Price ($)</h2>
              <input
                type="number"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter course price..."
                min="0"
                step="0.01"
                className="w-full p-4 text-lg bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                required
              />
            </motion.div>

            {/* Duration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                <FiClock className="mr-2" /> Duration (hours)
              </h2>
              <input
                type="number"
                name="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Course duration in hours..."
                min="1"
                className="w-full p-4 text-lg bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                required
              />
            </motion.div>

            {/* Status */}
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
                <option value="rejected">Rejected</option>
              </select>
            </motion.div>
          </div>

          {/* Course Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.07 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3">Course Features</h2>
            <p className="text-gray-600 mb-4">Add key features and benefits of this course</p>
            
            {/* Existing Features List */}
            <div className="space-y-3 mb-4">
              {features.map((feature, index) => (
                feature.trim() && (
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
                )
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

          {/* Enrollment Period */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <FiCalendar className="mr-2" /> Enrollment Period
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={enrollmentStart}
                  onChange={(e) => setEnrollmentStart(e.target.value)}
                  className="w-full p-4 bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={enrollmentEnd}
                  onChange={(e) => setEnrollmentEnd(e.target.value)}
                  className="w-full p-4 bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                  required
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
                  className="w-full p-4 bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Teachers Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3">Select Teachers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {teachers.map((teacher) => (
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
                  <div className={`w-4 h-4 border rounded mr-3 flex items-center justify-center ${
                    selectedTeachers.includes(teacher._id)
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300"
                  }`}>
                    {selectedTeachers.includes(teacher._id) && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{teacher.name}</p>
                    <p className="text-sm text-gray-600">{teacher.email}</p>
                  </div>
                </label>
              ))}
            </div>
            {teachers.length === 0 && (
              <p className="text-gray-500 text-center py-4">No teachers available</p>
            )}
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3">Course Description</h2>
            <div
              ref={editorRef}
              className="bg-gray-100 rounded-xl min-h-[300px] p-3"
            ></div>
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
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="py-8">
                  <FiImage className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload cover image</p>
                  <p className="text-sm text-gray-500 mb-4">
                    JPG, PNG, or WEBP up to 5MB
                  </p>
                </div>
              )}

              <label className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition cursor-pointer">
                <FiUpload className="mr-2" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  name="thumbnail"
                  className="hidden"
                />
              </label>
            </div>
          </motion.div>

          {/* Featured Course */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FiStar className="mr-2" /> Course Options
            </h2>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="hidden"
                />
                <div className={`w-12 h-6 rounded-full transition ${
                  featured ? "bg-green-500" : "bg-gray-300"
                }`}></div>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  featured ? "transform translate-x-7" : "transform translate-x-1"
                }`}></div>
              </div>
              <span className="ml-3 text-gray-700 font-medium">Featured Course</span>
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Featured courses will be highlighted on the homepage
            </p>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex justify-center items-center py-3 mb-8 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-md ${
              loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {loading ? (
              "Creating Course..."
            ) : (
              <>
                <FiSave className="mr-2" /> Create Course
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;