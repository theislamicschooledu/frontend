// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiUserPlus,
  FiBookOpen,
  FiArrowRight,
} from "react-icons/fi";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "", // email বা phone
    password: "",
    rememberMe: false,
  });

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      toast.error("Email/Phone and Password are required");
      return;
    }

    const response = await login(formData.identifier, formData.password);

    if (response?.success) {
      navigate("/");
    } else {
      toast.error(response?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-green-50 text-gray-800 font-sans flex items-center justify-center py-24 px-4">
      <div className="max-w-5xl w-full flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">
        <motion.div
          className="w-full lg:w-3/5 bg-white p-8 md:p-12"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-8">
            <div className="flex justify-between gap-4">
              <Link
                to={'/'}
                className="inline-flex items-center text-green-600 hover:text-green-700 transition mb-6"
              >
                <FiArrowLeft className="mr-2" />
                Back to Home
              </Link>
              <Link
                to={'/signup'}
                className="inline-flex items-center text-green-600 hover:text-green-700 transition mb-6"
              >
                
                Sign Up
                <FiArrowRight className="ml-2" />
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Sign In to Your Account
            </h1>
            <p className="text-gray-600">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email or Phone */}
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email or Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                  placeholder="Enter your email or phone"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
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
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
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

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a
                href="/forget-password"
                className="text-sm text-green-600 hover:text-green-700"
              >
                Forgot password?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Signing In..." : "Sign In"}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
              >
                Sign Up <FiUserPlus className="ml-1" />
              </a>
            </p>
          </div>
        </motion.div>

        {/* Right Side - Illustration */}
        <motion.div
          className="w-full lg:w-2/5 bg-gradient-to-br from-green-600 to-emerald-500 text-white p-8 md:p-12 flex flex-col justify-center relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute top-6 left-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <FiBookOpen className="text-green-600 text-lg" />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-green-100 opacity-90">
              Continue your Islamic learning journey with us
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-28 h-28 bg-white/30 rounded-full flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-green-600 text-4xl">
                    📖
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white/90 text-green-600 rounded-full p-2 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center">
                  <span className="text-white font-bold">100%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { text: "Access your personalized dashboard", icon: "📊" },
              { text: "Track your child's progress", icon: "📈" },
              { text: "Continue where you left off", icon: "🎯" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                className="flex items-center justify-center"
              >
                <span className="text-2xl mr-3">{feature.icon}</span>
                <span className="text-green-100 text-sm">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-green-400/30">
            <div className="text-center">
              <p className="text-green-100 text-sm">
                Join thousands of parents using our platform
              </p>
              <div className="flex justify-center mt-3">
                {[
                  "https://i.pravatar.cc/150?img=32",
                  "https://i.pravatar.cc/150?img=45",
                  "https://i.pravatar.cc/150?img=12",
                  "https://i.pravatar.cc/150?img=22",
                ].map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white -ml-2 first:ml-0"
                  />
                ))}
                <div className="w-10 h-10 rounded-full bg-green-500 border-2 border-white -ml-2 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+2k</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
