import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNav from "./adminNav";

const EditProfile = () => {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_BACKEND_URL;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* 🔹 Fetch profile */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const res = await axios.get(`${API}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEmail(res.data.user.email);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API, navigate]);

  /* 🔹 Update profile */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${API}/auth/profile`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(res.data.message || "Profile updated successfully");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />

      <div className="max-w-xl mx-auto px-4 mt-10 pb-12">
        <h1 className="text-2xl font-bold text-black mb-6">
          Edit Profile
        </h1>

        {loading && (
          <p className="text-gray-600">Loading profile…</p>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg border border-gray-300 bg-white text-black">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg border border-gray-300 bg-white text-black">
            {success}
          </div>
        )}

        {!loading && (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-300 rounded-2xl p-6 space-y-6 shadow-sm"
          >
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full px-4 py-2
                  border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-black
                "
                placeholder="you@example.com"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="
                  w-full sm:w-auto
                  px-6 py-2 rounded-lg
                  border border-gray-300
                  text-black bg-white
                  hover:bg-gray-100 transition
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`
                  w-full sm:w-auto
                  px-6 py-2 rounded-lg
                  text-white bg-black
                  hover:bg-gray-800 transition
                  ${saving ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
