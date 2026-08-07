// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiInfo,
  FiKey,
  FiLoader,
  FiLock,
  FiShield,
} from "react-icons/fi";
import { useState } from "react";
import { Link, useParams } from "react-router";
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

  const { token } = useParams();
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

    if (response?.success) {
      setStep(2);
      await logout();
    } else {
      toast.error(
        response?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Password reset failed",
      );
    }
  };

  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword !== "";

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
        {/* Main reset form */}
        <section className="order-2 bg-[#fffdf8] p-5 sm:p-8 lg:order-1 lg:p-10 xl:p-12">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full border border-[#dce5df] bg-white px-3 py-2 text-xs font-extrabold text-[#16745f] transition hover:border-[#8bcdbd] hover:bg-[#f1f8f5]"
          >
            <FiArrowLeft />
            সাইন ইন পেজে ফিরে যান
          </Link>

          <div className="mt-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#eeeafd] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#6e5bb4]">
              <FiShield />
              Secure Password Reset
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[#263c35] sm:text-4xl">
              {step === 1 ? (
                <>
                  একটি নতুন
                  <span className="relative ml-2 inline-block text-[#16745f]">
                    পাসওয়ার্ড তৈরি করুন
                    <span className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 rounded-full bg-[#f7c969]/45" />
                  </span>
                </>
              ) : (
                <>
                  পাসওয়ার্ড
                  <span className="relative ml-2 inline-block text-[#16745f]">
                    সফলভাবে পরিবর্তন হয়েছে
                    <span className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 rounded-full bg-[#f7c969]/45" />
                  </span>
                </>
              )}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#71817b]">
              {step === 1
                ? "আপনার অ্যাকাউন্টের জন্য একটি নতুন নিরাপদ পাসওয়ার্ড লিখুন এবং একই পাসওয়ার্ড পুনরায় নিশ্চিত করুন।"
                : "আপনার নতুন পাসওয়ার্ড এখন সক্রিয়। নতুন পাসওয়ার্ড ব্যবহার করে আবার সাইন ইন করতে পারবেন।"}
            </p>
          </div>

          {/* Progress */}
          <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div
              className={`rounded-[1.15rem] border p-3 ${
                step >= 1
                  ? "border-[#cfe6dc] bg-[#edf8f3]"
                  : "border-[#e4e8e4] bg-[#f7f9f7]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#16745f] font-extrabold text-white">
                  {step === 2 ? <FiCheck /> : "1"}
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a9691]">
                    Step One
                  </p>
                  <p className="text-xs font-extrabold text-[#263c35] sm:text-sm">
                    নতুন পাসওয়ার্ড
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`h-0.5 w-5 rounded-full sm:w-8 ${
                step === 2 ? "bg-[#16745f]" : "bg-[#dfe5e0]"
              }`}
            />

            <div
              className={`rounded-[1.15rem] border p-3 transition ${
                step === 2
                  ? "border-[#ded8f4] bg-[#f7f4ff]"
                  : "border-[#e4e8e4] bg-[#f7f9f7]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-extrabold ${
                    step === 2
                      ? "bg-[#7865c9] text-white"
                      : "bg-[#e9eeea] text-[#7d8b85]"
                  }`}
                >
                  2
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a9691]">
                    Step Two
                  </p>
                  <p className="text-xs font-extrabold text-[#263c35] sm:text-sm">
                    সম্পন্ন
                  </p>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="reset-password-form"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >
                {/* New password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#40554d]"
                  >
                    <FiKey className="text-[#7865c9]" />
                    নতুন পাসওয়ার্ড
                    <span className="text-[#d9704b]">*</span>
                  </label>

                  <div className="relative">
                    <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9893]" />

                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="h-13 w-full rounded-xl border border-[#dfe5e0] bg-white pl-11 pr-12 text-sm font-medium text-[#263c35] outline-none transition placeholder:text-[#9ba6a2] focus:border-[#8bcdbd] focus:ring-4 focus:ring-[#8bcdbd]/15"
                      placeholder="নতুন পাসওয়ার্ড লিখুন"
                      required
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#8b9893] transition hover:bg-[#eef3ef] hover:text-[#16745f]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#40554d]"
                  >
                    <FiLock className="text-[#d9704b]" />
                    নতুন পাসওয়ার্ড নিশ্চিত করুন
                    <span className="text-[#d9704b]">*</span>
                  </label>

                  <div className="relative">
                    <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9893]" />

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`h-13 w-full rounded-xl border bg-white pl-11 pr-12 text-sm font-medium text-[#263c35] outline-none transition placeholder:text-[#9ba6a2] focus:ring-4 ${
                        formData.confirmPassword
                          ? passwordsMatch
                            ? "border-[#8bcdbd] focus:border-[#16745f] focus:ring-[#8bcdbd]/15"
                            : "border-[#e4a58f] focus:border-[#d9704b] focus:ring-[#ef8f6d]/12"
                          : "border-[#dfe5e0] focus:border-[#8bcdbd] focus:ring-[#8bcdbd]/15"
                      }`}
                      placeholder="পাসওয়ার্ড আবার লিখুন"
                      required
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#8b9893] transition hover:bg-[#eef3ef] hover:text-[#16745f]"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirmed password"
                          : "Show confirmed password"
                      }
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>

                  <AnimatePresence>
                    {formData.confirmPassword && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className={`mt-2 flex items-center gap-1.5 text-xs font-bold ${
                          passwordsMatch ? "text-[#16745f]" : "text-[#c6573a]"
                        }`}
                      >
                        {passwordsMatch ? <FiCheckCircle /> : <FiInfo />}
                        {passwordsMatch
                          ? "দুটি পাসওয়ার্ড মিলেছে"
                          : "দুটি পাসওয়ার্ড মিলছে না"}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Notice */}
                <div className="flex items-start gap-3 rounded-[1.15rem] border border-[#ded8f4] bg-[#f7f4ff] p-4">
                  <FiInfo className="mt-0.5 shrink-0 text-[#7865c9]" />
                  <p className="text-xs leading-6 text-[#665d82] sm:text-sm">
                    নিরাপত্তার জন্য এমন পাসওয়ার্ড ব্যবহার করুন যা অন্য কোনো
                    অ্যাকাউন্টে ব্যবহার করেন না।
                  </p>
                </div>

                <motion.button
                  whileHover={{ y: loading || !passwordsMatch ? 0 : -2 }}
                  whileTap={{ scale: loading || !passwordsMatch ? 1 : 0.99 }}
                  type="submit"
                  disabled={loading || !passwordsMatch}
                  className="group inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#16745f] px-6 text-base font-extrabold text-white shadow-[0_15px_34px_rgba(22,116,95,0.24)] transition hover:bg-[#115f4e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" />
                      রিসেট করা হচ্ছে...
                    </>
                  ) : (
                    <>
                      পাসওয়ার্ড রিসেট করুন
                      <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="password-reset-success"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3 }}
                className="mt-7"
              >
                <div className="rounded-[1.4rem] border border-[#cfe6dc] bg-[#edf8f3] p-6 text-center">
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 20 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#16745f] text-white shadow-[0_12px_28px_rgba(22,116,95,0.22)]"
                  >
                    <FiCheckCircle className="text-3xl" />
                  </motion.div>

                  <h3 className="mt-4 text-xl font-extrabold text-[#263c35]">
                    পাসওয়ার্ড আপডেট হয়েছে
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-[#5d746a]">
                    আপনার নতুন পাসওয়ার্ড সফলভাবে সংরক্ষণ করা হয়েছে। এখন নতুন
                    পাসওয়ার্ড ব্যবহার করে সাইন ইন করুন।
                  </p>
                </div>

                <Link
                  to="/login"
                  className="group mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#16745f] px-6 text-base font-extrabold text-white shadow-[0_15px_34px_rgba(22,116,95,0.24)] transition hover:-translate-y-0.5 hover:bg-[#115f4e]"
                >
                  এখন সাইন ইন করুন
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Security side */}
        <motion.aside
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="relative hidden md:block order-1 overflow-hidden bg-[#263c35] p-6 text-white sm:p-8 lg:order-2 lg:p-10 xl:p-12"
        >
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#f7c969]/16" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#ef8f6d]/10" />
          <div className="absolute right-10 top-1/2 h-40 w-40 rounded-full bg-[#8bcdbd]/10 blur-2xl" />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#f7c969]">
                  <FiKey />
                  New Password
                </span>

                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#9de2c9]">
                  <FiShield className="text-xl" />
                </span>
              </div>

              <h2 className="mt-7 text-3xl font-extrabold leading-tight sm:text-4xl">
                নতুন পাসওয়ার্ডটি শক্তিশালী ও আলাদা রাখুন
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-white/68 sm:text-base">
                একটি শক্তিশালী পাসওয়ার্ড আপনার অ্যাকাউন্ট, কোর্স ও ব্যক্তিগত
                তথ্যকে অননুমোদিত প্রবেশ থেকে সুরক্ষিত রাখতে সাহায্য করে।
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড ব্যবহার করা ভালো",
                  "বড় ও ছোট হাতের অক্ষর, সংখ্যা ও চিহ্ন মিশিয়ে ব্যবহার করুন",
                  "আগের পাসওয়ার্ড পুনরায় ব্যবহার না করাই নিরাপদ",
                  "পাসওয়ার্ড অন্য কারও সঙ্গে শেয়ার করবেন না",
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.08 + 0.25,
                    }}
                    className="flex items-start gap-3 rounded-[1.15rem] border border-white/10 bg-white/6 p-3.5 backdrop-blur"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#f7c969]">
                      <FiCheck className="text-sm" />
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
                      Security Reminder
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/52">
                      পাসওয়ার্ড reset link বা নতুন পাসওয়ার্ড কারও সঙ্গে শেয়ার
                      করবেন না।
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] font-semibold text-white/45">
                <FiShield className="text-[#9de2c9]" />
                Secure password reset workflow
              </p>
            </div>
          </div>
        </motion.aside>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
