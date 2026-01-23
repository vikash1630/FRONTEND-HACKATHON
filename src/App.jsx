import { Routes, Route } from "react-router-dom";
import Login from "./components/Global/Login";
import Signup from "./components/Global/Signup";
import Dashboard from "./components/Admin/dashboard";
import UserHome from "./components/User/userHome";
import Profile from "./components/Admin/Profile";
import EditProfile from "./components/Admin/EditProfile";
import Analytics from "./components/Admin/Analytics";
import UserDashBoard from "./components/User/userDashBoard";
import Help from "./components/User/Help";
import UserProfile from "./components/User/userProfile";
import EditUserProfile from "./components/User/EditUserProfile";
import AdminAnalytics from "./components/Admin/AdminAnalytics";
import AdminUsersPage from "./components/Admin/AdminUsersPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/userHome" element={<UserHome />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/editprofile" element={<EditProfile />} />
      <Route path="/analytics" element={<Analytics />} />

      {/* USER */}
      <Route path="/userprofile" element={<UserProfile />} />
      <Route path="/userdashboard" element={<UserDashBoard />} />
      <Route path="/userhelp" element={<Help />} />
      <Route path="/edituserprofile" element={<EditUserProfile />} />

      {/* ADMIN */}
      <Route path="/an" element={<AdminAnalytics />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />
    </Routes>
  );
}

export default App;
