import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(
    localStorage.getItem("admin-theme") || "light"
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  // Redirect dashboard → analytics
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      navigate("/analytics", { replace: true });
    }
  }, [location.pathname, navigate]);

  // Apply theme
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

  const isActive = (path) =>
    location.pathname === path
      ? theme === "dark"
        ? "bg-gradient-to-r from-red-700 via-fuchsia-700 to-indigo-700 text-white scale-110 shadow-[0_0_30px_rgba(239,68,68,0.85)]"
        : "bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 text-white scale-110 shadow-[0_10px_30px_rgba(16,185,129,0.55)]"
      : theme === "dark"
        ? "hover:bg-zinc-800 hover:scale-105"
        : "hover:bg-emerald-100 hover:scale-105";

  return (
    <nav
      className={`
        sticky top-0 z-50 px-6 py-4 transition-all duration-700
        ${theme === "dark"
          ? `
            bg-gradient-to-r from-zinc-950 via-black to-zinc-900
            text-gray-100
            border-b border-red-900
            shadow-[0_20px_60px_rgba(239,68,68,0.35)]
          `
          : `
            bg-gradient-to-r from-[#f6f3ee] via-emerald-50 to-sky-50
            text-gray-900
            border-b border-emerald-400
            shadow-[0_20px_50px_rgba(16,185,129,0.35)]
          `
        }
      `}
    >
      <div className="flex items-center justify-between relative">
        {/* 🔮 Circular Glow Behind Logo */}
        <div
          className={`
            absolute -left-16 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-60
            ${theme === "dark"
              ? "bg-[radial-gradient(circle,_rgba(239,68,68,0.6),_transparent_70%)]"
              : "bg-[radial-gradient(circle,_rgba(16,185,129,0.6),_transparent_70%)]"
            }
          `}
        />

        {/* Logo */}
        <div
          onClick={() => navigate("/dashboard")}
          className={`
            relative z-10 text-xl font-extrabold tracking-[0.25em] cursor-pointer
            transition-all duration-500 hover:scale-125
            ${theme === "dark"
              ? "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,1)]"
              : "text-emerald-700 drop-shadow-[0_0_12px_rgba(16,185,129,0.9)]"
            }
          `}
        >
          ⚔️ ADMIN
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 relative z-10">
          <button
            onClick={() => navigate("/profile")}
            className={`px-5 py-2 rounded-xl transition-all duration-300 backdrop-blur-md ${isActive("/profile")}`}
          >
            👤 Profile
          </button>

          <button
            onClick={() => navigate("/analytics")}
            className={`px-5 py-2 rounded-xl transition-all duration-300 backdrop-blur-md ${isActive("/analytics")}`}
          >
            📊 Analytics
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`
              px-5 py-2 rounded-xl font-bold transition-all duration-500
              hover:scale-125
              ${theme === "dark"
                ? `
                  bg-gradient-to-r from-red-700 via-fuchsia-700 to-indigo-700
                  text-white
                  shadow-[0_0_25px_rgba(239,68,68,0.9)]
                `
                : `
                  bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400
                  text-white
                  shadow-[0_0_25px_rgba(16,185,129,0.8)]
                `
              }
            `}
          >
            {theme === "dark" ? "🌞 LIGHT" : "🌙 DARK"}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              px-5 py-2 rounded-xl
              bg-gradient-to-r from-red-600 via-rose-500 to-pink-500
              text-white font-semibold
              transition-all duration-500
              hover:scale-125
              shadow-[0_0_30px_rgba(239,68,68,0.9)]
            "
          >
            🚪 Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-3xl transition-all duration-300 hover:scale-150 relative z-10"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-700
          ${mobileOpen ? "max-h-[500px] mt-6 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div
          className={`
            flex flex-col gap-4 p-6 rounded-2xl backdrop-blur-xl
            ${theme === "dark"
              ? "bg-gradient-to-b from-zinc-900 via-black to-zinc-900"
              : "bg-gradient-to-b from-emerald-50 via-sky-50 to-teal-50"
            }
          `}
        >
          <button
            onClick={() => { navigate("/profile"); setMobileOpen(false); }}
            className={`px-4 py-3 rounded-xl text-left transition-all ${isActive("/profile")}`}
          >
            👤 Profile
          </button>

          <button
            onClick={() => { navigate("/analytics"); setMobileOpen(false); }}
            className={`px-4 py-3 rounded-xl text-left transition-all ${isActive("/analytics")}`}
          >
            📊 Analytics
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`
              px-4 py-3 rounded-xl font-bold
              ${theme === "dark"
                ? "bg-gradient-to-r from-red-700 via-fuchsia-700 to-indigo-700 text-white"
                : "bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 text-white"
              }
            `}
          >
            {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>

          <button
            onClick={handleLogout}
            className="
              px-4 py-3 rounded-xl
              bg-gradient-to-r from-red-600 via-rose-500 to-pink-500
              text-white
            "
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
