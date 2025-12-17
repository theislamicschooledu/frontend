import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiCheck,
  FiDownload,
  FiPlay,
  FiArrowLeft,
  FiMail,
} from "react-icons/fi";
import api from "../utils/axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const transactionId = searchParams.get("transaction_id");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (transactionId) {
          const { data } = await api.get(`/payments/verify/${transactionId}`);
          if (data.success) {
            setEnrollment(data.enrollment);
          }
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [transactionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="text-white text-3xl" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Welcome to the course! You now have full access to all course
            materials.
          </p>

          {enrollment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Course Info */}
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {enrollment.course.title}
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      <strong>Transaction ID:</strong>{" "}
                      {enrollment.transactionId}
                    </p>
                    <p>
                      <strong>Original Price:</strong> ৳
                      {enrollment.originalAmount}
                    </p>
                    {enrollment.discountAmount > 0 && (
                      <p className="text-green-600">
                        <strong>Discount:</strong> -৳{enrollment.discountAmount}
                      </p>
                    )}
                    <p>
                      <strong>Amount Paid:</strong> ৳{enrollment.amount}
                    </p>
                    <p>
                      <strong>Enrolled On:</strong>{" "}
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </p>
                    {enrollment.couponUsed && (
                      <p className="text-blue-600">
                        <strong>Coupon Applied:</strong>{" "}
                        {enrollment.couponUsed.code}
                      </p>
                    )}
                  </div>
                </div>

                {/* Course Thumbnail */}
                <div className="relative">
                  {enrollment.course.thumbnail ? (
                    <img
                      src={enrollment.course.thumbnail}
                      alt={enrollment.course.title}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                      <FiPlay className="text-white text-4xl" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={enrollment ? `/learn/${enrollment.course._id}` : "/courses"}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
            >
              <FiPlay />
              Start Learning
            </Link>

            <Link
              to="/my-courses"
              className="flex items-center gap-3 px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-2xl font-semibold hover:bg-blue-50 transition-all"
            >
              <FiDownload />
              My Courses
            </Link>

            <Link
              to="/courses"
              className="flex items-center gap-3 px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all"
            >
              <FiArrowLeft />
              Browse More Courses
            </Link>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 p-6 bg-blue-50 rounded-2xl max-w-2xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-3">
              <FiMail className="text-blue-500 text-xl" />
              <h4 className="text-lg font-semibold text-gray-800">
                What's Next?
              </h4>
            </div>
            <p className="text-gray-600 text-left">
              We've sent a confirmation email with your course access details.
              You can start learning immediately by visiting "My Courses"
              section. If you have any questions, don't hesitate to contact our
              support team.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
