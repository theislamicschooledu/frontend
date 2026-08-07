// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiInfo,
  FiLock,
  FiMail,
  FiRefreshCw,
  FiSend,
  FiShield,
} from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const { forgotPassword, error, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await forgotPassword(email);

    if (response?.success) {
      setStep(2);
    } else {
      toast.error(
        response?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to send reset link",
      );
    }
  };

  const handleResend = () => {
    setStep(1);
  };

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
        {/* Main form */}
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
              Password Recovery
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[#263c35] sm:text-4xl">
              {step === 1 ? (
                <>
                  আপনার পাসওয়ার্ড
                  <span className="relative ml-2 inline-block text-[#16745f]">
                    রিসেট করুন
                    <span className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 rounded-full bg-[#f7c969]/45" />
                  </span>
                </>
              ) : (
                <>
                  আপনার ইমেইল
                  <span className="relative ml-2 inline-block text-[#16745f]">
                    চেক করুন
                    <span className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 rounded-full bg-[#f7c969]/45" />
                  </span>
                </>
              )}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#71817b]">
              {step === 1
                ? "আপনার নিবন্ধিত ইমেইল ঠিকানা দিন। আমরা সেখানে পাসওয়ার্ড রিসেট করার নির্দেশনা পাঠাব।"
                : "পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে। ইনবক্সে গিয়ে নির্দেশনাগুলো অনুসরণ করুন।"}
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
                  {step === 2 ? <FiCheckCircle /> : "1"}
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a9691]">
                    Step One
                  </p>
                  <p className="text-xs font-extrabold text-[#263c35] sm:text-sm">
                    ইমেইল দিন
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
                    ইমেইল যাচাই
                  </p>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="forgot-password-form"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="mt-7"
              >
                <label
                  htmlFor="email"
                  className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#40554d]"
                >
                  <FiMail className="text-[#16745f]" />
                  ইমেইল ঠিকানা
                  <span className="text-[#d9704b]">*</span>
                </label>

                <div className="relative">
                  <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9893]" />

                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-13 w-full rounded-xl border border-[#dfe5e0] bg-white pl-11 pr-4 text-sm font-medium text-[#263c35] outline-none transition placeholder:text-[#9ba6a2] focus:border-[#8bcdbd] focus:ring-4 focus:ring-[#8bcdbd]/15"
                    placeholder="name@example.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-[1.15rem] border border-[#d4e9e1] bg-[#f1f9f6] p-4">
                  <FiInfo className="mt-0.5 shrink-0 text-[#16745f]" />
                  <p className="text-xs leading-6 text-[#4f7065] sm:text-sm">
                    যে ইমেইল ঠিকানা দিয়ে অ্যাকাউন্ট তৈরি করেছিলেন, সেই ইমেইলটি
                    ব্যবহার করুন।
                  </p>
                </div>

                <motion.button
                  whileHover={{ y: loading || !email ? 0 : -2 }}
                  whileTap={{ scale: loading || !email ? 1 : 0.99 }}
                  type="submit"
                  disabled={loading || !email}
                  className="group mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#16745f] px-6 text-base font-extrabold text-white shadow-[0_15px_34px_rgba(22,116,95,0.24)] transition hover:bg-[#115f4e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                      লিংক পাঠানো হচ্ছে...
                    </>
                  ) : (
                    <>
                      <FiSend />
                      রিসেট লিংক পাঠান
                      <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="email-sent"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3 }}
                className="mt-7"
              >
                <div className="rounded-[1.4rem] border border-[#cfe6dc] bg-[#edf8f3] p-5 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#16745f] text-white shadow-[0_12px_28px_rgba(22,116,95,0.22)]">
                    <FiCheckCircle className="text-3xl" />
                  </div>

                  <h3 className="mt-4 text-xl font-extrabold text-[#263c35]">
                    ইমেইল সফলভাবে পাঠানো হয়েছে
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-[#5d746a]">
                    আমরা{" "}
                    <span className="font-extrabold text-[#16745f]">
                      {email}
                    </span>{" "}
                    ঠিকানায় একটি পাসওয়ার্ড রিসেট লিংক পাঠিয়েছি।
                  </p>
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-[1.15rem] border border-[#ded8f4] bg-[#f7f4ff] p-4">
                  <FiInfo className="mt-0.5 shrink-0 text-[#7865c9]" />
                  <p className="text-xs leading-6 text-[#665d82] sm:text-sm">
                    ইমেইলটি না পেলে spam বা promotions folder দেখুন। কয়েক মিনিট
                    অপেক্ষা করে পুনরায় লিংক পাঠাতে পারেন।
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleResend}
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#dfe5e0] bg-white px-5 text-sm font-extrabold text-[#53665e] transition hover:border-[#8bcdbd] hover:bg-[#f1f8f5] hover:text-[#16745f]"
                  >
                    <FiRefreshCw />
                    আবার লিংক পাঠান
                  </button>

                  <Link
                    to="/login"
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#16745f] px-5 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(22,116,95,0.22)] transition hover:bg-[#115f4e]"
                  >
                    সাইন ইন পেজে যান
                    <FiArrowRight />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-7 border-t border-[#ece5d8] pt-5 text-center">
            <p className="text-sm text-[#71817b]">
              আরও সহায়তা প্রয়োজন?{" "}
              <Link
                to="/contact"
                className="font-extrabold text-[#16745f] transition hover:text-[#115f4e]"
              >
                সাপোর্টে যোগাযোগ করুন
              </Link>
            </p>
          </div>
        </section>

        {/* Security information */}
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
                  <FiLock />
                  Account Recovery
                </span>

                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#9de2c9]">
                  <FiShield className="text-xl" />
                </span>
              </div>

              <h2 className="mt-7 text-3xl font-extrabold leading-tight sm:text-4xl">
                নিরাপদভাবে আপনার অ্যাকাউন্টে ফিরে আসুন
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-white/68 sm:text-base">
                পাসওয়ার্ড ভুলে গেলে আপনার নিবন্ধিত ইমেইলের মাধ্যমে নিরাপদভাবে
                অ্যাকাউন্ট পুনরুদ্ধার করতে পারবেন।
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "রিসেট লিংক শুধুমাত্র নিবন্ধিত ইমেইলে পাঠানো হয়",
                  "রিসেট লিংক অন্য কারও সঙ্গে শেয়ার করবেন না",
                  "নতুন পাসওয়ার্ড পূর্বের পাসওয়ার্ড থেকে আলাদা রাখুন",
                  "সন্দেহজনক কোনো ইমেইলের লিংকে ক্লিক করবেন না",
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
                      <FiCheckCircle className="text-sm" />
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
                    <FiShield />
                  </span>

                  <div>
                    <p className="text-sm font-extrabold text-white">
                      Security Reminder
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/52">
                      আমাদের সাপোর্ট টিম কখনো আপনার পাসওয়ার্ড বা রিসেট লিংক
                      জানতে চাইবে না।
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] font-semibold text-white/45">
                <FiShield className="text-[#9de2c9]" />
                Secure password recovery workflow
              </p>
            </div>
          </div>
        </motion.aside>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
