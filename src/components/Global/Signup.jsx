import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, User, Mail, Lock, CheckCircle } from "lucide-react";

const Signup = () => {
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [darkMode, setDarkMode] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const API = import.meta.env.VITE_BACKEND_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.userName.trim()) {
            newErrors.userName = "Username is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email format is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords don't match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        try {
            const res = await axios.post(
                `${API}/auth/signup`,
                {
                    userName: formData.userName,
                    email: formData.email,
                    password: formData.password
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Signup success:", res.data);
            setSuccess(true);

            setTimeout(() => navigate("/"), 2000);

        } catch (err) {
            console.error(err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
            setErrors({
                submit: errorMessage
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
                    darkMode ? 'bg-purple-700' : 'bg-blue-300'
                }`}></div>
                <div className={`absolute top-40 right-5 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000 ${
                    darkMode ? 'bg-indigo-700' : 'bg-purple-300'
                }`}></div>
                <div className={`absolute -bottom-8 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000 ${
                    darkMode ? 'bg-blue-700' : 'bg-indigo-300'
                }`}></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-1 h-1 sm:w-2 sm:h-2 rounded-full animate-float ${darkMode ? 'bg-purple-500' : 'bg-blue-400'}`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 10}s`
                        }}
                    />
                ))}
            </div>

            {/* Signup Card */}
            <div className="w-full max-w-md relative transform transition-all duration-500 hover:scale-105">
                <div className={`backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border-2 transition-all duration-700 animate-slideUp ${
                    darkMode
                        ? 'bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900 border-purple-600/50 shadow-purple-900/60'
                        : 'bg-gradient-to-br from-white via-blue-50/40 to-white border-blue-300/60 shadow-blue-300/40'
                }`}>
                    {success ? (
                        // Success Message
                        <div className="text-center py-8 animate-fadeIn">
                            <div className="mx-auto w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce-slow shadow-2xl shadow-green-500/50">
                                <CheckCircle size={36} className="text-white" />
                            </div>
                            <h2 className={`text-2xl sm:text-3xl font-bold mb-3 transition-colors duration-300 ${darkMode ? 'text-slate-50' : 'text-slate-900'}`}>
                                Account Created! 🎉
                            </h2>
                            <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                Redirecting to login...
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="text-center mb-6 sm:mb-8">
                                <div className="relative inline-block mb-4">
                                    <div className={`absolute inset-0 rounded-full blur-xl animate-pulse ${
                                        'bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 shadow-2xl shadow-purple-500/80'
                                    }`}></div>
                                    <div className={`relative p-3 sm:p-4 rounded-full transform transition-all duration-500 hover:rotate-[360deg] hover:scale-125 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600`}>
                                        <User className="w-7 sm:w-8 h-7 sm:h-8 text-white animate-bounce-slow" />
                                    </div>
                                </div>
                                <h2 className={`text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent animate-fadeIn`}>
                                    Create Account
                                </h2>
                                <p className={`mt-2 text-xs sm:text-sm animate-fadeIn animation-delay-200 font-medium transition-colors duration-300 ${
                                    darkMode ? 'text-purple-300' : 'text-blue-600'
                                }`}>
                                    Join us today and get started
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                {/* Username */}
                                <div className="relative group">
                                    <label className={`block text-xs sm:text-sm font-bold mb-2.5 transition-colors duration-300 ${
                                        darkMode ? 'text-purple-300' : 'text-blue-600'
                                    }`}>
                                        Username
                                    </label>
                                    <div className="relative">
                                        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-xl blur transition-opacity duration-300 ${focusedField === 'userName' ? 'opacity-60' : 'opacity-0'}`}></div>
                                        <input
                                            type="text"
                                            name="userName"
                                            required
                                            value={formData.userName}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('userName')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`relative w-full px-3 sm:px-4 py-2.5 sm:py-3.5 pl-9 sm:pl-12 border-2 rounded-xl outline-none text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] ${
                                                errors.userName
                                                    ? 'border-red-500'
                                                    : darkMode
                                                        ? 'bg-purple-950/40 border-purple-600/60 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40'
                                                        : 'bg-blue-50/70 border-blue-300/80 text-blue-950 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50'
                                            }`}
                                            placeholder="johndoe"
                                        />
                                        <User className={`absolute left-3 sm:left-4 top-2.5 sm:top-3.5 w-4 sm:w-5 h-4 sm:h-5 transition-colors duration-300 ${focusedField === 'userName'
                                            ? 'text-purple-500'
                                            : darkMode ? 'text-purple-400' : 'text-blue-600'
                                        }`} />
                                    </div>
                                    {errors.userName && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.userName}</p>}
                                </div>

                                {/* Email */}
                                <div className="relative group">
                                    <label className={`block text-xs sm:text-sm font-bold mb-2.5 transition-colors duration-300 ${
                                        darkMode ? 'text-purple-300' : 'text-blue-600'
                                    }`}>
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-xl blur transition-opacity duration-300 ${focusedField === 'email' ? 'opacity-60' : 'opacity-0'}`}></div>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`relative w-full px-3 sm:px-4 py-2.5 sm:py-3.5 pl-9 sm:pl-12 border-2 rounded-xl outline-none text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] ${
                                                errors.email
                                                    ? 'border-red-500'
                                                    : darkMode
                                                        ? 'bg-purple-950/40 border-purple-600/60 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40'
                                                        : 'bg-blue-50/70 border-blue-300/80 text-blue-950 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50'
                                            }`}
                                            placeholder="you@example.com"
                                        />
                                        <Mail className={`absolute left-3 sm:left-4 top-2.5 sm:top-3.5 w-4 sm:w-5 h-4 sm:h-5 transition-colors duration-300 ${focusedField === 'email'
                                            ? 'text-purple-500'
                                            : darkMode ? 'text-purple-400' : 'text-blue-600'
                                        }`} />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div className="relative group">
                                    <label className={`block text-xs sm:text-sm font-bold mb-2.5 transition-colors duration-300 ${
                                        darkMode ? 'text-purple-300' : 'text-blue-600'
                                    }`}>
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-xl blur transition-opacity duration-300 ${focusedField === 'password' ? 'opacity-60' : 'opacity-0'}`}></div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`relative w-full px-3 sm:px-4 py-2.5 sm:py-3.5 pl-9 sm:pl-12 pr-10 sm:pr-12 border-2 rounded-xl outline-none text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] ${
                                                errors.password
                                                    ? 'border-red-500'
                                                    : darkMode
                                                        ? 'bg-purple-950/40 border-purple-600/60 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40'
                                                        : 'bg-blue-50/70 border-blue-300/80 text-blue-950 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50'
                                            }`}
                                            placeholder="••••••••"
                                        />
                                        <Lock className={`absolute left-3 sm:left-4 top-2.5 sm:top-3.5 w-4 sm:w-5 h-4 sm:h-5 transition-colors duration-300 ${focusedField === 'password'
                                            ? 'text-purple-500'
                                            : darkMode ? 'text-purple-400' : 'text-blue-600'
                                        }`} />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className={`absolute right-2 sm:right-3 top-2.5 sm:top-3 p-1 rounded-lg transition-all duration-300 hover:scale-110 ${
                                                darkMode ? 'hover:bg-purple-900/50' : 'hover:bg-blue-100/70'
                                            }`}
                                        >
                                            {showPassword ? (
                                                <EyeOff className={`w-4 sm:w-5 h-4 sm:h-5 ${
                                                    darkMode ? 'text-purple-300' : 'text-blue-600'
                                                }`} />
                                            ) : (
                                                <Eye className={`w-4 sm:w-5 h-4 sm:h-5 ${
                                                    darkMode ? 'text-purple-300' : 'text-blue-600'
                                                }`} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div className="relative group">
                                    <label className={`block text-xs sm:text-sm font-bold mb-2.5 transition-colors duration-300 ${
                                        darkMode ? 'text-purple-300' : 'text-blue-600'
                                    }`}>
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-xl blur transition-opacity duration-300 ${focusedField === 'confirmPassword' ? 'opacity-60' : 'opacity-0'}`}></div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('confirmPassword')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`relative w-full px-3 sm:px-4 py-2.5 sm:py-3.5 pl-9 sm:pl-12 pr-10 sm:pr-12 border-2 rounded-xl outline-none text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] ${
                                                errors.confirmPassword
                                                    ? 'border-red-500'
                                                    : darkMode
                                                        ? 'bg-purple-950/40 border-purple-600/60 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40'
                                                        : 'bg-blue-50/70 border-blue-300/80 text-blue-950 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50'
                                            }`}
                                            placeholder="••••••••"
                                        />
                                        <Lock className={`absolute left-3 sm:left-4 top-2.5 sm:top-3.5 w-4 sm:w-5 h-4 sm:h-5 transition-colors duration-300 ${focusedField === 'confirmPassword'
                                            ? 'text-purple-500'
                                            : darkMode ? 'text-purple-400' : 'text-blue-600'
                                        }`} />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className={`absolute right-2 sm:right-3 top-2.5 sm:top-3 p-1 rounded-lg transition-all duration-300 hover:scale-110 ${
                                                darkMode ? 'hover:bg-purple-900/50' : 'hover:bg-blue-100/70'
                                            }`}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className={`w-4 sm:w-5 h-4 sm:h-5 ${
                                                    darkMode ? 'text-purple-300' : 'text-blue-600'
                                                }`} />
                                            ) : (
                                                <Eye className={`w-4 sm:w-5 h-4 sm:h-5 ${
                                                    darkMode ? 'text-purple-300' : 'text-blue-600'
                                                }`} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.confirmPassword}</p>}
                                </div>

                                {/* Submit Error */}
                                {errors.submit && (
                                    <div className={`p-4 backdrop-blur-sm border-2 rounded-xl transition-colors duration-300 ${
                                        darkMode
                                            ? 'bg-red-900/30 border-red-600/50 text-red-300'
                                            : 'bg-red-50/50 border-red-300/60 text-red-600'
                                    }`}>
                                        <p className="text-sm font-medium text-center">{errors.submit}</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`relative w-full text-white py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base shadow-lg overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-[1.03] active:scale-95 mt-2 ${
                                        'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:shadow-2xl hover:shadow-purple-500/50'
                                    }`}
                                >
                                    <span className={`absolute inset-0 w-full h-full transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600`}></span>
                                    <span className="relative flex items-center justify-center gap-2">
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span className="hidden sm:inline">Creating Account...</span>
                                                <span className="sm:hidden">Loading...</span>
                                            </>
                                        ) : (
                                            <>
                                                Create Account
                                                <svg className="w-4 sm:w-5 h-4 sm:h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </>
                                        )}
                                    </span>
                                </button>

                                {/* Login Link */}
                                <div className="text-center space-y-4 pt-2 sm:pt-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/")}
                                        className={`relative w-full py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-95 border-2 group ${
                                            darkMode
                                                ? 'border-purple-600/60 text-purple-300 hover:bg-purple-600/20'
                                                : 'border-blue-400/60 text-blue-600 hover:bg-blue-100/70'
                                        }`}
                                    >
                                        <span className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                                            darkMode ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'
                                        }`} />
                                        <span className="relative flex items-center justify-center gap-2">
                                            Already have an account? Login
                                            <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                    </button>

                                    {/* Trust Indicators */}
                                    <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap pt-2 sm:pt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className={`text-xs transition-colors duration-300 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                                Secure Signup
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                                            <span className={`text-xs transition-colors duration-300 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                                Encrypted Data
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>

            {/* Animations */}
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
                .animate-slideUp {
                    animation: slideUp 0.6s ease-out;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out;
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
                .animation-delay-200 {
                    animation-delay: 0.2s;
                    animation-fill-mode: backwards;
                }
            `}</style>
        </div>
    );
};

export default Signup;