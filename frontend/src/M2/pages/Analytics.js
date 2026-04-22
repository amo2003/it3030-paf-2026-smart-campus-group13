import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { getAllBookings } from '../api/bookingApi';

const STATUS_COLORS = {
  PENDING:   '#FBBF24',
  APPROVED:  '#34D399',
  REJECTED:  '#F87171',
  CANCELLED: '#9CA3AF',
};

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}

export default function Analytics() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllBookings()
      .then(setBookings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-20 text-gray-400">Loading analytics...</p>;
  if (error)   return <p className="text-center py-20 text-red-500">{error}</p>;

  // ── Status breakdown ──────────────────────────────────
  const statusCount = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

  // ── Top resources ─────────────────────────────────────
  const resourceCount = bookings.reduce((acc, b) => {
    const key = `Resource ${b.resourceId}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const resourceData = Object.entries(resourceCount)
    .map(([name, bookings]) => ({ name, bookings }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 8);

  // ── Peak booking hours ────────────────────────────────
  const hourCount = bookings.reduce((acc, b) => {
    if (b.startTime) {
      const hour = `${b.startTime.slice(0, 2)}:00`;
      acc[hour] = (acc[hour] || 0) + 1;
    }
    return acc;
  }, {});
  const hourData = Object.entries(hourCount)
    .map(([hour, bookings]) => ({ hour, bookings }))
    .sort((a, b) => a.hour.localeCompare(b.hour));

  // ── Daily bookings trend ──────────────────────────────
  const dateCount = bookings.reduce((acc, b) => {
    if (b.bookingDate) {
      acc[b.bookingDate] = (acc[b.bookingDate] || 0) + 1;
    }
    return acc;
  }, {});
  const dateData = Object.entries(dateCount)
    .map(([date, bookings]) => ({ date, bookings }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14); // last 14 days

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
      <p className="text-gray-500 mb-10">Overview of campus resource booking activity.</p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Bookings" value={bookings.length} icon="📋" color="border-indigo-400" />
        <StatCard label="Approved" value={statusCount['APPROVED'] || 0} icon="✅" color="border-green-400" />
        <StatCard label="Pending" value={statusCount['PENDING'] || 0} icon="⏳" color="border-yellow-400" />
        <StatCard label="Rejected" value={statusCount['REJECTED'] || 0} icon="❌" color="border-red-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Status pie chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Booking Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#6366F1'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top resources bar chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Top Booked Resources</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={resourceData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Peak hours */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Peak Booking Hours</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={hourData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#34D399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Daily trend */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Daily Bookings Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dateData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#FBBF24" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
