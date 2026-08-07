// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
    setMessage("");

    try {
      const res = await verifyOldPassword(oldPassword);

      if (res.success) {
        setStep(2);
        setShowPassword(false);
        setMessage("Old password verified! Now set a new password.");
        setMessageColor(1);
      } else {
        setMessage(res.message || "Unable to verify your old password.");
        setMessageColor(2);
      }
    } catch (error) {
      setMessage(error.message);
      setMessageColor(2);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLocalLoading(true);
    setMessage("");

    try {
      const res = await changePassword(oldPassword, newPassword);

      if (res.success) {
        toast.success("Password changed successfully!");
        navigate("/profile");
      } else {
        setMessage(
          res.message ||
            error?.message ||
            "Unable to change your password. Please try again.",
        );
        setMessageColor(2);
      }
    } catch (error) {
      setMessage(error.message);
      setMessageColor(2);
    } finally {
      setLocalLoading(false);
    }
  };

  const isSuccessMessage = messageColor === 1;

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
        className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-4xl border border-white/80 bg-white shadow-[0_28px_90px_rgba(31,67,55,0.16)] lg:grid-cols-[1.05fr_0.95fr]"
      >
        {/* Form side */}
        <section className="order-2 bg-[#fffdf8] p-5 sm:p-8 lg:order-1 lg:p-10 xl:p-12">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-[#dce5df] bg-white px-3 py-2 text-xs font-extrabold text-[#16745f] transition hover:border-[#8bcdbd] hover:bg-[#f1f8f5]"
          >
            <FiArrowLeft />
            ফিরে যান
          </button>

          <div className="mt-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#eeeafd] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#6e5bb4]">
              <FiShield />
              Account Security
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[#263c35] sm:text-4xl">
              আপনার পাসওয়ার্ড
              <span className="relative ml-2 inline-block text-[#16745f]">
                পরিবর্তন করুন
                <span className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 rounded-full bg-[#f7c969]/45" />
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#71817b]">
              প্রথমে বর্তমান পাসওয়ার্ড যাচাই করুন, এরপর একটি নতুন ও নিরাপদ
              পাসওয়ার্ড সেট করুন।
            </p>
          </div>

          {/* Steps */}
          <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div
              className={`rounded-[1.15rem] border p-3 transition ${
                step >= 1
                  ? "border-[#cfe6dc] bg-[#edf8f3]"
                  : "border-[#e4e8e4] bg-[#f7f9f7]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-extrabold ${
                    step >= 1
                      ? "bg-[#16745f] text-white"
                      : "bg-[#e9eeea] text-[#7d8b85]"
                  }`}
                >
                  {step > 1 ? <FiCheck /> : "1"}
                </span>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a9691]">
                    Step One
                  </p>
                  <p className="truncate text-xs font-extrabold text-[#263c35] sm:text-sm">
                    বর্তমান পাসওয়ার্ড
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

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a9691]">
                    Step Two
                  </p>
                  <p className="truncate text-xs font-extrabold text-[#263c35] sm:text-sm">
                    নতুন পাসওয়ার্ড
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                key={message}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`mt-5 flex items-start gap-3 rounded-[1.15rem] border p-4 ${
                  isSuccessMessage
                    ? "border-[#cfe6dc] bg-[#edf8f3] text-[#4f7065]"
                    : "border-[#f1d8ce] bg-[#fff7f2] text-[#76594f]"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isSuccessMessage
                      ? "bg-[#16745f] text-white"
                      : "bg-[#fff0e9] text-[#d86545]"
                  }`}
                >
                  {isSuccessMessage ? <FiCheckCircle /> : <FiInfo />}
                </span>

                <p className="text-sm font-semibold leading-6">{message}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="verify-old-password"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.3 }}
                >
                  <label
                    htmlFor="old-password"
                    className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#40554d]"
                  >
                    <FiLock className="text-[#d9704b]" />
                    বর্তমান পাসওয়ার্ড
                    <span className="text-[#d9704b]">*</span>
                  </label>

                  <div className="relative">
                    <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9893]" />

                    <input
                      type={showPassword ? "text" : "password"}
                      id="old-password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="h-13 w-full rounded-xl border border-[#dfe5e0] bg-white pl-11 pr-12 text-sm font-medium text-[#263c35] outline-none transition placeholder:text-[#9ba6a2] focus:border-[#8bcdbd] focus:ring-4 focus:ring-[#8bcdbd]/15"
                      placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                      required
                      autoComplete="current-password"
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

                  <motion.button
                    type="button"
                    onClick={handleVerifyOld}
                    disabled={localLoading || !oldPassword}
                    whileHover={{
                      y: localLoading || !oldPassword ? 0 : -2,
                    }}
                    whileTap={{
                      scale: localLoading || !oldPassword ? 1 : 0.99,
                    }}
                    className="group mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#16745f] px-6 text-base font-extrabold text-white shadow-[0_15px_34px_rgba(22,116,95,0.24)] transition hover:bg-[#115f4e] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {localLoading ? (
                      <>
                        <FiLoader className="animate-spin" />
                        যাচাই হচ্ছে...
                      </>
                    ) : (
                      <>
                        বর্তমান পাসওয়ার্ড যাচাই করুন
                        <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="change-password"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <label
                    htmlFor="new-password"
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
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-13 w-full rounded-xl border border-[#dfe5e0] bg-white pl-11 pr-12 text-sm font-medium text-[#263c35] outline-none transition placeholder:text-[#9ba6a2] focus:border-[#a99be3] focus:ring-4 focus:ring-[#a99be3]/15"
                      placeholder="একটি নতুন নিরাপদ পাসওয়ার্ড লিখুন"
                      required
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#8b9893] transition hover:bg-[#f1eff9] hover:text-[#7865c9]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>

                  <div className="mt-3 rounded-[1.1rem] border border-[#e4def7] bg-[#f8f6ff] p-3">
                    <div className="flex items-start gap-2">
                      <FiInfo className="mt-0.5 shrink-0 text-[#7865c9]" />
                      <p className="text-xs leading-6 text-[#665d82]">
                        নিরাপত্তার জন্য পূর্বের পাসওয়ার্ড থেকে আলাদা এবং
                        শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।
                      </p>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={localLoading || !newPassword}
                    whileHover={{
                      y: localLoading || !newPassword ? 0 : -2,
                    }}
                    whileTap={{
                      scale: localLoading || !newPassword ? 1 : 0.99,
                    }}
                    className="group mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#16745f] px-6 text-base font-extrabold text-white shadow-[0_15px_34px_rgba(22,116,95,0.24)] transition hover:bg-[#115f4e] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {localLoading ? (
                      <>
                        <FiLoader className="animate-spin" />
                        পরিবর্তন করা হচ্ছে...
                      </>
                    ) : (
                      <>
                        পাসওয়ার্ড পরিবর্তন করুন
                        <FiCheckCircle />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 border-t border-[#ece5d8] pt-5 text-center text-[11px] font-semibold text-[#8a9691]">
            <FiShield className="text-[#16745f]" />
            আপনার পাসওয়ার্ড এনক্রিপ্টেড ও নিরাপদভাবে সংরক্ষিত থাকে
          </p>
        </section>

        {/* Information side */}
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
                  <FiLock />
                  Password Security
                </span>

                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#9de2c9]">
                  <FiShield className="text-xl" />
                </span>
              </div>

              <h2 className="mt-7 text-3xl font-extrabold leading-tight sm:text-4xl">
                শক্তিশালী পাসওয়ার্ড দিয়ে আপনার অ্যাকাউন্ট সুরক্ষিত রাখুন
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-white/68 sm:text-base">
                একটি নিরাপদ পাসওয়ার্ড আপনার কোর্স, ব্যক্তিগত তথ্য ও শেখার
                অগ্রগতি অননুমোদিত প্রবেশ থেকে রক্ষা করে।
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড ব্যবহার করুন",
                  "বড় ও ছোট হাতের অক্ষর, সংখ্যা ও চিহ্ন যুক্ত করুন",
                  "অন্য কোনো অ্যাকাউন্টের পাসওয়ার্ড পুনরায় ব্যবহার করবেন না",
                  "নিয়মিত বিরতিতে পাসওয়ার্ড পরিবর্তন করুন",
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
                    <FiCheckCircle />
                  </span>

                  <div>
                    <p className="text-sm font-extrabold text-white">
                      Two-step verification
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/52">
                      বর্তমান পাসওয়ার্ড যাচাই না করে নতুন পাসওয়ার্ড সেট করা যাবে
                      না।
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] font-semibold text-white/45">
                <FiShield className="text-[#9de2c9]" />
                নিরাপদ account security workflow
              </p>
            </div>
          </div>
        </motion.aside>
      </motion.div>
    </div>
  );
}
