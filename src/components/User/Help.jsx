import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserNavBar from "./userNavBar";
import { AlertCircle, Send, CheckCircle, Clock, AlertTriangle, Bug, Lock, CreditCard, HelpCircle, Trash2, Filter } from "lucide-react";

const Help = () => {
  const [issueType, setIssueType] = useState("BUG");
  const [severity, setSeverity] = useState("LOW");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("admin-theme") || "light");
  const [filterSeverity, setFilterSeverity] = useState("ALL");

  const API = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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

  // 🔐 user-scoped storage key
  const storageKey = `userIssues_${token}`;

  /* 🔹 Load issue history from localStorage */
  useEffect(() => {
    if (!token) return;
    const saved = JSON.parse(localStorage.getItem(storageKey)) || [];
    setHistory(saved);
  }, [token, storageKey]);

  /* 🔹 Track Help page visit */
  useEffect(() => {
    if (!token) return;

    axios.post(
      `${API}/events/track`,
      {
        eventType: "PAGE_VIEW",
        metadata: { page: "Help" },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ).catch(() => {});
  }, [API, token]);

  /* 🔹 Submit Issue */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // 1️⃣ Report Issue
      await axios.post(
        `${API}/issues/report`,
        { issueType, severity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 2️⃣ Track event
      await axios.post(
        `${API}/events/track`,
        {
          eventType: "CLICK",
          metadata: {
            action: "REPORT_ISSUE",
            issueType,
            severity,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 3️⃣ Save issue locally (append)
      const newIssue = {
        issueType,
        severity,
        time: new Date().toISOString(),
      };

      const updatedHistory = [...history, newIssue];
      localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
      setHistory(updatedHistory);

      // 4️⃣ Show success popup (no redirect)
      setShowSuccess(true);
      setSubmitting(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to report issue");
      setSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setIssueType("BUG");
    setSeverity("LOW");
  };

  const handleDeleteIssue = (index) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all reports?")) {
      localStorage.setItem(storageKey, JSON.stringify([]));
      setHistory([]);
    }
  };

  const filteredHistory = filterSeverity === "ALL" 
    ? history 
    : history.filter(item => item.severity === filterSeverity);

  const isLocked = submitting || showSuccess;

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "HIGH":
        return <AlertTriangle size={16} className="text-red-500" />;
      case "MEDIUM":
        return <AlertCircle size={16} className="text-yellow-500" />;
      default:
        return <Clock size={16} className="text-blue-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "HIGH":
        return isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700";
      case "MEDIUM":
        return isDark ? "bg-yellow-900/30 text-yellow-300" : "bg-yellow-100 text-yellow-700";
      default:
        return isDark ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-700";
    }
  };

  const getIssueIcon = (type) => {
    switch (type) {
      case "BUG":
        return <Bug size={18} />;
      case "AUTH_PROBLEM":
        return <Lock size={18} />;
      case "PAYMENT_FAILURE":
        return <CreditCard size={18} />;
      default:
        return <HelpCircle size={18} />;
    }
  };

  return (
    <>
      <UserNavBar />

      <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100"}`}>
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12">

          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className={`text-3xl sm:text-4xl font-bold mb-2 transition-colors duration-300 ${isDark ? "text-slate-50" : "text-slate-900"}`}>
              Help & Support Center
            </h1>
            <p className={`transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Report issues and get help from our support team
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* 📝 Report Form - Left Side */}
            <div className={`lg:col-span-1 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur-xl border transition-all duration-300 h-fit ${
              isDark
                ? "bg-slate-800/60 border-slate-700"
                : "bg-white/70 border-slate-200"
            }`}>
              <h2 className={`text-xl sm:text-2xl font-bold mb-6 transition-colors duration-300 ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                Report Issue
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Issue Type */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-semibold mb-3 transition-colors duration-300 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    {getIssueIcon(issueType)}
                    Issue Type
                  </label>
                  <select
                    value={issueType}
                    disabled={isLocked}
                    onChange={(e) => setIssueType(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 font-medium text-sm ${
                      isDark
                        ? "bg-slate-700/30 border-slate-600 focus:border-emerald-500 text-slate-100 disabled:bg-slate-700/50"
                        : "bg-slate-50/50 border-slate-200 focus:border-emerald-500 text-slate-900 disabled:bg-slate-100"
                    }`}
                  >
                    <option value="BUG">🐛 Bug Report</option>
                    <option value="AUTH_PROBLEM">🔐 Authentication Issue</option>
                    <option value="FAILED_ACTION">❌ Failed Action</option>
                    <option value="PAYMENT_FAILURE">💳 Payment Issue</option>
                    <option value="SUPPORT_REQUEST">❓ Support Request</option>
                  </select>
                </div>

                {/* Severity */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-semibold mb-3 transition-colors duration-300 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    {getSeverityIcon(severity)}
                    Severity Level
                  </label>
                  <select
                    value={severity}
                    disabled={isLocked}
                    onChange={(e) => setSeverity(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 font-medium text-sm ${
                      isDark
                        ? "bg-slate-700/30 border-slate-600 focus:border-emerald-500 text-slate-100 disabled:bg-slate-700/50"
                        : "bg-slate-50/50 border-slate-200 focus:border-emerald-500 text-slate-900 disabled:bg-slate-100"
                    }`}
                  >
                    <option value="LOW">🟦 Low Priority</option>
                    <option value="MEDIUM">🟨 Medium Priority</option>
                    <option value="HIGH">🟥 High Priority</option>
                  </select>
                </div>

                {/* Error Message */}
                {error && (
                  <div className={`rounded-lg p-3 flex items-start gap-3 transition-colors duration-300 ${
                    isDark
                      ? "bg-red-900/20 border border-red-700 text-red-300"
                      : "bg-red-50/50 border border-red-200 text-red-700"
                  }`}>
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLocked}
                  className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/40"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-400/40"
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="group-hover:scale-110 transition-transform" />
                      Report Issue
                    </>
                  )}
                </button>

                {/* ✅ Success Message */}
                {showSuccess && (
                  <div className={`rounded-lg p-4 text-center border transition-all duration-300 ${
                    isDark
                      ? "bg-emerald-900/20 border-emerald-700"
                      : "bg-emerald-50/50 border-emerald-200"
                  }`}>
                    <CheckCircle size={24} className="mx-auto mb-2 text-emerald-500" />
                    <p className={`font-semibold transition-colors duration-300 ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>
                      Issue Reported Successfully!
                    </p>
                    <p className={`text-xs mt-1 transition-colors duration-300 ${isDark ? "text-emerald-400/70" : "text-emerald-600/70"}`}>
                      Thank you for reporting this issue
                    </p>
                  </div>
                )}
              </form>
            </div>

            {/* 📜 Issue History - Right Side */}
            <div className={`lg:col-span-2 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur-xl border transition-all duration-300 ${
              isDark
                ? "bg-slate-800/60 border-slate-700"
                : "bg-white/70 border-slate-200"
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h3 className={`text-xl sm:text-2xl font-bold transition-colors duration-300 ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                  Report History
                </h3>
                <div className="flex items-center gap-2">
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors duration-300 ${
                      isDark
                        ? "bg-slate-700/30 border-slate-600 text-slate-300"
                        : "bg-slate-50/50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <option value="ALL">All Severity</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                  {history.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        isDark
                          ? "text-red-400 hover:bg-red-600/10"
                          : "text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Empty State */}
              {filteredHistory.length === 0 ? (
                <div className={`text-center py-12 rounded-lg border-2 border-dashed transition-colors duration-300 ${
                  isDark
                    ? "border-slate-700 text-slate-400"
                    : "border-slate-200 text-slate-600"
                }`}>
                  <HelpCircle size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="font-medium">{history.length === 0 ? "No reports yet" : "No reports match filter"}</p>
                  <p className="text-sm mt-1">Start by reporting an issue on the left</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredHistory.reverse().map((item, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-4 backdrop-blur-sm border transition-all duration-300 hover:shadow-lg group ${
                        isDark
                          ? "bg-slate-700/30 border-slate-600 hover:border-slate-500"
                          : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg flex-shrink-0 transition-colors duration-300 ${
                            isDark ? "bg-slate-600" : "bg-slate-100"
                          }`}>
                            {getIssueIcon(item.issueType)}
                          </div>
                          <div className="flex-1">
                            <p className={`font-semibold text-sm transition-colors duration-300 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                              {item.issueType.replace(/_/g, " ")}
                            </p>
                            <p className={`text-xs transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                              {new Date(item.time).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors duration-300 ${getSeverityColor(item.severity)}`}>
                            {item.severity}
                          </span>
                          <button
                            onClick={() => handleDeleteIssue(history.indexOf(item))}
                            className={`p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                              isDark
                                ? "hover:bg-red-600/20 text-red-400"
                                : "hover:bg-red-50 text-red-600"
                            }`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Summary Stats */}
              {history.length > 0 && (
                <div className={`mt-6 pt-6 border-t transition-colors duration-300 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className={`text-2xl font-bold transition-colors duration-300 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                        {history.length}
                      </p>
                      <p className={`text-xs transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Total Reports</p>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold transition-colors duration-300 ${isDark ? "text-red-400" : "text-red-600"}`}>
                        {history.filter(i => i.severity === "HIGH").length}
                      </p>
                      <p className={`text-xs transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>High Priority</p>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold transition-colors duration-300 ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                        {history.filter(i => i.severity === "LOW").length}
                      </p>
                      <p className={`text-xs transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Low Priority</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Success Modal Popup */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className={`rounded-xl sm:rounded-2xl p-8 max-w-sm w-full shadow-2xl transition-all duration-300 transform scale-100 ${
            isDark
              ? "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700"
              : "bg-gradient-to-br from-white to-slate-50 border border-slate-200"
          }`}>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <CheckCircle size={32} className="text-white" />
              </div>
              
              <h3 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                Issue Reported!
              </h3>
              
              <p className={`text-sm mb-6 transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Thank you for reporting this issue. Our support team will review it shortly.
              </p>

              <div className={`mb-6 p-4 rounded-lg transition-colors duration-300 ${
                isDark
                  ? "bg-slate-700/30 border border-slate-600"
                  : "bg-slate-50/50 border border-slate-200"
              }`}>
                <p className={`text-xs font-medium mb-2 transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Report Details
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className={isDark ? "text-slate-400" : "text-slate-600"}>Type:</span>
                    <span className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-900"}`}>{issueType.replace(/_/g, " ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? "text-slate-400" : "text-slate-600"}>Severity:</span>
                    <span className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-900"}`}>{severity}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCloseSuccess}
                className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 group ${
                  isDark
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/40"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-400/40"
                }`}
              >
                OK, Got It!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Help;