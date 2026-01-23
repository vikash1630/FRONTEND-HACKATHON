import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, LogOut, Menu, X, BarChart3, User } from "lucide-react";

const AdminNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(
    localStorage.getItem("admin-theme") || "light"
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      navigate("/analytics", { replace: true });
    }
  }, [location.pathname, navigate]);

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

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/profile", label: "Profile", icon: User },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <>
      <nav
        className={`
          sticky top-0 z-50 transition-all duration-500 ease-out
          ${theme === "dark"
            ? "bg-slate-950 border-b border-slate-800 shadow-2xl shadow-slate-950/50"
            : "bg-white border-b border-slate-200 shadow-lg shadow-slate-100/50"
          }
        `}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
            
            {/* Logo Section */}
            <div
              onClick={() => navigate("/dashboard")}
              className={`
                flex items-center gap-3 cursor-pointer group
                transform transition-all duration-300 hover:scale-105
              `}
            >
              <div
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-xl
                  flex items-center justify-center font-bold text-lg
                  transition-all duration-500 transform group-hover:scale-110
                  ${theme === "dark"
                    ? "bg-gradient-to-br from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/50"
                    : "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-400/40"
                  }
                `}
              >
                ⚔️
              </div>
              <div className="hidden sm:block">
                <h1
                  className={`
                    text-lg sm:text-xl font-bold tracking-tight
                    transition-colors duration-300
                    ${theme === "dark" ? "text-slate-50" : "text-slate-900"}
                  `}
                >
                  Admin
                </h1>
                <p
                  className={`
                    text-xs font-medium tracking-widest uppercase
                    transition-colors duration-300
                    ${theme === "dark" ? "text-slate-400" : "text-slate-500"}
                  `}
                >
                  Dashboard
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              {navItems.map(({ path, label, icon: Icon }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`
                    group relative px-4 lg:px-5 py-2.5 rounded-lg
                    flex items-center gap-2.5 font-medium text-sm
                    transition-all duration-300 ease-out
                    ${isActive(path)
                      ? theme === "dark"
                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/40"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-400/30"
                      : theme === "dark"
                        ? "text-slate-300 hover:bg-slate-800 hover:text-slate-50"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }
                  `}
                >
                  <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
                  <span>{label}</span>
                  {isActive(path) && (
                    <div
                      className={`
                        absolute bottom-0 left-0 right-0 h-1 rounded-full
                        transform origin-left animate-pulse
                        ${theme === "dark"
                          ? "bg-gradient-to-r from-red-400 to-rose-400"
                          : "bg-gradient-to-r from-emerald-300 to-teal-300"
                        }
                      `}
                    />
                  )}
                </button>
              ))}

              <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-300 to-transparent dark:via-slate-700 mx-2 lg:mx-3" />

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`
                  relative group px-4 lg:px-5 py-2.5 rounded-lg
                  flex items-center gap-2.5 font-semibold text-sm
                  transition-all duration-500 ease-out
                  transform hover:scale-105 active:scale-95
                  ${theme === "dark"
                    ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/40 hover:shadow-red-500/60"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-400/30 hover:shadow-emerald-400/50"
                  }
                `}
              >
                {theme === "dark" ? (
                  <Sun size={18} className="animate-spin-slow" />
                ) : (
                  <Moon size={18} className="animate-spin-slow" />
                )}
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className={`
                  group relative px-4 lg:px-5 py-2.5 rounded-lg
                  flex items-center gap-2.5 font-semibold text-sm
                  transition-all duration-300 ease-out
                  transform hover:scale-105 active:scale-95
                  bg-gradient-to-r from-red-600 to-rose-600 text-white
                  shadow-lg shadow-red-500/40 hover:shadow-red-500/60
                `}
              >
                <LogOut size={18} />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`
                md:hidden p-2.5 rounded-lg transition-all duration-300
                ${theme === "dark"
                  ? "hover:bg-slate-800 text-slate-300 hover:text-slate-50"
                  : "hover:bg-slate-100 text-slate-700 hover:text-slate-900"
                }
              `}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`
              md:hidden overflow-hidden transition-all duration-500 ease-out
              border-t border-slate-200 dark:border-slate-800
              ${mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
            `}
          >
            <div
              className={`
                px-4 py-4 sm:px-6 sm:py-6 space-y-3
                ${theme === "dark" ? "bg-slate-900/50" : "bg-slate-50/50"}
              `}
            >
              {navItems.map(({ path, label, icon: Icon }) => (
                <button
                  key={path}
                  onClick={() => {
                    navigate(path);
                    setMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3.5 rounded-lg
                    font-medium text-sm transition-all duration-300
                    transform hover:scale-102 active:scale-95
                    ${isActive(path)
                      ? theme === "dark"
                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                      : theme === "dark"
                        ? "text-slate-300 hover:bg-slate-800 hover:text-slate-50"
                        : "text-slate-700 hover:bg-slate-200/50 hover:text-slate-900"
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </button>
              ))}

              <div className="pt-2 my-3 border-t border-slate-300 dark:border-slate-700" />

              <button
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                  setMobileOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3.5 rounded-lg
                  font-semibold text-sm transition-all duration-300
                  transform hover:scale-102 active:scale-95
                  ${theme === "dark"
                    ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  }
                `}
              >
                {theme === "dark" ? (
                  <>
                    <Sun size={20} />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={20} />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3.5 rounded-lg
                  font-semibold text-sm transition-all duration-300
                  transform hover:scale-102 active:scale-95
                  bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg
                `}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-20 z-40 bg-black/20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
};

export default AdminNav;