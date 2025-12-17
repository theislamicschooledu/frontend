// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiMail,
  FiArrowLeft,
  FiCheckCircle,
  FiLock,
  FiArrowRight,
} from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const { forgotPassword, error, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await forgotPassword(email);
    if (response.success) {
      setStep(2);
    } else {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-green-50 text-gray-800 font-sans flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <a
            href="/login"
            className="inline-flex items-center text-green-600 hover:text-green-700 transition"
          >
            <FiArrowLeft className="mr-2" />
            Back to Sign In
          </a>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-green-600 text-2xl">
                <FiLock />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {step === 1 ? "Reset Your Password" : "Check Your Email"}
            </h1>
            <p className="text-green-100">
              {step === 1
                ? "Enter your email address to receive reset instructions"
                : "We've sent a password reset link to your email"}
            </p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {step === 1 ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition shadow-md"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="text-green-600 text-3xl" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Email Sent Successfully!
                  </h3>
                  <p className="text-gray-600">
                    We've sent a password reset link to{" "}
                    <span className="font-medium text-green-600">{email}</span>.
                    Please check your inbox and follow the instructions.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> If you don't see the email, check
                    your spam folder or try resending the link.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="text-green-600 hover:text-green-700 font-medium flex items-center justify-center"
                  >
                    Resend Reset Link
                  </button>

                  <a
                    href="/login"
                    className="inline-flex items-center justify-center text-gray-600 hover:text-gray-800 transition"
                  >
                    Back to Sign In
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Additional Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600">
            Need help?{" "}
            <a
              href="/contact"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Contact Support
            </a>
          </p>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <FiLock className="text-green-600 text-xs" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">
                <strong>Security Tip:</strong> Never share your password reset
                link with anyone. Our support team will never ask for this
                information.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
