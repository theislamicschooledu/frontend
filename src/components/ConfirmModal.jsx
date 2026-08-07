// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FiAlertTriangle,
  FiCheck,
  FiX,
  FiLoader,
  FiShield,
} from "react-icons/fi";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "আপনি কি নিশ্চিত?",
  message = "এটি পরে পরিবর্তন করা সম্ভব নয়।",
  confirmText = "কনফার্ম",
  cancelText = "বাতিল করুন",
  type = "danger", // "danger", "warning", "success"
  loading = false,
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

  const typeConfig = {
    danger: {
      icon: FiAlertTriangle,
      eyebrow: "Critical Action",
      accentText: "text-[#c6573a]",
      iconText: "text-[#d86545]",
      iconBg: "bg-[#fff0e9]",
      iconRing: "ring-[#f3c8b8]",
      confirmButton:
        "bg-[#d96343] hover:bg-[#bd4f32] shadow-[0_12px_28px_rgba(217,99,67,0.24)]",
      glow: "bg-[#ef8f6d]/18",
      noticeBg: "bg-[#fff7f2]",
      noticeBorder: "border-[#f1d8ce]",
      noticeText: "text-[#835b4d]",
    },
    warning: {
      icon: FiAlertTriangle,
      eyebrow: "Please Review",
      accentText: "text-[#a87318]",
      iconText: "text-[#b57a17]",
      iconBg: "bg-[#fff7df]",
      iconRing: "ring-[#f0d99c]",
      confirmButton:
        "bg-[#c78a24] hover:bg-[#aa7217] shadow-[0_12px_28px_rgba(199,138,36,0.24)]",
      glow: "bg-[#f7c969]/22",
      noticeBg: "bg-[#fffaf0]",
      noticeBorder: "border-[#efe0b8]",
      noticeText: "text-[#796641]",
    },
    success: {
      icon: FiCheck,
      eyebrow: "Confirm Action",
      accentText: "text-[#16745f]",
      iconText: "text-[#16745f]",
      iconBg: "bg-[#e9f6f1]",
      iconRing: "ring-[#bcded2]",
      confirmButton:
        "bg-[#16745f] hover:bg-[#115f4e] shadow-[0_12px_28px_rgba(22,116,95,0.24)]",
      glow: "bg-[#8bcdbd]/22",
      noticeBg: "bg-[#f1f9f6]",
      noticeBorder: "border-[#d4e9e1]",
      noticeText: "text-[#4f7065]",
    },
  };

  const config = typeConfig[type] || typeConfig.danger;
  const StatusIcon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-[#14231e]/65 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          aria-describedby="confirm-modal-message"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 27,
            }}
            className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#fffdf8] shadow-[0_28px_90px_rgba(12,36,29,0.30)]"
          >
            {/* Decorative background */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-[#fffaf0] via-[#f5fbf8] to-[#f1edff]" />
              <div
                className={`absolute -right-12 -top-14 h-36 w-36 rounded-full ${config.glow}`}
              />
              <div className="absolute -left-16 top-10 h-32 w-32 rounded-full bg-[#9d8be8]/10" />
            </div>

            {/* Header */}
            <div className="relative px-6 pb-5 pt-6 sm:px-7 sm:pt-7">
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${config.iconBg} ${config.iconText} ring-1 ${config.iconRing} shadow-sm`}
                >
                  <StatusIcon className="text-2xl" />
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e2e6e2] bg-white/80 text-[#71817b] transition hover:border-[#efb49f] hover:bg-[#fff2eb] hover:text-[#d9704b] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Close confirmation modal"
                >
                  <FiX size={19} />
                </button>
              </div>

              <div className="mt-5">
                <div
                  className={`flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.15em] ${config.accentText}`}
                >
                  <FiShield />
                  {config.eyebrow}
                </div>

                <h2
                  id="confirm-modal-title"
                  className="mt-2 text-2xl font-extrabold leading-tight text-[#263c35]"
                >
                  {title}
                </h2>
              </div>
            </div>

            {/* Body */}
            <div className="relative px-6 pb-6 sm:px-7">
              <div
                className={`rounded-[1.2rem] border p-4 ${config.noticeBg} ${config.noticeBorder}`}
              >
                <p
                  id="confirm-modal-message"
                  className={`text-sm leading-7 ${config.noticeText}`}
                >
                  {message}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="relative border-t border-[#e9e2d6] bg-white/75 px-6 py-5 backdrop-blur-sm sm:px-7">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-[#dfe5e0] bg-white px-5 text-sm font-extrabold text-[#53665e] transition hover:border-[#bfcfc7] hover:bg-[#f7faf8] hover:text-[#263c35] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-28"
                >
                  {cancelText}
                </button>

                <motion.button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isLoading}
                  whileHover={{ y: isLoading ? 0 : -2 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-55 sm:min-w-36 ${config.confirmButton}`}
                >
                  {isLoading ? (
                    <>
                      <FiLoader className="animate-spin" size={18} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <StatusIcon size={17} />
                      <span>{confirmText}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
