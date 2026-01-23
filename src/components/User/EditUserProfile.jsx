import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserNavBar from "./userNavBar";
import { User, Mail, Save, X, AlertCircle, CheckCircle, Loader } from "lucide-react";

const EditUserProfile = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("admin-theme") || "light");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_BACKEND_URL;

  // 🔹 Theme sync
  useEffect(() => {
    const handleStorageChange = () => {
      setTheme(localStorage.getItem("admin-theme") || "light");
    };
    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 500);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const isDark = theme === "dark";

  // 🔹 Fetch current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          setError("No authentication token found. Please login first.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserName(res.data.user.userName || "");
        setEmail(res.data.user.email || "");
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API, token]);

  // 🔹 Update email only
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setSaving(true);

    try {
      const res = await axios.put(
        `${API}/auth/profile`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Profile updated successfully");
      setTimeout(() => navigate("/userprofile"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Profile update failed"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <UserNavBar />
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100"}`}>
          <div className={`text-center ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (error && !message) {
    return (
      <>
        <UserNavBar />
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100"}`}>
          <div className={`text-center px-4 max-w-sm ${isDark ? "text-red-300" : "text-red-700"}`}>
            <AlertCircle size={48} className="mx-auto mb-4" />
            <p className="text-lg font-medium mb-4">{error}</p>
            <button
              onClick={() => navigate("/userprofile")}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                isDark
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <UserNavBar />

      <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100"}`}>
        <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12">

          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className={`text-3xl sm:text-4xl font-bold mb-2 transition-colors duration-300 ${isDark ? "text-slate-50" : "text-slate-900"}`}>
              Edit Profile
            </h1>
            <p className={`transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Update your account information
            </p>
          </div>

          {/* Edit Form Card */}
          <div className={`rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur-xl border transition-all duration-300 ${
            isDark
              ? "bg-slate-800/60 border-slate-700"
              : "bg-white/70 border-slate-200"
          }`}>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Username (Read-only) */}
              <div>
                <label className={`flex items-center gap-2 text-sm font-semibold mb-3 transition-colors duration-300 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <User size={18} className={isDark ? "text-red-400" : "text-emerald-600"} />
                  Username
                </label>
                <div className={`relative rounded-lg p-4 transition-colors duration-300 ${
                  isDark
                    ? "bg-slate-700/30 border border-slate-600 text-slate-100"
                    : "bg-slate-50/50 border border-slate-200 text-slate-900"
                }`}>
                  <input
                    type="text"
                    value={userName}
                    disabled
                    className={`w-full bg-transparent outline-none cursor-not-allowed font-medium transition-colors duration-300 ${
                      isDark ? "placeholder-slate-500" : "placeholder-slate-400"
                    }`}
                  />
                  <p className={`text-xs mt-2 transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Username cannot be changed
                  </p>
                </div>
              </div>

              {/* Email (Editable) */}
              <div>
                <label className={`flex items-center gap-2 text-sm font-semibold mb-3 transition-colors duration-300 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <Mail size={18} className={isDark ? "text-orange-400" : "text-blue-600"} />
                  Email Address
                </label>
                <div className={`relative rounded-lg border-2 transition-all duration-300 ${
                  isDark
                    ? "border-slate-600 focus-within:border-emerald-500 bg-slate-700/30"
                    : "border-slate-200 focus-within:border-emerald-500 bg-slate-50/50"
                }`}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    required
                    className={`w-full px-4 py-3.5 bg-transparent outline-none font-medium transition-colors duration-300 ${
                      isDark
                        ? "text-slate-100 placeholder-slate-500"
                        : "text-slate-900 placeholder-slate-400"
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                <p className={`text-xs mt-2 transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  We'll use this email for important notifications
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className={`rounded-lg p-4 flex items-start gap-3 transition-colors duration-300 ${
                  isDark
                    ? "bg-red-900/20 border border-red-700 text-red-300"
                    : "bg-red-50/50 border border-red-200 text-red-700"
                }`}>
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {message && (
                <div className={`rounded-lg p-4 flex items-start gap-3 transition-colors duration-300 ${
                  isDark
                    ? "bg-emerald-900/20 border border-emerald-700 text-emerald-300"
                    : "bg-emerald-50/50 border border-emerald-200 text-emerald-700"
                }`}>
                  <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{message}</p>
                    <p className={`text-xs mt-1 ${isDark ? "text-emerald-300/70" : "text-emerald-700/70"}`}>
                      Redirecting to profile...
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving || message}
                  className={`flex-1 py-3 sm:py-3.5 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/40"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-400/40"
                  }`}
                >
                  {saving ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="group-hover:scale-110 transition-transform" />
                      Save Changes
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/userprofile")}
                  disabled={saving}
                  className={`flex-1 py-3 sm:py-3.5 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 group border disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark
                      ? "border-red-600/40 text-red-400 hover:bg-red-600/10"
                      : "border-red-500 text-red-600 hover:bg-red-50"
                  }`}
                >
                  <X size={18} className="group-hover:scale-110 transition-transform" />
                  Cancel
                </button>
              </div>

            </form>

          </div>

          {/* Info Card */}
          <div className={`rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-xl border transition-colors duration-300 mt-6 ${
            isDark
              ? "bg-slate-800/40 border-slate-700"
              : "bg-blue-50/50 border-blue-200"
          }`}>
            <div className="flex gap-3">
              <AlertCircle size={20} className={isDark ? "text-yellow-400" : "text-yellow-600"} />
              <div>
                <h4 className={`font-semibold mb-1 transition-colors duration-300 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                  Profile Update Info
                </h4>
                <p className={`text-sm transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Username cannot be changed. To change your email, please update it above and save your changes.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default EditUserProfile;