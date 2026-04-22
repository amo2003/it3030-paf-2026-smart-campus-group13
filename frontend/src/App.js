import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './M2/components/Navbar';
import ChatBot from './M2/components/ChatBot';
import Home from './pages/Home';
import BookingList from './M2/pages/BookingList';
import BookingForm from './M2/pages/BookingForm';
import BookingDetail from './M2/pages/BookingDetail';
import MyBookings from './M2/pages/MyBookings';
import AdminPanel from './M2/pages/AdminPanel';
import CheckIn from './M2/pages/CheckIn';
import Analytics from './M2/pages/Analytics';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* booking manamgnet */}
          <Route path="/" element={<Home />} />
          <Route path="/bookings" element={<BookingList />} />
          <Route path="/bookings/:id" element={<BookingDetail />} />
          <Route path="/book" element={<BookingForm />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/checkin/:id" element={<CheckIn />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
        <ChatBot />
      </div>
    </Router>
import logo from './logo.svg';
import './App.css';
//Module1
import ResourceCatalogPage from "./M1/pages/ResourceCatalogPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage        from "./M4/pages/LoginPage";
import LoginSuccessPage from "./M4/pages/LoginSuccessPage";
import NotificationsPage from "./M4/pages/NotificationsPage";
import AdminUsersPage   from "./M4/pages/AdminUsersPage";
import "./M4/styles/theme.css";

/* Simple auth guard */
const RequireAuth = ({ children }) => {
  const user = localStorage.getItem("currentUser");
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/login-success" element={<LoginSuccessPage />} />
        <Route path="/profile"       element={<RequireAuth><LoginSuccessPage /></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />
        <Route path="/admin"         element={<RequireAuth><AdminUsersPage /></RequireAuth>} />
        <Route path="*"              element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
//Module1
return <ResourceCatalogPage />

}

export default App;