// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState } from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

export default function ChangePassword() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState(1);
  const [localLoading, setLocalLoading] = useState(false);
  const navigate = useNavigate();
  const { verifyOldPassword, changePassword, error } = useAuth();

  const handleVerifyOld = async () => {
    setLocalLoading(true);
    try {
      const res = await verifyOldPassword(oldPassword);
      setLocalLoading(false);
      if (res.success) {
        setStep(2);
        setMessage("Old password verified! Now set a new password.");
        setMessageColor(1);
      } else {
        setLocalLoading(false);
        setMessage(res.message);
        setMessageColor(2);
      }
    } catch (error) {
      setLocalLoading(false);
      setMessage(error.message);
      setMessageColor(2);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLocalLoading(true);
    try {
      const res = await changePassword(oldPassword, newPassword);
      setLocalLoading(false);
      if (res.success) {
        toast.success("Password changed successfully!");
        navigate("/profile");
      } else {
        setMessage(error.message);
        setMessageColor(2);
      }
    } catch (error) {
      setLocalLoading(false);
      setMessage(error.message);
      setMessageColor(2);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md pt-24">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>

      {message && (
        <p
          className={`mb-3 text-sm ${messageColor === 1 && "text-blue-600"} ${
            messageColor === 2 && "text-red-600"
          } font-medium`}
        >
          {message}
        </p>
      )}

      {step === 1 && (
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enter old password
          </label>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="pl-10 pr-10 w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
              placeholder="Enter old password"
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
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleVerifyOld}
            disabled={localLoading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {localLoading ? "Verifying..." : "Verify old password"}
          </motion.button>
        </div>
      )}

      {step === 2 && (
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enter new password
          </label>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-10 pr-10 w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
              placeholder="Enter new password"
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
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleChangePassword}
            disabled={localLoading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {localLoading ? "Changing..." : "Change password"}
          </motion.button>
        </div>
      )}
    </div>
  );
}
