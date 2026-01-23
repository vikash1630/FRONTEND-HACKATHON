import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserNavBar from "./userNavBar";

const Help = () => {
  const [issueType, setIssueType] = useState("BUG");
  const [severity, setSeverity] = useState("LOW");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [history, setHistory] = useState([]);

  const API = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // 🔐 user-scoped storage key
  const storageKey = `userIssues_${token}`;

  /* 🔹 Load issue history from localStorage */
  useEffect(() => {
    if (!token) return;
    const saved = JSON.parse(localStorage.getItem(storageKey)) || [];
    setHistory(saved);
  }, [token]);

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

      // 4️⃣ Lock UI + success
      setShowSuccess(true);

      // 5️⃣ Redirect after 3 sec
      setTimeout(() => {
        navigate("/userdashboard");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to report issue");
      setSubmitting(false);
    }
  };

  const isLocked = submitting || showSuccess;

  return (
    <>
      <UserNavBar />

      <div className="min-h-screen bg-gray-100 px-4 py-6 flex justify-center">
        <div className="w-full max-w-md space-y-6">

          {/* 📝 Report Form */}
          <div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-center mb-6">
              Help & Support
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Issue Type */}
              <div>
                <label className="text-sm text-gray-600">Issue Type</label>
                <select
                  value={issueType}
                  disabled={isLocked}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
                >
                  <option value="BUG">Bug</option>
                  <option value="AUTH_PROBLEM">Authentication Problem</option>
                  <option value="FAILED_ACTION">Failed Action</option>
                  <option value="PAYMENT_FAILURE">Payment Failure</option>
                  <option value="SUPPORT_REQUEST">Support Request</option>
                </select>
              </div>

              {/* Severity */}
              <div>
                <label className="text-sm text-gray-600">Severity</label>
                <select
                  value={severity}
                  disabled={isLocked}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              {error && <p className="text-sm text-gray-700">{error}</p>}

              <button
                type="submit"
                disabled={isLocked}
                className={`w-full py-2 rounded-lg ${
                  isLocked
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {submitting ? "Submitting..." : "Report Issue"}
              </button>
            </form>

            {/* ✅ Success */}
            {showSuccess && (
              <div className="mt-6 border border-gray-300 rounded-lg p-4 text-center">
                <p className="font-medium text-black">
                  ✅ Issue reported successfully
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Redirecting to home page...
                </p>
              </div>
            )}
          </div>

          {/* 📜 Issue History */}
          <div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-md">
            <h3 className="font-semibold mb-4">Your Previous Reports</h3>

            {history.length === 0 ? (
              <p className="text-sm text-gray-600">
                No issues reported yet.
              </p>
            ) : (
              <ul className="space-y-3 text-sm">
                {history.map((item, index) => (
                  <li
                    key={index}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <p><strong>Type:</strong> {item.issueType}</p>
                    <p><strong>Severity:</strong> {item.severity}</p>
                    <p className="text-gray-600">
                      {new Date(item.time).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Help;
