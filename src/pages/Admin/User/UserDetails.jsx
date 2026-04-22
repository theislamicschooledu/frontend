import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import api from "../../../utils/axios";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import {
  FiCamera,
  FiEdit2,
  FiMail,
  FiPhone,
  FiPhoneCall,
  FiSave,
  FiTrash2,
  FiUserCheck,
  FiUserX,
  FiX,
} from "react-icons/fi";
import { IoMailOpenSharp } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import ConfirmModal from "../../../components/ConfirmModal";

const UserDetails = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    image: null,
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users/${id}`);
      const userData = res.data?.user || res.data;
      setUser(userData);

      setFormData({
        name: userData?.name || "",
        address: userData?.address || "",
        image: null,
      });
      setPreview(userData?.avatar || "");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const roleColors = {
    admin: "bg-purple-100 text-purple-800",
    teacher: "bg-blue-100 text-blue-800",
    student: "bg-green-100 text-green-800",
  };

  const statusColors = {
    active: "bg-green-100 text-green-800",
    banned: "bg-red-100 text-red-800",
  };

  const openModal = (action) => {
    setModalAction(action);
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("address", formData.address);
      if (formData.image) {
        payload.append("user", formData.image);
      }

      const res = await api.put(`/admin/users/${id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success(res.data.message || "User updated successfully");
        setIsEditMode(false);
        await fetchUser();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmAction = async () => {
    try {
      setLoading(true);

      if (modalAction === "delete") {
        const res = await api.delete(`/admin/users/${id}`);
        if (res.data.success) {
          toast.success("User deleted successfully");
          navigate("/admin/users");
          return;
        }
      }

      if (modalAction === "makeAdmin") {
        const res = await api.put(`/admin/change-role`, {
          id,
          role: "admin",
        });
        if (res.data.success) {
          toast.success(res.data.message);
          await fetchUser();
        }
      }

      if (modalAction === "makeTeacher") {
        const res = await api.put(`/admin/change-role`, {
          id,
          role: "teacher",
        });
        if (res.data.success) {
          toast.success(res.data.message);
          await fetchUser();
        }
      }

      if (modalAction === "makeUser") {
        const res = await api.put(`/admin/change-role`, {
          id,
          role: "student",
        });
        if (res.data.success) {
          toast.success(res.data.message);
          await fetchUser();
        }
      }

      if (modalAction === "banned") {
        const res = await api.put(`/admin/${id}/ban`);
        if (res.data.success) {
          toast.success("User banned successfully");
          await fetchUser();
        } else {
          toast.error(res.data.message);
        }
      }

      if (modalAction === "unbanned") {
        const res = await api.put(`/admin/${id}/unBan`);
        if (res.data.success) {
          toast.success("User unbanned successfully");
          await fetchUser();
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
      setModalOpen(false);
      setModalAction(null);
    }
  };

  const getModalText = () => {
    switch (modalAction) {
      case "delete":
        return { title: "Delete User", message: "Are you sure to delete?" };
      case "banned":
        return {
          title: "Banned User",
          message: "Are you sure to want ban this user?",
        };
      case "unbanned":
        return {
          title: "Unbanned User",
          message: "Are you sure to want unbanned this user?",
        };
      case "makeAdmin":
        return {
          title: "Make Admin",
          message: "Are you sure to want make admin?",
        };
      case "makeTeacher":
        return {
          title: "Make Teacher",
          message: "Are you sure to want make teacher?",
        };
      case "makeUser":
        return {
          title: "Make User",
          message: "Are you sure to want make user?",
        };
      default:
        return { title: "", message: "" };
    }
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-linear-to-r from-amber-500 to-orange-500 text-white p-6 rounded-2xl shadow-lg mb-6 flex justify-between items-center"
      >
        <div>
          <h2 className="text-2xl font-bold">User Details</h2>
          <p className="opacity-80 text-sm">
            Profile information & quick actions
          </p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-white text-amber-600 rounded-xl hover:bg-gray-100 transition font-medium"
        >
          Back
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="backdrop-blur-md bg-white/60 border border-gray-100 rounded-2xl p-6 shadow-lg flex flex-col items-center">
          <div className="relative w-24 h-24 mb-4">
            {preview ? (
              <img
                src={preview}
                alt={user?.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-amber-100 shadow"
              />
            ) : (
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-3xl font-bold text-amber-600">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}

            {isEditMode && (
              <label className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-2 rounded-full cursor-pointer hover:bg-amber-600 transition">
                <FiCamera size={14} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {user?.name}
          </h3>

          <div className="flex gap-4 mb-4 flex-wrap justify-center">
            <p
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                roleColors[user?.role]
              }`}
            >
              {user?.role?.toUpperCase()}
            </p>

            <p
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                user?.isBanned ? statusColors.banned : statusColors.active
              }`}
            >
              {user?.isBanned ? "BANNED" : "ACTIVE"}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2">
              <IoMailOpenSharp />
              <span className="text-gray-500 break-all">
                {user?.email || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiPhone />
              <span className="text-gray-500">{user?.phone || "N/A"}</span>
            </div>
            <div className="flex items-start gap-2">
              <FaLocationDot className="mt-1" />
              <address className="text-gray-500 not-italic">
                {user?.address || "N/A"}
              </address>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-linear-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-amber-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800 text-lg">
                Edit Information
              </h4>

              {!isEditMode ? (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-amber-600 rounded-xl border border-amber-200 hover:bg-amber-50 transition"
                >
                  <FiEdit2 />
                  Edit
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsEditMode(false);
                    setFormData({
                      name: user?.name || "",
                      address: user?.address || "",
                      image: null,
                    });
                    setPreview(user?.avatar || "");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                >
                  <FiX />
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Enter user name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  rows="4"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Enter address"
                />
              </div>

              {isEditMode && (
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition disabled:opacity-70"
                >
                  <FiSave />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              )}
            </form>
          </div>

          <div className="bg-linear-to-r from-purple-50 to-fuchsia-50 rounded-2xl p-6 border border-fuchsia-100 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-4 text-lg">
              Activity
            </h4>
            <div className="space-y-2 text-gray-600">
              <p className="flex gap-1">
                <span className="font-medium">User Type:</span>
                <span>{user?.verified ? "Verified" : "Unverified"}</span>
              </p>
              <p className="flex gap-1">
                <span className="font-medium">Verification Code:</span>
                <span>{user?.otp ? user?.otp : "Not found"}</span>
              </p>
              <p className="flex gap-1">
                <span className="font-medium">Reset Code:</span>
                <span>
                  {user?.resetPasswordToken
                    ? user?.resetPasswordToken
                    : "Not found"}
                </span>
              </p>
              <p>
                <span className="font-medium">Joined:</span>{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleString()
                  : "N/A"}
              </p>
              <p>
                <span className="font-medium">Last Update:</span>{" "}
                {user?.updatedAt
                  ? new Date(user.updatedAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-linear-to-r from-purple-50 to-fuchsia-50 rounded-2xl p-6 border border-fuchsia-100 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-4 text-lg">
              Quick Actions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a
                href={`mailto:${user?.email}`}
                className="flex items-center justify-center px-4 py-2 bg-white text-green-600 rounded-xl border border-green-200 hover:bg-green-50 transition"
              >
                <FiMail className="mr-2" />
                Send Message
              </a>

              <a
                href={`tel:${user?.phone}`}
                className="flex items-center justify-center px-4 py-2 bg-white text-green-600 rounded-xl border border-green-200 hover:bg-green-50 transition"
              >
                <FiPhoneCall className="mr-2" />
                Call
              </a>

              {user?.role === "student" && (
                <>
                  <button
                    onClick={() => openModal("makeAdmin")}
                    className="flex items-center justify-center px-4 py-2 bg-white text-purple-600 rounded-xl border border-purple-200 hover:bg-purple-50 transition cursor-pointer"
                  >
                    Make Admin
                  </button>
                  <button
                    onClick={() => openModal("makeTeacher")}
                    className="flex items-center justify-center px-4 py-2 bg-white text-blue-600 rounded-xl border border-blue-200 hover:bg-blue-50 transition cursor-pointer"
                  >
                    Make Teacher
                  </button>
                </>
              )}

              {user?.role === "teacher" && (
                <>
                  <button
                    onClick={() => openModal("makeAdmin")}
                    className="flex items-center justify-center px-4 py-2 bg-white text-purple-600 rounded-xl border border-purple-200 hover:bg-purple-50 transition cursor-pointer"
                  >
                    Make Admin
                  </button>
                  <button
                    onClick={() => openModal("makeUser")}
                    className="flex items-center justify-center px-4 py-2 bg-white text-green-600 rounded-xl border border-green-200 hover:bg-green-50 transition cursor-pointer"
                  >
                    Make User
                  </button>
                </>
              )}

              {user?.role === "admin" && (
                <>
                  <button
                    onClick={() => openModal("makeTeacher")}
                    className="flex items-center justify-center px-4 py-2 bg-white text-blue-600 rounded-xl border border-blue-200 hover:bg-blue-50 transition cursor-pointer"
                  >
                    Make Teacher
                  </button>
                  <button
                    onClick={() => openModal("makeUser")}
                    className="flex items-center justify-center px-4 py-2 bg-white text-green-600 rounded-xl border border-green-200 hover:bg-green-50 transition cursor-pointer"
                  >
                    Make User
                  </button>
                </>
              )}

              {user?.isBanned ? (
                <button
                  onClick={() => openModal("unbanned")}
                  className="flex items-center justify-center px-4 py-2 bg-white text-green-600 rounded-xl border border-green-200 hover:bg-green-50 transition cursor-pointer"
                >
                  <FiUserCheck className="mr-2" />
                  Unbanned User
                </button>
              ) : (
                <button
                  onClick={() => openModal("banned")}
                  className="flex items-center justify-center px-4 py-2 bg-white text-amber-600 rounded-xl border border-amber-200 hover:bg-amber-50 transition cursor-pointer"
                >
                  <FiUserX className="mr-2" />
                  Ban User
                </button>
              )}

              <button
                onClick={() => openModal("delete")}
                className="flex items-center justify-center px-4 py-2 bg-white text-red-600 rounded-xl border border-red-200 hover:bg-red-50 transition cursor-pointer"
              >
                <FiTrash2 className="mr-2" />
                Delete User
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAction}
        title={getModalText().title}
        message={getModalText().message}
        type={
          modalAction === "delete"
            ? "danger"
            : modalAction === "banned"
              ? "warning"
              : "success"
        }
      />
    </div>
  );
};

export default UserDetails;
