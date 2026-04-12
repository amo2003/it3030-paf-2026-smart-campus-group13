import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './M2/components/Navbar';
import Home from './pages/Home';
import BookingList from './M2/pages/BookingList';
import BookingForm from './M2/pages/BookingForm';
import BookingDetail from './M2/pages/BookingDetail';
import MyBookings from './M2/pages/MyBookings';
import AdminPanel from './M2/pages/AdminPanel';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bookings" element={<BookingList />} />
          <Route path="/bookings/:id" element={<BookingDetail />} />
          <Route path="/book" element={<BookingForm />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
