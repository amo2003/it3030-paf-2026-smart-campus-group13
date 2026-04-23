import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Auth guard
import RequireAuth from './components/RequireAuth';

// Module 2 – Booking Management
import Navbar from './M2/components/Navbar';
import ChatBot from './M2/components/ChatBot';
import Home from './pages/Home';
import BookingForm from './M2/pages/BookingForm';
import BookingDetail from './M2/pages/BookingDetail';
import MyBookings from './M2/pages/MyBookings';
import AdminPanel from './M2/pages/AdminPanel';
import CheckIn from './M2/pages/CheckIn';
import Analytics from './M2/pages/Analytics';
import AdminDashboard from './M2/pages/AdminDashboard';
import ResourcesPage from './M2/pages/ResourcesPage';

// Module 3 – Incident Ticketing
import TicketListPage from './M3/pages/TicketListPage';
import CreateTicketPage from './M3/pages/CreateTicketPage';
import TicketDetailsPage from './M3/pages/TicketDetailsPage';
import MyTicketsPage from './M3/pages/MyTicketsPage';

// Module 1 – Resource Catalogue
import ResourceCatalogPage from './M1/pages/ResourceCatalogPage';

// Module 4 – Auth & Notifications
import LoginPage from './M4/pages/LoginPage';
import LoginSuccessPage from './M4/pages/LoginSuccessPage';
import NotificationsPage from './M4/pages/NotificationsPage';
import AdminUsersPage from './M4/pages/AdminUsersPage';

// M4 pages use their own sidebar Layout — hide top Navbar for them
const M4_PATHS = ['/login', '/login-success', '/profile', '/notifications', '/admin-users'];

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const { pathname } = useLocation();
  const hideNavbar = M4_PATHS.some(p => pathname.startsWith(p));

  return (
    <div className="min-h-screen">
      {!hideNavbar && <Navbar />}
      <Routes>

        {/* ── Public ── */}
        <Route path="/"             element={<Home />} />
        <Route path="/login"        element={<LoginPage />} />
        <Route path="/login-success" element={<LoginSuccessPage />} />

        {/* ── Module 2 — protected ── */}
        <Route path="/book"         element={<RequireAuth><BookingForm /></RequireAuth>} />
        <Route path="/bookings/:id" element={<RequireAuth><BookingDetail /></RequireAuth>} />
        <Route path="/my-bookings"  element={<RequireAuth><MyBookings /></RequireAuth>} />
        <Route path="/admin"        element={<RequireAuth><AdminPanel /></RequireAuth>} />
        <Route path="/admind"       element={<RequireAuth><AdminDashboard /></RequireAuth>} />
        <Route path="/checkin/:id"  element={<RequireAuth><CheckIn /></RequireAuth>} />
        <Route path="/analytics"    element={<RequireAuth><Analytics /></RequireAuth>} />
        <Route path="/reslist"      element={<RequireAuth><ResourcesPage /></RequireAuth>} />

        {/* ── Module 3 — protected ── */}
        <Route path="/tickets"        element={<RequireAuth><TicketListPage /></RequireAuth>} />
        <Route path="/tickets/create" element={<RequireAuth><CreateTicketPage /></RequireAuth>} />
        <Route path="/tickets/my"     element={<RequireAuth><MyTicketsPage /></RequireAuth>} />
        <Route path="/tickets/:id"    element={<RequireAuth><TicketDetailsPage /></RequireAuth>} />

        {/* ── Module 1 — protected ── */}
        <Route path="/resources"    element={<RequireAuth><ResourceCatalogPage /></RequireAuth>} />

        {/* ── Module 4 — protected ── */}
        <Route path="/profile"       element={<RequireAuth><LoginSuccessPage /></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />
        <Route path="/admin-users"   element={<RequireAuth><AdminUsersPage /></RequireAuth>} />

      </Routes>
      {!hideNavbar && <ChatBot />}
    </div>
  );
}

export default App;
