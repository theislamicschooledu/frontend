import { useState, useEffect } from "react";
import { FiGlobe, FiMenu, FiUser, FiX } from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router";
import { Nav_Item } from "../../public/assist";
import { useAuth } from "../hooks/useAuth.js";
import { useLanguage } from "../hooks/useLanguage.js";
import toast from "react-hot-toast";
import logoWhite from "./../../public/Logo-white.png";
import logoBlue from "./../../public/Logo-blue.png";
import { MdOutlineLocalPhone } from "react-icons/md";
import { CiLogin } from "react-icons/ci";
import { HiSparkles } from "react-icons/hi2";
import { FaPerson } from "react-icons/fa6";

// Each nav link gets its own hover color — cycles through this palette
const HOVER_COLORS = [
  { text: "hover:text-pink-500", bg: "hover:bg-pink-50", dot: "bg-pink-400" },
  { text: "hover:text-sky-500", bg: "hover:bg-sky-50", dot: "bg-sky-400" },
  {
    text: "hover:text-emerald-500",
    bg: "hover:bg-emerald-50",
    dot: "bg-emerald-400",
  },
  {
    text: "hover:text-amber-500",
    bg: "hover:bg-amber-50",
    dot: "bg-amber-400",
  },
  {
    text: "hover:text-violet-500",
    bg: "hover:bg-violet-50",
    dot: "bg-violet-400",
  },
  { text: "hover:text-rose-500", bg: "hover:bg-rose-50", dot: "bg-rose-400" },
];

// Scrolled variant needs lighter colors so they stay visible on the gradient bar
const HOVER_COLORS_SCROLLED = [
  { text: "hover:text-yellow-200", dot: "bg-yellow-200" },
  { text: "hover:text-cyan-200", dot: "bg-cyan-200" },
  { text: "hover:text-lime-200", dot: "bg-lime-200" },
  { text: "hover:text-orange-200", dot: "bg-orange-200" },
  { text: "hover:text-fuchsia-200", dot: "bg-fuchsia-200" },
  { text: "hover:text-rose-200", dot: "bg-rose-200" },
];

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Desktop breakpoint এ গেলে mobile menu স্বয়ংক্রিয়ভাবে বন্ধ হবে
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobile menu hide on link click
  const handleLinkClick = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t("common.loggedOut"));
      navigate("/login");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed inset-x-0 top-0 z-100 isolate w-full touch-pan-y transition-all duration-500 ${
          scrolled
            ? "bg-linear-to-r from-violet-600 via-indigo-600 to-sky-600 shadow-lg shadow-indigo-300/30"
            : "bg-white/95 backdrop-blur-md backdrop-saturate-150 shadow-sm"
        }`}
      >
        {/* Top strip */}
        <div className="relative h-7 overflow-hidden bg-linear-to-r from-teal-500 to-emerald-500">
          {/* Fun floating star sprinkles */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <HiSparkles className="absolute left-[8%] top-1 text-yellow-200 text-lg animate-[float_3s_ease-in-out_infinite]" />
            <HiSparkles className="absolute left-[42%] top-1.5 text-white text-sm animate-[float_4s_ease-in-out_infinite_0.5s]" />
            <HiSparkles className="absolute right-[15%] top-1 text-yellow-200 text-lg animate-[float_3.5s_ease-in-out_infinite_1s]" />
          </div>
          <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
            <p className="flex items-center gap-2">
              <MdOutlineLocalPhone className="text-white animate-[wiggle_2s_ease-in-out_infinite]" />
              <span className="text-xs font-medium text-white sm:text-sm">
                {t("common.callUs")}
              </span>
            </p>
            {user ? (
              <Link to={`/profile`} className="flex items-center gap-2 group">
                <FaPerson className="text-white text-lg group-hover:translate-x-1 transition-transform" />
                <span className="text-xs font-medium text-white sm:text-sm">
                  {user?.name}
                </span>
              </Link>
            ) : (
              <Link to={"/login"} className="flex items-center gap-2 group">
                <CiLogin className="text-white text-lg group-hover:translate-x-1 transition-transform" />
                <span className="text-xs font-medium text-white sm:text-sm">
                  {t("common.studentLogin")}
                </span>
              </Link>
            )}
          </div>
        </div>

        <div className="mx-auto grid h-14 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 sm:h-16 sm:px-6 lg:h-17 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-4">
          {/* Logo */}
          <NavLink
            to={"/"}
            className="flex min-w-0 items-center gap-2 transition-transform duration-300 hover:-rotate-2 hover:scale-[1.03]"
            onClick={handleLinkClick}
          >
            {scrolled ? (
              <>
                <img
                  src={logoWhite}
                  alt="Website Logo"
                  className="h-7 w-auto object-contain drop-shadow-sm animate-[bounce-slow_3s_ease-in-out_infinite] sm:h-8 lg:h-9"
                />
                <div className="flex flex-col gap-0">
                  <p className="truncate whitespace-nowrap text-sm font-extrabold tracking-wide text-white min-[390px]:text-base sm:text-lg md:text-xl">
                    {t("common.siteName")}
                  </p>
                  <span className="hidden text-[10px] font-medium leading-tight tracking-widest text-sky-100 sm:block md:text-[11px]">
                    {t("common.tagline")}
                  </span>
                </div>
              </>
            ) : (
              <>
                <img
                  src={logoBlue}
                  alt="Website Logo"
                  className="h-7 w-auto object-contain drop-shadow-sm animate-[bounce-slow_3s_ease-in-out_infinite] sm:h-8 lg:h-9"
                />
                <div className="flex flex-col gap-0">
                  <p className="truncate whitespace-nowrap text-sm font-extrabold tracking-wide text-indigo-900 min-[390px]:text-base sm:text-lg md:text-xl">
                    {t("common.siteName")}
                  </p>
                  <span className="hidden text-[10px] font-medium leading-tight tracking-widest text-emerald-600 sm:block md:text-[11px]">
                    {t("common.tagline")}
                  </span>
                </div>
              </>
            )}
          </NavLink>

          {/* Desktop Nav Links — centered */}
          <div className="hidden lg:flex justify-center items-center gap-1">
            {Nav_Item.map((link, i) => {
              const palette = scrolled
                ? HOVER_COLORS_SCROLLED[i % HOVER_COLORS_SCROLLED.length]
                : HOVER_COLORS[i % HOVER_COLORS.length];
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `group relative px-4 py-2 rounded-full font-semibold text-sm lg:text-base transition-all duration-300 ${
                      isActive
                        ? scrolled
                          ? "bg-white/15 text-white"
                          : "bg-indigo-50 text-indigo-700"
                        : scrolled
                          ? `text-white/90 ${palette.text}`
                          : `text-gray-600 ${palette.text} ${palette.bg}`
                    }`
                  }
                >
                  {t(link.labelKey)}
                  {/* animated underline dot */}
                  <span
                    className={`absolute left-1/2 -bottom-0.5 h-1 w-1 -translate-x-1/2 rounded-full opacity-0 scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 ${palette.dot}`}
                  />
                </NavLink>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={
                language === "bn"
                  ? t("common.switchToEnglish")
                  : t("common.switchToBangla")
              }
              title={
                language === "bn"
                  ? t("common.switchToEnglish")
                  : t("common.switchToBangla")
              }
              className={`group inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
                scrolled
                  ? "border-white/30 bg-white/15 text-white hover:bg-white/25"
                  : "border-indigo-100 bg-indigo-50 text-indigo-700 hover:border-indigo-200 hover:bg-indigo-100"
              }`}
            >
              <FiGlobe className="text-base transition-transform duration-300 group-hover:rotate-12" />
              <span>{language === "bn" ? "EN" : "বাংলা"}</span>
            </button>

            {user ? (
              <>
                {user.role !== "admin" && (
                  <NavLink
                    to={"/my-courses"}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-full transition text-sm lg:text-base font-medium whitespace-nowrap ${
                        isActive
                          ? scrolled
                            ? "bg-white/15 text-white"
                            : "bg-indigo-50 text-indigo-700"
                          : scrolled
                            ? "text-white/90 hover:bg-white/15"
                            : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                      }`
                    }
                  >
                    {t("common.myCourses")}
                  </NavLink>
                )}
                {user.role !== "student" && (
                  <Link
                    to={`/${user.role}`}
                    className={`px-3 py-2 rounded-full transition font-medium text-sm lg:text-base whitespace-nowrap ${
                      scrolled
                        ? "text-white/90 hover:bg-white/15"
                        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                    }`}
                  >
                    {t("common.dashboard")}
                  </Link>
                )}
                <Link
                  to={"/profile"}
                  className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 ${
                    scrolled
                      ? "bg-white/15 text-white hover:bg-white/25"
                      : "bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700"
                  }`}
                >
                  <FiUser className="text-lg lg:text-xl" />
                </Link>
                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 text-sm lg:text-base hover:shadow-md active:scale-95 ${
                    scrolled
                      ? "bg-white text-indigo-600 hover:bg-sky-50"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {t("common.logout")}
                </button>
              </>
            ) : (
              <NavLink
                to={"/login"}
                className={`px-5 py-2 rounded-full shadow-sm transition-all duration-300 text-sm lg:text-base font-semibold hover:scale-105 hover:shadow-md active:scale-95 ${
                  scrolled
                    ? "bg-white text-indigo-600 hover:bg-sky-50"
                    : "bg-linear-to-r from-indigo-600 to-sky-500 text-white hover:shadow-indigo-200"
                }`}
              >
                {t("common.joinNow")}
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={isOpen ? t("common.closeMenu") : t("common.openMenu")}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((open) => !open)}
            className={`lg:hidden justify-self-end p-2.5 rounded-full transition-all duration-300 active:scale-90 ${
              scrolled
                ? "bg-white/15 text-white hover:bg-white/25"
                : "bg-gray-100 text-gray-600 hover:bg-indigo-100"
            }`}
          >
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-navigation"
          className={`absolute inset-x-0 top-full overflow-y-auto overscroll-y-auto touch-pan-y [-webkit-overflow-scrolling:touch] lg:hidden transition-[max-height,opacity,visibility] duration-300 ease-in-out ${
            isOpen
              ? "visible pointer-events-auto max-h-[calc(100dvh-84px)] opacity-100 sm:max-h-[calc(100dvh-92px)]"
              : "invisible pointer-events-none max-h-0 opacity-0"
          }`}
        >
          <div
            className={`px-4 py-4 space-y-1 font-medium ${
              scrolled
                ? "bg-linear-to-b from-indigo-700 to-sky-700 text-white"
                : "bg-white/95 backdrop-blur-md border-t border-gray-200"
            }`}
          >
            {Nav_Item.map((link, i) => {
              const palette = scrolled
                ? HOVER_COLORS_SCROLLED[i % HOVER_COLORS_SCROLLED.length]
                : HOVER_COLORS[i % HOVER_COLORS.length];
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl transition-all duration-300 text-base ${
                      isActive
                        ? scrolled
                          ? "bg-white/15 text-white font-semibold"
                          : "bg-indigo-50 text-indigo-700 font-semibold"
                        : scrolled
                          ? `${palette.text} hover:bg-white/10`
                          : `${palette.text} ${palette.bg}`
                    }`
                  }
                >
                  {t(link.labelKey)}
                </NavLink>
              );
            })}

            <button
              type="button"
              onClick={toggleLanguage}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 font-semibold transition active:scale-[0.99] ${
                scrolled
                  ? "bg-white/10 text-white hover:bg-white/15"
                  : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              }`}
              aria-label={
                language === "bn"
                  ? t("common.switchToEnglish")
                  : t("common.switchToBangla")
              }
            >
              <span className="flex items-center gap-3">
                <FiGlobe className="text-xl" />
                {t("common.language")}
              </span>
              <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-black text-indigo-700 shadow-sm">
                {language === "bn" ? "EN" : "বাংলা"}
              </span>
            </button>

            <div className="border-t border-white/20 pt-3 mt-2">
              {user ? (
                <div className="space-y-1">
                  <Link
                    to={`/${user.role}`}
                    onClick={handleLinkClick}
                    className={`block px-4 py-3 rounded-xl transition font-semibold ${
                      scrolled
                        ? "hover:bg-white/10"
                        : "hover:bg-indigo-50 hover:text-indigo-700"
                    }`}
                  >
                    {t("common.dashboard")}
                  </Link>
                  <Link
                    to={"/profile"}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-semibold ${
                      scrolled
                        ? "hover:bg-white/10"
                        : "hover:bg-indigo-50 hover:text-indigo-700"
                    }`}
                  >
                    <FiUser className="text-xl" />
                    <span>{t("common.profile")}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLinkClick();
                      handleLogout();
                    }}
                    className={`w-full px-4 py-3 rounded-xl font-semibold transition active:scale-95 ${
                      scrolled
                        ? "bg-white text-indigo-600 hover:bg-sky-50"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {t("common.logout")}
                  </button>
                </div>
              ) : (
                <NavLink
                  to={"/login"}
                  onClick={handleLinkClick}
                  className={`block w-full px-4 py-3 rounded-xl text-center font-semibold transition active:scale-95 ${
                    scrolled
                      ? "bg-white text-indigo-600 hover:bg-sky-50"
                      : "bg-linear-to-r from-indigo-600 to-sky-500 text-white hover:shadow-md"
                  }`}
                >
                  {t("common.joinNow")}
                </NavLink>
              )}
            </div>
          </div>
        </div>

        <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-12deg); }
          75% { transform: rotate(12deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-6px) rotate(15deg); opacity: 1; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
      </nav>
      <div aria-hidden="true" className="h-21 shrink-0 sm:h-23 lg:h-24" />
    </>
  );
};

export default NavBar;
