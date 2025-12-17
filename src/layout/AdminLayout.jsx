import React, { useState } from "react";
import { Outlet } from "react-router";
import AdminNavBar from "../components/AdminNavBar";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import TeacherNavBar from "../components/TeacherNavBar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  return (
    <div className="flex w-full h-screen bg-gray-100">
      {user.role === "admin" ? (
        <AdminNavBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      ) : user.role === "teacher" ? (
        <TeacherNavBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      ) : (
        ""
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 lg:px-0 lg:py-0 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-600 mr-4"
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
