import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserNavBar from "./userNavBar";
import { User, Mail, LogOut, Edit3, Calendar, Shield, CheckCircle } from "lucide-react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  // 🔹 Fetch profile
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
        setUser(res.data.user);
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

  if (error) {
    return (
      <>
        <UserNavBar />
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100"}`}>
          <div className={`text-center px-4 max-w-sm ${isDark ? "text-red-300" : "text-red-700"}`}>
            <p className="text-lg font-medium mb-4">{error}</p>
            <button
              onClick={() => navigate("/")}
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

  if (!user) {
    return (
      <>
        <UserNavBar />
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100"}`}>
          <div className={`text-center px-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            <p className="text-lg font-medium">No user data found</p>
          </div>
        </div>
      </>
    );
  }

  const handleLogout = () => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    navigate("/");
  };

  return (
    <>
      <UserNavBar />

      <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100"}`}>
        <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12">

          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className={`text-3xl sm:text-4xl font-bold mb-2 transition-colors duration-300 ${isDark ? "text-slate-50" : "text-slate-900"}`}>
              Profile Settings
            </h1>
            <p className={`transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Manage your account information and preferences
            </p>
          </div>

          {/* Main Profile Card */}
          <div className={`rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur-xl border transition-all duration-300 mb-6 ${
            isDark
              ? "bg-slate-800/60 border-slate-700"
              : "bg-white/70 border-slate-200"
          }`}>

            {/* Profile Header with Avatar */}
            <div className={`flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b transition-colors duration-300 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
              <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center text-5xl sm:text-6xl font-bold flex-shrink-0 bg-gradient-to-br transition-all duration-300 ${
                isDark
                  ? "from-red-600 to-rose-600"
                  : "from-emerald-500 to-teal-500"
              }`}>
                👤
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className={`text-2xl sm:text-3xl font-bold mb-2 transition-colors duration-300 ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                  {user?.userName || "User"}
                </h2>
                <p className={`mb-4 transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Premium Member
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <CheckCircle size={18} className="text-emerald-500" />
                  <p className={`text-sm transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Account Verified
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Information Grid */}
            <div className="space-y-4 mb-8">
              {/* Username */}
              <div className={`rounded-lg p-4 sm:p-5 backdrop-blur-sm border transition-colors duration-300 ${
                isDark
                  ? "bg-slate-700/30 border-slate-600"
                  : "bg-slate-50/50 border-slate-200"
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <User size={18} className={isDark ? "text-red-400" : "text-emerald-600"} />
                  <label className={`text-sm font-semibold transition-colors duration-300 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Username
                  </label>
                </div>
                <p className={`text-base sm:text-lg font-medium pl-9 transition-colors duration-300 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                  {user?.userName || "N/A"}
                </p>
              </div>

              {/* Email */}
              <div className={`rounded-lg p-4 sm:p-5 backdrop-blur-sm border transition-colors duration-300 ${
                isDark
                  ? "bg-slate-700/30 border-slate-600"
                  : "bg-slate-50/50 border-slate-200"
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <Mail size={18} className={isDark ? "text-orange-400" : "text-blue-600"} />
                  <label className={`text-sm font-semibold transition-colors duration-300 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Email Address
                  </label>
                </div>
                <p className={`text-base sm:text-lg font-medium pl-9 break-all transition-colors duration-300 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                  {user?.email || "N/A"}
                </p>
              </div>

              {/* Account Status */}
              <div className={`rounded-lg p-4 sm:p-5 backdrop-blur-sm border transition-colors duration-300 ${
                isDark
                  ? "bg-slate-700/30 border-slate-600"
                  : "bg-slate-50/50 border-slate-200"
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <Shield size={18} className={isDark ? "text-purple-400" : "text-purple-600"} />
                  <label className={`text-sm font-semibold transition-colors duration-300 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Account Status
                  </label>
                </div>
                <div className="flex items-center gap-2 pl-9">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <p className={`text-base sm:text-lg font-medium transition-colors duration-300 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                    Active
                  </p>
                </div>
              </div>

              {/* Member Since */}
              <div className={`rounded-lg p-4 sm:p-5 backdrop-blur-sm border transition-colors duration-300 ${
                isDark
                  ? "bg-slate-700/30 border-slate-600"
                  : "bg-slate-50/50 border-slate-200"
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <Calendar size={18} className={isDark ? "text-cyan-400" : "text-cyan-600"} />
                  <label className={`text-sm font-semibold transition-colors duration-300 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Member Since
                  </label>
                </div>
                <p className={`text-base sm:text-lg font-medium pl-9 transition-colors duration-300 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                  January 2024
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => navigate("/edituserprofile")}
                className={`flex-1 py-3 sm:py-3.5 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 group ${
                  isDark
                    ? "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:shadow-lg hover:shadow-red-500/40"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-400/40"
                }`}
              >
                <Edit3 size={18} className="group-hover:scale-110 transition-transform" />
                Edit Profile
              </button>

              <button
                onClick={handleLogout}
                className={`flex-1 py-3 sm:py-3.5 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 group border ${
                  isDark
                    ? "border-red-600/40 text-red-400 hover:bg-red-600/10"
                    : "border-red-500 text-red-600 hover:bg-red-50"
                }`}
              >
                <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                Logout
              </button>
            </div>

          </div>

          {/* Security Reminder */}
          <div className={`rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-xl border transition-colors duration-300 ${
            isDark
              ? "bg-slate-800/40 border-slate-700"
              : "bg-blue-50/50 border-blue-200"
          }`}>
            <div className="flex gap-3">
              <Shield size={20} className={isDark ? "text-yellow-400" : "text-yellow-600"} />
              <div>
                <h4 className={`font-semibold mb-1 transition-colors duration-300 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                  Security Tip
                </h4>
                <p className={`text-sm transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Keep your profile information up to date and enable two-factor authentication for better security.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default UserProfile;