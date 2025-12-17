import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../../../utils/axios";
import toast from "react-hot-toast";
import { FiArrowLeft, FiSave, FiUpload, FiImage } from "react-icons/fi";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useAuth } from "../../../hooks/useAuth";

const UpdateBlog = () => {
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const {user} = useAuth()

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/blogs/${id}`);        
        setTitle(res.data.title);
        setPreview(res.data.cover);
        setSelectedCategory(res.data.category?._id || "");

        // Initialize Quill only once
        if (editorRef.current && !quillRef.current) {
          quillRef.current = new Quill(editorRef.current, {
            theme: "snow",
            placeholder: "Write your blog content here...",
            modules: { toolbar: [["bold", "italic", "underline", "strike"], ["clean"]] },
          });
        }

        // Set content AFTER Quill is ready
        if (quillRef.current) {
          quillRef.current.root.innerHTML = res.data.content;
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Fetch categories
  useEffect(() => {
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
    fetchCategories();
  }, []);

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

      const { data } = await api.put(`/blogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success("Blog updated successfully!");
        navigate(`/${user?.role}/blogs`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update blog!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 overflow-y-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center px-4 py-2 text-gray-600 hover:bg-white rounded-xl transition"
      >
        <FiArrowLeft className="mr-2" /> Back
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold my-4">Update Blog</h1>

      <form
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        onSubmit={handleSubmit}
      >
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Title</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 text-lg bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
              placeholder="Enter blog title..."
            />
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Category</h2>
            <select
              className="w-full p-4 text-lg bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Content</h2>
            <div ref={editorRef} className="bg-gray-100 rounded-xl min-h-[300px] p-3"></div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover Image */}
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            {preview ? (
              <img
                src={preview}
                alt="Cover Preview"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="py-8">
                <FiImage className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Upload cover image</p>
              </div>
            )}

            <label className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-xl cursor-pointer hover:bg-green-700 transition">
              <FiUpload className="mr-2" /> Upload
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full flex justify-center items-center py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-md ${
              loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : <><FiSave className="mr-2" /> Save Blog</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBlog;
