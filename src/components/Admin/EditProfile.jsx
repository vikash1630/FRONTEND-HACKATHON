import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Check, AlertCircle, ArrowLeft, Save, Loader } from "lucide-react";
import AdminNav from "./adminNav";

const EditProfile = () => {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_BACKEND_URL;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

  /* 🔹 Fetch profile */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const res = await axios.get(`${API}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEmail(res.data.user.email);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API, navigate]);

  /* 🔹 Update profile */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${API}/auth/profile`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(res.data.message || "Profile updated successfully");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

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

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <button
            onClick={() => navigate("/profile")}
            className={`
              inline-flex items-center gap-2 mb-6 font-medium
              transition-all duration-300 hover:gap-3
              ${isDark ? "text-red-400 hover:text-red-300" : "text-emerald-600 hover:text-emerald-700"}
            `}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>

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
              Edit Profile
            </h1>
            <p
              className={`
                text-sm sm:text-base transition-colors duration-300
                ${isDark ? "text-slate-400" : "text-slate-600"}
              `}
            >
              Update your account information and settings
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
                Please check your input and try again.
              </p>
            </div>
          </div>
        )}

        {/* Success State */}
        {success && !loading && (
          <div
            className={`
              mb-6 p-4 sm:p-6 rounded-xl border backdrop-blur-xl
              flex items-start gap-4 transition-all duration-300 animate-pulse
              ${isDark
                ? "bg-emerald-950/40 border-emerald-800/50 text-emerald-200"
                : "bg-emerald-50/80 border-emerald-200/50 text-emerald-700"
              }
            `}
          >
            <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm sm:text-base">{success}</p>
              <p
                className={`
                  text-xs sm:text-sm mt-1
                  ${isDark ? "text-emerald-300/70" : "text-emerald-600/70"}
                `}
              >
                Redirecting to profile page...
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        {!loading && (
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

            <form
              onSubmit={handleSubmit}
              className={`
                relative rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl
                transition-all duration-300 border backdrop-blur-xl
                ${isDark
                  ? "bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 border-slate-700/50"
                  : "bg-gradient-to-br from-white/80 via-slate-50/60 to-white/80 border-slate-200/50"
                }
              `}
            >
              {/* Email Field */}
              <div className="mb-8">
                <label
                  className={`
                    flex items-center gap-2 text-sm font-semibold mb-3
                    transition-colors duration-300
                    ${isDark ? "text-slate-300" : "text-slate-700"}
                  `}
                >
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>

                <div className="relative group/input">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`
                      w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl
                      font-medium transition-all duration-300
                      border backdrop-blur-sm
                      focus:outline-none focus:ring-2
                      ${isDark
                        ? "bg-slate-700/40 border-slate-600/50 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500/50"
                        : "bg-white/50 border-slate-300/50 text-slate-900 placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500/50"
                      }
                    `}
                    placeholder="you@example.com"
                  />

                  {email && (
                    <div
                      className={`
                        absolute right-4 top-1/2 -translate-y-1/2
                        ${isDark ? "text-red-400" : "text-emerald-600"}
                      `}
                    >
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <p
                  className={`
                    text-xs sm:text-sm mt-2 transition-colors duration-300
                    ${isDark ? "text-slate-400" : "text-slate-600"}
                  `}
                >
                  This email is used to log in to your account. Make sure it's correct and accessible.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
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
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className={`
                    group flex-1 flex items-center justify-center gap-2
                    px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold
                    transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:scale-100
                    ${isDark
                      ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/40 hover:shadow-red-500/60 disabled:opacity-75 disabled:cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-400/30 hover:shadow-emerald-400/50 disabled:opacity-75 disabled:cursor-not-allowed"
                    }
                  `}
                >
                  {saving ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Info Box */}
        {!loading && !error && (
          <div
            className={`
              mt-6 p-4 sm:p-6 rounded-xl border backdrop-blur-xl
              transition-colors duration-300
              ${isDark
                ? "bg-blue-950/40 border-blue-800/50"
                : "bg-blue-50/80 border-blue-200/50"
              }
            `}
          >
            <p
              className={`
                text-xs sm:text-sm transition-colors duration-300
                ${isDark ? "text-blue-200" : "text-blue-700"}
              `}
            >
              <span className="font-semibold">💡 Tip:</span> Keep your email address up to date to ensure you can always access your account and receive important notifications.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;