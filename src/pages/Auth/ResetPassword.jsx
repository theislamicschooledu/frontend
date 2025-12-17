// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiCheckCircle,
} from "react-icons/fi";
import { useState } from "react";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const {token} = useParams();
  const { resetPassword, error, loading, logout } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = formData.password;
    
    const response = await resetPassword(token, password);
    if (response.success) {
      setStep(2);
      await logout();
    } else {
      toast(error);
    }
  };

  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword !== "";

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
            href="/signin"
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
              {step === 1
                ? "Create New Password"
                : "Password Reset Successfully!"}
            </h1>
            <p className="text-green-100">
              {step === 1
                ? "Please create a new secure password for your account"
                : "Your password has been successfully reset"}
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
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10 w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FiEyeOff className="text-gray-400" />
                      ) : (
                        <FiEye className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 pr-10 w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="text-gray-400" />
                      ) : (
                        <FiEye className="text-gray-400" />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword && (
                    <p
                      className={`text-xs mt-1 ${
                        passwordsMatch ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {passwordsMatch
                        ? "Passwords match!"
                        : "Passwords do not match"}
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || !passwordsMatch}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting" : "Reset Password"}
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
                    Password Updated!
                  </h3>
                  <p className="text-gray-600">
                    Your password has been successfully reset. You can now sign
                    in with your new password.
                  </p>
                </div>

                <a
                  href="/login"
                  className="block w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition shadow-md text-center"
                >
                  Sign In Now
                </a>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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
                <strong>Security Reminder:</strong> Choose a strong, unique
                password that you don't use on any other websites. Consider
                using a password manager to keep your accounts secure.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
