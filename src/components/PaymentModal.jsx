import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiLoader,
  FiCheck,
  FiAlertCircle,
  FiLock,
  FiTag,
  FiPlus,
  FiBook,
  FiArrowRight,
  FiInfo,
  FiShield,
  FiCreditCard,
  FiCheckCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { useLanguage } from "../hooks/useLanguage";

const PaymentModal = ({ isOpen, onClose, course }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponInput, setShowCouponInput] = useState(false);

  const calculateFinalAmount = () => {
    if (appliedCoupon) {
      return appliedCoupon.discountedPrice;
    }

    return course?.price || 0;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError(t("paymentModal.enterCoupon"));
      return;
    }

    try {
      setApplyingCoupon(true);
      setError("");

      const { data } = await api.post("/coupons/validate", {
        couponCode: couponCode.trim(),
        courseId: course._id,
      });

      if (data.success) {
        setAppliedCoupon(data.coupon);
        setError("");
      } else {
        setError(data.message || t("paymentModal.invalidCoupon"));
      }
    } catch (error) {
      console.error("Coupon error:", error.response?.data);
      setError(
        error.response?.data?.message || t("paymentModal.invalidCoupon"),
      );
      setAppliedCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setShowCouponInput(false);
    setError("");
  };

  const handleProceedToManualPayment = () => {
    navigate(`/courses/${course._id}/enroll/manual`, {
      state: {
        course,
        appliedCoupon,
        couponCode: appliedCoupon ? couponCode : null,
        finalAmount: calculateFinalAmount(),
      },
    });

    onClose();
  };

  const paymentSteps = [
    t("paymentModal.step1"),
    t("paymentModal.step2"),
    t("paymentModal.step3"),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-[#14231e]/65 p-3 backdrop-blur-md sm:p-5"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[1.75rem] border border-white/70 bg-[#fffdf8] shadow-[0_28px_90px_rgba(12,36,29,0.32)]"
          >
            {/* Decorative background */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-36 overflow-hidden rounded-t-[1.75rem]">
              <div className="absolute inset-0 bg-linear-to-br from-[#e8f5ef] via-[#fff8ea] to-[#f1edff]" />
              <div className="absolute -right-12 -top-14 h-36 w-36 rounded-full bg-[#f7c969]/22" />
              <div className="absolute -left-12 top-8 h-32 w-32 rounded-full bg-[#8bcdbd]/18" />
            </div>

            {/* Header */}
            <div className="sticky top-0 z-20 border-b border-[#e8e1d5]/80 bg-[#fffdf8]/92 px-5 py-4 backdrop-blur-xl sm:px-6">
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#16745f] text-white shadow-[0_10px_24px_rgba(22,116,95,0.24)]">
                    <FiLock className="text-lg" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-extrabold text-[#263c35] sm:text-xl">
                        {t("paymentModal.enrollTitle")}
                      </h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#e5f4ee] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#16745f]">
                        <FiShield />
                        {t("paymentModal.secure")}
                      </span>
                    </div>

                    <p className="mt-0.5 truncate text-xs font-medium text-[#71817b] sm:text-sm">
                      {t("paymentModal.subtitle")}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e1e5e1] bg-white/80 text-[#71817b] transition hover:border-[#efb49f] hover:bg-[#fff2eb] hover:text-[#d9704b]"
                  aria-label={t("paymentModal.close")}
                >
                  <FiX size={19} />
                </button>
              </div>
            </div>

            <div className="relative">
              {/* Course Summary */}
              <div className="px-5 pb-5 pt-5 sm:px-6">
                <div className="rounded-[1.35rem] border border-[#e7e1d6] bg-white p-3.5 shadow-[0_10px_30px_rgba(45,75,65,0.06)]">
                  <div className="flex items-center gap-3">
                    {course?.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-[#e5ded0]"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#16745f] to-[#6ab5a1] text-white">
                        <FiBook className="text-xl" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <span className="inline-flex rounded-full bg-[#eeeafd] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#6e5bb4]">
                        {course?.category?.name ||
                          t("paymentModal.uncategorized")}
                      </span>

                      <h4 className="mt-2 line-clamp-2 text-sm font-extrabold leading-5 text-[#263c35] sm:text-base">
                        {course?.title}
                      </h4>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a9691]">
                        {t("paymentModal.price")}
                      </p>
                      <p
                        className={`mt-1 font-extrabold ${
                          appliedCoupon
                            ? "text-sm text-[#9ba6a2] line-through"
                            : "text-xl text-[#263c35]"
                        }`}
                      >
                        ৳{course?.price || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Coupon */}
                <div className="mt-4 rounded-[1.3rem] border border-[#e7e1d6] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff0e8] text-[#d9704b]">
                        <FiTag />
                      </span>

                      <div>
                        <p className="text-sm font-extrabold text-[#263c35]">
                          {t("paymentModal.couponCode")}
                        </p>
                        <p className="text-xs text-[#7b8983]">
                          {t("paymentModal.couponHint")}
                        </p>
                      </div>
                    </div>

                    {!showCouponInput && !appliedCoupon && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowCouponInput(true);
                          setError("");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#eef8f4] px-3 py-2 text-xs font-extrabold text-[#16745f] transition hover:bg-[#e1f1eb]"
                      >
                        <FiPlus />
                        {t("paymentModal.add")}
                      </button>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {showCouponInput && !appliedCoupon && (
                      <motion.div
                        key="coupon-input"
                        initial={{ opacity: 0, height: 0, y: -5 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -5 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                          <div className="relative min-w-0 flex-1">
                            <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a9691]" />
                            <input
                              type="text"
                              placeholder={t("paymentModal.couponPlaceholder")}
                              value={couponCode}
                              onChange={(e) => {
                                setCouponCode(e.target.value.toUpperCase());
                                if (error) setError("");
                              }}
                              className="h-11 w-full rounded-xl border border-[#dfe5e0] bg-[#fafbf8] pl-10 pr-4 text-sm font-bold uppercase tracking-wide text-[#263c35] outline-none transition placeholder:font-medium placeholder:normal-case placeholder:tracking-normal placeholder:text-[#9ca7a2] focus:border-[#8bcdbd] focus:bg-white focus:ring-4 focus:ring-[#8bcdbd]/15"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={applyingCoupon}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#263c35] px-5 text-sm font-extrabold text-white transition hover:bg-[#1d302a] disabled:cursor-not-allowed disabled:opacity-55"
                          >
                            {applyingCoupon ? (
                              <>
                                <FiLoader className="animate-spin" />
                                {t("paymentModal.validating")}
                              </>
                            ) : (
                              t("paymentModal.apply")
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {appliedCoupon && (
                      <motion.div
                        key="coupon-applied"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-[#cfe6dc] bg-[#edf8f3] p-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#16745f] text-white">
                            <FiCheckCircle />
                          </span>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-extrabold text-[#145f50]">
                              {t("paymentModal.applied", {
                                code: appliedCoupon.code,
                              })}
                            </p>
                            <p className="mt-0.5 text-xs font-semibold text-[#4d8172]">
                              {appliedCoupon.discountType === "percentage"
                                ? t("paymentModal.percentageDiscount", {
                                    value: appliedCoupon.discountValue,
                                  })
                                : t("paymentModal.fixedDiscount", {
                                    value: appliedCoupon.discountValue,
                                  })}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#4f8173] transition hover:bg-white hover:text-[#d9704b]"
                          aria-label={t("paymentModal.removeCoupon")}
                        >
                          <FiX />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-start gap-2 rounded-xl border border-[#f2d2c7] bg-[#fff2ed] p-3 text-[#bc5638]"
                    >
                      <FiAlertCircle className="mt-0.5 shrink-0" />
                      <span className="text-xs font-semibold leading-5">
                        {error}
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="mt-4 overflow-hidden rounded-[1.3rem] border border-[#e7e1d6] bg-[#263c35] text-white shadow-[0_16px_38px_rgba(38,60,53,0.16)]">
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#f7c969]">
                          <FiCreditCard />
                        </span>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/55">
                            {t("paymentModal.paymentSummary")}
                          </p>
                          <p className="text-sm font-extrabold">
                            {t("paymentModal.priceBreakdown")}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/75">
                        {t("paymentModal.currency")}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2.5 text-sm">
                      <div className="flex items-center justify-between text-white/70">
                        <span>{t("paymentModal.coursePrice")}</span>
                        <span className="font-bold text-white">
                          ৳{course?.price || 0}
                        </span>
                      </div>

                      {appliedCoupon && (
                        <div className="flex items-center justify-between text-[#9de2c9]">
                          <span>{t("paymentModal.couponDiscount")}</span>
                          <span className="font-extrabold">
                            -৳{appliedCoupon.discountAmount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-white/10 bg-white/6 px-4 py-4 sm:px-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-white/55">
                          {t("paymentModal.totalPayable")}
                        </p>
                        {appliedCoupon && (
                          <p className="mt-1 text-xs font-bold text-[#9de2c9]">
                            {t("paymentModal.saving", {
                              amount: appliedCoupon.savings,
                            })}
                          </p>
                        )}
                      </div>

                      <p className="text-2xl font-extrabold text-[#f7c969]">
                        ৳{calculateFinalAmount()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Process */}
                <div className="mt-4 rounded-[1.3rem] border border-[#dce7e1] bg-[#f5faf7] p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e5f4ee] text-[#16745f]">
                      <FiInfo />
                    </span>

                    <div className="min-w-0 flex-1">
                      <h5 className="text-sm font-extrabold text-[#263c35]">
                        {t("paymentModal.processTitle")}
                      </h5>

                      <div className="mt-3 space-y-3">
                        {paymentSteps.map((step, index) => (
                          <div
                            key={step}
                            className="flex items-start gap-3 text-xs leading-5 text-[#60716a] sm:text-sm"
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-extrabold text-[#16745f] shadow-sm ring-1 ring-[#dce7e1]">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="sticky bottom-0 z-20 border-t border-[#e8e1d5] bg-[#fffdf8]/94 px-5 py-4 backdrop-blur-xl sm:px-6">
                <button
                  type="button"
                  onClick={handleProceedToManualPayment}
                  disabled={!course}
                  className="group inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#16745f] px-5 text-base font-extrabold text-white shadow-[0_14px_32px_rgba(22,116,95,0.23)] transition hover:-translate-y-0.5 hover:bg-[#115f4e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>{t("paymentModal.continue")}</span>
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </button>

                <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-[#84918c]">
                  <FiCheck className="text-[#16745f]" />
                  {t("paymentModal.nextStep")}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
