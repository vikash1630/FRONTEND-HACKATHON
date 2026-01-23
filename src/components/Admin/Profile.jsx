import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Shield, Edit3, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import AdminNav from "./adminNav";

const Profile = () => {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_BACKEND_URL;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("admin-theme") || "light");

  // Sync theme from localStorage
  useEffect(() => {
    const updateTheme = () => {
      const storedTheme = localStorage.getItem("admin-theme") || "light";
      setTheme(storedTheme);
    };

    updateTheme();
    window.addEventListener("storage", updateTheme);

    const observer = new MutationObserver(() => {
      updateTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const interval = setInterval(updateTheme, 500);

    return () => {
      window.removeEventListener("storage", updateTheme);
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  // 🔹 Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const res = await axios.get(`${API}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API, navigate]);

  const isDark = theme === "dark";

  return (
    <div
      className={`
        min-h-screen transition-colors duration-500
        ${isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
        }
      `}
    >
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {isDark ? (
          <>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-600/20 to-rose-600/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-600/20 to-pink-600/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-full blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/30 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-purple-400/15 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-emerald-500/15 to-teal-500/10 rounded-full blur-3xl" />
          </>
        )}
      </div>

      <AdminNav />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="space-y-2">
            <h1
              className={`
                text-3xl sm:text-4xl lg:text-5xl font-bold
                transition-colors duration-300
                ${isDark
                  ? "bg-gradient-to-r from-red-400 via-rose-300 to-pink-400 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent"
                }
              `}
            >
              Admin Profile
            </h1>
            <p
              className={`
                text-sm sm:text-base transition-colors duration-300
                ${isDark ? "text-slate-400" : "text-slate-600"}
              `}
            >
              Manage your account information and settings
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div
                className={`
                  w-12 h-12 rounded-full border-3 animate-spin mx-auto mb-4
                  ${isDark
                    ? "border-red-400/30 border-t-red-400"
                    : "border-emerald-400/30 border-t-emerald-400"
                  }
                `}
              />
              <p
                className={`
                  text-sm transition-colors duration-300
                  ${isDark ? "text-slate-400" : "text-slate-600"}
                `}
              >
                Loading profile...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            className={`
              mb-6 p-4 sm:p-6 rounded-xl border backdrop-blur-xl
              flex items-start gap-4 transition-all duration-300
              ${isDark
                ? "bg-red-950/40 border-red-800/50 text-red-200"
                : "bg-red-50/80 border-red-200/50 text-red-700"
              }
            `}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm sm:text-base">{error}</p>
              <p
                className={`
                  text-xs sm:text-sm mt-1
                  ${isDark ? "text-red-300/70" : "text-red-600/70"}
                `}
              >
                Please try again or contact support if the issue persists.
              </p>
            </div>
          </div>
        )}

        {/* Profile Card */}
        {user && !loading && (
          <div className="space-y-6">
            {/* Main Card */}
            <div className="relative group">
              <div
                className={`
                  absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100
                  transition-opacity duration-500
                  ${isDark
                    ? "bg-gradient-to-r from-red-600/20 to-rose-600/20"
                    : "bg-gradient-to-r from-emerald-600/20 to-teal-600/20"
                  }
                `}
              />

              <div
                className={`
                  relative rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl
                  transition-all duration-300 border backdrop-blur-xl
                  ${isDark
                    ? "bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 border-slate-700/50"
                    : "bg-gradient-to-br from-white/80 via-slate-50/60 to-white/80 border-slate-200/50"
                  }
                `}
              >
                {/* Welcome Badge */}
                <div className="flex items-center gap-2 mb-8">
                  <div
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${isDark
                        ? "bg-gradient-to-br from-red-600 to-rose-600"
                        : "bg-gradient-to-br from-emerald-500 to-teal-500"
                      }
                    `}
                  >
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p
                      className={`
                        text-xs font-semibold uppercase tracking-wide
                        ${isDark ? "text-slate-400" : "text-slate-600"}
                      `}
                    >
                      Welcome Back
                    </p>
                    <p
                      className={`
                        text-sm font-bold transition-colors duration-300
                        ${isDark ? "text-slate-200" : "text-slate-900"}
                      `}
                    >
                      {user.userName}
                    </p>
                  </div>
                </div>

                {/* Profile Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  {/* Username */}
                  <InfoCard
                    icon={User}
                    label="Username"
                    value={user.userName}
                    isDark={isDark}
                  />

                  {/* Email */}
                  <InfoCard
                    icon={Mail}
                    label="Email Address"
                    value={user.email}
                    isDark={isDark}
                  />

                  {/* Role */}
                  <InfoCard
                    icon={Shield}
                    label="Account Role"
                    value={user.isAdmin ? "Administrator" : "User"}
                    badge={user.isAdmin ? "Admin" : "User"}
                    isDark={isDark}
                  />
                </div>

                {/* Account Status */}
                <div
                  className={`
                    p-4 sm:p-6 rounded-xl mb-8 border
                    transition-colors duration-300
                    ${isDark
                      ? "bg-slate-700/30 border-slate-600/50"
                      : "bg-slate-100/50 border-slate-300/50"
                    }
                  `}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle
                      className={`
                        w-5 h-5
                        ${isDark ? "text-emerald-400" : "text-emerald-600"}
                      `}
                    />
                    <p
                      className={`
                        font-semibold transition-colors duration-300
                        ${isDark ? "text-slate-200" : "text-slate-900"}
                      `}
                    >
                      Account Status
                    </p>
                  </div>
                  <p
                    className={`
                      text-sm transition-colors duration-300
                      ${isDark ? "text-slate-400" : "text-slate-600"}
                    `}
                  >
                    Your account is active and in good standing. All administrative privileges are enabled.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-slate-700/50">
                  <button
                    onClick={() => navigate("/editprofile")}
                    className={`
                      group flex-1 flex items-center justify-center gap-2
                      px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold
                      transition-all duration-300 transform hover:scale-105 active:scale-95
                      ${isDark
                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/40 hover:shadow-red-500/60"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-400/30 hover:shadow-emerald-400/50"
                      }
                    `}
                  >
                    <Edit3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>Edit Profile</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                  </button>

                  <button
                    onClick={() => navigate("/analytics")}
                    className={`
                      group flex-1 flex items-center justify-center gap-2
                      px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold
                      transition-all duration-300 transform hover:scale-105 active:scale-95 border
                      ${isDark
                        ? "bg-slate-800/50 border-slate-600/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-500/50"
                        : "bg-white/50 border-slate-300/50 text-slate-900 hover:bg-slate-100/50 hover:border-slate-400/50"
                      }
                    `}
                  >
                    <span>Back to Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <StatBox
                title="Profile Completion"
                value="100%"
                description="All information filled"
                isDark={isDark}
                gradient={isDark ? "from-emerald-600 to-teal-600" : "from-emerald-500 to-teal-600"}
              />
              <StatBox
                title="Account Security"
                value="Strong"
                description="2FA ready (when available)"
                isDark={isDark}
                gradient={isDark ? "from-blue-600 to-cyan-600" : "from-blue-500 to-cyan-600"}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- UI COMPONENTS ---------- */

function InfoCard({ icon: Icon, label, value, badge, isDark }) {
  return (
    <div
      className={`
        p-4 sm:p-6 rounded-xl border transition-all duration-300
        group hover:scale-105 transform cursor-default
        ${isDark
          ? "bg-slate-700/30 border-slate-600/50 hover:bg-slate-600/40 hover:border-slate-500/50"
          : "bg-slate-100/50 border-slate-300/50 hover:bg-slate-200/50 hover:border-slate-400/50"
        }
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <p
          className={`
            text-xs font-semibold uppercase tracking-wide transition-colors duration-300
            ${isDark ? "text-slate-400" : "text-slate-600"}
          `}
        >
          {label}
        </p>
        <Icon
          className={`
            w-4 h-4 transition-all duration-300 group-hover:scale-125
            ${isDark ? "text-red-400" : "text-emerald-600"}
          `}
        />
      </div>
      <p
        className={`
          text-base sm:text-lg font-bold break-all transition-colors duration-300
          ${isDark ? "text-slate-100" : "text-slate-900"}
        `}
      >
        {value}
      </p>
      {badge && (
        <div className="mt-2 pt-2 border-t border-slate-600/50">
          <span
            className={`
              inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
              ${isDark
                ? "bg-red-600/30 text-red-200 border border-red-500/50"
                : "bg-emerald-100/80 text-emerald-700 border border-emerald-300/50"
              }
            `}
          >
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}

function StatBox({ title, value, description, isDark, gradient }) {
  return (
    <div className="group relative overflow-hidden rounded-xl p-6 sm:p-8 cursor-default">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

      <div className="relative z-10">
        <p className="text-white/80 text-sm font-medium mb-2">{title}</p>
        <p className="text-3xl sm:text-4xl font-bold text-white mb-1">{value}</p>
        <p className="text-white/70 text-xs sm:text-sm">{description}</p>
      </div>
    </div>
  );
}

export default Profile;