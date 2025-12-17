import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import api from "../../../utils/axios";
import toast from "react-hot-toast";
import { 
  FiArrowLeft, 
  FiSave, 
  FiPercent, 
  FiDollarSign, 
  FiCalendar,
  FiUsers,
  FiTag
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const AddCoupon = () => {
  const { courseId } = useParams();
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    expiryDate: "",
    usageLimit: "1"
  });
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/courseDetails/${courseId}`);
        if (res.data) {
          setCourse(res.data);
        }
      } catch (error) {
        console.error(error)
        toast.error("Failed to fetch course details");
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code }));
  };

  const validateForm = () => {
    if (!formData.code.trim()) {
      toast.error("Coupon code is required");
      return false;
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      toast.error("Discount value must be a positive number");
      return false;
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      toast.error("Percentage discount cannot exceed 100%");
      return false;
    }

    if (formData.expiryDate && new Date(formData.expiryDate) <= new Date()) {
      toast.error("Expiry date must be in the future");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        ...formData,
        courseId,
        discountValue: parseFloat(formData.discountValue),
        usageLimit: parseInt(formData.usageLimit)
      };

      const { data } = await api.post("/coupons", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (data.success) {
        toast.success("✅ Coupon created successfully!");
        navigate(`/admin/courses/${courseId}/coupons`);
      }
    } catch (error) {
      console.error("Create coupon error:", error);
      toast.error(`❌ ${error.response?.data?.message || "Failed to create coupon"}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = () => {
    if (!course?.price || !formData.discountValue) return null;

    const price = course.price;
    const discountValue = parseFloat(formData.discountValue);

    if (formData.discountType === 'percentage') {
      const discountAmount = (price * discountValue) / 100;
      return {
        original: price,
        discounted: price - discountAmount,
        savings: discountAmount
      };
    } else {
      return {
        original: price,
        discounted: Math.max(0, price - discountValue),
        savings: discountValue
      };
    }
  };

  const discountPreview = calculateDiscount();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <button
          onClick={() => navigate(`/admin/courses/${courseId}/coupons`)}
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-white rounded-xl transition"
        >
          <FiArrowLeft className="mr-2" /> Back to Coupons
        </button>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Create New Coupon
          </h1>
          <p className="text-gray-600 mt-1">{course?.title}</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Coupon Code */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FiTag className="mr-2" /> Coupon Code
              </h2>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Enter coupon code (e.g., SUMMER25)"
                    className="w-full p-4 text-lg bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none uppercase"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={generateRandomCode}
                  className="px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition whitespace-nowrap"
                >
                  Generate Code
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Use uppercase letters and numbers. Code will be automatically converted to uppercase.
              </p>
            </motion.div>

            {/* Discount Settings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Discount Settings
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Discount Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, discountType: 'percentage' }))}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition flex-1 ${
                        formData.discountType === 'percentage'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <FiPercent />
                      Percentage
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, discountType: 'flat' }))}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition flex-1 ${
                        formData.discountType === 'flat'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <FiDollarSign />
                      Flat Amount
                    </button>
                  </div>
                </div>

                {/* Discount Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Value
                    {formData.discountType === 'percentage' ? ' (%)' : ' (৳)'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleChange}
                      placeholder={formData.discountType === 'percentage' ? "25" : "500"}
                      min="0"
                      max={formData.discountType === 'percentage' ? "100" : undefined}
                      step="0.01"
                      className="w-full p-4 pl-12 bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {formData.discountType === 'percentage' ? <FiPercent /> : <FiDollarSign />}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Usage Limits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FiUsers className="mr-2" /> Usage Limits
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Usage Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Usage Limit
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="usageLimit"
                      value={formData.usageLimit}
                      onChange={handleChange}
                      placeholder="1"
                      min="1"
                      className="w-full p-4 pl-12 bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <FiUsers />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Number of times this coupon can be used
                  </p>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full p-4 pl-12 bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-300 outline-none"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <FiCalendar />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Leave empty for no expiration
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Discount Preview */}
            {discountPreview && course?.price && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Discount Preview
                </h2>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Original Price</p>
                      <p className="text-2xl font-bold text-gray-800 line-through">
                        ৳{discountPreview.original}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Discounted Price</p>
                      <p className="text-2xl font-bold text-green-600">
                        ৳{discountPreview.discounted.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">You Save</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ৳{discountPreview.savings.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
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
                  <span className="text-gray-600">Original Price:</span>
                  <span className="font-medium">৳{course?.price || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Coupons:</span>
                  <span className="font-medium">
                    {course?.coupons?.length || 0}
                  </span>
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
                "Creating Coupon..."
              ) : (
                <>
                  <FiSave className="mr-2" /> Create Coupon
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCoupon;