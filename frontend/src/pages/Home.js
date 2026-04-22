import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '📅', title: 'Easy Booking', desc: 'Reserve campus resources in seconds with a simple form.' },
  { icon: '✅', title: 'Admin Approval', desc: 'Bookings go through an approval workflow for fair access.' },
  { icon: '📧', title: 'Email Notifications', desc: 'Get notified instantly when your booking is approved or rejected.' },
  { icon: '🔍', title: 'Track Status', desc: 'Check your booking status anytime — pending, approved, or cancelled.' },
];

function Home() {
  return (
    <div>
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Smart Campus Booking</h1>
        <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
          Reserve lecture halls, labs, and meeting rooms on campus — fast, simple, and transparent.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/book" className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full shadow hover:bg-indigo-50 transition">
            Book a Resource
          </Link>
          <Link to="/bookings" className="border border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-indigo-600 transition">
            View All Bookings
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-indigo-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/book" className="bg-indigo-600 text-white rounded-xl py-6 px-4 font-semibold hover:bg-indigo-700 transition">
              + New Booking
            </Link>
            <Link to="/my-bookings" className="bg-white text-indigo-600 border border-indigo-200 rounded-xl py-6 px-4 font-semibold hover:bg-indigo-50 transition">
              My Bookings
            </Link>
            <Link to="/admin" className="bg-white text-purple-600 border border-purple-200 rounded-xl py-6 px-4 font-semibold hover:bg-purple-50 transition">
              Admin Panel
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-gray-400 text-center py-6 text-sm">
        © {new Date().getFullYear()} Smart Campus. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
