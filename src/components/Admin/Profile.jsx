import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNav from "./adminNav";

const Profile = () => {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_BACKEND_URL;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const res = await axios.get(`${API}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />

      <div className="max-w-4xl mx-auto px-4 mt-10 pb-12">
        <h1 className="text-2xl font-bold text-black mb-6">
          Admin Profile
        </h1>

        {loading && (
          <p className="text-gray-600">Loading profile...</p>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg border border-gray-300 text-black bg-white">
            {error}
          </div>
        )}

        {user && (
          <div className="bg-white border border-gray-300 rounded-2xl p-6 space-y-6 shadow-sm">
            {/* Profile Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="text-lg font-semibold text-black">
                  {user.userName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-semibold text-black break-all">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-lg font-semibold text-black">
                  {user.isAdmin ? "Admin" : "User"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-300 flex justify-end">
              <button
                onClick={() => navigate("/editprofile")}
                className="
                  px-6 py-2 rounded-lg
                  bg-black text-white font-medium
                  hover:bg-gray-800 transition
                "
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
