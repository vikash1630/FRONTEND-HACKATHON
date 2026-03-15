import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, Loader, Moon, Sun } from "lucide-react";

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

    const DEMO_CREDENTIALS = {
        user: { email: "USER@gmail.com", password: "12345678" },
        admin: { email: "ADMIN@gmail.com", password: "12345678" },
    };

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

            if (role === "user" && user.isAdmin) {
                setRoleAlert({
                    type: "admin-detected",
                    message: "This account is registered as Admin. Please use Admin Login.",
                    action: () => { setRole("admin"); setRoleAlert(null); }
                });
                setLoading(false);
                return;
            }

            if (role === "admin" && !user.isAdmin) {
                setRoleAlert({
                    type: "user-detected",
                    message: "This account is registered as User. Please use User Login.",
                    action: () => { setRole("user"); setRoleAlert(null); }
                });
                setLoading(false);
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("isAdmin", user.isAdmin);

            setPopup({ type: "success", message: `Welcome back! Redirecting...` });

            setTimeout(() => {
                if (user.isAdmin) navigate("/dashboard");
                else navigate("/userHome");
            }, 1500);

        } catch (err) {
            const errorMessage = err.response?.data?.message || "Login failed. Try again.";
            setPopup({ type: "error", message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const isAdmin = role === "admin";

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-700 ${darkMode ? 'bg-[#080b14]' : 'bg-[#eef1f8]'}`}>

            {/* Ambient Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-15 transition-all duration-700 ${isAdmin ? 'bg-rose-600' : 'bg-violet-600'}`}></div>
                <div className={`absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-15 transition-all duration-700 ${isAdmin ? 'bg-orange-500' : 'bg-cyan-500'}`}></div>
            </div>

            {/* Grid overlay */}
            <div className={`absolute inset-0 pointer-events-none ${darkMode ? 'opacity-[0.025]' : 'opacity-[0.05]'}`}
                style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '44px 44px' }}
            />

            {/* Dark/Light Mode Toggle — clean pill button top-right */}
            <button
                onClick={() => setDarkMode(!darkMode)}
                className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 ${
                    darkMode
                        ? 'bg-slate-800 border-slate-600/80 text-amber-300 hover:bg-slate-700'
                        : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50 shadow-md'
                }`}
            >
                {darkMode
                    ? <><Sun size={13} className="text-amber-400" /><span className="hidden sm:inline">Light Mode</span></>
                    : <><Moon size={13} className="text-slate-500" /><span className="hidden sm:inline">Dark Mode</span></>
                }
            </button>

            {/* Card */}
            <div className="w-full max-w-md relative animate-slideUp">
                <div className={`rounded-2xl border overflow-hidden shadow-2xl transition-all duration-500 ${
                    darkMode
                        ? `bg-slate-900/95 border-slate-700/70 backdrop-blur-xl ${isAdmin ? 'shadow-rose-900/20' : 'shadow-violet-900/20'}`
                        : `bg-white/95 border-slate-200 backdrop-blur-xl ${isAdmin ? 'shadow-rose-200/40' : 'shadow-violet-200/40'}`
                }`}>

                    {/* Gradient top bar */}
                    <div className={`h-[3px] w-full transition-all duration-500 ${isAdmin ? 'bg-gradient-to-r from-rose-500 via-red-400 to-orange-500' : 'bg-gradient-to-r from-violet-500 via-blue-400 to-cyan-400'}`} />

                    <div className="p-6 sm:p-8">

                        {/* Header */}
                        <div className="text-center mb-7">
                            <div className="relative inline-flex items-center justify-center mb-4">
                                <div className={`absolute inset-0 rounded-2xl blur-xl opacity-50 transition-all duration-500 ${isAdmin ? 'bg-gradient-to-br from-rose-500 to-orange-500' : 'bg-gradient-to-br from-violet-500 to-cyan-500'}`}></div>
                                <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${isAdmin ? 'bg-gradient-to-br from-rose-500 via-red-500 to-orange-500' : 'bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500'}`}>
                                    {isAdmin ? (
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                {isAdmin ? "Admin Portal" : "Welcome Back"}
                            </h1>
                            <p className={`mt-1 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {isAdmin ? "Secure administrative access" : "Sign in to your account"}
                            </p>
                        </div>

                        {/* Role Toggle */}
                        <div className={`flex p-1 rounded-xl mb-6 transition-all duration-300 ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}>
                            {["user", "admin"].map((r) => {
                                const active = role === r;
                                return (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                                            active
                                                ? `text-white shadow-md ${r === "admin" ? 'bg-gradient-to-r from-rose-500 to-orange-500 shadow-rose-500/30' : 'bg-gradient-to-r from-violet-500 to-cyan-500 shadow-violet-500/30'}`
                                                : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        <span>{r === "user" ? "👤" : "🔐"}</span>
                                        <span className="capitalize">{r}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Demo Credentials Box */}
                        <div className={`mb-6 rounded-xl border p-4 transition-all duration-500 ${darkMode ? 'bg-slate-800/60 border-slate-700/80' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="flex items-center gap-2 mb-3">
                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isAdmin ? 'bg-rose-400' : 'bg-violet-400'}`}></div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Demo Credentials — For Showcase Only
                                </span>
                            </div>
                            <div className="space-y-1.5">
                                {[
                                    { label: "Email", value: DEMO_CREDENTIALS[role].email },
                                    { label: "Password", value: DEMO_CREDENTIALS[role].password },
                                ].map(({ label, value }) => (
                                    <div key={label} className={`flex items-center justify-between rounded-lg px-3 py-2 ${darkMode ? 'bg-slate-900/70' : 'bg-white border border-slate-100 shadow-sm'}`}>
                                        <span className={`text-xs font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{label}</span>
                                        <span className={`text-xs font-bold font-mono ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{value}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail(DEMO_CREDENTIALS[role].email);
                                    setPassword(DEMO_CREDENTIALS[role].password);
                                }}
                                className={`mt-3 w-full py-2 rounded-lg text-xs font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-sm ${isAdmin ? 'bg-gradient-to-r from-rose-500 to-orange-500' : 'bg-gradient-to-r from-violet-500 to-cyan-500'}`}
                            >
                                ⚡ Auto-fill &amp; Try Demo
                            </button>
                        </div>

                        {/* Popup notification */}
                        {popup && (
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-4 text-sm font-semibold text-white ${popup.type === "success" ? "bg-gradient-to-r from-emerald-500 to-teal-600" : "bg-gradient-to-r from-red-500 to-rose-600"}`}>
                                {popup.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                <span>{popup.message}</span>
                            </div>
                        )}

                        {/* Form */}
                        <div className="space-y-4">
                            {/* Email field */}
                            <div>
                                <label className={`block text-[11px] font-bold mb-2 uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="you@example.com"
                                        className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium border outline-none transition-all duration-200 ${
                                            darkMode
                                                ? `bg-slate-800 text-white placeholder-slate-600 ${focusedField === 'email' ? `border-transparent ring-2 ${isAdmin ? 'ring-rose-500/50' : 'ring-violet-500/50'}` : 'border-slate-700 hover:border-slate-600'}`
                                                : `bg-white text-slate-900 placeholder-slate-400 ${focusedField === 'email' ? `border-transparent ring-2 ${isAdmin ? 'ring-rose-400/50' : 'ring-violet-400/50'}` : 'border-slate-200 hover:border-slate-300'}`
                                        }`}
                                    />
                                    <Mail className={`absolute left-3.5 top-3.5 w-4 h-4 transition-colors duration-200 ${focusedField === 'email' ? (isAdmin ? 'text-rose-400' : 'text-violet-400') : darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                </div>
                            </div>

                            {/* Password field */}
                            <div>
                                <label className={`block text-[11px] font-bold mb-2 uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="••••••••"
                                        className={`w-full pl-10 pr-11 py-3 rounded-xl text-sm font-medium border outline-none transition-all duration-200 ${
                                            darkMode
                                                ? `bg-slate-800 text-white placeholder-slate-600 ${focusedField === 'password' ? `border-transparent ring-2 ${isAdmin ? 'ring-rose-500/50' : 'ring-violet-500/50'}` : 'border-slate-700 hover:border-slate-600'}`
                                                : `bg-white text-slate-900 placeholder-slate-400 ${focusedField === 'password' ? `border-transparent ring-2 ${isAdmin ? 'ring-rose-400/50' : 'ring-violet-400/50'}` : 'border-slate-200 hover:border-slate-300'}`
                                        }`}
                                    />
                                    <Lock className={`absolute left-3.5 top-3.5 w-4 h-4 transition-colors duration-200 ${focusedField === 'password' ? (isAdmin ? 'text-rose-400' : 'text-violet-400') : darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`absolute right-3 top-3 p-0.5 rounded transition-colors duration-200 ${darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit button */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`relative w-full py-3.5 rounded-xl font-bold text-sm text-white overflow-hidden group transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg ${isAdmin ? 'bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 hover:shadow-rose-500/40' : 'bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 hover:shadow-violet-500/40'} hover:shadow-xl`}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {loading ? (
                                        <><Loader size={16} className="animate-spin" /> Authenticating...</>
                                    ) : (
                                        <>
                                            Sign In
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 space-y-4">
                            {role === "user" && (
                                <div className="text-center">
                                    <p className={`text-xs mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Don't have an account?</p>
                                    <button
                                        onClick={() => navigate("/Signup")}
                                        className={`w-full py-2.5 rounded-xl font-semibold text-sm border-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                                            darkMode
                                                ? 'border-violet-500/40 text-violet-400 hover:bg-violet-500/10'
                                                : 'border-violet-400 text-violet-600 hover:bg-violet-50'
                                        }`}
                                    >
                                        Create New Account
                                    </button>
                                </div>
                            )}

                            <div className={`flex items-center justify-center gap-5 pt-3 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                    <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>System Online</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isAdmin ? 'bg-rose-500' : 'bg-violet-500'}`}></span>
                                    <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>End-to-End Encrypted</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Role Alert Modal */}
            {roleAlert && (
                <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className={`rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border transition-all duration-300 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <div className="text-center">
                            <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${roleAlert.type === "admin-detected" ? 'bg-gradient-to-br from-rose-500 to-red-600' : 'bg-gradient-to-br from-violet-500 to-blue-600'}`}>
                                <AlertCircle size={24} className="text-white" />
                            </div>
                            <h3 className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
                                {roleAlert.type === "admin-detected" ? "Admin Account Detected" : "User Account Detected"}
                            </h3>
                            <p className={`text-sm mb-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{roleAlert.message}</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setRoleAlert(null)}
                                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${darkMode ? "bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={roleAlert.action}
                                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all ${roleAlert.type === "admin-detected" ? "bg-gradient-to-r from-rose-500 to-red-600" : "bg-gradient-to-r from-violet-500 to-blue-600"}`}
                                >
                                    Switch to {roleAlert.type === "admin-detected" ? "Admin" : "User"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.99); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-slideUp {
                    animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default Login;
