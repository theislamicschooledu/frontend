import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router";
import { FaHome } from "react-icons/fa";
import { admin_nav_item } from "../../public/assist";
import logo from "./../../public/Logo-white.png";

const AdminNavBar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed lg:relative z-50 w-64 h-screen bg-gradient-to-b from-green-600 to-emerald-700 text-white flex flex-col shadow-lg
        ${sidebarOpen ? "block" : "hidden lg:flex"} overflow-y-scroll`}
      >
        <div className="px-6 py-6 flex gap-2 items-center text-lg font-medium">
          <img
            src={logo}
            alt="Website Logo"
            className="h-6 w-auto md:h-8 lg:h-10 object-contain transition-all duration-300"
          />
          <div className="flex flex-col">
            <h2>অ্যাডমিন ড্যাশবোর্ড</h2>
            <p className="text-xs">সকল এডমিন অ্যাক্সেস এখানে</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-1">
            {admin_nav_item.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition ${
                      isActive
                        ? "bg-white text-green-700 shadow-lg"
                        : "text-green-100 hover:bg-white/10"
                    }`}
                  >
                    <item.icon className="mr-3" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-green-500/30">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center px-4 py-3 text-green-100 hover:bg-white/10 rounded-xl transition"
          >
            <FaHome className="mr-3" />
            হোমে ফিরে যান
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default AdminNavBar;
