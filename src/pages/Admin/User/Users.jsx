import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle, FiEye, FiUserCheck, FiUsers } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import { PiChalkboardTeacherLight } from "react-icons/pi";
import { Link } from "react-router";
import api from "../../../utils/axios";

const Users = () => {
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    if (filter === "banned") return user.isBanned;
    return user.role === filter;
  });

  const roleColors = {
    admin: "bg-purple-100 text-purple-800",
    teacher: "bg-blue-100 text-blue-800",
    student: "bg-green-100 text-green-800",
  };

  const statusColors = {
    active: "bg-green-100 text-green-800",
    banned: "bg-red-100 text-red-800",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Users"
            count={users.length}
            icon={<FiUsers size={24} />}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            title="Active Users"
            count={users.filter((u) => !u.isBanned).length}
            icon={<FiUserCheck size={24} />}
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            title="Admins"
            count={users.filter((u) => u.role === "admin").length}
            icon={<MdAdminPanelSettings size={24} />}
            color="from-[#42275a] to-[#734b6d]"
          />
          <StatCard
            title="Teachers"
            count={users.filter((u) => u.role === "teacher").length}
            icon={<PiChalkboardTeacherLight size={24} />}
            color="from-[#6a11cb] to-[#2575fc]"
          />
          <StatCard
            title="Banned Users"
            count={users.filter((u) => u.isBanned).length}
            icon={<FiAlertTriangle size={24} />}
            color="from-yellow-500 to-red-500"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-3">
            {[
              { key: "all", label: "All" },
              { key: "student", label: "Students" },
              { key: "teacher", label: "Teachers" },
              { key: "admin", label: "Admins" },
              { key: "banned", label: "Banned Users" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filter === btn.key
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <Th>User</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th>Join Date</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <Td>
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </Td>
                    <Td>{user.email}</Td>
                    <Td>{user.phone}</Td>
                    <Td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          roleColors[user.role]
                        }`}
                      >
                        {user.role}
                      </span>
                    </Td>
                    <Td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.isBanned
                            ? statusColors.banned
                            : statusColors.active
                        }`}
                      >
                        {user.isBanned ? "Banned" : "Active"}
                      </span>
                    </Td>
                    <Td>
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Td>
                    <Td>
                      <Link
                        to={`/admin/users/${user._id}`}
                        className="text-green-600 hover:text-green-800 flex items-center gap-2"
                      >
                        <FiEye /> <span>view</span>
                      </Link>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    </main>
  );
};

export default Users;

// 🧩 Reusable Components
const StatCard = ({ title, count, icon, color }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{count}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-r ${color} text-white`}>
        {icon}
      </div>
    </div>
  </div>
);

const Th = ({ children }) => (
  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
    {children}
  </td>
);
