import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, AlertCircle, TrendingDown, ArrowRight, Zap } from "lucide-react";
import AdminNav from "./adminNav";

const API = import.meta.env.VITE_BACKEND_URL;

export default function AdminAnalytics() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("admin-theme") || "light");
  const [avgChurn, setAvgChurn] = useState(0);
  const [plotData, setPlotData] = useState([]);
  const [plotType, setPlotType] = useState("line");
  const [reasons, setReasons] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Sync theme
  useEffect(() => {
    const updateTheme = () => {
      const storedTheme = localStorage.getItem("admin-theme") || "light";
      setTheme(storedTheme);
    };

    updateTheme();
    window.addEventListener("storage", updateTheme);

    const observer = new MutationObserver(() => updateTheme());
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

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const churnRes = await axios.get(`${API}/admin/metrics/avg-churn-score`);
        setAvgChurn(churnRes.data.averageChurnScore || 0);

        const issuesRes = await axios.get(`${API}/admin/metrics/issues-over-time`);
        setPlotData(issuesRes.data.data || []);

        const rrRes = await axios.get(`${API}/admin/metrics/reasons-recommendations`);
        setReasons(Object.keys(rrRes.data.reasons || {}));
        setRecommendations(Object.keys(rrRes.data.recommendations || {}));
      } catch (err) {
        console.error("Analytics error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const isDark = theme === "dark";

  return (
    <div
      className={`
        min-h-screen transition-colors duration-700
        ${isDark
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950"
          : "bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-100"
        }
      `}
    >
      <style>{`
        @keyframes centrifugal-orbit {
          0% { transform: rotate(0deg) translateX(0); }
          100% { transform: rotate(360deg) translateX(0); }
        }
        @keyframes float-up {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slide-in-left {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-slide-left {
          animation: slide-in-left 0.7s ease-out forwards;
        }
        .animate-slide-right {
          animation: slide-in-right 0.7s ease-out forwards;
        }
        .card-1 { animation-delay: 0.1s; }
        .card-2 { animation-delay: 0.2s; }
        .card-3 { animation-delay: 0.3s; }
        .card-4 { animation-delay: 0.4s; }
      `}</style>

      {/* Centrifugal Background - Premium Animated */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {isDark ? (
          <>
            {/* Core glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/40 via-purple-600/20 to-red-600/10 rounded-full blur-3xl animate-pulse" />
            
            {/* Rotating outer rings */}
            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30 animate-[spin_40s_linear_infinite]" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke={`url(#gradient1)`} strokeWidth="0.5" />
              <circle cx="50" cy="50" r="35" fill="none" stroke={`url(#gradient2)`} strokeWidth="0.5" />
              <circle cx="50" cy="50" r="25" fill="none" stroke={`url(#gradient3)`} strokeWidth="0.5" />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
            </svg>

            {/* Satellite orbs */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0s" }} />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-bl from-purple-600/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-to-tl from-red-600/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
            <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-gradient-to-tr from-cyan-600/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
          </>
        ) : (
          <>
            {/* Core glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/40 via-cyan-400/30 to-blue-400/15 rounded-full blur-3xl animate-pulse" />
            
            {/* Rotating outer rings */}
            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 animate-[spin_40s_linear_infinite]" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke={`url(#gradient1)`} strokeWidth="0.5" />
              <circle cx="50" cy="50" r="35" fill="none" stroke={`url(#gradient2)`} strokeWidth="0.5" />
              <circle cx="50" cy="50" r="25" fill="none" stroke={`url(#gradient3)`} strokeWidth="0.5" />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
            </svg>

            {/* Satellite orbs */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-emerald-300/25 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0s" }} />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-bl from-cyan-300/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-to-tl from-blue-300/25 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
            <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-gradient-to-tr from-teal-300/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
          </>
        )}
      </div>

      <AdminNav />

      <div className="relative z-10">
        {/* Premium Header with animations */}
        <div className="text-center py-12 sm:py-16 lg:py-20">
          <div className="inline-block mb-6">
            <Zap className={`w-12 h-12 animate-bounce ${isDark ? "text-blue-400" : "text-emerald-600"}`} />
          </div>
          <h1
            className={`
              text-4xl sm:text-5xl lg:text-7xl font-black mb-4
              transition-colors duration-300
              ${isDark
                ? "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-emerald-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent"
              }
            `}
          >
            Analytics Hub
          </h1>
          <p
            className={`
              text-lg sm:text-xl transition-colors duration-300
              ${isDark ? "text-blue-300/70" : "text-emerald-700/70"}
            `}
          >
            Real-time intelligence with centrifugal precision
          </p>
        </div>

        {/* Main Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Centrifugal Cards Grid - Premium Positioning */}
          <div className="relative mb-16">
            {/* Invisible center point for visual reference */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-current opacity-0 z-0" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {/* Card 1 - Upper Left - Pulls inward on hover */}
              <div className="animate-bounce-in card-1 group lg:col-span-1 lg:row-span-1 perspective">
                <div className="relative transition-all duration-500 group-hover:scale-110 group-hover:lg:translate-x-6 group-hover:lg:-translate-y-6 origin-bottom-right">
                  <NavCard
                    title="All Users"
                    count="1,234"
                    icon={Users}
                    onClick={() => navigate("/admin/users")}
                    gradient={isDark ? "from-blue-600 via-blue-700 to-cyan-600" : "from-blue-500 via-cyan-500 to-emerald-500"}
                    isDark={isDark}
                    index={1}
                  />
                </div>
              </div>

              {/* Card 2 - Upper Right */}
              <div className="animate-bounce-in card-2 group lg:col-span-1 lg:row-span-1 perspective">
                <div className="relative transition-all duration-500 group-hover:scale-110 group-hover:lg:-translate-x-6 group-hover:lg:-translate-y-6 origin-bottom-left">
                  <NavCard
                    title="High Risk"
                    count="89"
                    icon={AlertCircle}
                    onClick={() => navigate("/admin/users?type=high")}
                    gradient={isDark ? "from-red-600 via-pink-700 to-rose-600" : "from-red-500 via-rose-500 to-pink-500"}
                    isDark={isDark}
                    index={2}
                  />
                </div>
              </div>

              {/* Card 3 - Lower Left */}
              <div className="animate-bounce-in card-3 group lg:col-span-1 lg:row-span-1 perspective">
                <div className="relative transition-all duration-500 group-hover:scale-110 group-hover:lg:translate-x-6 group-hover:lg:translate-y-6 origin-top-right">
                  <NavCard
                    title="Medium Risk"
                    count="234"
                    icon={TrendingDown}
                    onClick={() => navigate("/admin/users?type=medium")}
                    gradient={isDark ? "from-amber-600 via-orange-700 to-red-600" : "from-amber-500 via-orange-500 to-red-500"}
                    isDark={isDark}
                    index={3}
                  />
                </div>
              </div>

              {/* Card 4 - Lower Right (Center Focus) */}
              <div className="animate-bounce-in card-4 group lg:col-span-1 lg:row-span-1 perspective">
                <div className="relative transition-all duration-500 group-hover:scale-110 group-hover:lg:-translate-x-6 group-hover:lg:translate-y-6 origin-top-left">
                  <StatCard
                    title="Avg Churn"
                    value={(avgChurn * 100).toFixed(1)}
                    unit="%"
                    gradient={isDark ? "from-purple-600 via-purple-700 to-pink-600" : "from-emerald-500 via-teal-600 to-cyan-600"}
                    icon={TrendingUp}
                    isDark={isDark}
                    index={4}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Premium Chart Section - Central Hub */}
          <div className="relative mb-16 animate-slide-left" style={{ animationDelay: "0.5s" }}>
            {/* Glow effect behind chart */}
            <div className={`absolute inset-0 rounded-3xl blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 ${isDark ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" : "bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600"}`} />

            <div
              className={`
                relative rounded-3xl backdrop-blur-xl border-2 shadow-2xl
                transition-all duration-500 group p-6 sm:p-8 lg:p-12
                hover:shadow-2xl
                ${isDark
                  ? "bg-gradient-to-br from-slate-800/90 via-blue-900/60 to-slate-900/90 border-blue-500/30 hover:border-blue-400/50"
                  : "bg-gradient-to-br from-white/90 via-cyan-50/60 to-white/90 border-emerald-300/30 hover:border-emerald-400/50"
                }
              `}
            >
              {/* Decorative top bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-3xl ${isDark ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" : "bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500"}`} />

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-10 rounded-full ${isDark ? "bg-gradient-to-b from-blue-500 to-purple-600" : "bg-gradient-to-b from-emerald-500 to-teal-600"}`} />
                    <div>
                      <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                        Issues Timeline
                      </h2>
                      <p className={`text-sm mt-1 ${isDark ? "text-blue-300/60" : "text-emerald-700/60"}`}>
                        Centrifugal data visualization
                      </p>
                    </div>
                  </div>
                </div>

                <select
                  value={plotType}
                  onChange={(e) => setPlotType(e.target.value)}
                  className={`
                    px-5 sm:px-6 py-3 rounded-xl text-sm font-bold
                    border-2 transition-all duration-300
                    focus:outline-none focus:ring-2 cursor-pointer appearance-none
                    ${isDark
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 border-blue-500 text-white hover:border-blue-400 focus:ring-blue-500/50 shadow-lg shadow-blue-500/50"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-400 text-white hover:border-emerald-300 focus:ring-emerald-500/50 shadow-lg shadow-emerald-500/30"
                    }
                  `}
                >
                  <option value="line" style={{ background: isDark ? "#1f2937" : "#ffffff", color: isDark ? "#ffffff" : "#000000" }}>📈 Line</option>
                  <option value="bar" style={{ background: isDark ? "#1f2937" : "#ffffff", color: isDark ? "#ffffff" : "#000000" }}>📊 Bar</option>
                  <option value="area" style={{ background: isDark ? "#1f2937" : "#ffffff", color: isDark ? "#ffffff" : "#000000" }}>🎨 Area</option>
                  <option value="composed" style={{ background: isDark ? "#1f2937" : "#ffffff", color: isDark ? "#ffffff" : "#000000" }}>🔀 Composed</option>
                  <option value="scatter" style={{ background: isDark ? "#1f2937" : "#ffffff", color: isDark ? "#ffffff" : "#000000" }}>🔹 Scatter</option>
                </select>
              </div>

              {/* Chart Container */}
              <div
                className={`
                  w-full h-80 sm:h-96 lg:h-[550px] rounded-2xl overflow-hidden border
                  transition-all duration-300
                  ${isDark
                    ? "bg-gradient-to-b from-slate-700/50 to-slate-900/50 border-slate-700/50"
                    : "bg-gradient-to-b from-slate-100/50 to-slate-50/30 border-slate-300/50"
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className={`w-14 h-14 rounded-full border-4 animate-spin mx-auto mb-4 ${isDark ? "border-blue-400/30 border-t-blue-400" : "border-emerald-400/30 border-t-emerald-400"}`} />
                      <p className={`text-sm font-medium ${isDark ? "text-blue-300" : "text-emerald-700"}`}>Loading premium analytics...</p>
                    </div>
                  </div>
                ) : plotData.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className={isDark ? "text-blue-300/60" : "text-emerald-700/60"}>No data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    {plotType === "line" && (
                      <LineChart data={plotData}>
                        <defs>
                          <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={isDark ? "#3b82f6" : "#10b981"} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={isDark ? "#1e40af" : "#059669"} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(59,130,246,0.2)" : "rgba(16,185,129,0.2)"} />
                        <XAxis dataKey="date" stroke={isDark ? "rgb(147,197,253)" : "rgb(52,211,153)"} style={{ fontSize: "12px" }} />
                        <YAxis stroke={isDark ? "rgb(147,197,253)" : "rgb(52,211,153)"} style={{ fontSize: "12px" }} />
                        <Tooltip contentStyle={{ background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.95)", border: isDark ? "2px solid rgba(59,130,246,0.5)" : "2px solid rgba(16,185,129,0.5)", borderRadius: "12px", color: isDark ? "white" : "black" }} />
                        <Line type="monotone" dataKey="count" stroke={isDark ? "#3b82f6" : "#10b981"} strokeWidth={4} dot={{ fill: isDark ? "#3b82f6" : "#10b981", r: 5 }} activeDot={{ r: 8 }} />
                      </LineChart>
                    )}
                    {plotType === "bar" && (
                      <BarChart data={plotData}>
                        <defs>
                          <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={isDark ? "#3b82f6" : "#10b981"} stopOpacity={1} />
                            <stop offset="100%" stopColor={isDark ? "#1e40af" : "#059669"} stopOpacity={0.7} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(59,130,246,0.2)" : "rgba(16,185,129,0.2)"} />
                        <XAxis dataKey="date" stroke={isDark ? "rgb(147,197,253)" : "rgb(52,211,153)"} style={{ fontSize: "12px" }} />
                        <YAxis stroke={isDark ? "rgb(147,197,253)" : "rgb(52,211,153)"} style={{ fontSize: "12px" }} />
                        <Tooltip contentStyle={{ background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.95)", border: isDark ? "2px solid rgba(59,130,246,0.5)" : "2px solid rgba(16,185,129,0.5)", borderRadius: "12px", color: isDark ? "white" : "black" }} />
                        <Bar dataKey="count" fill="url(#colorBar)" radius={[12, 12, 0, 0]} />
                      </BarChart>
                    )}
                    {plotType === "area" && (
                      <AreaChart data={plotData}>
                        <defs>
                          <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={isDark ? "#a855f7" : "#10b981"} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={isDark ? "#7c2d12" : "#14b8a6"} stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(168,85,247,0.2)" : "rgba(16,185,129,0.2)"} />
                        <XAxis dataKey="date" stroke={isDark ? "rgb(196,181,253)" : "rgb(52,211,153)"} style={{ fontSize: "12px" }} />
                        <YAxis stroke={isDark ? "rgb(196,181,253)" : "rgb(52,211,153)"} style={{ fontSize: "12px" }} />
                        <Tooltip contentStyle={{ background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.95)", border: isDark ? "2px solid rgba(168,85,247,0.5)" : "2px solid rgba(16,185,129,0.5)", borderRadius: "12px", color: isDark ? "white" : "black" }} />
                        <Area type="monotone" dataKey="count" stroke={isDark ? "#a855f7" : "#10b981"} fill="url(#colorArea)" strokeWidth={3} />
                      </AreaChart>
                    )}
                    {plotType === "composed" && (
                      <ComposedChart data={plotData}>
                        <defs>
                          <linearGradient id="colorComposed" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={isDark ? "#3b82f6" : "#8b5cf6"} stopOpacity={0.8} />
                            <stop offset="100%" stopColor={isDark ? "#1e40af" : "#7c3aed"} stopOpacity={0.4} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(59,130,246,0.2)" : "rgba(139,92,246,0.2)"} />
                        <XAxis dataKey="date" stroke={isDark ? "rgb(147,197,253)" : "rgb(196,181,253)"} style={{ fontSize: "12px" }} />
                        <YAxis stroke={isDark ? "rgb(147,197,253)" : "rgb(196,181,253)"} style={{ fontSize: "12px" }} />
                        <Tooltip contentStyle={{ background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.95)", border: isDark ? "2px solid rgba(59,130,246,0.5)" : "2px solid rgba(139,92,246,0.5)", borderRadius: "12px", color: isDark ? "white" : "black" }} />
                        <Bar dataKey="count" fill="url(#colorComposed)" radius={[12, 12, 0, 0]} />
                        <Line type="monotone" dataKey="count" stroke={isDark ? "#f59e0b" : "#f59e0b"} strokeWidth={3} dot={false} />
                      </ComposedChart>
                    )}
                    {plotType === "scatter" && (
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(59,130,246,0.2)" : "rgba(16,185,129,0.2)"} />
                        <XAxis type="number" dataKey="date" stroke={isDark ? "rgb(147,197,253)" : "rgb(52,211,153)"} style={{ fontSize: "12px" }} />
                        <YAxis type="number" dataKey="count" stroke={isDark ? "rgb(147,197,253)" : "rgb(52,211,153)"} style={{ fontSize: "12px" }} />
                        <Tooltip contentStyle={{ background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.95)", border: isDark ? "2px solid rgba(59,130,246,0.5)" : "2px solid rgba(16,185,129,0.5)", borderRadius: "12px", color: isDark ? "white" : "black" }} />
                        <Scatter data={plotData} fill={isDark ? "#06b6d4" : "#10b981"} />
                      </ScatterChart>
                    )}
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Lists Section - Centrifugal Spread */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="animate-slide-left" style={{ animationDelay: "0.7s" }}>
              <ListCard
                title="Churn Reasons"
                items={reasons}
                gradient={isDark ? "from-purple-500 to-pink-500" : "from-violet-500 to-purple-600"}
                icon="🎯"
                isDark={isDark}
              />
            </div>
            <div className="animate-slide-right" style={{ animationDelay: "0.7s" }}>
              <ListCard
                title="Recommendations"
                items={recommendations}
                gradient={isDark ? "from-cyan-500 to-blue-500" : "from-emerald-500 to-teal-600"}
                icon="💡"
                isDark={isDark}
              />
            </div>
          </div>
        </div>

        {/* Footer spacer */}
        <div className="h-12" />
      </div>
    </div>
  );
}

/* ---------- PREMIUM COMPONENTS ---------- */

function NavCard({ title, count, icon: Icon, onClick, gradient, isDark, index }) {
  return (
    <div
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-2xl cursor-pointer
        transition-all duration-500 p-6 sm:p-7 lg:p-8
        min-h-48 sm:min-h-56 lg:min-h-60 shadow-xl hover:shadow-2xl
        border-2
        ${isDark
          ? "border-slate-700/50 hover:border-blue-500/50"
          : "border-slate-200/50 hover:border-emerald-500/50"
        }
      `}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-85 group-hover:opacity-95 transition-all duration-500`} />
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-r from-transparent via-white/20 to-transparent" : "bg-gradient-to-r from-transparent via-white/40 to-transparent"} animate-[shimmer_3s_infinite]`} />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">{title}</h3>
            <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white/80 group-hover:text-white group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-white/90">{count}</p>
        </div>

        <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
          <span className="text-sm font-bold">Explore</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, unit, gradient, icon: Icon, isDark, index }) {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        transition-all duration-500 p-6 sm:p-7 lg:p-8
        min-h-48 sm:min-h-56 lg:min-h-60 shadow-xl hover:shadow-2xl
        border-2
        ${isDark
          ? "border-slate-700/50 hover:border-purple-500/50"
          : "border-slate-200/50 hover:border-cyan-500/50"
        }
      `}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-85 group-hover:opacity-95 transition-all duration-500`} />
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-r from-transparent via-white/20 to-transparent" : "bg-gradient-to-r from-transparent via-white/40 to-transparent"} animate-[shimmer_3s_infinite]`} />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between">
          <p className="text-white/80 text-sm sm:text-base font-bold">{title}</p>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white/80 group-hover:text-white group-hover:scale-125 transition-all duration-300" />
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <p className="text-5xl sm:text-6xl font-black text-white">{value}</p>
            <p className="text-xl sm:text-2xl font-bold text-white/70">{unit}</p>
          </div>
          <p className="text-xs sm:text-sm text-white/60">Premium metric</p>
        </div>
      </div>
    </div>
  );
}

function ListCard({ title, items, gradient, icon, isDark }) {
  return (
    <div className="group relative">
      {/* Glow effect */}
      <div
        className={`
          absolute inset-0 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100
          transition-opacity duration-700
          ${isDark
            ? "bg-gradient-to-r from-blue-600/40 to-purple-600/40"
            : "bg-gradient-to-r from-emerald-400/40 to-cyan-400/40"
          }
        `}
      />
      
      <div
        className={`
          relative rounded-2xl p-6 sm:p-7 lg:p-8 shadow-xl hover:shadow-2xl
          transition-all duration-500 border-2 backdrop-blur-xl
          ${isDark
            ? "bg-gradient-to-br from-slate-800/90 via-blue-900/60 to-slate-900/90 border-blue-500/30 hover:border-blue-400/50"
            : "bg-gradient-to-br from-white/90 via-cyan-50/60 to-white/90 border-emerald-300/30 hover:border-emerald-400/50"
          }
        `}
      >
        {/* Decorative top bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${isDark ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" : "bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500"}`} />

        {/* Header with decorative line */}
        <div className="flex items-center gap-4 mb-6 pt-2">
          <div className={`w-1.5 h-12 rounded-full ${isDark ? "bg-gradient-to-b from-purple-500 to-pink-600" : "bg-gradient-to-b from-emerald-500 to-teal-600"}`} />
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{icon}</span>
              <h3 className={`text-xl sm:text-2xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                {title}
              </h3>
            </div>
            <p className={`text-xs mt-2 font-medium ${isDark ? "text-blue-300/60" : "text-emerald-700/60"}`}>
              {items.length} {items.length === 1 ? "item" : "items"} tracked
            </p>
          </div>
        </div>

        {/* Items List with premium styling */}
        {items.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className={`text-sm font-medium text-center transition-colors ${isDark ? "text-blue-300/50" : "text-emerald-700/50"}`}>
              No data currently available
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {items.map((item, i) => (
              <div
                key={i}
                className={`
                  group/item p-4 rounded-xl border-2
                  transition-all duration-300 transform hover:scale-105 hover:translate-x-2
                  flex items-center justify-between cursor-default
                  ${isDark
                    ? "bg-gradient-to-r from-blue-700/40 to-purple-700/30 border-blue-600/40 hover:border-blue-500/60 hover:bg-gradient-to-r hover:from-blue-600/60 hover:to-purple-600/40"
                    : "bg-gradient-to-r from-emerald-100/40 to-cyan-100/30 border-emerald-400/40 hover:border-emerald-500/60 hover:bg-gradient-to-r hover:from-emerald-200/60 hover:to-cyan-200/40"
                  }
                `}
              >
                <p className={`text-sm sm:text-base font-bold transition-colors ${isDark ? "text-blue-100 group-hover/item:text-white" : "text-emerald-800 group-hover/item:text-emerald-900"}`}>
                  {item}
                </p>
                <div className={`w-3 h-3 rounded-full group-hover/item:scale-150 transition-transform ${isDark ? "bg-gradient-to-br from-blue-400 to-purple-500" : "bg-gradient-to-br from-emerald-500 to-teal-500"}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
