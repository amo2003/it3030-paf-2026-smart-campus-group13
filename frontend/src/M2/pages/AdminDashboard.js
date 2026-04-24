import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBookings } from '../api/bookingApi';
import './AdminDashboard.css';

const BASE_RESOURCES = 'http://localhost:8080/api/module1/resources';
const BASE_TICKETS   = 'http://localhost:8080/api/tickets';
const BASE_USERS     = 'http://localhost:8080/api/module4/users';

export default function AdminDashboard() {
  const [bookings,  setBookings]  = useState([]);
  const [resources, setResources] = useState([]);
  const [tickets,   setTickets]   = useState([]);
  const [users,     setUsers]     = useState([]);
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

  useEffect(() => {
    getAllBookings().then(setBookings).catch(() => {});
    fetch(BASE_RESOURCES).then(r => r.ok ? r.json() : []).then(setResources).catch(() => {});
    fetch(BASE_TICKETS).then(r => r.ok ? r.json() : []).then(setTickets).catch(() => {});
    fetch(BASE_USERS).then(r => r.ok ? r.json() : []).then(setUsers).catch(() => {});
  }, []);

  const pending   = bookings.filter(b => b.status === 'PENDING').length;
  const openTix   = tickets.filter(t => t.status === 'OPEN').length;
  const highTix   = tickets.filter(t => t.priority === 'HIGH').length;
  const activeRes = resources.filter(r => r.status === 'ACTIVE').length;

  const sections = [
    { to: '/resources',     icon: '🏢', title: 'Resource Management',  desc: 'Add, edit and manage campus facilities and equipment.',                          color: 'blue',   stats: [{ label: 'Total', value: resources.length }, { label: 'Active', value: activeRes }],                                                                                    action: 'Manage Resources' },
    { to: '/admin',         icon: '📋', title: 'Booking Management',   desc: 'Review, approve or reject campus resource booking requests.',                    color: 'indigo', stats: [{ label: 'Total', value: bookings.length }, { label: 'Pending', value: pending, highlight: pending > 0 }],                                                              action: 'Manage Bookings' },
    { to: '/tickets',       icon: '🎫', title: 'Incident Tickets',     desc: 'Track and resolve maintenance and incident reports across campus.',              color: 'orange', stats: [{ label: 'Total', value: tickets.length }, { label: 'Open', value: openTix, highlight: openTix > 0 }, { label: 'High Pri', value: highTix, highlight: highTix > 0 }],  action: 'Manage Tickets' },
    { to: '/analytics',     icon: '📊', title: 'Analytics & Reports',  desc: 'View booking trends, peak hours, top resources and status breakdown.',          color: 'purple', stats: [{ label: 'Approved', value: bookings.filter(b => b.status === 'APPROVED').length }, { label: 'Rejected', value: bookings.filter(b => b.status === 'REJECTED').length }], action: 'View Analytics' },
    { to: '/admin-users',   icon: '👥', title: 'User Management',      desc: 'Manage user roles — assign Admin, Technician or User permissions.',             color: 'green',  stats: [{ label: 'Total', value: users.length }, { label: 'Admins', value: users.filter(u => u.role === 'ADMIN').length }],                                                    action: 'Manage Users' },
    { to: '/notifications', icon: '🔔', title: 'Notifications',        desc: 'View and manage system notifications for bookings and ticket updates.',         color: 'yellow', stats: [],                                                                                                                                                                          action: 'View Notifications' },
  ];
 
  return (
    <div className="admin-dash">
      <div className="admin-dash-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name?.split(' ')[0] || 'Admin'} 👋 — manage all campus operations below.</p>
      </div>

      <div className="dash-stat-strip">
        <div className="dash-stat-tile indigo">
          <div><div className="tile-val">{bookings.length}</div><div className="tile-label">Total Bookings</div></div>
          <div className="tile-icon">📋</div>
        </div>
        <div className={`dash-stat-tile ${pending > 0 ? 'yellow' : 'indigo'}`}>
          <div><div className="tile-val">{pending}</div><div className="tile-label">Pending Approval</div></div>
          <div className="tile-icon">⏳</div>
        </div>
        <div className={`dash-stat-tile ${openTix > 0 ? 'orange' : 'indigo'}`}>
          <div><div className="tile-val">{openTix}</div><div className="tile-label">Open Tickets</div></div>
          <div className="tile-icon">🎫</div>
        </div>
        <div className="dash-stat-tile green">
          <div><div className="tile-val">{activeRes}</div><div className="tile-label">Active Resources</div></div>
          <div className="tile-icon">🏢</div>
        </div>
      </div>

      <div className="dash-cards-grid">
        {sections.map(s => (
          <div key={s.to} className={`dash-card ${s.color}`}>
            <div className="dash-card-top">
              <span className="dash-card-icon">{s.icon}</span>
              <span className="dash-card-title">{s.title}</span>
            </div>
            <p className="dash-card-desc">{s.desc}</p>
            {s.stats.length > 0 && (
              <div className="dash-mini-stats">
                {s.stats.map(st => (
                  <div key={st.label} className={`dash-mini-stat${st.highlight ? ' highlight' : ''}`}>
                    <div className="mini-val">{st.value}</div>
                    <div className="mini-label">{st.label}</div>
                  </div>
                ))}
              </div>
            )}
            <Link to={s.to} className="dash-card-btn">{s.action} →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
