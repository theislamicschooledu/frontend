import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import api from "../../../utils/axios";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiPlus,
  FiTag,
  FiPercent,
  FiDollarSign,
  FiCalendar,
  FiUsers,
  FiEdit,
  FiTrash2,
  FiCopy,
  FiClock,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const CourseCoupons = () => {
  const { courseId } = useParams();
  const [coupons, setCoupons] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();

  // Fetch course and coupons
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseRes, couponsRes] = await Promise.all([
          api.get(`/courses/courseDetails/${courseId}`),
          api.get(`/coupons/course/${courseId}`),
        ]);

        if (courseRes.data) {
          setCourse(courseRes.data);
        }

        if (couponsRes.data.success) {
          setCoupons(couponsRes.data.coupons);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) {
      return;
    }

    try {
      setDeleteLoading(couponId);
      const { data } = await api.delete(`/coupons/${couponId}`);

      if (data.success) {
        toast.success("✅ Coupon deleted successfully!");
        setCoupons((prev) => prev.filter((coupon) => coupon._id !== couponId));
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to delete coupon");
    } finally {
      setDeleteLoading(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Coupon code copied to clipboard!");
  };

  const isCouponExpired = (coupon) => {
    if (!coupon.expiryDate) return false;
    return new Date() > new Date(coupon.expiryDate);
  };

  const isCouponUsedUp = (coupon) => {
    return coupon.usedCount >= coupon.usageLimit;
  };

  const getCouponStatus = (coupon) => {
    if (isCouponExpired(coupon)) {
      return { status: "expired", color: "red", text: "Expired" };
    }
    if (isCouponUsedUp(coupon)) {
      return { status: "used", color: "orange", text: "Used Up" };
    }
    return { status: "active", color: "green", text: "Active" };
  };

  const calculateDiscountedPrice = (coupon) => {
    if (!course?.price) return null;

    const price = course.price;
    if (coupon.discountType === "percentage") {
      return price * (1 - coupon.discountValue / 100);
    } else {
      return Math.max(0, price - coupon.discountValue);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading coupons...</p>
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
          onClick={() => navigate(`/admin/courses/${courseId}`)}
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-white rounded-xl transition"
        >
          <FiArrowLeft className="mr-2" /> Back to Course
        </button>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Course Coupons
          </h1>
          <p className="text-gray-600 mt-1">{course?.title}</p>
        </div>
        <button
          onClick={() => navigate(`/admin/courses/${courseId}/coupons/add`)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          <FiPlus className="mr-2" /> Create Coupon
        </button>
      </motion.div>

      {/* Coupons List */}
      <div className="max-w-6xl mx-auto">
        {coupons.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <FiTag className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Coupons Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first coupon to offer discounts on this course.
            </p>
            <button
              onClick={() => navigate(`/admin/courses/${courseId}/coupons/add`)}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition mx-auto"
            >
              <FiPlus className="mr-2" /> Create First Coupon
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {coupons.map((coupon, index) => {
              const status = getCouponStatus(coupon);
              const discountedPrice = calculateDiscountedPrice(coupon);

              return (
                <motion.div
                  key={coupon._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4"
                  style={{ borderLeftColor: `var(--${status.color}-500)` }}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Coupon Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-${status.color}-500`}
                          >
                            {status.text}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <FiClock className="mr-1" />
                            Created{" "}
                            {new Date(coupon.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-bold text-lg">
                              {coupon.code}
                            </div>
                            <button
                              onClick={() => copyToClipboard(coupon.code)}
                              className="p-2 text-gray-500 hover:text-gray-700 transition"
                              title="Copy coupon code"
                            >
                              <FiCopy size={16} />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {coupon.discountType === "percentage" ? (
                              <FiPercent className="text-green-600" />
                            ) : (
                              <FiDollarSign className="text-green-600" />
                            )}
                            <span className="text-xl font-bold text-gray-800">
                              {coupon.discountValue}
                              {coupon.discountType === "percentage"
                                ? "%"
                                : "৳"}{" "}
                              OFF
                            </span>
                          </div>
                        </div>

                        {/* Course Price Comparison */}
                        {discountedPrice && (
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600 line-through">
                              ৳{course.price}
                            </span>
                            <span className="text-green-600 font-bold">
                              ৳{discountedPrice.toFixed(2)}
                            </span>
                            <span className="text-blue-600">
                              Save ৳
                              {(course.price - discountedPrice).toFixed(2)}
                            </span>
                          </div>
                        )}

                        {/* Usage Info */}
                        <div className="flex items-center gap-6 text-sm text-gray-600 mt-3">
                          <div className="flex items-center gap-1">
                            <FiUsers />
                            <span>
                              {coupon.usedCount} / {coupon.usageLimit} used
                            </span>
                          </div>

                          {coupon.expiryDate && (
                            <div className="flex items-center gap-1">
                              <FiCalendar />
                              <span>
                                Expires{" "}
                                {new Date(
                                  coupon.expiryDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/admin/courses/${courseId}/coupons/edit/${coupon._id}`
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                        >
                          <FiEdit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon._id)}
                          disabled={deleteLoading === coupon._id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition disabled:opacity-50"
                        >
                          <FiTrash2 size={16} />
                          {deleteLoading === coupon._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCoupons;
