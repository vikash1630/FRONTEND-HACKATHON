import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserNavBar from "./userNavBar";

const EditUserProfile = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_BACKEND_URL;

  // 🔹 Fetch current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserName(res.data.user.userName);
        setEmail(res.data.user.email);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API, token]);

  // 🔹 Update email only
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.put(
        `${API}/auth/profile`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Profile updated successfully");
      setTimeout(() => navigate("/userprofile"), 1200);
    } catch (err) {
      setError(
        err.response?.data?.message || "Profile update failed"
      );
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <>
      <UserNavBar />

      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
        <div className="w-full max-w-sm sm:max-w-md bg-white border border-gray-300 rounded-2xl p-6 sm:p-8 shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6 text-black">
            Edit Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username (read-only) */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Username
              </label>
              <input
                type="text"
                value={userName}
                disabled
                className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-black cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {error && (
              <p className="text-sm text-gray-700">{error}</p>
            )}
            {message && (
              <p className="text-sm text-black font-medium">{message}</p>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-2.5 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => navigate("/userprofile")}
              className="w-full py-2.5 rounded-lg border border-gray-400 text-black hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditUserProfile;
