import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import AdminNav from "./adminNav";

const API = import.meta.env.VITE_BACKEND_URL;

export default function AdminUsersPage() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type"); // high | medium | null

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      let endpoint = "/admin/users";
      if (type === "high") endpoint = "/admin/users/high-risk";
      if (type === "medium") endpoint = "/admin/users/medium-risk";

      const res = await axios.get(`${API}${endpoint}`);
      setUsers(res.data.users || []);
      setLoading(false);
    };

    fetchUsers();
  }, [type]);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {type === "high"
            ? "High Risk Users"
            : type === "medium"
            ? "Medium Risk Users"
            : "All Users"}
        </h1>

        {loading ? (
          <p>Loading users…</p>
        ) : (
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Username</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Churn</th>
                  <th className="p-3 text-left">Risk</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t">
                    <td className="p-3">{u.userName}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3 font-semibold">{u.churnScore}</td>
                    <td className="p-3">{u.riskLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
