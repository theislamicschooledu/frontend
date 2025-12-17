import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FiArrowLeft, FiSave, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../../utils/axios";

const AddBlogCategory = () => {
  const [loading, setLoading] = useState(false);
  const [allCategory, setAllCategory] = useState([]);
  const [category, setCategory] = useState("");

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/blogs/blogCategory");
      if (res.data.success) {
        setAllCategory(res.data.categories);
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/admin/blogCategory", { name: category });
      if (res.data.success) {
        toast.success(res.data.message);
        setCategory("");
        fetchCategory();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await api.delete(`/admin/blogCategory/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        setCategory("");
        fetchCategory();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-white rounded-xl shadow-sm transition"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mt-4 md:mt-0">
          Add Blog Category
        </h1>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800">New Category</h2>
          <input
            type="text"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter blog category..."
            className="w-full p-4 text-lg bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-400 outline-none transition"
            required
          />
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex justify-center items-center py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition shadow-md ${
              loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <FiSave className="mr-2" /> Save Category
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Category List */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-amber-100 shadow-md"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            All Categories
          </h2>
          <div className="space-y-3 max-h-[400px] overflow-x-hidden overflow-y-auto">
            {allCategory.length === 0 ? (
              <p className="text-gray-500">No categories found.</p>
            ) : (
              allCategory.map((cat) => (
                <motion.div
                  key={cat._id}
                  whileHover={{ scale: 1.02 }}
                  className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <span className="text-gray-700 font-medium">{cat.name}</span>
                  {/* delete button */}
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="text-red-500 hover:text-red-600 transition cursor-pointer"
                  >
                    <FiTrash2 />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddBlogCategory;
