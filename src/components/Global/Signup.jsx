import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
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
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    // Client-side validation for UX only (backend does real validation)
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

        // Basic client validation for UX
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

            // ✅ ADD THIS LINE
            // alert("Account created successfully");

            setSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => navigate("/"), 2000);


        } catch (err) {
            console.error(err.response?.data || err.message);

            // Handle backend error messages
            const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";

            setErrors({
                submit: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-all duration-700 ${darkMode
            ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900'
            : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
            }`}>
            {/* Dark Mode Toggle */}
            <button
                onClick={() => setDarkMode(!darkMode)}
                className={`fixed top-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 hover:rotate-180 z-50 ${darkMode
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                    : 'bg-gradient-to-br from-indigo-600 to-purple-600'
                    }`}
            >
                {darkMode ? (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                )}
            </button>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob ${darkMode ? 'bg-purple-600' : 'bg-blue-200'}`}></div>
                <div className={`absolute top-40 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 ${darkMode ? 'bg-pink-600' : 'bg-purple-200'}`}></div>
                <div className={`absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 ${darkMode ? 'bg-indigo-600' : 'bg-pink-200'}`}></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-2 h-2 rounded-full animate-float ${darkMode ? 'bg-purple-400' : 'bg-blue-400'}`}
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
                <div className={`backdrop-blur-lg rounded-3xl shadow-2xl p-8 border transition-all duration-700 animate-slideUp ${darkMode
                    ? 'bg-gray-800/80 border-purple-500/30 shadow-purple-900/50'
                    : 'bg-white/80 border-white/20'
                    }`}>
                    {success ? (
                        // Success Message
                        <div className="text-center py-8 animate-fadeIn">
                            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                Account Created! 🎉
                            </h2>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Redirecting to login...
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="relative inline-block mb-4">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-lg animate-pulse"></div>
                                    <div className="relative p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full transform transition-all duration-500 hover:rotate-[360deg] hover:scale-110">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                    </div>
                                </div>
                                <h2 className={`text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fadeIn ${darkMode && 'from-blue-400 to-purple-400'}`}>
                                    Create Account
                                </h2>
                                <p className={`mt-2 text-sm animate-fadeIn animation-delay-200 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Join us today and get started
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Username */}
                                <div className="relative group">
                                    <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Username
                                    </label>
                                    <div className="relative">
                                        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur transition-opacity duration-300 ${focusedField === 'userName' ? 'opacity-40' : 'opacity-0'}`}></div>
                                        <input
                                            type="text"
                                            name="userName"
                                            required
                                            value={formData.userName}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('userName')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`relative w-full px-4 py-3 pl-12 border-2 rounded-xl outline-none transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] ${errors.userName
                                                ? 'border-red-500'
                                                : darkMode
                                                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50'
                                                    : 'bg-white border-gray-200 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500'
                                                }`}
                                            placeholder="johndoe"
                                        />
                                        <svg className={`absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300 ${focusedField === 'userName' ? 'text-purple-500' : darkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName}</p>}
                                </div>

                                {/* Email */}
                                <div className="relative group">
                                    <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur transition-opacity duration-300 ${focusedField === 'email' ? 'opacity-40' : 'opacity-0'}`}></div>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`relative w-full px-4 py-3 pl-12 border-2 rounded-xl outline-none transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] ${errors.email
                                                ? 'border-red-500'
                                                : darkMode
                                                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50'
                                                    : 'bg-white border-gray-200 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500'
                                                }`}
                                            placeholder="you@example.com"
                                        />
                                        <svg className={`absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-purple-500' : darkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div className="relative group">
                                    <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur transition-opacity duration-300 ${focusedField === 'password' ? 'opacity-40' : 'opacity-0'}`}></div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`relative w-full px-4 py-3 pl-12 pr-12 border-2 rounded-xl outline-none transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] ${errors.password
                                                ? 'border-red-500'
                                                : darkMode
                                                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50'
                                                    : 'bg-white border-gray-200 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500'
                                                }`}
                                            placeholder="••••••••"
                                        />
                                        <svg className={`absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-purple-500' : darkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className={`absolute right-3 top-3 p-1 rounded-lg transition-all duration-300 hover:scale-110 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                                        >
                                            {showPassword ? (
                                                <svg className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div className="relative group">
                                    <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur transition-opacity duration-300 ${focusedField === 'confirmPassword' ? 'opacity-40' : 'opacity-0'}`}></div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('confirmPassword')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`relative w-full px-4 py-3 pl-12 pr-12 border-2 rounded-xl outline-none transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] ${errors.confirmPassword
                                                ? 'border-red-500'
                                                : darkMode
                                                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50'
                                                    : 'bg-white border-gray-200 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500'
                                                }`}
                                            placeholder="••••••••"
                                        />
                                        <svg className={`absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300 ${focusedField === 'confirmPassword' ? 'text-purple-500' : darkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className={`absolute right-3 top-3 p-1 rounded-lg transition-all duration-300 hover:scale-110 ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}
                                        >
                                            {showConfirmPassword ? (
                                                <svg className={`w-5 h-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className={`w-5 h-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                                </div>

                                {/* Submit Error */}
                                {errors.submit && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl">
                                        <p className="text-red-500 text-sm text-center">{errors.submit}</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="relative w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-2xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/50 active:scale-95 mt-6"
                                >
                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
                                    <span className="relative flex items-center justify-center gap-2">
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                Create Account
                                                <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </>
                                        )}
                                    </span>
                                </button>

                                {/* Login Link */}
                                <div className="text-center space-y-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/")}
                                        className={`relative w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-95 border-2 group ${darkMode
                                            ? "border-purple-500 text-purple-400 hover:bg-purple-500/10"
                                            : "border-blue-500 text-blue-600 hover:bg-blue-50"
                                            }`}
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" />
                                        <span className="relative flex items-center justify-center gap-2">
                                            Already have an account? Login
                                            <svg
                                                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                />
                                            </svg>
                                        </span>
                                    </button>

                                    {/* Trust indicators */}
                                    <div className="flex items-center justify-center gap-6 pt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                Secure Signup
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                                            <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
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
                    0%, 100% { transform: translateY(0px); opacity: 0.2; }
                    50% { transform: translateY(-100px); opacity: 0.8; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-blob { animation: blob 7s infinite; }
                .animate-float { animation: float linear infinite; }
                .animate-slideUp { animation: slideUp 0.6s ease-out; }
                .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
                .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
                .animation-delay-200 {
                    animation-delay: 0.2s;
                    animation-fill-mode: backwards;
                }
            `}</style>
        </div>
    );
};

export default Signup;