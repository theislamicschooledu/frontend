import { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FiArrowLeft, FiSave, FiUpload, FiImage } from "react-icons/fi";
import api from "../../../utils/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useAuth } from "../../../hooks/useAuth";

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const navigate = useNavigate();

  const {user} = useAuth();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/blogs/blogCategory");
      if (res.data.success) {
        setCategories(res.data.categories);
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Quill editor
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write your blog content here...",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editorContent = quillRef.current.root.innerHTML;

    if (!title || editorContent.length === 0 || !selectedCategory) {
      toast.error("Title, content and category are required!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", JSON.stringify(editorContent));
      formData.append("category", selectedCategory);
      if (cover) formData.append("cover", cover);

      const { data } = await api.post("/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (data.success) {
        toast.success("✅ Blog created successfully!");
        navigate(`/${user.role}/blogs`);
        setTitle("");
        if (quillRef.current) quillRef.current.setContents([]);
        setCover(null);
        setPreview(null);
        setSelectedCategory("");
      }
    } catch (error) {
      toast.error("❌ Failed to create blog!");
      console.error(error);
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
          onClick={() => window.history.back()}
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-white rounded-xl transition"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Add New Blog
        </h1>
      </motion.div>

      {/* Form */}
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
            <h2 className="text-xl font-bold text-gray-800 mb-3">Title</h2>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title..."
              className="w-full p-4 text-lg bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
              required
            />
          </motion.div>

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

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3">Content</h2>
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
                  name="cover"
                  className="hidden"
                />
              </label>
            </div>
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
              "Saving..."
            ) : (
              <>
                <FiSave className="mr-2" /> Save Blog
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
