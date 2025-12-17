// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiAlertTriangle, FiCheck, FiX, FiLoader } from "react-icons/fi";

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "আপনি কি নিশ্চিত?", 
  message = "এটি পরে পরিবর্তন করা সম্ভব নয়।",
  confirmText = "কনফার্ম",
  cancelText = "বাতিল করুন",
  type = "danger", // 'danger', 'warning', 'success'
  loading = false
}) => {
  const [internalLoading, setInternalLoading] = useState(false);

  const handleConfirm = async () => {
    setInternalLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Modal Confirm Error:", error);
    } finally {
      setInternalLoading(false);
    }
  };

  const isLoading = loading || internalLoading;

  // Color schemes based on type
  const typeConfig = {
    danger: {
      icon: <FiAlertTriangle className="text-red-500" />,
      confirmBg: "bg-red-600 hover:bg-red-700",
      iconBg: "bg-red-50",
      borderColor: "border-red-100"
    },
    warning: {
      icon: <FiAlertTriangle className="text-amber-500" />,
      confirmBg: "bg-amber-600 hover:bg-amber-700",
      iconBg: "bg-amber-50",
      borderColor: "border-amber-100"
    },
    success: {
      icon: <FiCheck className="text-green-500" />,
      confirmBg: "bg-green-600 hover:bg-green-700",
      iconBg: "bg-green-50",
      borderColor: "border-green-100"
    }
  };

  const config = typeConfig[type] || typeConfig.danger;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className={`p-6 border-b ${config.borderColor}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${config.iconBg}`}>
                  {config.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              </div>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition duration-200 cursor-pointer"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-gray-600 leading-relaxed">{message}</p>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 bg-gray-50">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {cancelText}
            </button>

            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`px-6 py-3 text-white rounded-xl transition duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${config.confirmBg} cursor-pointer`}
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin" size={18} />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{confirmText}</span>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmModal;