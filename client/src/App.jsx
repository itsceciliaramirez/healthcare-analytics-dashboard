import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const API_URL = "https://healthcare-analytics-dashboard-cl84.onrender.com";

function App() {
  const [analytics, setAnalytics] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [funnelData, setFunnelData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch(
      selectedDepartment === "All"
        ? `${API_URL}/analytics`
        : `${API_URL}/analytics/${selectedDepartment}`
    )
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch((err) => console.error(err));

    fetch(`${API_URL}/appointment-status`)
      .then((res) => res.json())
      .then((data) => setStatusData(data))
      .catch((err) => console.error(err));

    fetch(`${API_URL}/patient-funnel`)
      .then((res) => res.json())
      .then((data) => setFunnelData(data))
      .catch((err) => console.error(err));

    fetch(`${API_URL}/department-analytics`)
      .then((res) => res.json())
      .then((data) => setDepartmentData(data))
      .catch((err) => console.error(err));

    fetch(`${API_URL}/appointment-trends`)
      .then((res) => res.json())
      .then((data) => setTrendData(data))
      .catch((err) => console.error(err));
  }, [selectedDepartment]);

  const filteredDepartmentData =
    selectedDepartment === "All"
      ? departmentData
      : departmentData.filter(
          (dept) => dept.department_name === selectedDepartment
        );

  if (!analytics) {
    return (
      <div className="p-10 text-2xl font-semibold">
        Loading analytics...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-10 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h1
        className={`text-4xl font-bold mb-10 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Healthcare Analytics Dashboard
      </h1>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="mb-6 bg-blue-600 text-white px-5 py-2 rounded-xl shadow-lg"
      >
        Toggle Dark Mode
      </button>

      <div className="mb-8">
        <label
          className={`block text-lg font-semibold mb-2 ${
            darkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          Filter by Department
        </label>

        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm text-gray-700"
        >
          <option value="All">All Departments</option>
          <option value="Emergency">Emergency</option>
          <option value="Orthopedics">Orthopedics</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Neurology">Neurology</option>
          <option value="Pediatrics">Pediatrics</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-gray-800">
          <h2 className="text-xl font-semibold text-gray-600">
            Total Appointments
          </h2>
          <p className="text-5xl font-bold mt-4 text-blue-600">
            {analytics.total_appointments}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-gray-800">
          <h2 className="text-xl font-semibold text-gray-600">
            No Show Count
          </h2>
          <p className="text-5xl font-bold mt-4 text-red-500">
            {analytics.no_show_count}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-gray-800">
          <h2 className="text-xl font-semibold text-gray-600">
            Average Wait Time
          </h2>
          <p className="text-5xl font-bold mt-4 text-green-600">
            {Math.round(analytics.average_wait_time || 0)} min
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-gray-800">
          <h2 className="text-xl font-semibold text-gray-600">
            No Show Rate
          </h2>
          <p className="text-5xl font-bold mt-4 text-orange-500">
            {analytics.no_show_rate || 0}%
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-gray-800">
          <h2 className="text-xl font-semibold text-gray-600">
            Completed Rate
          </h2>
          <p className="text-5xl font-bold mt-4 text-purple-600">
            {analytics.completed_rate || 0}%
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-gray-800">
          <h2 className="text-xl font-semibold text-gray-600">
            Follow-Ups
          </h2>
          <p className="text-5xl font-bold mt-4 text-pink-500">
            {analytics.follow_up_count || 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 text-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">
          Appointment Status Overview
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="appointment_status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 text-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">
          Patient Funnel Analysis
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={funnelData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage_name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="patient_count" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 text-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">
          Department Performance
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredDepartmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department_name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="appointment_count" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 text-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">
          Appointments Over Time
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="appointment_day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="appointment_count"
              stroke="#EF4444"
              strokeWidth={4}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;