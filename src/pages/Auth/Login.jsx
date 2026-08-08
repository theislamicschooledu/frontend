// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBarChart2,
  FiBookOpen,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiPlayCircle,
  FiShield,
  FiTarget,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });

  const { login, loading } = useAuth();
  const { language, t } = useLanguage();
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
      toast.error(t("loginPage.validationRequired"));
      return;
    }

    const response = await login(formData.identifier, formData.password);

    if (response?.success) {
      navigate("/");
    } else {
      toast.error(response?.message || t("loginPage.loginFailed"));
    }
  };

  const benefits = [
    {
      icon: FiBarChart2,
      title: t("loginPage.benefits.dashboardTitle"),
      text: t("loginPage.benefits.dashboardText"),
    },
    {
      icon: FiTarget,
      title: t("loginPage.benefits.progressTitle"),
      text: t("loginPage.benefits.progressText"),
    },
    {
      icon: FiPlayCircle,
      title: t("loginPage.benefits.resumeTitle"),
      text: t("loginPage.benefits.resumeText"),
    },
  ];

  const stats = [
    {
      value: language === "bn" ? "৪২+" : "42+",
      label: t("loginPage.stats.courses"),
    },
    {
      value: language === "bn" ? "১১৪+" : "114+",
      label: t("loginPage.stats.teachers"),
    },
    {
      value: language === "bn" ? "১ লক্ষ+" : "100K+",
      label: t("loginPage.stats.students"),
    },
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
        className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-4xl border border-white/80 bg-white shadow-[0_28px_90px_rgba(31,67,55,0.16)] lg:grid-cols-[1.08fr_0.92fr]"
      >
        {/* Login form */}
        <section className="order-2 bg-[#fffdf8] p-5 sm:p-8 lg:order-1 lg:p-10 xl:p-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#dce5df] bg-white px-3 py-2 text-xs font-extrabold text-[#16745f] transition hover:border-[#8bcdbd] hover:bg-[#f1f8f5]"
            >
              <FiArrowLeft />
              {t("loginPage.backHome")}
            </Link>

            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-[#eef8f4] px-3 py-2 text-xs font-extrabold text-[#16745f] transition hover:bg-[#e2f2ec]"
            >
              {t("loginPage.signUp")}
              <FiArrowRight />
            </Link>
          </div>

          <div className="mt-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#eeeafd] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#6e5bb4]">
              <FiShield />
              {t("loginPage.badge")}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[#263c35] sm:text-4xl">
              {t("loginPage.headingPrefix")}
              <span className="relative ml-2 inline-block text-[#16745f]">
                {t("loginPage.headingAccent")}
                <span className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 rounded-full bg-[#f7c969]/45" />
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#71817b]">
              {t("loginPage.description")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Identifier */}
            <div>
              <label
                htmlFor="identifier"
                className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#40554d]"
              >
                <FiMail className="text-[#16745f]" />
                {t("loginPage.identifierLabel")}
                <span className="text-[#d9704b]">*</span>
              </label>

              <div className="relative">
                <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9893]" />

                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  className="h-13 w-full rounded-xl border border-[#dfe5e0] bg-white pl-11 pr-4 text-sm font-medium text-[#263c35] outline-none transition placeholder:text-[#9ba6a2] focus:border-[#8bcdbd] focus:ring-4 focus:ring-[#8bcdbd]/15"
                  placeholder={t("loginPage.identifierPlaceholder")}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="flex items-center gap-2 text-sm font-extrabold text-[#40554d]"
                >
                  <FiLock className="text-[#d9704b]" />
                  {t("loginPage.passwordLabel")}
                  <span className="text-[#d9704b]">*</span>
                </label>

                <Link
                  to="/forget-password"
                  className="text-xs font-extrabold text-[#16745f] transition hover:text-[#115f4e]"
                >
                  {t("loginPage.forgotPassword")}
                </Link>
              </div>

              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9893]" />

                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-13 w-full rounded-xl border border-[#dfe5e0] bg-white pl-11 pr-12 text-sm font-medium text-[#263c35] outline-none transition placeholder:text-[#9ba6a2] focus:border-[#8bcdbd] focus:ring-4 focus:ring-[#8bcdbd]/15"
                  placeholder={t("loginPage.passwordPlaceholder")}
                  required
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#8b9893] transition hover:bg-[#eef3ef] hover:text-[#16745f]"
                  aria-label={
                    showPassword
                      ? t("loginPage.hidePassword")
                      : t("loginPage.showPassword")
                  }
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="rounded-[1.15rem] border border-[#dfe7e1] bg-[#f8faf7] p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 rounded border-[#cbd6cf] text-[#16745f] focus:ring-[#8bcdbd]"
                />

                <span className="text-sm font-medium leading-6 text-[#63736c]">
                  {t("loginPage.rememberMe")}
                </span>
              </label>
            </div>

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
                  {t("loginPage.signingIn")}
                </>
              ) : (
                <>
                  {t("loginPage.signIn")}
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-7 border-t border-[#ece5d8] pt-5 text-center">
            <p className="text-sm text-[#71817b]">
              {t("loginPage.noAccount")}{" "}
              <Link
                to="/signup"
                className="inline-flex items-center gap-1 font-extrabold text-[#16745f] transition hover:text-[#115f4e]"
              >
                {t("loginPage.createAccount")}
                <FiUserPlus />
              </Link>
            </p>
          </div>

          <p className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] font-semibold text-[#8a9691]">
            <FiShield className="text-[#16745f]" />
            {t("loginPage.secureInfo")}
          </p>
        </section>

        {/* Benefits */}
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
                  <FiBookOpen />
                  {t("loginPage.asideBadge")}
                </span>

                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#9de2c9]">
                  <FiCheckCircle className="text-xl" />
                </span>
              </div>

              <h2 className="mt-7 text-3xl font-extrabold leading-tight sm:text-4xl">
                {t("loginPage.asideTitle")}
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-white/68 sm:text-base">
                {t("loginPage.asideDescription")}
              </p>

              <div className="mt-8 space-y-3">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;

                  return (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.09 + 0.25,
                      }}
                      className="flex items-start gap-3 rounded-[1.15rem] border border-white/10 bg-white/5.5 p-3.5 backdrop-blur"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#f7c969]">
                        <Icon />
                      </span>

                      <div>
                        <h3 className="text-sm font-extrabold text-white">
                          {benefit.title}
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-white/58">
                          {benefit.text}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="grid grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-white/[0.07] p-3 text-center"
                  >
                    <p className="text-lg font-extrabold text-[#f7c969]">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold text-white/45">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#263c35] bg-linear-to-br from-[#6ab5a1] to-[#16745f] text-xs font-extrabold text-white"
                    >
                      {item}
                    </div>
                  ))}

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#263c35] bg-[#f7c969] text-[10px] font-extrabold text-[#263c35]">
                    +2k
                  </div>
                </div>
              </div>

              <p className="mt-3 flex items-center justify-center gap-2 text-center text-[11px] font-semibold text-white/45">
                <FiUsers className="text-[#9de2c9]" />
                {t("loginPage.trustedPlatform")}
              </p>
            </div>
          </div>
        </motion.aside>
      </motion.div>
    </div>
  );
};

export default Login;
