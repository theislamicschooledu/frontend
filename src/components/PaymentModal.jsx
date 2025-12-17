import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiLoader, 
  FiCheck, 
  FiAlertCircle, 
  FiLock, 
  FiTag,
  FiPlus,
} from 'react-icons/fi';
import api from '../utils/axios';

const PaymentModal = ({ isOpen, onClose, course, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponInput, setShowCouponInput] = useState(false);

  const calculateFinalAmount = () => {
    if (appliedCoupon) {
      return appliedCoupon.discountedPrice;
    }
    return course.price;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    try {
      setApplyingCoupon(true);
      setError('');

      const { data } = await api.post('/payments/validate-coupon', {
        couponCode: couponCode.trim(),
        courseId: course._id
      });

      if (data.success) {
        setAppliedCoupon(data.coupon);
        setError('');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setShowCouponInput(false);
    setError('');
  };

  const handleEnroll = async () => {
    try {
      setLoading(true);
      setError('');

      const { data } = await api.post('/payments/initiate', {
        courseId: course._id,
        couponCode: appliedCoupon ? couponCode : undefined
      });

      if (data.success) {
        // Redirect to UddoktaPay payment page
        window.location.href = data.payment_url;
      } else {
        setError(data.message || 'Payment initiation failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <FiLock className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Enroll in Course</h3>
                  <p className="text-sm text-gray-600">Secure payment via UddoktaPay</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Course Info */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                    <FiBook className="text-white text-xl" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 line-clamp-2">
                    {course.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {course.category?.name || 'Uncategorized'}
                  </p>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="mb-4">
                {!showCouponInput && !appliedCoupon && (
                  <button
                    onClick={() => setShowCouponInput(true)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <FiPlus size={16} />
                    Apply Coupon Code
                  </button>
                )}

                {showCouponInput && !appliedCoupon && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={applyingCoupon}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
                    >
                      {applyingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FiTag className="text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          {appliedCoupon.code} Applied
                        </p>
                        <p className="text-xs text-green-600">
                          {appliedCoupon.discountType === 'percentage' 
                            ? `${appliedCoupon.discountValue}% off` 
                            : `৳${appliedCoupon.discountValue} off`
                          }
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-green-600 hover:text-green-700"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Course Price</span>
                  <span className="font-semibold text-gray-800">৳{course.price}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">
                      -৳{appliedCoupon.discountAmount}
                    </span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount</span>
                    <span>৳{calculateFinalAmount()}</span>
                  </div>
                </div>

                {appliedCoupon && (
                  <div className="text-sm text-green-600 text-center">
                    You save ৳{appliedCoupon.savings}!
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <FiAlertCircle className="text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="p-6 border-b border-gray-200">
              <h5 className="font-semibold text-gray-800 mb-3">What you'll get:</h5>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <FiCheck className="text-green-500 flex-shrink-0" />
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheck className="text-green-500 flex-shrink-0" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheck className="text-green-500 flex-shrink-0" />
                  <span>Access on mobile and TV</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheck className="text-green-500 flex-shrink-0" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6">
              <button
                onClick={handleEnroll}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiLock />
                    Pay ৳{calculateFinalAmount()}
                  </>
                )}
              </button>
              
              <p className="text-center text-xs text-gray-500 mt-4">
                Secure payment processed by UddoktaPay
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;