import { useState, useEffect } from "react";
import { FiMenu, FiUser, FiX } from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router";
import { Nav_Item } from "../../public/assist";
import { useAuth } from "../hooks/useAuth.js";
import toast from "react-hot-toast";
import logoWhite from "./../../public/Logo-white.png";
import logoBlue from "./../../public/Logo-blue.png";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile menu hide on link click
  const handleLinkClick = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg"
          : "bg-white/70 backdrop-blur-md backdrop-saturate-150 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <NavLink
          to={"/"}
          className="flex items-center space-x-2 transition-transform hover:scale-105"
          onClick={handleLinkClick}
        >
          {scrolled ? (
            <>
              <img
                src={logoWhite}
                alt="Website Logo"
                className="h-6 w-auto md:h-8 lg:h-10 object-contain transition-all duration-300"
              />
              <div className="flex flex-col gap-0">
                <p className="text-xl font-bold text-white">
                  THE ISLAMIC SCHOOL
                </p>
                <span className="text-xs text-gray-300 leading-2 tracking-widest">
                  Learn - Light - Lead with Islam
                </span>
              </div>
            </>
          ) : (
            <>
              <img
                src={logoBlue}
                alt="Website Logo"
                className="h-6 w-auto md:h-8 lg:h-10 object-contain transition-all duration-300"
              />
              <div className="flex flex-col gap-0">
                <p className="text-xl font-bold text-blue-900">
                  THE ISLAMIC SCHOOL
                </p>
                <span className="text-xs text-blue-600 leading-2 tracking-widest">
                  Learn - Light - Lead with Islam
                </span>
              </div>
            </>
          )}
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-4 lg:space-x-6 font-medium items-center">
          {Nav_Item.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-3 py-2 rounded-full transition text-sm lg:text-base ${
                  isActive
                    ? "bg-blue-500 text-white shadow-md"
                    : scrolled
                    ? "text-white hover:bg-blue-500/50 hover:text-white"
                    : "text-gray-700 hover:bg-blue-100/50 hover:text-blue-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {user ? (
            <>
              {user.role !== "admin" && (
                <NavLink
                  to={"/my-courses"}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-full transition text-sm lg:text-base ${
                      isActive
                        ? "bg-blue-500 text-white shadow-md"
                        : scrolled
                        ? "text-white hover:bg-blue-500/50 hover:text-white"
                        : "text-gray-700 hover:bg-blue-100/50 hover:text-blue-600"
                    }`
                  }
                >
                  আমার কোর্সসমুহ
                </NavLink>
              )}
              {user.role !== "student" && (
                <Link
                  to={`/${user.role}`}
                  className={`px-3 py-2 rounded-full transition font-semibold text-sm lg:text-base ${
                    scrolled
                      ? "text-white hover:bg-blue-500/50"
                      : "text-gray-800 hover:bg-blue-100/50 hover:text-blue-600"
                  }`}
                >
                  ড্যাশবোর্ড
                </Link>
              )}
              <Link
                to={"/profile"}
                className={`p-2 rounded-full transition ${
                  scrolled
                    ? "text-white hover:bg-blue-500/50"
                    : "text-gray-800 hover:bg-blue-100/50 hover:text-blue-600"
                }`}
              >
                <FiUser className="text-xl lg:text-2xl" />
              </Link>
              <button
                onClick={handleLogout}
                className={`px-4 py-2 rounded-full font-medium transition text-sm lg:text-base ${
                  scrolled
                    ? "bg-white text-blue-600 hover:bg-blue-50 hover:shadow-md"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 hover:shadow-lg"
                }`}
              >
                লগ আউট
              </button>
            </>
          ) : (
            <NavLink
              to={"/signup"}
              className={`px-4 py-2 rounded-full shadow hover:opacity-90 transition text-sm lg:text-base font-semibold ${
                scrolled
                  ? "bg-white text-blue-600 hover:bg-blue-50"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg"
              }`}
            >
              Join Now
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden p-2 rounded-lg transition ${
            scrolled
              ? "text-white hover:bg-blue-500/50"
              : "text-gray-700 hover:bg-blue-100/50"
          }`}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className={`lg:hidden px-4 py-4 space-y-2 font-medium transition-all duration-300 ${
            scrolled
              ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
              : "bg-white/95 backdrop-blur-md border-t border-gray-200"
          }`}
        >
          {Nav_Item.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg transition text-base font-medium ${
                  isActive
                    ? "bg-blue-500 text-white shadow-md"
                    : scrolled
                    ? "hover:bg-blue-500/50 hover:text-white"
                    : "hover:bg-blue-100/70 hover:text-blue-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="border-t border-gray-300/50 pt-3 mt-2">
            {user ? (
              <div className="space-y-2">
                <Link
                  to={`/${user.role}`}
                  onClick={handleLinkClick}
                  className={`block px-4 py-3 rounded-lg transition font-semibold ${
                    scrolled
                      ? "hover:bg-blue-500/50"
                      : "hover:bg-blue-100/70 hover:text-blue-600"
                  }`}
                >
                  ড্যাশবোর্ড
                </Link>
                <Link
                  to={"/profile"}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-semibold ${
                    scrolled
                      ? "hover:bg-blue-500/50"
                      : "hover:bg-blue-100/70 hover:text-blue-600"
                  }`}
                >
                  <FiUser className="text-xl" />
                  <span>প্রোফাইল</span>
                </Link>
                <button
                  onClick={() => {
                    handleLinkClick();
                    handleLogout();
                  }}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition ${
                    scrolled
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg"
                  }`}
                >
                  লগ আউট
                </button>
              </div>
            ) : (
              <NavLink
                to={"/signup"}
                onClick={handleLinkClick}
                className={`block w-full px-4 py-3 rounded-lg text-center font-semibold transition ${
                  scrolled
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg"
                }`}
              >
                Join Now
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
