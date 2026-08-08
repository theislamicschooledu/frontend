import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiInfo,
  FiKey,
  FiLock,
  FiMail,
  FiShield,
  FiUserCheck,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";

const VerifyOtp = () => {
  const [formData, setFormData] = useState({
    email: "",
    code: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { verifyOtp } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (message) {
      setMessage("");
      setIsSuccess(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = t("verifyOtpPage.validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("verifyOtpPage.validation.invalidEmail");
    }

    if (!formData.code) {
      newErrors.code = t("verifyOtpPage.validation.otpRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    try {
      const response = await verifyOtp(formData.email, formData.code);

      if (response?.success) {
        setIsSuccess(true);
        setMessage(t("verifyOtpPage.successMessage"));

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setIsSuccess(false);
        setMessage(response?.message || t("verifyOtpPage.verificationFailed"));
      }
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setMessage(t("verifyOtpPage.serverError"));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    t("verifyOtpPage.steps.email"),
    t("verifyOtpPage.steps.otp"),
    t("verifyOtpPage.steps.login"),
  ];

  return (
    <div className="font-hind relative min-h-screen overflow-hidden bg-[#f8f5ed] px-3 py-8 text-[#263c35] sm:px-5">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-8 h-80 w-80 rounded-full bg-[#f7c969]/16 blur-3xl" />
        <div className="absolute -right-28 top-20 h-80 w-80 rounded-full bg-[#9d8be8]/14 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#8bcdbd]/12 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-4xl border border-white/80 bg-white shadow-[0_28px_90px_rgba(31,67,55,0.16)] lg:grid-cols-[1.06fr_0.94fr]"
      >
        {/* Verification form */}
        <section className="order-2 bg-[#fffdf8] p-5 sm:p-8 lg:order-1 lg:p-10 xl:p-12">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full border border-[#dce5df] bg-white px-3 py-2 text-xs font-extrabold text-[#16745f] transition hover:border-[#8bcdbd] hover:bg-[#f1f8f5]"
          >
            <FiArrowLeft />
            {t("verifyOtpPage.backLogin")}
          </Link>

          <div className="mt-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#eeeafd] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#6e5bb4]">
              <FiShield />
              {t("verifyOtpPage.badge")}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[#263c35] sm:text-4xl">
              {t("verifyOtpPage.headingPrefix")}
              <span className="relative ml-2 inline-block text-[#16745f]">
                {t("verifyOtpPage.headingAccent")}
                <span className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 rounded-full bg-[#f7c969]/45" />
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#71817b]">
              {t("verifyOtpPage.description")}
            </p>
          </div>

          {/* Verification status */}
          <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="rounded-[1.15rem] border border-[#cfe6dc] bg-[#edf8f3] p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#16745f] text-white">
                  <FiMail />
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a9691]">
                    {t("verifyOtpPage.stepOne")}
                  </p>
                  <p className="text-xs font-extrabold text-[#263c35] sm:text-sm">
                    {t("verifyOtpPage.receiveOtp")}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-0.5 w-5 rounded-full bg-[#dfe5e0] sm:w-8" />

            <div className="rounded-[1.15rem] border border-[#ded8f4] bg-[#f7f4ff] p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#7865c9] text-white">
                  <FiUserCheck />
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a9691]">
                    {t("verifyOtpPage.stepTwo")}
                  </p>
                  <p className="text-xs font-extrabold text-[#263c35] sm:text-sm">
                    {t("verifyOtpPage.verifyAccountShort")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#40554d]"
              >
                <FiMail className="text-[#16745f]" />
                {t("verifyOtpPage.emailLabel")}
                <span className="text-[#d9704b]">*</span>
              </label>

              <div className="relative">
                <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9893]" />

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`h-13 w-full rounded-xl border bg-white pl-11 pr-4 text-sm font-medium text-[#263c35] outline-none transition placeholder:text-[#9ba6a2] focus:ring-4 ${
                    errors.email
                      ? "border-[#e4a58f] focus:border-[#d9704b] focus:ring-[#ef8f6d]/12"
                      : "border-[#dfe5e0] focus:border-[#8bcdbd] focus:ring-[#8bcdbd]/15"
                  }`}
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </div>

              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="mt-1.5 text-xs font-semibold text-[#c6573a]"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* OTP */}
            <div>
              <label
                htmlFor="code"
                className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#40554d]"
              >
                <FiKey className="text-[#7865c9]" />
                {t("verifyOtpPage.otpLabel")}
                <span className="text-[#d9704b]">*</span>
              </label>

              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9893]" />

                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className={`h-13 w-full rounded-xl border bg-white pl-11 pr-4 font-mono text-base font-extrabold tracking-[0.28em] text-[#263c35] outline-none transition placeholder:font-medium placeholder:tracking-normal placeholder:text-[#9ba6a2] focus:ring-4 ${
                    errors.code
                      ? "border-[#e4a58f] focus:border-[#d9704b] focus:ring-[#ef8f6d]/12"
                      : "border-[#dfe5e0] focus:border-[#a99be3] focus:ring-[#a99be3]/15"
                  }`}
                  placeholder={t("verifyOtpPage.otpPlaceholder")}
                  autoComplete="one-time-code"
                />
              </div>

              <AnimatePresence>
                {errors.code && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="mt-1.5 text-xs font-semibold text-[#c6573a]"
                  >
                    {errors.code}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Message */}
            <AnimatePresence mode="wait">
              {message && (
                <motion.div
                  key={message}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`flex items-start gap-3 rounded-[1.15rem] border p-4 ${
                    isSuccess
                      ? "border-[#cfe6dc] bg-[#edf8f3] text-[#4f7065]"
                      : "border-[#f1d8ce] bg-[#fff7f2] text-[#76594f]"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      isSuccess
                        ? "bg-[#16745f] text-white"
                        : "bg-[#fff0e9] text-[#d86545]"
                    }`}
                  >
                    {isSuccess ? <FiCheckCircle /> : <FiInfo />}
                  </span>

                  <p className="text-sm font-semibold leading-6">{message}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ y: loading ? 0 : -2 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              type="submit"
              disabled={loading}
              className="group inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#16745f] px-6 text-base font-extrabold text-white shadow-[0_15px_34px_rgba(22,116,95,0.24)] transition hover:bg-[#115f4e] disabled:cursor-not-allowed disabled:opacity-55"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                  {t("verifyOtpPage.verifying")}
                </>
              ) : (
                <>
                  {t("verifyOtpPage.verifyAccount")}
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 border-t border-[#ece5d8] pt-5">
            <div className="flex items-start gap-3 rounded-[1.15rem] border border-[#d4e9e1] bg-[#f1f9f6] p-4">
              <FiInfo className="mt-0.5 shrink-0 text-[#16745f]" />
              <p className="text-xs leading-6 text-[#4f7065] sm:text-sm">
                {t("verifyOtpPage.notice")}
              </p>
            </div>
          </div>
        </section>

        {/* Information side */}
        <motion.aside
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="relative order-1 overflow-hidden bg-[#263c35] p-6 text-white sm:p-8 lg:order-2 lg:p-10 xl:p-12"
        >
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#f7c969]/16" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#ef8f6d]/10" />
          <div className="absolute right-10 top-1/2 h-40 w-40 rounded-full bg-[#8bcdbd]/10 blur-2xl" />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#f7c969]">
                  <FiUserCheck />
                  {t("verifyOtpPage.asideBadge")}
                </span>

                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#9de2c9]">
                  <FiShield className="text-xl" />
                </span>
              </div>

              <h2 className="mt-7 text-3xl font-extrabold leading-tight sm:text-4xl">
                {t("verifyOtpPage.asideTitle")}
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-white/68 sm:text-base">
                {t("verifyOtpPage.asideDescription")}
              </p>

              <div className="mt-8 space-y-3">
                {steps.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.09 + 0.25,
                    }}
                    className="flex items-start gap-3 rounded-[1.15rem] border border-white/10 bg-white/6 p-3.5 backdrop-blur"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-extrabold text-[#f7c969]">
                      {index + 1}
                    </span>

                    <p className="text-sm leading-6 text-white/68">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#9de2c9]">
                    <FiLock />
                  </span>

                  <div>
                    <p className="text-sm font-extrabold text-white">
                      {t("verifyOtpPage.securityTitle")}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/52">
                      {t("verifyOtpPage.securityDescription")}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] font-semibold text-white/45">
                <FiShield className="text-[#9de2c9]" />
                {t("verifyOtpPage.secureWorkflow")}
              </p>
            </div>
          </div>
        </motion.aside>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
