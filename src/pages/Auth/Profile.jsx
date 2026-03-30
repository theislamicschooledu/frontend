// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit3,
  FiSave,
  FiArrowLeft,
  FiLock,
  FiBookOpen,
  FiBarChart2,
  FiUpload,
  FiX,
  FiCheckCircle,
  FiClock,
  FiShield,
  FiLogOut,
} from "react-icons/fi";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth.js";
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

  const fetchProfileData = useCallback(async () => {
    if (!user?._id) return;

    try {
      setPageLoading(true);

      const [userRes, enrollmentRes] = await Promise.all([
        api.get(`/auth/${user._id}`),
        api.get(`/enrollments/my-enrollments`),
      ]);

      if (userRes.data.success) {
        setUserData(userRes.data.user);
      }

      if (enrollmentRes.data.success) {
        setEnrollments(enrollmentRes.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("প্রোফাইল লোড করা যায়নি");
    } finally {
      setPageLoading(false);
    }
  }, [user]);

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
    ? new Date(userData.createdAt).toLocaleDateString("en-US", {
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
      label: "মোট Enrollment",
      value: enrollments.length,
      icon: FiBookOpen,
    },
    {
      label: "Approved Courses",
      value: completedEnrollments.length,
      icon: FiCheckCircle,
    },
    {
      label: "Average Progress",
      value: `${averageProgress}%`,
      icon: FiBarChart2,
    },
  ];

  const handleLogOut = async () => {
    try {
      await logout();
      toast.success("সফলভাবে লগ আউট হয়েছে");
      navigate("/login");
    } catch (error) {
      console.log(error);      
      toast.error("লগ আউট করতে সমস্যা হয়েছে");
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
      toast.error("শুধু image file দিন");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("ছবির সাইজ 5MB এর কম হতে হবে");
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
      toast.error("নাম লিখুন");
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

        toast.success(response.data.message || "প্রোফাইল আপডেট হয়েছে");
      } else {
        toast.error(response.data.message || "প্রোফাইল আপডেট করা যায়নি");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(
        error?.response?.data?.message || "প্রোফাইল আপডেট করতে সমস্যা হয়েছে",
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
      return "bg-green-100 text-green-700";
    }
    if (status === "pending") {
      return "bg-yellow-100 text-yellow-700";
    }
    if (status === "cancelled") {
      return "bg-red-100 text-red-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-green-50 flex items-center justify-center pt-20 px-4">
        <div className="text-center">
          <div className="h-12 w-12 mx-auto rounded-full border-b-2 border-green-600 animate-spin"></div>
          <p className="mt-4 text-gray-600">প্রোফাইল লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-green-50 flex items-center justify-center pt-20 px-4">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
          <p className="text-lg font-semibold text-gray-700">
            Profile data not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-green-50 text-gray-800 py-6 px-3 sm:px-4 pt-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-green-600 hover:text-green-700 transition text-sm sm:text-base"
            >
              <FiArrowLeft className="mr-1" />
              Back
            </button>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">প্রোফাইল</h1>
              <p className="text-gray-500 text-sm">
                আপনার তথ্য ও কোর্স স্ট্যাটাস
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEditToggle}
            disabled={loading}
            className={`flex items-center justify-center px-5 py-3 rounded-2xl font-semibold transition w-full sm:w-auto ${
              isEditing
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-white border border-green-600 text-green-700 hover:bg-green-50"
            } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 rounded-full border-b-2 border-white animate-spin mr-2"></div>
                Saving...
              </>
            ) : isEditing ? (
              <>
                <FiSave className="mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <FiEdit3 className="mr-2" />
                Edit Profile
              </>
            )}
          </motion.button>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100">
              <div className="bg-linear-to-br from-green-700 to-emerald-500 text-white p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white/20 bg-white/10">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiUser className="text-white text-4xl" />
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 hover:bg-green-600 rounded-full border-2 border-white flex items-center justify-center"
                        >
                          <FiUpload className="text-white text-xs" />
                        </button>

                        {selectedFile && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center"
                          >
                            <FiX className="text-white text-xs" />
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

                  <div className="flex-1 w-full">
                    <h2 className="text-xl sm:text-2xl font-bold mb-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="w-full bg-white/20 rounded-lg px-3 py-2 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-white/40"
                          placeholder="আপনার নাম লিখুন"
                        />
                      ) : (
                        userData.name || "User"
                      )}
                    </h2>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-3 py-1 rounded-full bg-white/20 text-xs sm:text-sm capitalize">
                        {userData.role || "student"}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm ${
                          userData.verified
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {userData.verified ? "Verified ✔" : "Not Verified"}
                      </span>
                    </div>

                    <div className="flex items-center text-green-100 text-sm mt-3">
                      <FiCalendar className="mr-1" />
                      <span>Joined {formattedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                <div className="flex items-center">
                  <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center mr-4 shrink-0">
                    <FiMail className="text-green-600 text-lg" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500">ইমেইল</p>
                    <p className="font-medium break-all">
                      {userData.email || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center mr-4 shrink-0">
                    <FiPhone className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ফোন নাম্বার</p>
                    <p className="font-medium">{userData.phone || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center mr-4 shrink-0">
                    <FiMapPin className="text-purple-600 text-lg" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">ঠিকানা</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className="w-full mt-1 bg-gray-50 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
                        placeholder="আপনার ঠিকানা লিখুন"
                      />
                    ) : (
                      <p className="font-medium">{userData.address || "-"}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500 mb-1">Account Status</p>
                    <p
                      className={`font-semibold ${
                        userData.isBanned ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {userData.isBanned ? "Banned" : "Active"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500 mb-1">
                      Pending Request
                    </p>
                    <p className="font-semibold text-yellow-600">
                      {pendingEnrollments.length}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Link
                    to="/change-password"
                    className="w-full flex items-center justify-center py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
                  >
                    <FiLock className="mr-2 text-gray-600" />
                    <span className="text-gray-700 font-medium">
                      পাসওয়ার্ড পরিবর্তন করুন
                    </span>
                  </Link>

                  <button
                    onClick={handleLogOut}
                    className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition flex items-center justify-center"
                  >
                    <FiLogOut className="mr-2" />
                    লগ আউট করুন
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center pt-2">
                  “Seek knowledge from cradle to grave.” 📖
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8"
          >
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-green-700 mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                      <stat.icon className="text-green-700 text-xl" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {[
                    { id: "courses", label: "আমার কোর্সসমূহ" },
                    { id: "account", label: "অ্যাকাউন্ট তথ্য" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-4 px-4 sm:px-6 text-center font-medium transition text-sm sm:text-base ${
                        activeTab === tab.id
                          ? "text-green-600 border-b-2 border-green-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-4 sm:p-6">
                {activeTab === "courses" && (
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                          আমার কোর্সসমূহ
                        </h3>
                        <p className="text-gray-500 mt-1 text-sm sm:text-base">
                          আপনার enrollment ও learning progress এখানে দেখানো
                          হচ্ছে
                        </p>
                      </div>
                    </div>

                    {enrollments.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FiBookOpen className="text-green-600 text-3xl" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">
                          এখনো কোনো কোর্সে যুক্ত হননি
                        </h4>
                        <p className="text-gray-600 mb-5">
                          আপনার জন্য উপযুক্ত কোর্স দেখে enrollment করুন।
                        </p>
                        <button
                          onClick={() => navigate("/courses")}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition"
                        >
                          কোর্স দেখুন
                        </button>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {enrollments.map((item) => (
                          <div
                            key={item._id}
                            className="rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition bg-white"
                          >
                            <div className="h-40 bg-gray-100 overflow-hidden">
                              {item.course?.thumbnail ? (
                                <img
                                  src={item.course.thumbnail}
                                  alt={item.course?.title || "Course"}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <FiBookOpen className="text-4xl" />
                                </div>
                              )}
                            </div>

                            <div className="p-4 sm:p-5">
                              <div className="flex items-start justify-between gap-3 mb-3">
                                <h4 className="font-semibold text-base text-gray-800 line-clamp-2">
                                  {item.course?.title || "Untitled Course"}
                                </h4>

                                <span
                                  className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${getStatusBadge(
                                    item.paymentStatus,
                                  )}`}
                                >
                                  {item.paymentStatus || "unknown"}
                                </span>
                              </div>

                              <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <p>
                                  <span className="font-medium text-gray-800">
                                    Category:
                                  </span>{" "}
                                  {item.course?.category?.name || "-"}
                                </p>
                                <p>
                                  <span className="font-medium text-gray-800">
                                    Duration:
                                  </span>{" "}
                                  {item.course?.duration
                                    ? `${item.course.duration} days`
                                    : "-"}
                                </p>
                                <p>
                                  <span className="font-medium text-gray-800">
                                    Paid:
                                  </span>{" "}
                                  ৳{item.amount || 0}
                                </p>
                              </div>

                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2 text-sm">
                                  <span className="text-gray-600">
                                    Progress
                                  </span>
                                  <span className="font-semibold text-gray-800">
                                    {item.progress || 0}%
                                  </span>
                                </div>

                                <div className="h-2 bg-gray-200 rounded-full">
                                  <div
                                    className="h-full bg-green-600 rounded-full"
                                    style={{ width: `${item.progress || 0}%` }}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-sm text-gray-500 gap-3">
                                <span className="flex items-center">
                                  <FiClock className="mr-1" />
                                  {item.completionStatus || "in-progress"}
                                </span>
                                <span>
                                  {new Date(
                                    item.createdAt ||
                                      item.enrolledAt ||
                                      Date.now(),
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "account" && (
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="rounded-2xl bg-green-50 border border-green-100 p-5">
                      <div className="flex items-center mb-3">
                        <FiShield className="text-green-600 text-xl mr-2" />
                        <h4 className="font-bold text-gray-800">
                          Account Summary
                        </h4>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">Full Name</span>
                          <span className="font-medium text-right">
                            {userData.name || "-"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">Email</span>
                          <span className="font-medium text-right break-all">
                            {userData.email || "-"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">Phone</span>
                          <span className="font-medium text-right">
                            {userData.phone || "-"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">Role</span>
                          <span className="font-medium capitalize">
                            {userData.role || "-"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">Verified</span>
                          <span className="font-medium">
                            {userData.verified ? "Yes" : "No"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">Address</span>
                          <span className="font-medium text-right">
                            {userData.address || "-"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">Joined</span>
                          <span className="font-medium">{formattedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
                      <div className="flex items-center mb-3">
                        <FiBarChart2 className="text-blue-600 text-xl mr-2" />
                        <h4 className="font-bold text-gray-800">
                          Learning Summary
                        </h4>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">
                            Total Enrollments
                          </span>
                          <span className="font-medium">
                            {enrollments.length}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">
                            Approved Courses
                          </span>
                          <span className="font-medium">
                            {completedEnrollments.length}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">
                            Pending Requests
                          </span>
                          <span className="font-medium">
                            {pendingEnrollments.length}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">
                            Average Progress
                          </span>
                          <span className="font-medium">
                            {averageProgress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
