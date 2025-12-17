import React from 'react'
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FiX, FiArrowLeft, FiShoppingBag, FiHelpCircle } from 'react-icons/fi';

const PaymentCancel = () => {
  return (
    <div className="pt-10 min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Cancel Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-lg"
          >
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <FiX className="text-white text-2xl" />
            </div>
          </motion.div>

          {/* Header */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Payment Canceled
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Your payment process was canceled. No charges have been made to your account. 
            You can try again anytime or explore other courses.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              to="/courses"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FiShoppingBag className="text-lg" />
              Try Again
            </Link>

            <Link
              to="/courses"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FiArrowLeft className="text-lg" />
              Browse Courses
            </Link>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-100 max-w-2xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FiHelpCircle className="text-blue-500 text-xl" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Need Help?</h4>
            </div>
            <p className="text-gray-600 text-left mb-4">
              If you encountered any issues during payment or have questions about our courses, 
              our support team is here to help you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/contact"
                className="flex-1 text-center px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                to="/faq"
                className="flex-1 text-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                View FAQ
              </Link>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-500 text-sm">
              Have questions about payment?{' '}
              <Link to="/payment-help" className="text-blue-500 hover:text-blue-600 font-medium underline">
                Learn more about our payment process
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default PaymentCancel