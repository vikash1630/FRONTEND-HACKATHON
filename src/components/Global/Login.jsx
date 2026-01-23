import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, Loader } from "lucide-react";

const Login = () => {
    const [role, setRole] = useState("user");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [darkMode, setDarkMode] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [popup, setPopup] = useState(null);
    const [roleAlert, setRoleAlert] = useState(null);
    const navigate = useNavigate();

    const API = import.meta.env.VITE_BACKEND_URL;

    React.useEffect(() => {
        if (!popup) return;
        const t = setTimeout(() => setPopup(null), 4000);
        return () => clearTimeout(t);
    }, [popup]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(
                `${API}/auth/login`,
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            const { token, user } = res.data;

            // Check role mismatch
            if (role === "user" && user.isAdmin) {
                setRoleAlert({
                    type: "admin-detected",
                    message: "This account is registered as Admin. Please use Admin Login.",
                    action: () => {
                        setRole("admin");
                        setRoleAlert(null);
                    }
                });
                setLoading(false);
                return;
            }

            if (role === "admin" && !user.isAdmin) {
                setRoleAlert({
                    type: "user-detected",
                    message: "This account is registered as User. Please use User Login.",
                    action: () => {
                        setRole("user");
                        setRoleAlert(null);
                    }
                });
                setLoading(false);
                return;
            }

            // Save token and role
            localStorage.setItem("token", token);
            localStorage.setItem("isAdmin", user.isAdmin);

            setPopup({
                type: "success",
                message: `Welcome back! Redirecting...`,
            });

            // Redirect based on role
            setTimeout(() => {
                if (user.isAdmin) {
                    navigate("/dashboard");
                } else {
                    navigate("/userHome");
                }
            }, 1500);

        } catch (err) {
            const errorMessage =
                err.response?.data?.message || "Login failed. Try again.";

            setPopup({
                type: "error",
                message: errorMessage,
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-3 sm:p-4 relative overflow-hidden transition-all duration-700 ${darkMode
            ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
            : 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50'
            }`}>

            {/* Dark Mode Toggle */}
            <button
                onClick={() => setDarkMode(!darkMode)}
                className={`fixed top-4 sm:top-6 right-4 sm:right-6 p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 hover:rotate-180 z-50 ${darkMode
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/50'
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-400/50'
                    }`}
            >
                {darkMode ? (
                    <svg className="w-5 sm:w-6 h-5 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-5 sm:w-6 h-5 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                )}
            </button>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob ${
                    role === "admin"
                        ? darkMode ? 'bg-red-700' : 'bg-red-300'
                        : darkMode ? 'bg-blue-700' : 'bg-blue-300'
                }`}></div>
                <div className={`absolute top-40 right-5 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000 ${
                    role === "admin"
                        ? darkMode ? 'bg-rose-700' : 'bg-rose-300'
                        : darkMode ? 'bg-purple-700' : 'bg-purple-300'
                }`}></div>
                <div className={`absolute -bottom-8 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000 ${
                    role === "admin"
                        ? darkMode ? 'bg-pink-700' : 'bg-pink-300'
                        : darkMode ? 'bg-indigo-700' : 'bg-indigo-300'
                }`}></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-1 h-1 sm:w-2 sm:h-2 rounded-full animate-float ${
                            role === "admin"
                                ? darkMode ? 'bg-red-500' : 'bg-red-400'
                                : darkMode ? 'bg-blue-500' : 'bg-blue-400'
                        }`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 10}s`
                        }}
                    />
                ))}
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md relative transform transition-all duration-500 hover:scale-105">
                <div className={`backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border-2 transition-all duration-700 animate-slideUp ${
                    role === "admin"
                        ? darkMode
                            ? 'bg-gradient-to-br from-slate-900 via-red-900/40 to-slate-900 border-red-600/50 shadow-red-900/60'
                            : 'bg-gradient-to-br from-white via-red-50/40 to-white border-red-300/60 shadow-red-300/40'
                        : darkMode
                            ? 'bg-gradient-to-br from-slate-900 via-blue-900/40 to-slate-900 border-blue-600/50 shadow-blue-900/60'
                            : 'bg-gradient-to-br from-white via-blue-50/40 to-white border-blue-300/60 shadow-blue-300/40'
                }`}>

                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="relative inline-block mb-4">
                            <div className={`absolute inset-0 rounded-full blur-xl animate-pulse ${
                                role === "admin" 
                                    ? 'bg-gradient-to-br from-red-500 via-red-600 to-rose-600 shadow-2xl shadow-red-500/80' 
                                    : 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-2xl shadow-blue-500/80'
                            }`}></div>
                            <div className={`relative p-3 sm:p-4 rounded-full transform transition-all duration-500 hover:rotate-[360deg] hover:scale-125 ${
                                role === "admin" 
                                    ? 'bg-gradient-to-br from-red-500 via-red-600 to-rose-600' 
                                    : 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600'
                            }`}>
                                {role === "admin" ? (
                                    <svg className="w-7 sm:w-8 h-7 sm:h-8 text-white animate-bounce-slow" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                                ) : (
                                    <svg className="w-7 sm:w-8 h-7 sm:h-8 text-white animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <h2 className={`text-2xl sm:text-4xl font-bold bg-gradient-to-r ${
                            role === "admin" 
                                ? 'from-red-600 via-red-500 to-rose-600' 
                                : 'from-blue-600 via-blue-500 to-indigo-600'
                        } bg-clip-text text-transparent animate-fadeIn`}>
                            {role === "admin" ? "🔐 Admin" : "👤 User"}
                        </h2>
                        <p className={`mt-2 text-xs sm:text-sm animate-fadeIn animation-delay-200 font-medium ${
                            role === "admin"
                                ? darkMode ? 'text-red-300' : 'text-red-600'
                                : darkMode ? 'text-blue-300' : 'text-blue-600'
                        }`}>
                            {role === "admin" ? "Secure Administrative Access" : "Welcome Back to Your Account"}
                        </p>
                    </div>

                    {/* Status Badge */}
                    <div className={`mb-6 px-4 py-3 rounded-lg text-center text-xs sm:text-sm font-bold transition-all duration-300 backdrop-blur-sm border-2 ${
                        role === "admin"
                            ? darkMode
                                ? 'bg-red-900/40 border-red-600/60 text-red-200'
                                : 'bg-red-100/80 border-red-400/60 text-red-700'
                            : darkMode
                                ? 'bg-blue-900/40 border-blue-600/60 text-blue-200'
                                : 'bg-blue-100/80 border-blue-400/60 text-blue-700'
                    }`}>
                        {role === "admin" ? "🔒 Restricted Access Portal" : "✓ Standard User Account"}
                    </div>

                    {/* Role Toggle */}
                    <div className={`relative mb-6 sm:mb-8 p-2 rounded-2xl transition-all duration-700 border-2 backdrop-blur-sm ${
                        darkMode 
                            ? 'bg-gradient-to-r from-slate-800 via-slate-750 to-slate-800 border-slate-600 shadow-inner shadow-slate-900/50' 
                            : 'bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 border-slate-300 shadow-inner shadow-slate-300/30'
                    }`}>
                        {/* Animated Background Slider */}
                        <div
                            className={`absolute top-2 h-10 sm:h-11 rounded-xl transition-all duration-500 ease-out ${
                                role === "admin" 
                                    ? 'from-red-600 via-rose-500 to-red-600 translate-x-[calc(100%+8px)] bg-gradient-to-r shadow-2xl shadow-red-500/70 left-2' 
                                    : 'from-blue-600 via-cyan-500 to-blue-600 translate-x-0 bg-gradient-to-r shadow-2xl shadow-blue-500/70 left-2'
                            }`}
                        ></div>

                        {/* Toggle Buttons */}
                        <div className="relative flex gap-2">
                            {/* User Button */}
                            <button
                                type="button"
                                onClick={() => setRole("user")}
                                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 transform flex items-center justify-center gap-1.5 relative z-10 ${
                                    role === "user"
                                        ? "text-white drop-shadow-lg scale-105 font-extrabold"
                                        : darkMode 
                                            ? "text-slate-400 hover:text-slate-200 hover:scale-105" 
                                            : "text-slate-700 hover:text-slate-900 hover:scale-105"
                                }`}
                            >
                                <span className={`text-lg sm:text-xl transition-transform duration-300 ${role === "user" ? 'scale-125 animate-bounce-slow' : 'scale-100'}`}>👤</span>
                                <span className="hidden sm:inline">User</span>
                            </button>

                            {/* Admin Button */}
                            <button
                                type="button"
                                onClick={() => setRole("admin")}
                                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 transform flex items-center justify-center gap-1.5 relative z-10 ${
                                    role === "admin"
                                        ? "text-white drop-shadow-lg scale-105 font-extrabold"
                                        : darkMode 
                                            ? "text-slate-400 hover:text-slate-200 hover:scale-105" 
                                            : "text-slate-700 hover:text-slate-900 hover:scale-105"
                                }`}
                            >
                                <span className={`text-lg sm:text-xl transition-transform duration-300 ${role === "admin" ? 'scale-125 animate-bounce-slow' : 'scale-100'}`}>🔐</span>
                                <span className="hidden sm:inline">Admin</span>
                            </button>
                        </div>

                        {/* Subtle Border Accent */}
                        <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 ${
                            role === "admin"
                                ? 'border-l-2 border-t-2 border-red-500/40 opacity-100'
                                : 'border-l-2 border-t-2 border-blue-500/40 opacity-100'
                        }`}></div>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        {/* Popup Notifications */}
                        {popup && (
                            <div
                                className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold text-white transition-all duration-300 ${popup.type === "success"
                                    ? "bg-gradient-to-r from-emerald-500 to-green-600"
                                    : "bg-gradient-to-r from-red-500 to-rose-600"
                                    }`}
                            >
                                {popup.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                <span>{popup.message}</span>
                            </div>
                        )}

                        {/* Role Alert Modal */}
                        {roleAlert && (
                            <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
                                <div className={`rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl transition-all duration-300 transform scale-100 ${
                                    darkMode
                                        ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700'
                                        : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200'
                                }`}>
                                    <div className="text-center">
                                        <div className={`mx-auto w-12 sm:w-16 h-12 sm:h-16 rounded-full flex items-center justify-center mb-4 ${
                                            roleAlert.type === "admin-detected"
                                                ? "bg-gradient-to-br from-red-500 to-rose-600"
                                                : "bg-gradient-to-br from-blue-500 to-purple-600"
                                        }`}>
                                            <AlertCircle size={28} className="text-white" />
                                        </div>

                                        <h3 className={`text-lg sm:text-xl font-bold mb-2 transition-colors duration-300 ${darkMode ? "text-slate-50" : "text-slate-900"}`}>
                                            {roleAlert.type === "admin-detected" ? "Admin Account Detected" : "User Account Detected"}
                                        </h3>

                                        <p className={`text-sm mb-6 transition-colors duration-300 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                                            {roleAlert.message}
                                        </p>

                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={() => setRoleAlert(null)}
                                                className={`flex-1 py-2.5 sm:py-3 rounded-lg font-semibold text-sm transition-all ${
                                                    darkMode
                                                        ? "bg-slate-700 text-slate-200 hover:bg-slate-600"
                                                        : "bg-slate-200 text-slate-900 hover:bg-slate-300"
                                                }`}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={roleAlert.action}
                                                className={`flex-1 py-2.5 sm:py-3 rounded-lg font-semibold text-sm text-white transition-all ${
                                                    roleAlert.type === "admin-detected"
                                                        ? "bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-lg hover:shadow-red-500/40"
                                                        : "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/40"
                                                }`}
                                            >
                                                Switch to {roleAlert.type === "admin-detected" ? "Admin" : "User"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="relative group">
                            <label className={`block text-xs sm:text-sm font-bold mb-2.5 transition-colors duration-300 ${
                                role === "admin"
                                    ? darkMode ? 'text-red-300' : 'text-red-600'
                                    : darkMode ? 'text-blue-300' : 'text-blue-600'
                            }`}>
                                Email Address
                            </label>
                            <div className="relative">
                                <div className={`absolute inset-0 rounded-xl blur transition-opacity duration-300 ${role === "admin" 
                                    ? 'bg-gradient-to-r from-red-500 via-red-600 to-rose-600' 
                                    : 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600'
                                } ${focusedField === 'email' ? 'opacity-60' : 'opacity-0'
                                    }`}></div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`relative w-full px-3 sm:px-4 py-2.5 sm:py-3.5 pl-9 sm:pl-12 border-2 rounded-xl outline-none text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] ${
                                        role === "admin"
                                            ? darkMode
                                                ? 'bg-red-950/40 border-red-600/60 text-white placeholder-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-500/40'
                                                : 'bg-red-50/70 border-red-300/80 text-red-950 placeholder-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/50'
                                            : darkMode
                                                ? 'bg-blue-950/40 border-blue-600/60 text-white placeholder-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40'
                                                : 'bg-blue-50/70 border-blue-300/80 text-blue-950 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50'
                                    }`}
                                    placeholder="you@example.com"
                                />
                                <Mail className={`absolute left-3 sm:left-4 top-2.5 sm:top-3.5 w-4 sm:w-5 h-4 sm:h-5 transition-colors duration-300 ${focusedField === 'email'
                                    ? role === "admin" ? 'text-red-500' : 'text-blue-500'
                                    : role === "admin" ? (darkMode ? 'text-red-400' : 'text-red-600') : (darkMode ? 'text-blue-400' : 'text-blue-600')
                                    }`} />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="relative group">
                            <label className={`block text-xs sm:text-sm font-bold mb-2.5 transition-colors duration-300 ${
                                role === "admin"
                                    ? darkMode ? 'text-red-300' : 'text-red-600'
                                    : darkMode ? 'text-blue-300' : 'text-blue-600'
                            }`}>
                                Password
                            </label>
                            <div className="relative">
                                <div className={`absolute inset-0 rounded-xl blur transition-opacity duration-300 ${role === "admin" 
                                    ? 'bg-gradient-to-r from-red-500 via-red-600 to-rose-600' 
                                    : 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600'
                                } ${focusedField === 'password' ? 'opacity-60' : 'opacity-0'
                                    }`}></div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`relative w-full px-3 sm:px-4 py-2.5 sm:py-3.5 pl-9 sm:pl-12 pr-10 sm:pr-12 border-2 rounded-xl outline-none text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] ${
                                        role === "admin"
                                            ? darkMode
                                                ? 'bg-red-950/40 border-red-600/60 text-white placeholder-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-500/40'
                                                : 'bg-red-50/70 border-red-300/80 text-red-950 placeholder-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/50'
                                            : darkMode
                                                ? 'bg-blue-950/40 border-blue-600/60 text-white placeholder-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40'
                                                : 'bg-blue-50/70 border-blue-300/80 text-blue-950 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50'
                                    }`}
                                    placeholder="••••••••"
                                />
                                <Lock className={`absolute left-3 sm:left-4 top-2.5 sm:top-3.5 w-4 sm:w-5 h-4 sm:h-5 transition-colors duration-300 ${focusedField === 'password'
                                    ? role === "admin" ? 'text-red-500' : 'text-blue-500'
                                    : role === "admin" ? (darkMode ? 'text-red-400' : 'text-red-600') : (darkMode ? 'text-blue-400' : 'text-blue-600')
                                    }`} />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute right-2 sm:right-3 top-2.5 sm:top-3 p-1 rounded-lg transition-all duration-300 hover:scale-110 ${
                                        role === "admin"
                                            ? darkMode ? 'hover:bg-red-900/50' : 'hover:bg-red-100/70'
                                            : darkMode ? 'hover:bg-blue-900/50' : 'hover:bg-blue-100/70'
                                    }`}
                                >
                                    {showPassword ? (
                                        <EyeOff className={`w-4 sm:w-5 h-4 sm:h-5 ${
                                            role === "admin"
                                                ? darkMode ? 'text-red-300' : 'text-red-600'
                                                : darkMode ? 'text-blue-300' : 'text-blue-600'
                                        }`} />
                                    ) : (
                                        <Eye className={`w-4 sm:w-5 h-4 sm:h-5 ${
                                            role === "admin"
                                                ? darkMode ? 'text-red-300' : 'text-red-600'
                                                : darkMode ? 'text-blue-300' : 'text-blue-600'
                                        }`} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`relative w-full text-white py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base shadow-lg overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-[1.03] active:scale-95 ${
                                role === "admin"
                                    ? 'bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:shadow-2xl hover:shadow-red-500/50'
                                    : 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:shadow-2xl hover:shadow-blue-500/50'
                            }`}
                        >
                            <span className={`absolute inset-0 w-full h-full transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out ${
                                role === "admin"
                                    ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600'
                                    : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600'
                            }`}></span>
                            <span className="relative flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <Loader size={18} className="animate-spin" />
                                        <span className="hidden sm:inline">Authenticating...</span>
                                        <span className="sm:hidden">Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        Login Now
                                        <svg className="w-4 sm:w-5 h-4 sm:h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 sm:mt-8 text-center space-y-3 sm:space-y-4">
                        {role === "user" && (
                            <div className="space-y-2 sm:space-y-3">
                                <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Don't have an account?
                                </p>
                                <button
                                    onClick={() => navigate("/Signup")}
                                    className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-95 border-2 ${darkMode
                                        ? 'border-blue-500 text-blue-400 hover:bg-blue-500/10'
                                        : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                                        }`}
                                >
                                    Create New Account
                                </button>
                            </div>
                        )}

                        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>System Online</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Secure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-100px) rotate(180deg); opacity: 0.8; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: backwards;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: backwards;
        }
      `}</style>
        </div>
    );
};

export default Login;