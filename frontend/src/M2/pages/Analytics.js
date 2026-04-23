import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

import { getAllBookings } from '../api/bookingApi';
import './Analytics.css';

const STATUS_COLORS = {
  PENDING: '#FBBF24',
  APPROVED: '#34D399',
  REJECTED: '#F87171',
  CANCELLED: '#9CA3AF',
};

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

  if (loading) {
    return <p className="state-msg">Loading analytics...</p>;
  }

  if (error) {
    return (
      <div className="analytics-page">
        <div style={{
          background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 16,
          padding: '24px 28px', display: 'flex', gap: 16, alignItems: 'flex-start',
          marginTop: 32,
        }}>
          <span style={{ fontSize: 28 }}>🔌</span>
          <div>
            <div style={{ fontWeight: 800, color: '#b91c1c', fontSize: 15, marginBottom: 6 }}>
              Cannot connect to backend
            </div>
            <div style={{ color: '#dc2626', fontSize: 13, lineHeight: 1.6 }}>{error}</div>
            <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 8 }}>
              Make sure the Spring Boot backend is running on <strong>http://localhost:8080</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     STATUS COUNT
  ========================== */
  const statusCount = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(statusCount).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  /* =========================
     RESOURCE COUNT
  ========================== */
  const resourceCount = bookings.reduce((acc, b) => {
    const key = `Resource ${b.resourceId}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const resourceData = Object.entries(resourceCount)
    .map(([name, bookings]) => ({
      name,
      bookings,
    }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 8);

  /* =========================
     PEAK HOURS
  ========================== */
  const hourCount = bookings.reduce((acc, b) => {
    if (b.startTime) {
      const hour = `${b.startTime.slice(0, 2)}:00`;
      acc[hour] = (acc[hour] || 0) + 1;
    }

    return acc;
  }, {});

  const hourData = Object.entries(hourCount)
    .map(([hour, bookings]) => ({
      hour,
      bookings,
    }))
    .sort((a, b) => a.hour.localeCompare(b.hour));

  /* =========================
     DAILY TREND
  ========================== */
  const dateCount = bookings.reduce((acc, b) => {
    if (b.bookingDate) {
      acc[b.bookingDate] =
        (acc[b.bookingDate] || 0) + 1;
    }

    return acc;
  }, {});

  const dateData = Object.entries(dateCount)
    .map(([date, bookings]) => ({
      date,
      bookings,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);

  return (
    <div className="analytics-page">
      <h1>Analytics Dashboard</h1>

      <p className="analytics-subtitle">
        Overview of campus resource booking activity.
      </p>

      {/* =========================
          STATS
      ========================== */}
      <div className="analytics-stat-grid">
        {[
          {
            label: 'Total Bookings',
            value: bookings.length,
            icon: '📋',
            cls: 'indigo',
          },
          {
            label: 'Approved',
            value: statusCount['APPROVED'] || 0,
            icon: '✅',
            cls: 'green',
          },
          {
            label: 'Pending',
            value: statusCount['PENDING'] || 0,
            icon: '⏳',
            cls: 'yellow',
          },
          {
            label: 'Rejected',
            value: statusCount['REJECTED'] || 0,
            icon: '❌',
            cls: 'red',
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`analytics-stat-card ${s.cls}`}
          >
            <div>
              <div className="analytics-stat-label">
                {s.label}
              </div>

              <div className="analytics-stat-value">
                {s.value}
              </div>
            </div>

            <div className="analytics-stat-icon">
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* =========================
          CHARTS
      ========================== */}
      <div className="analytics-charts-grid">

        {/* STATUS PIE CHART */}
        <div className="chart-card">
          <h2>Booking Status Breakdown</h2>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {statusData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={
                      STATUS_COLORS[entry.name] ||
                      '#6366F1'
                    }
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* TOP RESOURCES */}
        <div className="chart-card">
          <h2>Top Booked Resources</h2>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={resourceData}
              margin={{
                top: 0,
                right: 10,
                left: -10,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F3F4F6"
              />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11 }}
              />

              <Tooltip />

              <Bar
                dataKey="bookings"
                fill="#6366F1"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PEAK HOURS */}
        <div className="chart-card">
          <h2>Peak Booking Hours</h2>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={hourData}
              margin={{
                top: 0,
                right: 10,
                left: -10,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F3F4F6"
              />

              <XAxis
                dataKey="hour"
                tick={{ fontSize: 11 }}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11 }}
              />

              <Tooltip />

              <Bar
                dataKey="bookings"
                fill="#34D399"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DAILY TREND */}
        <div className="chart-card">
          <h2>
            Daily Bookings Trend (Last 14 Days)
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={dateData}
              margin={{
                top: 0,
                right: 10,
                left: -10,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F3F4F6"
              />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11 }}
              />

              <Tooltip />

              <Bar
                dataKey="bookings"
                fill="#FBBF24"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}