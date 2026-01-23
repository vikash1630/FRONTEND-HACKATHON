import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const UserNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(
    localStorage.getItem("admin-theme") || "light"
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  /* 🔹 Sync theme */
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("admin-theme", theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    navigate("/");
  };

  /* 🔹 Active link logic (supports nested routes) */
  const isActive = (path) => {
    const active = location.pathname.startsWith(path);

    if (!active) {
      return theme === "dark"
        ? "hover:bg-zinc-800/70"
        : "hover:bg-emerald-100/70";
    }

    return theme === "dark"
      ? "bg-gradient-to-r from-red-700 via-rose-600 to-fuchsia-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)]"
      : "bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]";
  };

  return (
    <nav
      className={`
        sticky top-0 z-50 px-5 py-4 backdrop-blur-xl transition-all duration-500
        ${
          theme === "dark"
            ? "bg-gradient-to-r from-zinc-950 via-black to-zinc-900 text-gray-100 border-b border-red-900/60"
            : "bg-gradient-to-r from-[#faf8f4] via-emerald-50 to-sky-50 text-gray-900 border-b border-emerald-300"
        }
      `}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate("/userdashboard")}
          className={`text-xl font-extrabold tracking-widest cursor-pointer transition-all hover:scale-110 ${
            theme === "dark" ? "text-red-400" : "text-emerald-700"
          }`}
        >
          👤 USER
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/userdashboard")}
            className={`px-4 py-2 rounded-xl ${isActive("/userdashboard")}`}
          >
            🏠 Dashboard
          </button>

          <button
            onClick={() => navigate("/userprofile")}
            className={`px-4 py-2 rounded-xl ${isActive("/userprofile")}`}
          >
            👤 Profile
          </button>

          <button
            onClick={() => navigate("/userhelp")}
            className={`px-4 py-2 rounded-xl ${isActive("/userhelp")}`}
          >
            ❓ Help
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`px-4 py-2 rounded-xl font-semibold ${
              theme === "dark"
                ? "bg-gradient-to-r from-red-800 to-fuchsia-700 text-white"
                : "bg-gradient-to-r from-emerald-600 to-sky-500 text-white"
            }`}
          >
            {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white hover:scale-110 transition"
          >
            🚪 Logout
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden w-10 h-10 relative"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span
            className={`absolute w-6 h-0.5 transition ${
              mobileOpen ? "rotate-45 bg-red-500" : "-translate-y-2 bg-current"
            }`}
          />
          <span
            className={`absolute w-6 h-0.5 transition ${
              mobileOpen ? "opacity-0" : "bg-current"
            }`}
          />
          <span
            className={`absolute w-6 h-0.5 transition ${
              mobileOpen ? "-rotate-45 bg-red-500" : "translate-y-2 bg-current"
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${
          mobileOpen ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`p-4 rounded-2xl flex flex-col gap-3 ${
            theme === "dark"
              ? "bg-gradient-to-b from-zinc-900 to-black"
              : "bg-gradient-to-b from-emerald-50 to-sky-50"
          }`}
        >
          <button
            onClick={() => {
              navigate("/userdashboard");
              setMobileOpen(false);
            }}
            className={`px-4 py-3 rounded-xl text-left ${isActive(
              "/userdashboard"
            )}`}
          >
            🏠 Dashboard
          </button>

          <button
            onClick={() => {
              navigate("/userprofile");
              setMobileOpen(false);
            }}
            className={`px-4 py-3 rounded-xl text-left ${isActive(
              "/userprofile"
            )}`}
          >
            👤 Profile
          </button>

          <button
            onClick={() => {
              navigate("/userhelp");
              setMobileOpen(false);
            }}
            className={`px-4 py-3 rounded-xl text-left ${isActive(
              "/userhelp"
            )}`}
          >
            ❓ Help
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-500 text-white"
          >
            {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;
