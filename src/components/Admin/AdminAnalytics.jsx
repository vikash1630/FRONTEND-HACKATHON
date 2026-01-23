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
import AdminNav from "./adminNav";

const API = import.meta.env.VITE_BACKEND_URL;

export default function AdminAnalytics() {
  const navigate = useNavigate();

  const [avgChurn, setAvgChurn] = useState(0);
  const [plotData, setPlotData] = useState([]);
  const [plotType, setPlotType] = useState("line");
  const [reasons, setReasons] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const churnRes = await axios.get(
          `${API}/admin/metrics/avg-churn-score`
        );
        setAvgChurn(churnRes.data.averageChurnScore || 0);

        const issuesRes = await axios.get(
          `${API}/admin/metrics/issues-over-time`
        );
        setPlotData(issuesRes.data.data || []);

        const rrRes = await axios.get(
          `${API}/admin/metrics/reasons-recommendations`
        );
        setReasons(Object.keys(rrRes.data.reasons || {}));
        setRecommendations(
          Object.keys(rrRes.data.recommendations || {})
        );
      } catch (err) {
        console.error("Analytics error:", err.message);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />

      <div className="p-6 space-y-6">
        {/* NAV CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NavCard
            title="All Users"
            onClick={() => navigate("/admin/users")}
          />
          <NavCard
            title="High Risk Users"
            onClick={() => navigate("/admin/users?type=high")}
          />
          <NavCard
            title="Medium Risk Users"
            onClick={() => navigate("/admin/users?type=medium")}
          />
          <StatCard title="Avg Churn Score" value={avgChurn} />
        </div>

        {/* CHART */}
        <div className="bg-white rounded shadow p-6">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Issues Over Time</h2>

            <select
              value={plotType}
              onChange={(e) => setPlotType(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="line">Line</option>
              <option value="bar">Bar</option>
              <option value="area">Area</option>
              <option value="composed">Composed</option>
              <option value="scatter">Scatter</option>
            </select>
          </div>

          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              {plotType === "line" && (
                <LineChart data={plotData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="count" stroke="#000" />
                </LineChart>
              )}

              {plotType === "bar" && (
                <BarChart data={plotData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#000" />
                </BarChart>
              )}

              {plotType === "area" && (
                <AreaChart data={plotData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area dataKey="count" stroke="#000" fill="#e5e5e5" />
                </AreaChart>
              )}

              {plotType === "composed" && (
                <ComposedChart data={plotData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#bbb" />
                  <Line dataKey="count" stroke="#000" />
                </ComposedChart>
              )}

              {plotType === "scatter" && (
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis dataKey="count" />
                  <Tooltip />
                  <Scatter data={plotData} fill="#000" />
                </ScatterChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* LISTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ListCard title="Reasons" items={reasons} />
          <ListCard title="Recommendations" items={recommendations} />
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function NavCard({ title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded shadow p-5 cursor-pointer hover:scale-105 transition"
    >
      <p className="font-semibold">{title}</p>
      <p className="text-xs text-gray-400">View →</p>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded shadow p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ListCard({ title, items }) {
  return (
    <div className="bg-white rounded shadow p-5">
      <h3 className="font-semibold mb-3">{title}</h3>
      {items.length === 0 ? (
        <p className="text-gray-400 text-sm">No data</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {items.map((item, i) => (
            <li key={i} className="bg-gray-100 px-3 py-1 rounded">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
