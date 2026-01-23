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
import { TrendingUp, Users, AlertCircle, TrendingDown, ArrowRight } from "lucide-react";
import AdminNav from "./adminNav";

const API = import.meta.env.VITE_BACKEND_URL;

export default function Analytics() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("admin-theme") || "light");
  const [avgChurn, setAvgChurn] = useState(0);
  const [plotData, setPlotData] = useState([]);
  const [plotType, setPlotType] = useState("line");
  const [reasons, setReasons] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync theme from localStorage with MutationObserver
  useEffect(() => {
    const updateTheme = () => {
      const storedTheme = localStorage.getItem("admin-theme") || "light";
      setTheme(storedTheme);
    };

    // Check theme on mount
    updateTheme();

    // Listen for storage changes (works across tabs)
    window.addEventListener("storage", updateTheme);

    // Listen for class changes on html element (works within same tab)
    const observer = new MutationObserver(() => {
      updateTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Poll localStorage periodically as fallback
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
        console.error("❌ Analytics API Error:", err.response?.data || err.message);
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

      <div
        className={`
          relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8
        `}
      >
        
        {/* Header Section */}
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
            Analytics Dashboard
          </h1>
          <p
            className={`
              text-sm sm:text-base transition-colors duration-300
              ${isDark ? "text-slate-400" : "text-slate-600"}
            `}
          >
            Monitor churn metrics and user insights in real-time
          </p>
        </div>

        {/* Navigation Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <NavCard
            title="All Users"
            icon={Users}
            onClick={() => navigate("/admin/users")}
            gradient={isDark ? "from-red-600 via-red-700 to-rose-600" : "from-blue-500 via-blue-600 to-cyan-600"}
            iconColor={isDark ? "text-red-200" : "text-blue-200"}
            isDark={isDark}
          />
          <NavCard
            title="High Risk"
            icon={AlertCircle}
            onClick={() => navigate("/admin/users?type=high")}
            gradient={isDark ? "from-rose-600 via-pink-700 to-red-600" : "from-red-500 via-rose-600 to-pink-600"}
            iconColor={isDark ? "text-pink-200" : "text-red-200"}
            isDark={isDark}
          />
          <NavCard
            title="Medium Risk"
            icon={TrendingDown}
            onClick={() => navigate("/admin/users?type=medium")}
            gradient={isDark ? "from-amber-600 via-orange-700 to-rose-600" : "from-amber-500 via-orange-600 to-rose-600"}
            iconColor={isDark ? "text-amber-200" : "text-amber-200"}
            isDark={isDark}
          />
          <StatCard
            title="Avg Churn Score"
            value={(avgChurn).toFixed(1)}
            unit="%"
            gradient={isDark ? "from-purple-600 via-purple-700 to-pink-600" : "from-emerald-500 via-teal-600 to-cyan-600"}
            icon={TrendingUp}
            iconColor={isDark ? "text-purple-200" : "text-emerald-200"}
            isDark={isDark}
          />
        </div>

        {/* Chart Section */}
        <div className="relative group">
          <div
            className={`
              absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100
              transition-opacity duration-500
              ${isDark
                ? "bg-gradient-to-r from-red-600/20 to-rose-600/20"
                : "bg-gradient-to-r from-blue-600/20 to-cyan-600/20"
              }
            `}
          />
          
          <div
            className={`
              relative rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl
              transition-all duration-300 border
              backdrop-blur-xl
              ${isDark
                ? "bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 border-slate-700/50"
                : "bg-gradient-to-br from-white/80 via-slate-50/60 to-white/80 border-slate-200/50"
              }
            `}
          >
            
            {/* Chart Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h2
                  className={`
                    text-xl sm:text-2xl font-bold transition-colors duration-300
                    ${isDark ? "text-white" : "text-slate-900"}
                  `}
                >
                  Issues Over Time
                </h2>
                <p
                  className={`
                    text-xs sm:text-sm mt-1 transition-colors duration-300
                    ${isDark ? "text-slate-400" : "text-slate-600"}
                  `}
                >
                  Track trends and patterns
                </p>
              </div>

              <select
                value={plotType}
                onChange={(e) => setPlotType(e.target.value)}
                className={`
                  px-4 sm:px-5 py-2.5 rounded-lg text-sm font-medium
                  border transition-all duration-300
                  focus:outline-none focus:ring-2
                  cursor-pointer appearance-none
                  ${isDark
                    ? "bg-gradient-to-r from-red-600 to-rose-600 border-red-500 text-white hover:border-red-400 focus:ring-red-500/50 shadow-lg shadow-red-500/40"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-300/70 text-white hover:border-emerald-400 focus:ring-emerald-500/50 shadow-lg shadow-emerald-400/20"
                  }
                `}
              >
                <option value="line" style={{ background: isDark ? "#1f2937" : "#ffffff", color: isDark ? "#ffffff" : "#000000" }}>📈 Line Chart</option>
                <option value="bar" style={{ background: isDark ? "#1f2937" : "#ffffff", color: isDark ? "#ffffff" : "#000000" }}>📊 Bar Chart</option>
                <option value="area" style={{ background: isDark ? "#1f2937" : "#ffffff", color: isDark ? "#ffffff" : "#000000" }}>🎨 Area Chart</option>
                <option value="composed" style={{ background: isDark ? "#1f2937" : "#ffffff", color: isDark ? "#ffffff" : "#000000" }}>🔀 Composed</option>
                <option value="scatter" style={{ background: isDark ? "#1f2937" : "#ffffff", color: isDark ? "#ffffff" : "#000000" }}>🔹 Scatter</option>
                <option value="radial" style={{ background: isDark ? "#1f2937" : "#ffffff", color: isDark ? "#ffffff" : "#000000" }}>🎯 Radial</option>
                <option value="funnel" style={{ background: isDark ? "#1f2937" : "#ffffff", color: isDark ? "#ffffff" : "#000000" }}>📉 Funnel</option>
                <option value="waterfall" style={{ background: isDark ? "#1f2937" : "#ffffff", color: isDark ? "#ffffff" : "#000000" }}>💧 Waterfall</option>
                <option value="heatmap" style={{ background: isDark ? "#1f2937" : "#ffffff", color: isDark ? "#ffffff" : "#000000" }}>🔥 Heatmap</option>
              </select>
            </div>

            {/* Chart Container */}
            <div
              className={`
                w-full h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden
                transition-colors duration-300
                ${isDark
                  ? "bg-gradient-to-b from-slate-700/30 to-slate-900/30"
                  : "bg-gradient-to-b from-slate-100/50 to-slate-50/30"
                }
              `}
            >
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div
                      className={`
                        w-12 h-12 rounded-full border-3 animate-spin mx-auto mb-3
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
                      Loading analytics...
                    </p>
                  </div>
                </div>
              ) : plotData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className={isDark ? "text-slate-400" : "text-slate-600"}>No data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {plotType === "line" && (
                    <LineChart data={plotData}>
                      <defs>
                        <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={isDark ? "#ef4444" : "#3b82f6"} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={isDark ? "#be123c" : "#06b6d4"} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(71,85,105,0.3)" : "rgba(203,213,225,0.5)"} />
                      <XAxis dataKey="date" stroke={isDark ? "rgb(148,163,184)" : "rgb(100,116,139)"} style={{ fontSize: "12px" }} />
                      <YAxis stroke={isDark ? "rgb(148,163,184)" : "rgb(100,116,139)"} style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.95)",
                          border: isDark ? "1px solid rgba(71,85,105,0.5)" : "1px solid rgba(203,213,225,0.5)",
                          borderRadius: "8px",
                          color: isDark ? "white" : "black",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke={isDark ? "#ef4444" : "#3b82f6"}
                        strokeWidth={3}
                        dot={{ fill: isDark ? "#ef4444" : "#3b82f6", r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  )}

                  {plotType === "bar" && (
                    <BarChart data={plotData}>
                      <defs>
                        <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={isDark ? "#ef4444" : "#3b82f6"} stopOpacity={1} />
                          <stop offset="100%" stopColor={isDark ? "#be123c" : "#06b6d4"} stopOpacity={0.7} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(71,85,105,0.3)" : "rgba(203,213,225,0.5)"} />
                      <XAxis dataKey="date" stroke={isDark ? "rgb(148,163,184)" : "rgb(100,116,139)"} style={{ fontSize: "12px" }} />
                      <YAxis stroke={isDark ? "rgb(148,163,184)" : "rgb(100,116,139)"} style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.95)",
                          border: isDark ? "1px solid rgba(71,85,105,0.5)" : "1px solid rgba(203,213,225,0.5)",
                          borderRadius: "8px",
                          color: isDark ? "white" : "black",
                        }}
                      />
                      <Bar dataKey="count" fill="url(#colorBar)" radius={[8, 8, 0, 0]} />
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
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(71,85,105,0.3)" : "rgba(203,213,225,0.5)"} />
                      <XAxis dataKey="date" stroke={isDark ? "rgb(148,163,184)" : "rgb(100,116,139)"} style={{ fontSize: "12px" }} />
                      <YAxis stroke={isDark ? "rgb(148,163,184)" : "rgb(100,116,139)"} style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.95)",
                          border: isDark ? "1px solid rgba(71,85,105,0.5)" : "1px solid rgba(203,213,225,0.5)",
                          borderRadius: "8px",
                          color: isDark ? "white" : "black",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke={isDark ? "#a855f7" : "#10b981"}
                        fill="url(#colorArea)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  )}

                  {plotType === "composed" && (
                    <ComposedChart data={plotData}>
                      <defs>
                        <linearGradient id="colorComposed" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={isDark ? "#a855f7" : "#8b5cf6"} stopOpacity={0.8} />
                          <stop offset="100%" stopColor={isDark ? "#be123c" : "#ec4899"} stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(71,85,105,0.3)" : "rgba(203,213,225,0.5)"} />
                      <XAxis dataKey="date" stroke={isDark ? "rgb(148,163,184)" : "rgb(100,116,139)"} style={{ fontSize: "12px" }} />
                      <YAxis stroke={isDark ? "rgb(148,163,184)" : "rgb(100,116,139)"} style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.95)",
                          border: isDark ? "1px solid rgba(71,85,105,0.5)" : "1px solid rgba(203,213,225,0.5)",
                          borderRadius: "8px",
                          color: isDark ? "white" : "black",
                        }}
                      />
                      <Bar dataKey="count" fill="url(#colorComposed)" radius={[8, 8, 0, 0]} />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke={isDark ? "#f59e0b" : "#f59e0b"}
                        strokeWidth={2}
                        dot={false}
                      />
                    </ComposedChart>
                  )}

                  {plotType === "scatter" && (
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(71,85,105,0.3)" : "rgba(203,213,225,0.5)"} />
                      <XAxis
                        type="number"
                        dataKey="date"
                        stroke={isDark ? "rgb(148,163,184)" : "rgb(100,116,139)"}
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis
                        type="number"
                        dataKey="count"
                        stroke={isDark ? "rgb(148,163,184)" : "rgb(100,116,139)"}
                        style={{ fontSize: "12px" }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.95)",
                          border: isDark ? "1px solid rgba(71,85,105,0.5)" : "1px solid rgba(203,213,225,0.5)",
                          borderRadius: "8px",
                          color: isDark ? "white" : "black",
                        }}
                      />
                      <Scatter data={plotData} fill={isDark ? "#06b6d4" : "#06b6d4"} />
                    </ScatterChart>
                  )}

                  {plotType === "radial" && (
                    <BarChart data={plotData} layout="vertical">
                      <defs>
                        <linearGradient id="colorRadial" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={isDark ? "#f97316" : "#f59e0b"} stopOpacity={1} />
                          <stop offset="100%" stopColor={isDark ? "#fb923c" : "#fbbf24"} stopOpacity={0.7} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(71,85,105,0.3)" : "rgba(203,213,225,0.5)"} />
                      <XAxis type="number" stroke={isDark ? "rgb(148,163,184)" : "rgb(100,116,139)"} style={{ fontSize: "12px" }} />
                      <YAxis dataKey="date" type="category" stroke={isDark ? "rgb(148,163,184)" : "rgb(100,116,139)"} style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.95)",
                          border: isDark ? "1px solid rgba(71,85,105,0.5)" : "1px solid rgba(203,213,225,0.5)",
                          borderRadius: "8px",
                          color: isDark ? "white" : "black",
                        }}
                      />
                      <Bar dataKey="count" fill="url(#colorRadial)" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  )}

                  {plotType === "funnel" && (
                    <BarChart data={plotData.map((d, i) => ({ ...d, count: d.count * (1 - i * 0.1) }))}>
                      <defs>
                        <linearGradient id="colorFunnel" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={isDark ? "#8b5cf6" : "#a78bfa"} stopOpacity={1} />
                          <stop offset="100%" stopColor={isDark ? "#6d28d9" : "#7c3aed"} stopOpacity={0.7} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(71,85,105,0.3)" : "rgba(203,213,225,0.5)"} />
                      <XAxis dataKey="date" stroke={isDark ? "rgb(148,163,184)" : "rgb(100,116,139)"} style={{ fontSize: "12px" }} />
                      <YAxis stroke={isDark ? "rgb(148,163,184)" : "rgb(100,116,139)"} style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.95)",
                          border: isDark ? "1px solid rgba(71,85,105,0.5)" : "1px solid rgba(203,213,225,0.5)",
                          borderRadius: "8px",
                          color: isDark ? "white" : "black",
                        }}
                      />
                      <Bar dataKey="count" fill="url(#colorFunnel)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  )}

                  {plotType === "waterfall" && (
                    <ComposedChart data={plotData}>
                      <defs>
                        <linearGradient id="colorWaterfall" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={isDark ? "#06b6d4" : "#0ea5e9"} stopOpacity={0.8} />
                          <stop offset="100%" stopColor={isDark ? "#0891b2" : "#0284c7"} stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(71,85,105,0.3)" : "rgba(203,213,225,0.5)"} />
                      <XAxis dataKey="date" stroke={isDark ? "rgb(148,163,184)" : "rgb(100,116,139)"} style={{ fontSize: "12px" }} />
                      <YAxis stroke={isDark ? "rgb(148,163,184)" : "rgb(100,116,139)"} style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.95)",
                          border: isDark ? "1px solid rgba(71,85,105,0.5)" : "1px solid rgba(203,213,225,0.5)",
                          borderRadius: "8px",
                          color: isDark ? "white" : "black",
                        }}
                      />
                      <Bar dataKey="count" fill="url(#colorWaterfall)" radius={[8, 8, 0, 0]} />
                      <Line type="monotone" dataKey="count" stroke={isDark ? "#22d3ee" : "#06b6d4"} strokeWidth={2} dot={false} />
                    </ComposedChart>
                  )}

                  {plotType === "heatmap" && (
                    <BarChart data={plotData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <defs>
                        <linearGradient id="colorHeatmap" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={isDark ? "#dc2626" : "#ef4444"} stopOpacity={1} />
                          <stop offset="50%" stopColor={isDark ? "#f59e0b" : "#f97316"} stopOpacity={0.8} />
                          <stop offset="100%" stopColor={isDark ? "#10b981" : "#84cc16"} stopOpacity={0.6} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(71,85,105,0.3)" : "rgba(203,213,225,0.5)"} />
                      <XAxis dataKey="date" angle={-45} textAnchor="end" height={100} stroke={isDark ? "rgb(148,163,184)" : "rgb(100,116,139)"} style={{ fontSize: "12px" }} />
                      <YAxis stroke={isDark ? "rgb(148,163,184)" : "rgb(100,116,139)"} style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.95)",
                          border: isDark ? "1px solid rgba(71,85,105,0.5)" : "1px solid rgba(203,213,225,0.5)",
                          borderRadius: "8px",
                          color: isDark ? "white" : "black",
                        }}
                      />
                      <Bar dataKey="count" fill="url(#colorHeatmap)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Lists Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <ListCard
            title="Churn Reasons"
            items={reasons}
            gradient={isDark ? "from-violet-600 to-purple-600" : "from-violet-500 to-purple-600"}
            icon="🎯"
            isDark={isDark}
          />
          <ListCard
            title="Recommendations"
            items={recommendations}
            gradient={isDark ? "from-emerald-600 to-teal-600" : "from-emerald-500 to-teal-600"}
            icon="💡"
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

function NavCard({ title, icon: Icon, onClick, gradient, iconColor, isDark }) {
  return (
    <div
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-xl cursor-pointer
        transition-all duration-500 transform hover:scale-105
        p-5 sm:p-6 min-h-32 sm:min-h-40 shadow-lg hover:shadow-xl
      `}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-white">{title}</h3>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor} transform group-hover:scale-125 transition-transform duration-300`} />
        </div>
        <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
          <span className="text-xs sm:text-sm font-medium">View</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, unit, gradient, icon: Icon, iconColor, isDark }) {
  return (
    <div className="group relative overflow-hidden rounded-xl p-5 sm:p-6 min-h-32 sm:min-h-40 shadow-lg hover:shadow-xl">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between">
          <p className="text-white/80 text-xs sm:text-sm font-medium">{title}</p>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
        </div>
        <div className="flex items-baseline gap-1">
          <p className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white">{value}</p>
          <p className="text-white/70 text-sm sm:text-base">{unit}</p>
        </div>
      </div>
    </div>
  );
}

function ListCard({ title, items, gradient, icon, isDark }) {
  return (
    <div className="group relative">
      <div
        className={`
          absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100
          transition-opacity duration-500
          ${isDark
            ? "bg-gradient-to-r from-slate-700/40 to-slate-800/40"
            : "bg-gradient-to-r from-slate-300/40 to-slate-200/40"
          }
        `}
      />
      
      <div
        className={`
          relative rounded-2xl p-4 sm:p-6 shadow-lg
          transition-all duration-300 border backdrop-blur-xl
          ${isDark
            ? "bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 border-slate-700/50"
            : "bg-gradient-to-br from-white/80 via-slate-50/60 to-white/80 border-slate-200/50"
          }
        `}
      >
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="text-2xl sm:text-3xl">{icon}</div>
          <h3
            className={`
              text-lg sm:text-xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent
            `}
          >
            {title}
          </h3>
        </div>

        {/* Items List */}
        {items.length === 0 ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <p
              className={`
                text-sm text-center transition-colors duration-300
                ${isDark ? "text-slate-400" : "text-slate-500"}
              `}
            >
              No data available
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, i) => (
              <div
                key={i}
                className={`
                  group/item p-3 sm:p-4 rounded-lg
                  border transition-all duration-300 transform hover:scale-102
                  ${isDark
                    ? "bg-gradient-to-r from-slate-700/50 to-slate-600/30 border-slate-600/30 hover:border-slate-500/50 hover:bg-gradient-to-r hover:from-slate-600/70 hover:to-slate-500/50"
                    : "bg-gradient-to-r from-slate-100/50 to-slate-50/30 border-slate-300/30 hover:border-slate-400/50 hover:bg-gradient-to-r hover:from-slate-200/70 hover:to-slate-100/50"
                  }
                `}
              >
                <p
                  className={`
                    group-hover/item:text-transparent text-xs sm:text-sm font-medium transition-colors
                    ${isDark ? "text-white/80 group-hover/item:text-white" : "text-slate-700 group-hover/item:text-slate-900"}
                  `}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}