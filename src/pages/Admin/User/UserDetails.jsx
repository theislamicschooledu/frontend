import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import api from "../../../utils/axios";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import {
  FiMail,
  FiPhone,
  FiPhoneCall,
  FiTrash2,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";
import { IoMailOpenSharp } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import ConfirmModal from "../../../components/ConfirmModal";

const UserDetails = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/admin/users/${id}`);
        if (res.data) setUser(res.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
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

  const confirmAction = async () => {
    if (modalAction === "delete") {
      setLoading(true);
      try {
        const res = await api.delete(`/admin/users/${id}`);
        if (res.data.success) {
          toast.success("User deleted successfully");
          navigate("/admin/users");
          setLoading(false);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (modalAction === "makeAdmin") {
      setLoading(true);
      try {
        const res = await api.put(`/admin/change-role`, {
          id: id,
          role: "admin",
        });
        if (res.data.success) {
          toast.success(res.data.message);
          setLoading(false);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (modalAction === "makeTeacher") {
      setLoading(true);
      try {
        const res = await api.put(`/admin/change-role`, {
          id: id,
          role: "teacher",
        });
        if (res.data.success) {
          toast.success(res.data.message);
          setLoading(false);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (modalAction === "makeUser") {
      setLoading(true);
      try {
        const res = await api.put(`/admin/change-role`, {
          id: id,
          role: "student",
        });
        if (res.data.success) {
          toast.success(res.data.message);
          setLoading(false);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (modalAction === "banned") {
      setLoading(true);
      try {
        const res = await api.put(`/admin/${id}/ban`);
        if (res.data.success) {
          toast.success("User Banned Successfully");
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (modalAction === "unbanned") {
      setLoading(true);
      try {
        const res = await api.put(`/admin/${id}/unBan`);
        if (res.data.success) {
          toast.success("User Unbanned Successfully");
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    setModalOpen(false);
    setModalAction(null);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 overflow-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-2xl shadow-lg mb-6 flex justify-between items-center"
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

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Profile Card */}
        <div className="backdrop-blur-md bg-white/60 border border-gray-100 rounded-2xl p-6 shadow-lg flex flex-col items-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-3xl font-bold text-amber-600 mb-4">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {user?.name}
          </h3>
          <div className="flex gap-8 mb-4">
            <p
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                roleColors[user?.role]
              }`}
            >
              {user?.role.toUpperCase()}
            </p>

            <p
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                user?.isBanned ? statusColors.banned : statusColors.active
              }`}
            >
              {user?.isBanned ? "BANNED" : "ACTIVE"}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <IoMailOpenSharp />
              <span className="text-gray-500">{user?.email || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiPhone />
              <span className="text-gray-500">{user?.phone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaLocationDot />
              <address className="text-gray-500">
                {user?.address || "N/A"}
              </address>
            </div>
          </div>
        </div>

        {/* Activity + Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Card */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-amber-100 shadow-sm">
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
                {new Date(user?.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Last Update:</span>{" "}
                {new Date(user?.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-2xl p-6 border border-fuchsia-100 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-4 text-lg">
              Quick Actions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a
                href={`mailto:${user?.email}`}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-white text-green-600 rounded-xl border border-green-200 hover:bg-green-50 transition"
              >
                <FiMail className="mr-2" />
                Send Message
              </a>
              <a
                href={`tel:${user?.phone}`}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-white text-green-600 rounded-xl border border-green-200 hover:bg-green-50 transition"
              >
                <FiPhoneCall className="mr-2" />
                Call
              </a>
              {user?.role === "student" && (
                <>
                  <button
                    onClick={() => openModal("makeAdmin")}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-white text-purple-600 rounded-xl border border-purple-200 hover:bg-purple-50 transition cursor-pointer"
                  >
                    Make Admin
                  </button>
                  <button
                    onClick={() => openModal("makeTeacher")}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-white text-blue-600 rounded-xl border border-blue-200 hover:bg-blue-50 transition cursor-pointer"
                  >
                    Make Teacher
                  </button>
                </>
              )}
              {user?.role === "teacher" && (
                <>
                  <button
                    onClick={() => openModal("makeAdmin")}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-white text-purple-600 rounded-xl border border-purple-200 hover:bg-purple-50 transition cursor-pointer"
                  >
                    Make Admin
                  </button>
                  <button
                    onClick={() => openModal("makeUser")}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-white text-green-600 rounded-xl border border-green-200 hover:bg-green-50 transition cursor-pointer"
                  >
                    Make User
                  </button>
                </>
              )}
              {user?.role === "admin" && (
                <>
                  <button
                    onClick={() => openModal("makeTeacher")}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-white text-blue-600 rounded-xl border border-blue-200 hover:bg-blue-50 transition cursor-pointer"
                  >
                    Make Teacher
                  </button>
                  <button
                    onClick={() => openModal("makeUser")}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-white text-green-600 rounded-xl border border-green-200 hover:bg-green-50 transition cursor-pointer"
                  >
                    Make User
                  </button>
                </>
              )}
              {user?.isBanned ? (
                <button
                  onClick={() => openModal("unbanned")}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-white text-green-600 rounded-xl border border-green-200 hover:bg-green-50 transition cursor-pointer"
                >
                  <FiUserCheck className="mr-2" />
                  Unbanned User
                </button>
              ) : (
                <button
                  onClick={() => openModal("banned")}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-white text-amber-600 rounded-xl border border-amber-200 hover:bg-amber-50 transition cursor-pointer"
                >
                  <FiUserX className="mr-2" />
                  Ban User
                </button>
              )}
              <button
                onClick={() => openModal("delete")}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-white text-red-600 rounded-xl border border-red-200 hover:bg-red-50 transition cursor-pointer"
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
            ? "danger"
            : "success"
        }
      />
    </div>
  );
};

export default UserDetails;
