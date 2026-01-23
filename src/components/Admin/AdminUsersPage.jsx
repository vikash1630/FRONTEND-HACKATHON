import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Users, AlertTriangle, TrendingDown, Loader, Filter, ChevronDown } from "lucide-react";
import AdminNav from "./adminNav";

const API = import.meta.env.VITE_BACKEND_URL;

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [users, setUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("admin-theme") || "light");
  const [sortBy, setSortBy] = useState("name");
  const [filterOpen, setFilterOpen] = useState(false);

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

  // Get endpoint
  const getEndpoint = () => {
    if (type === "high") return "/admin/users/high-risk";
    if (type === "medium") return "/admin/users/medium-risk";
    return "/admin/users";
  };

  // Fetch users
  const fetchUsers = async (searchValue = "") => {
    setLoading(true);
    try {
      const endpoint = getEndpoint();
      const res = await axios.get(`${API}${endpoint}`, {
        params: searchValue ? { search: searchValue } : {},
      });
      // Divide churn scores by 100 to convert from percentage to decimal
      const processedUsers = (res.data.users || []).map(user => ({
        ...user,
        churnScore: (user.churnScore || 0) / 100
      }));
      setUsers(processedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch suggestions
  const fetchSuggestions = async (value) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const endpoint = getEndpoint();
      const res = await axios.get(`${API}${endpoint}`, {
        params: { search: value },
      });
      setSuggestions((res.data.users || []).slice(0, 5));
    } catch (err) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [type]);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearch(value);
    await fetchSuggestions(value);
    await fetchUsers(value);
  };

  const handleSuggestionClick = (value) => {
    setSearch(value);
    setSuggestions([]);
    fetchUsers(value);
  };

  const isDark = theme === "dark";

  const getPageTitle = () => {
    if (type === "high") return { title: "High Risk Users", icon: AlertTriangle, color: "from-red-600 to-rose-600" };
    if (type === "medium") return { title: "Medium Risk Users", icon: TrendingDown, color: "from-amber-600 to-orange-600" };
    return { title: "All Users", icon: Users, color: "from-blue-600 to-cyan-600" };
  };

  const pageInfo = getPageTitle();
  const PageIcon = pageInfo.icon;

  const getRiskColor = (level) => {
    const riskType = (level || "").toLowerCase();
    switch (riskType) {
      case "high":
        return isDark 
          ? "bg-gradient-to-r from-red-900/80 to-rose-900/80 border-red-600/80 text-red-100 shadow-lg shadow-red-600/30 hover:shadow-red-600/50" 
          : "bg-gradient-to-r from-red-200/80 to-rose-200/80 border-red-400/80 text-red-800 shadow-lg shadow-red-400/30 hover:shadow-red-400/50";
      case "medium":
        return isDark 
          ? "bg-gradient-to-r from-amber-900/80 to-orange-900/80 border-amber-600/80 text-amber-100 shadow-lg shadow-amber-600/30 hover:shadow-amber-600/50" 
          : "bg-gradient-to-r from-amber-200/80 to-orange-200/80 border-amber-400/80 text-amber-800 shadow-lg shadow-amber-400/30 hover:shadow-amber-400/50";
      case "low":
      default:
        return isDark 
          ? "bg-gradient-to-r from-green-900/80 to-emerald-900/80 border-green-600/80 text-green-100 shadow-lg shadow-green-600/30 hover:shadow-green-600/50" 
          : "bg-gradient-to-r from-green-200/80 to-emerald-200/80 border-green-400/80 text-green-800 shadow-lg shadow-green-400/30 hover:shadow-green-400/50";
    }
  };

  const getChurnColor = (score) => {
    // Score is now in decimal format (0-1)
    if (score > 0.8) return "from-red-600 via-red-500 to-rose-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]";
    if (score > 0.5) return "from-amber-600 via-amber-500 to-orange-500 drop-shadow-[0_0_10px_rgba(217,119,6,0.6)]";
    return "from-green-600 via-emerald-500 to-teal-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]";
  };

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
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-in; }
        .animate-slide-down { animation: slide-down 0.4s ease-out; }
      `}</style>

      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {isDark ? (
          <>
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-tl from-red-600/15 to-rose-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </>
        ) : (
          <>
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-400/25 to-cyan-400/15 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-tl from-blue-400/20 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </>
        )}
      </div>

      <AdminNav />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header Section */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${pageInfo.color}`}>
              <PageIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1
                className={`
                  text-3xl sm:text-4xl lg:text-5xl font-black
                  ${isDark
                    ? "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-emerald-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent"
                  }
                `}
              >
                {pageInfo.title}
              </h1>
              <p
                className={`
                  text-sm sm:text-base mt-2 font-medium
                  ${isDark ? "text-blue-300/70" : "text-emerald-700/70"}
                `}
              >
                Manage and analyze user accounts with precision
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <StatBox label="Total Users" value={users.length} isDark={isDark} />
            <StatBox label="High Risk" value={users.filter(u => (u.riskLevel || "").toLowerCase() === "high").length} isDark={isDark} color="red" />
            <StatBox label="Medium Risk" value={users.filter(u => (u.riskLevel || "").toLowerCase() === "medium").length} isDark={isDark} color="amber" />
            <StatBox label="Avg Churn" value={users.length > 0 ? ((users.reduce((a, u) => a + (u.churnScore || 0), 0) / users.length) * 100).toFixed(1) + "%" : "0%"} isDark={isDark} color="emerald" />
          </div>
        </div>

        {/* Search Section - Centered with Label */}
        <div className="mb-12 animate-slide-down">
          <div className="flex flex-col items-center justify-center mb-6">
            <h2 className={`text-lg sm:text-xl font-black uppercase tracking-widest mb-4 ${isDark ? "text-blue-300" : "text-emerald-700"}`}>
              Search Users
            </h2>
            <p className={`text-xs sm:text-sm ${isDark ? "text-blue-300/50" : "text-emerald-700/50"}`}>
              💾 Data: Churn scores are stored as decimals (0-1) and displayed as percentages (0-100%)
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="relative w-full max-w-3xl">
              <div className={`relative group rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-2xl ${isDark ? "border-blue-500/40 hover:border-blue-400/60 bg-gradient-to-br from-slate-800/90 to-slate-900/90" : "border-emerald-300/40 hover:border-emerald-400/60 bg-gradient-to-br from-white/90 to-slate-50/90"}`}>
                <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 ${isDark ? "text-blue-400/60" : "text-emerald-600/60"}`} />
                
                <input
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search by username, email, or ID…"
                  className={`
                    w-full pl-16 pr-5 py-4 sm:py-5
                    bg-transparent transition-all duration-300
                    focus:outline-none text-sm sm:text-base font-medium
                    ${isDark
                      ? "text-white placeholder-slate-500"
                      : "text-slate-900 placeholder-slate-600"
                    }
                  `}
                />

                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                  <div
                    className={`
                      absolute top-full left-0 right-0 mt-2 rounded-2xl border-2 shadow-2xl z-50
                      overflow-hidden backdrop-blur-xl
                      ${isDark
                        ? "bg-gradient-to-br from-slate-800/95 to-slate-900/95 border-blue-500/40"
                        : "bg-gradient-to-br from-white/95 to-slate-50/95 border-emerald-300/40"
                      }
                    `}
                  >
                    <div className={`px-4 py-3 text-xs font-bold uppercase tracking-wider ${isDark ? "text-blue-300/60 border-b border-blue-500/20" : "text-emerald-700/60 border-b border-emerald-300/20"}`}>
                      Suggestions
                    </div>
                    {suggestions.map((u) => (
                      <div
                        key={u._id}
                        onClick={() => handleSuggestionClick(u.userName || u.email)}
                        className={`
                          px-4 py-3 cursor-pointer transition-all duration-200 border-b last:border-0
                          ${isDark
                            ? "hover:bg-blue-600/30 border-blue-500/10"
                            : "hover:bg-emerald-100/50 border-emerald-300/10"
                          }
                        `}
                      >
                        <p className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{u.userName}</p>
                        <p className={`text-xs ${isDark ? "text-blue-300/70" : "text-emerald-700/70"}`}>{u.email}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full border-4 animate-spin mx-auto mb-4 ${isDark ? "border-blue-400/30 border-t-blue-400" : "border-emerald-400/30 border-t-emerald-400"}`} />
              <p className={`text-lg font-semibold ${isDark ? "text-blue-300" : "text-emerald-700"}`}>Loading users...</p>
            </div>
          </div>
        )}

        {/* Users Table */}
        {!loading && (
          <div className="animate-fade-in">
            {users.length === 0 ? (
              <div
                className={`
                  rounded-2xl border-2 p-12 text-center backdrop-blur-xl
                  ${isDark
                    ? "bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-blue-500/30"
                    : "bg-gradient-to-br from-white/80 to-slate-50/80 border-emerald-300/30"
                  }
                `}
              >
                <Users className={`w-16 h-16 mx-auto mb-4 opacity-40 ${isDark ? "text-blue-400" : "text-emerald-600"}`} />
                <p className={`text-lg font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  No users found
                </p>
                <p className={`text-sm mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Try adjusting your search criteria or filters
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border-2 shadow-2xl backdrop-blur-xl"
                style={{
                  borderColor: isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(16, 185, 129, 0.3)",
                  backgroundColor: isDark ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    {/* Table Header */}
                    <thead>
                      <tr
                        className={`
                          border-b-2 transition-colors duration-300
                          ${isDark
                            ? "bg-gradient-to-r from-slate-800/60 to-slate-900/60 border-blue-500/30"
                            : "bg-gradient-to-r from-emerald-50/60 to-cyan-50/60 border-emerald-300/30"
                          }
                        `}
                      >
                        <th className="px-6 py-4 text-left">
                          <p className={`text-xs sm:text-sm font-black uppercase tracking-wider ${isDark ? "text-blue-300" : "text-emerald-700"}`}>
                            Username
                          </p>
                        </th>
                        <th className="px-6 py-4 text-left hidden sm:table-cell">
                          <p className={`text-xs sm:text-sm font-black uppercase tracking-wider ${isDark ? "text-blue-300" : "text-emerald-700"}`}>
                            Email
                          </p>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <p className={`text-xs sm:text-sm font-black uppercase tracking-wider ${isDark ? "text-blue-300" : "text-emerald-700"}`}>
                            Churn Score
                          </p>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <p className={`text-xs sm:text-sm font-black uppercase tracking-wider ${isDark ? "text-blue-300" : "text-emerald-700"}`}>
                            Risk Level
                          </p>
                        </th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                      {users.map((u, idx) => {
                        const riskLevel = (u.riskLevel || "").toLowerCase();
                        const riskRowColor = riskLevel === "high" 
                          ? isDark 
                            ? "border-l-4 border-l-red-500 hover:bg-red-600/15" 
                            : "border-l-4 border-l-red-500 hover:bg-red-100/40"
                          : riskLevel === "medium"
                          ? isDark
                            ? "border-l-4 border-l-amber-500 hover:bg-amber-600/15"
                            : "border-l-4 border-l-amber-500 hover:bg-amber-100/40"
                          : isDark
                          ? "border-l-4 border-l-green-500 hover:bg-green-600/15"
                          : "border-l-4 border-l-green-500 hover:bg-green-100/40";

                        return (
                          <tr
                            key={u._id}
                            className={`
                              border-b transition-all duration-300 hover:scale-102 hover:shadow-lg
                              group cursor-pointer ${riskRowColor}
                              ${isDark
                                ? "border-slate-700/50"
                                : "border-slate-300/30"
                              }
                            `}
                            style={{
                              animation: `slide-down 0.4s ease-out ${idx * 0.05}s both`,
                            }}
                          >
                            <td className="px-6 py-4">
                              <p className={`text-sm sm:text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                                {u.userName}
                              </p>
                            </td>
                            <td className="px-6 py-4 hidden sm:table-cell">
                              <p className={`text-sm ${isDark ? "text-blue-300/80" : "text-emerald-700/80"}`}>
                                {u.email}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3 max-w-xs">
                                <div className={`flex-1 h-3 rounded-full bg-gradient-to-r ${getChurnColor(u.churnScore || 0)} shadow-lg`} style={{ width: `${Math.min((u.churnScore || 0) * 100, 100)}%` }} />
                                <span className={`text-sm font-bold whitespace-nowrap ${isDark ? "text-white" : "text-slate-900"}`}>
                                  {Math.round((u.churnScore || 0) * 100)}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`
                                  inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2
                                  text-xs sm:text-sm font-bold
                                  transition-all duration-300 group-hover:scale-110 backdrop-blur-sm
                                  ${getRiskColor(u.riskLevel)}
                                `}
                              >
                                {riskLevel === "high" && <AlertTriangle className="w-4 h-4" />}
                                {riskLevel === "medium" && <TrendingDown className="w-4 h-4" />}
                                {(riskLevel === "low" || riskLevel === "") && <Users className="w-4 h-4" />}
                                {u.riskLevel ? (u.riskLevel.charAt(0).toUpperCase() + u.riskLevel.slice(1)) : "Unknown"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Footer with summary */}
                <div
                  className={`
                    px-6 py-4 border-t-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
                    ${isDark
                      ? "bg-slate-800/40 border-blue-500/30"
                      : "bg-slate-100/40 border-emerald-300/30"
                    }
                  `}
                >
                  <p className={`text-sm font-bold ${isDark ? "text-blue-300" : "text-emerald-700"}`}>
                    Showing {users.length} {users.length === 1 ? "user" : "users"}
                  </p>
                  <div className="flex items-center gap-6">
                    <p className={`text-xs sm:text-sm ${isDark ? "text-blue-300/70" : "text-emerald-700/70"}`}>
                      <span className="font-bold">High Risk:</span> {users.filter(u => (u.riskLevel || "").toLowerCase() === "high").length}
                    </p>
                    <p className={`text-xs sm:text-sm ${isDark ? "text-blue-300/70" : "text-emerald-700/70"}`}>
                      <span className="font-bold">Medium Risk:</span> {users.filter(u => (u.riskLevel || "").toLowerCase() === "medium").length}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, isDark, color = "blue" }) {
  const colorMap = {
    blue: isDark ? "from-blue-600/20 to-cyan-600/10 border-blue-500/30" : "from-blue-100/40 to-cyan-100/30 border-blue-300/40",
    red: isDark ? "from-red-600/20 to-rose-600/10 border-red-500/30" : "from-red-100/40 to-rose-100/30 border-red-300/40",
    amber: isDark ? "from-amber-600/20 to-orange-600/10 border-amber-500/30" : "from-amber-100/40 to-orange-100/30 border-amber-300/40",
    emerald: isDark ? "from-emerald-600/20 to-teal-600/10 border-emerald-500/30" : "from-emerald-100/40 to-teal-100/30 border-emerald-300/40",
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border-2 rounded-xl p-4 backdrop-blur-xl`}>
      <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
        {label}
      </p>
      <p className={`text-2xl sm:text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
}