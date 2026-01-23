import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserNavBar from "./userNavBar";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_BACKEND_URL;

  // 🔹 Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.user);
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

  if (loading) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-gray-700">{error}</div>;
  }

  return (
    <>
      <UserNavBar />

      {/* Page */}
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
        {/* Card */}
        <div className="w-full max-w-sm sm:max-w-md bg-white border border-gray-300 rounded-2xl p-6 sm:p-8 shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6 text-black">
            User Profile
          </h2>

          {/* Profile Info */}
          <div className="space-y-4 text-sm sm:text-base">
            <div>
              <p className="text-gray-600 mb-1">Username</p>
              <div className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-black">
                {user.userName}
              </div>
            </div>

            <div>
              <p className="text-gray-600 mb-1">Email</p>
              <div className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-black break-all">
                {user.email}
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => navigate("/edituserprofile")}
            className="
              w-full mt-6 py-2.5 rounded-lg
              bg-black text-white font-medium
              hover:bg-gray-800 transition
            "
          >
            Edit Profile
          </button>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
