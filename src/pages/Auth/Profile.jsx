// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBarChart2,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiLock,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiShield,
  FiUpload,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth.js";
import { useLanguage } from "../../hooks/useLanguage.js";
import api from "../../utils/axios";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("courses");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [editData, setEditData] = useState({
    name: "",
    address: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();
  const { language, t } = useLanguage();
  const locale = language === "bn" ? "bn-BD" : "en-US";

  const formatNumber = (value) => Number(value || 0).toLocaleString(locale);
  const getRoleLabel = (role) => t(`profilePage.roles.${role || "student"}`);
  const getPaymentStatusLabel = (status) =>
    t(`profilePage.paymentStatus.${status || "unknown"}`);
  const getCompletionStatusLabel = (status) =>
    t(`profilePage.completionStatus.${status || "in-progress"}`);

  const fetchProfileData = useCallback(async () => {
    if (!user?._id) return;

    try {
      setPageLoading(true);

      const [userRes, enrollmentRes] = await Promise.all([
        api.get(`/auth/${user._id}`),
        api.get("/enrollments/my-enrollments"),
      ]);

      if (userRes.data.success) {
        setUserData(userRes.data.user);
      }

      if (enrollmentRes.data.success) {
        setEnrollments(enrollmentRes.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error(t("profilePage.loadFailed"));
    } finally {
      setPageLoading(false);
    }
  }, [user, t]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  useEffect(() => {
    if (userData) {
      setEditData({
        name: userData.name || "",
        address: userData.address || "",
      });
      setPreviewImage(userData.avatar || null);
    }
  }, [userData]);

  const formattedDate = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  const completedEnrollments = useMemo(
    () => enrollments.filter((item) => item.paymentStatus === "completed"),
    [enrollments],
  );

  const pendingEnrollments = useMemo(
    () => enrollments.filter((item) => item.paymentStatus === "pending"),
    [enrollments],
  );

  const averageProgress = useMemo(() => {
    if (!completedEnrollments.length) return 0;

    const total = completedEnrollments.reduce(
      (sum, item) => sum + (item.progress || 0),
      0,
    );

    return Math.round(total / completedEnrollments.length);
  }, [completedEnrollments]);

  const stats = [
    {
      label: t("profilePage.stats.totalEnrollments"),
      value: formatNumber(enrollments.length),
      icon: FiBookOpen,
      iconBg: "bg-[#fff0e8]",
      iconText: "text-[#d9704b]",
    },
    {
      label: t("profilePage.stats.approvedCourses"),
      value: formatNumber(completedEnrollments.length),
      icon: FiCheckCircle,
      iconBg: "bg-[#e5f4ee]",
      iconText: "text-[#16745f]",
    },
    {
      label: t("profilePage.stats.averageProgress"),
      value: `${formatNumber(averageProgress)}%`,
      icon: FiBarChart2,
      iconBg: "bg-[#eeeafd]",
      iconText: "text-[#6e5bb4]",
    },
  ];

  const handleLogOut = async () => {
    try {
      await logout();
      toast.success(t("profilePage.logoutSuccess"));
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(t("profilePage.logoutFailed"));
    }
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("profilePage.validation.imageOnly"));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("profilePage.validation.imageSize"));
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewImage(userData?.avatar || null);
  };

  const handleSaveChanges = async () => {
    if (!editData.name.trim()) {
      toast.error(t("profilePage.validation.nameRequired"));
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", editData.name.trim());
      formData.append("address", editData.address?.trim() || "");

      if (selectedFile) {
        formData.append("user", selectedFile);
      }

      const response = await api.put(`/auth/${userData._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const updatedUser = response.data.user;

        setUserData(updatedUser);
        setPreviewImage(updatedUser?.avatar || null);
        setSelectedFile(null);
        setIsEditing(false);

        if (updatedUser) {
          localStorage.setItem("user", JSON.stringify(updatedUser));

          if (setUser) {
            setUser(updatedUser);
          }
        }

        toast.success(response.data.message || t("profilePage.updateSuccess"));
      } else {
        toast.error(response.data.message || t("profilePage.updateFailed"));
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(
        error?.response?.data?.message || t("profilePage.updateError"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSaveChanges();
    } else {
      setIsEditing(true);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "completed") {
      return "border-[#cfe6dc] bg-[#edf8f3] text-[#16745f]";
    }

    if (status === "pending") {
      return "border-[#efe0b8] bg-[#fffaf0] text-[#a87318]";
    }

    if (status === "cancelled") {
      return "border-[#f1d8ce] bg-[#fff7f2] text-[#c6573a]";
    }

    return "border-[#e3e8e4] bg-[#f5f7f5] text-[#6d7b75]";
  };

  if (pageLoading) {
    return (
      <div className="font-hind min-h-screen bg-[#f8f5ed] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm rounded-4xl border border-[#e6dfcf] bg-white p-8 text-center shadow-[0_20px_60px_rgba(45,75,65,0.10)]"
        >
          <div className="relative mx-auto mb-5 h-16 w-16">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-[#dcebe4]"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-[#16745f] border-t-[#16745f]" />
            </motion.div>

            <div className="absolute inset-3 flex items-center justify-center rounded-full bg-[#eef8f4]">
              <FiUser className="text-xl text-[#16745f]" />
            </div>
          </div>

          <h3 className="text-xl font-extrabold text-[#263c35]">
            {t("profilePage.loadingTitle")}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#6d7c76]">
            {t("profilePage.loadingDescription")}
          </p>
        </motion.div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="font-hind min-h-screen bg-[#f8f5ed] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-4xl border border-[#e6dfcf] bg-white p-8 text-center shadow-[0_20px_60px_rgba(45,75,65,0.10)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0e8] text-[#d9704b]">
            <FiUser className="text-2xl" />
          </div>
          <h2 className="mt-4 text-xl font-extrabold text-[#263c35]">
            {t("profilePage.notFoundTitle")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#71817b]">
            {t("profilePage.notFoundDescription")}
          </p>
          <Link
            to="/login"
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#16745f] px-5 text-sm font-extrabold text-white"
          >
            {t("profilePage.signIn")}
            <FiArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="font-hind min-h-screen overflow-hidden bg-[#f8f5ed] text-[#263c35]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#e8dfce] pt-8">
        <div className="absolute inset-0 bg-linear-to-br from-[#fffaf0] via-[#f4fbf7] to-[#edf7f4]" />
        <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-[#f6c85f]/18 blur-3xl" />
        <div className="absolute -right-20 top-6 h-64 w-64 rounded-full bg-[#9d8be8]/16 blur-3xl" />

        <motion.div
          className="absolute left-[7%] top-28 hidden h-12 w-12 rotate-12 items-center justify-center rounded-2xl bg-[#ffe8dd] text-[#df7650] shadow-sm md:flex"
          animate={{ y: [0, -8, 0], rotate: [12, 18, 12] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <FiUser className="text-xl" />
        </motion.div>

        <motion.div
          className="absolute right-[8%] top-28 hidden h-11 w-11 -rotate-12 items-center justify-center rounded-full bg-[#e9e5ff] text-[#7865c9] shadow-sm lg:flex"
          animate={{ y: [0, 9, 0], rotate: [-12, -5, -12] }}
          transition={{ duration: 4.8, repeat: Infinity }}
        >
          <FiShield className="text-xl" />
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8 lg:pb-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#eef8f4] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#16745f]">
                <FiUser />
                {t("profilePage.badge")}
              </div>

              <h1 className="mt-4 text-3xl font-extrabold leading-[1.18] text-[#263c35] sm:text-4xl lg:text-[3.05rem]">
                {t("profilePage.headingPrefix")}
                <span className="relative ml-2 inline-block text-[#16745f]">
                  {t("profilePage.headingAccent")}
                  <span className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 rounded-full bg-[#f7c969]/45" />
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#687a73] sm:text-base">
                {t("profilePage.description")}
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              whileHover={{ y: loading ? 0 : -2 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              type="button"
              onClick={handleEditToggle}
              disabled={loading}
              className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto ${
                isEditing
                  ? "bg-[#16745f] text-white shadow-[0_14px_30px_rgba(22,116,95,0.22)] hover:bg-[#115f4e]"
                  : "border border-[#cfe2d9] bg-white text-[#16745f] shadow-sm hover:border-[#8bcdbd] hover:bg-[#f1f8f5]"
              }`}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                  {t("profilePage.saving")}
                </>
              ) : isEditing ? (
                <>
                  <FiSave />
                  {t("profilePage.saveChanges")}
                </>
              ) : (
                <>
                  <FiEdit3 />
                  {t("profilePage.editProfile")}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </section>

      <section className="py-7 sm:py-9">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
            {/* Profile sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              <div className="overflow-hidden rounded-[1.7rem] border border-[#e5ded0] bg-white shadow-[0_18px_50px_rgba(45,75,65,0.08)]">
                <div className="relative overflow-hidden bg-[#263c35] p-6 text-white">
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#f7c969]/16" />
                  <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-[#ef8f6d]/10" />

                  <div className="relative">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative">
                        <div className="h-28 w-28 overflow-hidden rounded-4xl border-4 border-white/15 bg-white/10 shadow-[0_14px_35px_rgba(0,0,0,0.18)]">
                          {previewImage ? (
                            <img
                              src={previewImage}
                              alt={t("profilePage.profilePhotoAlt")}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <FiUser className="text-4xl text-white/85" />
                            </div>
                          )}
                        </div>

                        {isEditing && (
                          <>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#263c35] bg-[#f7c969] text-[#263c35] shadow-lg transition hover:scale-105"
                              aria-label={t("profilePage.uploadPhoto")}
                            >
                              <FiUpload />
                            </button>

                            {selectedFile && (
                              <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#d96343] text-white shadow-lg transition hover:bg-[#bd4f32]"
                                aria-label={t("profilePage.removePhoto")}
                              >
                                <FiX />
                              </button>
                            )}

                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="hidden"
                            />
                          </>
                        )}
                      </div>

                      <div className="mt-5 w-full">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            className="h-11 w-full rounded-xl border border-white/15 bg-white/10 px-3 text-center text-lg font-extrabold text-white outline-none transition placeholder:text-white/45 focus:border-white/35 focus:bg-white/15"
                            placeholder={t("profilePage.namePlaceholder")}
                          />
                        ) : (
                          <h2 className="text-2xl font-extrabold">
                            {userData.name || t("profilePage.userFallback")}
                          </h2>
                        )}

                        <div className="mt-3 flex flex-wrap justify-center gap-2">
                          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold capitalize text-white/75">
                            {getRoleLabel(userData.role)}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-extrabold ${
                              userData.verified
                                ? "bg-[#9de2c9]/16 text-[#b8ebd9]"
                                : "bg-[#f7c969]/15 text-[#f8d77f]"
                            }`}
                          >
                            {userData.verified && <FiCheckCircle />}
                            {userData.verified
                              ? t("profilePage.verified")
                              : t("profilePage.notVerified")}
                          </span>
                        </div>

                        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-white/50">
                          <FiCalendar />
                          {t("profilePage.joined")} {formattedDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-xl bg-[#f8faf7] p-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e5f4ee] text-[#16745f]">
                        <FiMail />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a9691]">
                          {t("profilePage.fields.email")}
                        </p>
                        <p className="mt-1 break-all text-sm font-extrabold text-[#40554d]">
                          {userData.email || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl bg-[#f8faf7] p-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff0e8] text-[#d9704b]">
                        <FiPhone />
                      </span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a9691]">
                          {t("profilePage.fields.phone")}
                        </p>
                        <p className="mt-1 text-sm font-extrabold text-[#40554d]">
                          {userData.phone || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl bg-[#f8faf7] p-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eeeafd] text-[#7865c9]">
                        <FiMapPin />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a9691]">
                          {t("profilePage.fields.address")}
                        </p>

                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.address}
                            onChange={(e) =>
                              handleInputChange("address", e.target.value)
                            }
                            className="mt-1 h-10 w-full rounded-lg border border-[#dfe5e0] bg-white px-3 text-sm font-medium text-[#263c35] outline-none transition focus:border-[#8bcdbd] focus:ring-3 focus:ring-[#8bcdbd]/15"
                            placeholder={t("profilePage.addressPlaceholder")}
                          />
                        ) : (
                          <p className="mt-1 text-sm font-extrabold text-[#40554d]">
                            {userData.address || "-"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-[#dfe7e1] bg-[#f8faf7] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a9691]">
                        {t("profilePage.fields.account")}
                      </p>
                      <p
                        className={`mt-1 text-sm font-extrabold ${
                          userData.isBanned
                            ? "text-[#c6573a]"
                            : "text-[#16745f]"
                        }`}
                      >
                        {userData.isBanned
                          ? t("profilePage.accountStatus.banned")
                          : t("profilePage.accountStatus.active")}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#eee5cb] bg-[#fffaf0] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a9691]">
                        {t("profilePage.fields.pending")}
                      </p>
                      <p className="mt-1 text-sm font-extrabold text-[#a87318]">
                        {formatNumber(pendingEnrollments.length)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2.5 border-t border-[#eee8dc] pt-4">
                    <Link
                      to="/change-password"
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#dfe5e0] bg-white text-sm font-extrabold text-[#53665e] transition hover:border-[#8bcdbd] hover:bg-[#f1f8f5] hover:text-[#16745f]"
                    >
                      <FiLock />
                      {t("profilePage.changePassword")}
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogOut}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#f1d8ce] bg-[#fff7f2] text-sm font-extrabold text-[#c6573a] transition hover:bg-[#fff0e9]"
                    >
                      <FiLogOut />
                      {t("profilePage.logout")}
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>

            {/* Main area */}
            <motion.main
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="min-w-0"
            >
              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat, index) => {
                  const StatIcon = stat.icon;

                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.08 }}
                      whileHover={{ y: -3 }}
                      className="rounded-[1.45rem] border border-[#e5ded0] bg-white p-5 shadow-[0_12px_34px_rgba(45,75,65,0.07)] transition hover:shadow-[0_18px_42px_rgba(45,75,65,0.11)]"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold text-[#7c8984]">
                            {stat.label}
                          </p>
                          <p className="mt-2 text-3xl font-extrabold text-[#263c35]">
                            {stat.value}
                          </p>
                        </div>

                        <span
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${stat.iconBg} ${stat.iconText}`}
                        >
                          <StatIcon className="text-xl" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Tabs card */}
              <div className="mt-5 overflow-hidden rounded-[1.7rem] border border-[#e5ded0] bg-white shadow-[0_18px_50px_rgba(45,75,65,0.08)]">
                <div className="border-b border-[#eee8dc] bg-[#fffdf8] px-3 pt-3 sm:px-5">
                  <nav className="grid grid-cols-2 gap-2">
                    {[
                      {
                        id: "courses",
                        label: t("profilePage.tabs.courses"),
                        icon: FiBookOpen,
                      },
                      {
                        id: "account",
                        label: t("profilePage.tabs.account"),
                        icon: FiShield,
                      },
                    ].map((tab) => {
                      const TabIcon = tab.icon;
                      const isActive = activeTab === tab.id;

                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          className={`relative inline-flex h-12 items-center justify-center gap-2 rounded-t-xl px-3 text-sm font-extrabold transition ${
                            isActive
                              ? "bg-white text-[#16745f]"
                              : "text-[#7c8984] hover:bg-white/70 hover:text-[#40554d]"
                          }`}
                        >
                          <TabIcon />
                          {tab.label}

                          {isActive && (
                            <motion.span
                              layoutId="profile-active-tab"
                              className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-[#16745f]"
                            />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="p-4 sm:p-6">
                  <AnimatePresence mode="wait">
                    {activeTab === "courses" && (
                      <motion.div
                        key="courses-tab"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                          <div>
                            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#d9704b]">
                              {t("profilePage.courses.badge")}
                            </p>
                            <h3 className="mt-1 text-2xl font-extrabold text-[#263c35]">
                              {t("profilePage.courses.title")}
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-[#71817b]">
                              {t("profilePage.courses.description")}
                            </p>
                          </div>

                          <span className="w-fit rounded-full bg-[#eef8f4] px-3 py-1.5 text-xs font-extrabold text-[#16745f]">
                            {t("profilePage.courses.enrollmentCount", {
                              count: formatNumber(enrollments.length),
                            })}
                          </span>
                        </div>

                        {enrollments.length === 0 ? (
                          <div className="rounded-3xl border border-dashed border-[#d6ded8] bg-[#fafbf8] px-5 py-10 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eef8f4] text-[#16745f]">
                              <FiBookOpen className="text-2xl" />
                            </div>

                            <h4 className="mt-4 text-xl font-extrabold text-[#263c35]">
                              {t("profilePage.courses.emptyTitle")}
                            </h4>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#71817b]">
                              {t("profilePage.courses.emptyDescription")}
                            </p>

                            <button
                              type="button"
                              onClick={() => navigate("/courses")}
                              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#16745f] px-5 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(22,116,95,0.22)] transition hover:bg-[#115f4e]"
                            >
                              {t("profilePage.courses.browseCourses")}
                              <FiArrowRight />
                            </button>
                          </div>
                        ) : (
                          <div className="grid gap-4 md:grid-cols-2">
                            {enrollments.map((item, index) => {
                              const progress = item.progress || 0;

                              return (
                                <motion.article
                                  key={item._id}
                                  initial={{ opacity: 0, y: 12 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: 0.35,
                                    delay: Math.min(index * 0.05, 0.3),
                                  }}
                                  whileHover={{ y: -3 }}
                                  className="group overflow-hidden rounded-[1.35rem] border border-[#e5ded0] bg-white shadow-[0_10px_30px_rgba(45,75,65,0.06)] transition hover:border-[#cfe5dc] hover:shadow-[0_16px_38px_rgba(45,75,65,0.10)]"
                                >
                                  <div className="relative h-40 overflow-hidden bg-[#edf2ee]">
                                    {item.course?.thumbnail ? (
                                      <img
                                        src={item.course.thumbnail}
                                        alt={
                                          item.course?.title ||
                                          t(
                                            "profilePage.courses.courseFallback",
                                          )
                                        }
                                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center text-[#9ca8a2]">
                                        <FiBookOpen className="text-4xl" />
                                      </div>
                                    )}

                                    <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#21382f]/70 to-transparent" />

                                    <span
                                      className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-[10px] font-extrabold capitalize shadow-sm backdrop-blur ${getStatusBadge(
                                        item.paymentStatus,
                                      )}`}
                                    >
                                      {getPaymentStatusLabel(
                                        item.paymentStatus,
                                      )}
                                    </span>

                                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 text-xs font-bold text-white">
                                      <span className="inline-flex items-center gap-1.5">
                                        <FiClock />
                                        {item.course?.duration
                                          ? t(
                                              "profilePage.courses.durationDays",
                                              {
                                                count: formatNumber(
                                                  item.course.duration,
                                                ),
                                              },
                                            )
                                          : "-"}
                                      </span>

                                      <span className="inline-flex items-center gap-1.5">
                                        <FiBarChart2 />
                                        {formatNumber(progress)}%
                                      </span>
                                    </div>
                                  </div>

                                  <div className="p-4">
                                    <h4 className="line-clamp-2 min-h-12 text-base font-extrabold leading-6 text-[#263c35] transition group-hover:text-[#16745f]">
                                      {item.course?.title ||
                                        t("profilePage.courses.untitledCourse")}
                                    </h4>

                                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold">
                                      <span className="rounded-full bg-[#f8faf7] px-2.5 py-1 text-[#6f7e78]">
                                        {item.course?.category?.name ||
                                          t("profilePage.courses.noCategory")}
                                      </span>

                                      <span className="rounded-full bg-[#fff9eb] px-2.5 py-1 text-[#8b6b2e]">
                                        {t("profilePage.courses.paid", {
                                          amount: formatNumber(
                                            item.amount || 0,
                                          ),
                                        })}
                                      </span>
                                    </div>

                                    <div className="mt-4">
                                      <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-[#71817b]">
                                          {t("profilePage.courses.progress")}
                                        </span>
                                        <span className="text-[#16745f]">
                                          {formatNumber(progress)}%
                                        </span>
                                      </div>

                                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8eee9]">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${progress}%` }}
                                          transition={{ duration: 0.7 }}
                                          className="h-full rounded-full bg-linear-to-r from-[#16745f] to-[#72baa7]"
                                        />
                                      </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#eee8dc] pt-3 text-[11px] font-medium text-[#86928d]">
                                      <span className="inline-flex items-center gap-1.5">
                                        <FiClock />
                                        {getCompletionStatusLabel(
                                          item.completionStatus,
                                        )}
                                      </span>

                                      <span>
                                        {new Date(
                                          item.createdAt ||
                                            item.enrolledAt ||
                                            Date.now(),
                                        ).toLocaleDateString(locale)}
                                      </span>
                                    </div>
                                  </div>
                                </motion.article>
                              );
                            })}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "account" && (
                      <motion.div
                        key="account-tab"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="mb-5">
                          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#6e5bb4]">
                            {t("profilePage.account.badge")}
                          </p>
                          <h3 className="mt-1 text-2xl font-extrabold text-[#263c35]">
                            {t("profilePage.account.title")}
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-[#71817b]">
                            {t("profilePage.account.description")}
                          </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                          <div className="rounded-[1.4rem] border border-[#d7e9e2] bg-[#f5faf7] p-5">
                            <div className="flex items-center gap-3">
                              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f4ee] text-[#16745f]">
                                <FiShield />
                              </span>

                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7f8d87]">
                                  {t("profilePage.fields.account")}
                                </p>
                                <h4 className="mt-1 font-extrabold text-[#263c35]">
                                  {t("profilePage.account.accountSummary")}
                                </h4>
                              </div>
                            </div>

                            <div className="mt-5 space-y-3">
                              {[
                                [
                                  t("profilePage.account.fullName"),
                                  userData.name || "-",
                                ],
                                [
                                  t("profilePage.fields.email"),
                                  userData.email || "-",
                                ],
                                [
                                  t("profilePage.fields.phone"),
                                  userData.phone || "-",
                                ],
                                [
                                  t("profilePage.account.role"),
                                  getRoleLabel(userData.role),
                                ],
                                [
                                  t("profilePage.account.verified"),
                                  userData.verified
                                    ? t("profilePage.yes")
                                    : t("profilePage.no"),
                                ],
                                [
                                  t("profilePage.fields.address"),
                                  userData.address || "-",
                                ],
                                [t("profilePage.joined"), formattedDate],
                              ].map(([label, value]) => (
                                <div
                                  key={label}
                                  className="flex items-start justify-between gap-4 border-b border-[#e3ece7] pb-3 last:border-0 last:pb-0"
                                >
                                  <span className="text-xs font-semibold text-[#7c8984]">
                                    {label}
                                  </span>
                                  <span className="max-w-[60%] wrap-break-word text-right text-xs font-extrabold capitalize text-[#40554d]">
                                    {value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-[1.4rem] border border-[#ded8f4] bg-[#f8f6ff] p-5">
                            <div className="flex items-center gap-3">
                              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eeeafd] text-[#7865c9]">
                                <FiBarChart2 />
                              </span>

                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#817897]">
                                  {t("profilePage.account.learningLabel")}
                                </p>
                                <h4 className="mt-1 font-extrabold text-[#263c35]">
                                  {t("profilePage.account.learningSummary")}
                                </h4>
                              </div>
                            </div>

                            <div className="mt-5 space-y-3">
                              {[
                                [
                                  t("profilePage.stats.totalEnrollments"),
                                  formatNumber(enrollments.length),
                                ],
                                [
                                  t("profilePage.stats.approvedCourses"),
                                  formatNumber(completedEnrollments.length),
                                ],
                                [
                                  t("profilePage.account.pendingRequests"),
                                  formatNumber(pendingEnrollments.length),
                                ],
                                [
                                  t("profilePage.stats.averageProgress"),
                                  `${formatNumber(averageProgress)}%`,
                                ],
                              ].map(([label, value]) => (
                                <div
                                  key={label}
                                  className="flex items-center justify-between gap-4 border-b border-[#e6e0f4] pb-3 last:border-0 last:pb-0"
                                >
                                  <span className="text-xs font-semibold text-[#817897]">
                                    {label}
                                  </span>
                                  <span className="text-sm font-extrabold text-[#6e5bb4]">
                                    {value}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="mt-5 rounded-xl border border-[#e6e0f4] bg-white/70 p-4">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-[#817897]">
                                  {t("profilePage.account.overallProgress")}
                                </span>
                                <span className="text-[#6e5bb4]">
                                  {formatNumber(averageProgress)}%
                                </span>
                              </div>

                              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8e3f4]">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${averageProgress}%` }}
                                  transition={{ duration: 0.8 }}
                                  className="h-full rounded-full bg-linear-to-r from-[#7865c9] to-[#a99be3]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
