// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiAward,
  FiBarChart2,
  FiBookOpen,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiPhone,
  FiShield,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";

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
  const { language, t } = useLanguage();
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
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("signupPage.validation.nameRequired");
    }

    if (!formData.email) {
      newErrors.email = t("signupPage.validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("signupPage.validation.invalidEmail");
    }

    if (!formData.phone) {
      newErrors.phone = t("signupPage.validation.phoneRequired");
    } else if (!/^01[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = t("signupPage.validation.invalidPhone");
    }

    if (!formData.password) {
      newErrors.password = t("signupPage.validation.passwordRequired");
    } else if (formData.password.length < 8) {
      newErrors.password = t("signupPage.validation.passwordLength");
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("signupPage.validation.confirmRequired");
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = t("signupPage.validation.passwordMismatch");
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t("signupPage.validation.termsRequired");
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
      alert(response?.message || t("signupPage.signupFailed"));
    }
  };

  const benefits = [
    {
      icon: FiBookOpen,
      title: t("signupPage.benefits.libraryTitle"),
      text: t("signupPage.benefits.libraryText"),
    },
    {
      icon: FiBarChart2,
      title: t("signupPage.benefits.progressTitle"),
      text: t("signupPage.benefits.progressText"),
    },
    {
      icon: FiUsers,
      title: t("signupPage.benefits.teachersTitle"),
      text: t("signupPage.benefits.teachersText"),
    },
    {
      icon: FiAward,
      title: t("signupPage.benefits.interactiveTitle"),
      text: t("signupPage.benefits.interactiveText"),
    },
  ];

  const stats = [
    {
      value: language === "bn" ? "৪২+" : "42+",
      label: t("signupPage.stats.courses"),
    },
    {
      value: language === "bn" ? "১১৪+" : "114+",
      label: t("signupPage.stats.teachers"),
    },
    {
      value: language === "bn" ? "১ লক্ষ+" : "100K+",
      label: t("signupPage.stats.students"),
    },
  ];

  const getInputClass = (fieldName, extra = "") =>
    `h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm font-medium text-[#263c35] outline-none transition placeholder:text-[#9ba6a2] focus:ring-4 ${
      errors[fieldName]
        ? "border-[#e4a58f] focus:border-[#d9704b] focus:ring-[#ef8f6d]/12"
        : "border-[#dfe5e0] focus:border-[#8bcdbd] focus:ring-[#8bcdbd]/15"
    } ${extra}`;

  return (
    <div className="font-hind relative min-h-screen overflow-hidden bg-[#f8f5ed] px-3 text-[#263c35] sm:px-5 py-8">
      {/* Page decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#f7c969]/16 blur-3xl" />
        <div className="absolute -right-28 top-24 h-80 w-80 rounded-full bg-[#9d8be8]/14 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#8bcdbd]/12 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-4xl border border-white/80 bg-white shadow-[0_28px_90px_rgba(31,67,55,0.16)] lg:grid-cols-[1.08fr_0.92fr]"
      >
        {/* Form side */}
        <section className="order-2 bg-[#fffdf8] p-5 sm:p-8 lg:order-1 lg:p-10 xl:p-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#dce5df] bg-white px-3 py-2 text-xs font-extrabold text-[#16745f] transition hover:border-[#8bcdbd] hover:bg-[#f1f8f5]"
            >
              <FiArrowLeft />
              {t("signupPage.backHome")}
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full bg-[#eef8f4] px-3 py-2 text-xs font-extrabold text-[#16745f] transition hover:bg-[#e2f2ec]"
            >
              {t("signupPage.signIn")}
              <FiArrowRight />
            </Link>
          </div>

          <div className="mt-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#eeeafd] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#6e5bb4]">
              <FiShield />
              {t("signupPage.badge")}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[#263c35] sm:text-4xl">
              {t("signupPage.headingPrefix")}
              <span className="relative ml-2 inline-block text-[#16745f]">
                {t("signupPage.headingAccent")}
                <span className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 rounded-full bg-[#f7c969]/45" />
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#71817b]">
              {t("signupPage.description")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#40554d]"
                >
                  <FiUser className="text-[#16745f]" />
                  {t("signupPage.nameLabel")}
                  <span className="text-[#d9704b]">*</span>
                </label>

                <div className="relative">
                  <FiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9893]" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={getInputClass("name")}
                    placeholder={t("signupPage.namePlaceholder")}
                    required
                  />
                </div>

                {errors.name && (
                  <p className="mt-1.5 text-xs font-semibold text-[#c6573a]">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#40554d]"
                >
                  <FiPhone className="text-[#16745f]" />
                  {t("signupPage.phoneLabel")}
                  <span className="text-[#d9704b]">*</span>
                </label>

                <div className="relative">
                  <FiPhone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9893]" />
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onInput={handlePhoneInput}
                    className={getInputClass("phone")}
                    placeholder="01XXXXXXXXX"
                    required
                    maxLength={11}
                  />
                </div>

                {errors.phone ? (
                  <p className="mt-1.5 text-xs font-semibold text-[#c6573a]">
                    {errors.phone}
                  </p>
                ) : (
                  <p className="mt-1.5 text-[11px] font-medium text-[#8a9691]">
                    {t("signupPage.phoneHint")}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#40554d]"
              >
                <FiMail className="text-[#7865c9]" />
                {t("signupPage.emailLabel")}
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
                  className={getInputClass("email")}
                  placeholder="name@example.com"
                  required
                />
              </div>

              {errors.email && (
                <p className="mt-1.5 text-xs font-semibold text-[#c6573a]">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#40554d]"
                >
                  <FiLock className="text-[#d9704b]" />
                  {t("signupPage.passwordLabel")}
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
                    className={getInputClass("password", "pr-11")}
                    placeholder={t("signupPage.passwordPlaceholder")}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#8b9893] transition hover:bg-[#eef3ef] hover:text-[#16745f]"
                    aria-label={
                      showPassword
                        ? t("signupPage.hidePassword")
                        : t("signupPage.showPassword")
                    }
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {errors.password ? (
                  <p className="mt-1.5 text-xs font-semibold text-[#c6573a]">
                    {errors.password}
                  </p>
                ) : (
                  <p className="mt-1.5 text-[11px] font-medium text-[#8a9691]">
                    {t("signupPage.passwordHint")}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#40554d]"
                >
                  <FiLock className="text-[#d9704b]" />
                  {t("signupPage.confirmPasswordLabel")}
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
                    className={getInputClass("confirmPassword", "pr-11")}
                    placeholder={t("signupPage.confirmPasswordPlaceholder")}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#8b9893] transition hover:bg-[#eef3ef] hover:text-[#16745f]"
                    aria-label={
                      showConfirmPassword
                        ? t("signupPage.hideConfirmPassword")
                        : t("signupPage.showConfirmPassword")
                    }
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs font-semibold text-[#c6573a]">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Terms */}
            <div
              className={`rounded-[1.15rem] border p-4 transition ${
                errors.agreeToTerms
                  ? "border-[#efc0b0] bg-[#fff7f2]"
                  : "border-[#dfe7e1] bg-[#f8faf7]"
              }`}
            >
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 rounded border-[#cbd6cf] text-[#16745f] focus:ring-[#8bcdbd]"
                  required
                />

                <span className="text-xs leading-6 text-[#63736c] sm:text-sm">
                  {t("signupPage.agreePrefix")}{" "}
                  <a
                    href="#"
                    className="font-extrabold text-[#16745f] hover:text-[#115f4e]"
                  >
                    {t("signupPage.terms")}
                  </a>{" "}
                  {t("signupPage.and")}{" "}
                  <a
                    href="#"
                    className="font-extrabold text-[#16745f] hover:text-[#115f4e]"
                  >
                    {t("signupPage.privacy")}
                  </a>{" "}
                  {t("signupPage.agreeSuffix")}
                </span>
              </label>

              {errors.agreeToTerms && (
                <p className="mt-2 text-xs font-semibold text-[#c6573a]">
                  {errors.agreeToTerms}
                </p>
              )}
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
                  {t("signupPage.creatingAccount")}
                </>
              ) : (
                <>
                  {t("signupPage.createAccount")}
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 border-t border-[#ece5d8] pt-5 text-center">
            <p className="text-sm text-[#71817b]">
              {t("signupPage.haveAccount")}{" "}
              <Link
                to="/login"
                className="font-extrabold text-[#16745f] transition hover:text-[#115f4e]"
              >
                {t("signupPage.signIn")}
              </Link>
            </p>
          </div>
        </section>

        {/* Benefit side */}
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
                  <FiUsers />
                  {t("signupPage.asideBadge")}
                </span>

                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#9de2c9]">
                  <FiCheck className="text-xl" />
                </span>
              </div>

              <h2 className="mt-7 text-3xl font-extrabold leading-tight sm:text-4xl">
                {t("signupPage.asideTitle")}
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-white/68 sm:text-base">
                {t("signupPage.asideDescription")}
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
                        delay: index * 0.08 + 0.25,
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

              <p className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] font-semibold text-white/45">
                <FiShield className="text-[#9de2c9]" />
                {t("signupPage.secureRegistration")}
              </p>
            </div>
          </div>
        </motion.aside>
      </motion.div>
    </div>
  );
};

export default SignUp;
