// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiCheck,
  FiPhone,
  FiArrowRight,
} from "react-icons/fi";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});

  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhoneInput = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^01[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 11 digits and start with 01";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const response = await signup(formData);

    if (response?.success) {
      navigate("/verify-otp");
    } else {
      alert(response?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-green-50 text-gray-800 font-sans flex items-center justify-center py-24 px-4">
      <div className="max-w-5xl w-full flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Side - Form */}
        <motion.div
          className="w-full lg:w-1/2 bg-white p-8 md:p-12"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
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
                to={'/login'}
                className="inline-flex items-center text-green-600 hover:text-green-700 transition mb-6"
              >
                
                Sign In
                <FiArrowRight className="ml-2" />
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">
              Join thousands of parents teaching Islam to their children
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                  placeholder="Enter first name"
                  required
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onInput={handlePhoneInput}
                  className="pl-10 w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                  placeholder="01XXXXXXXXX"
                  required
                  maxLength={11}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
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
                  placeholder="Create a password"
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
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters
              </p>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
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
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="text-gray-400" />
                  ) : (
                    <FiEye className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <span className="text-gray-600">I agree to the </span>
                  <a
                    href="#"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Terms of Service
                  </a>
                  <span className="text-gray-600"> and </span>
                  <a
                    href="#"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Privacy Policy
                  </a>
                </div>
              </label>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.agreeToTerms}
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Progressing..." : "Create Account"}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Sign In
              </a>
            </p>
          </div>
        </motion.div>

        {/* Right Side - Illustration */}
        <motion.div
          className="w-full lg:w-1/2 bg-gradient-to-br from-green-600 to-emerald-500 text-white p-12 flex flex-col justify-center relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute top-6 right-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <FiCheck className="text-green-600 text-xl" />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-green-100 opacity-90">
              Become part of a growing community dedicated to Islamic education
              for children
            </p>
          </div>

          <div className="space-y-5">
            {[
              { text: "Access to all courses and materials", icon: "📚" },
              { text: "Track your child's progress", icon: "📊" },
              { text: "Connect with qualified teachers", icon: "👨‍🏫" },
              { text: "Interactive learning activities", icon: "🎮" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                className="flex items-center"
              >
                <span className="text-2xl mr-4">{feature.icon}</span>
                <span className="text-green-100">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-green-400/30">
            <div className="flex items-center justify-center space-x-4">
              {[
                { src: "https://i.pravatar.cc/150?img=12", name: "Ahmed" },
                { src: "https://i.pravatar.cc/150?img=32", name: "Aisha" },
                { src: "https://i.pravatar.cc/150?img=45", name: "Karim" },
              ].map((teacher, index) => (
                <div key={index} className="text-center">
                  <img
                    src={teacher.src}
                    alt={teacher.name}
                    className="w-14 h-14 rounded-full border-2 border-white mx-auto mb-2"
                  />
                  <p className="text-xs text-green-100">
                    Teacher {teacher.name}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-center text-green-100 mt-4 text-sm">
              Learn from our qualified instructors
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
