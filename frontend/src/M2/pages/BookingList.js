import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBookings } from '../api/bookingApi';
import StatusBadge from '../components/StatusBadge';

const STATUSES = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getAllBookings(filter === 'ALL' ? null : filter)
      .then(setBookings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">All Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">{bookings.length} booking(s) found</p>
        </div>
        <Link to="/book" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
          + New Booking
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{s}</button>
        ))}
      </div>

      {loading && <p className="text-gray-400 text-center py-12">Loading...</p>}
      {error && <p className="text-red-500 text-center py-12">{error}</p>}
      {!loading && !error && bookings.length === 0 && <p className="text-gray-400 text-center py-12">No bookings found.</p>}

      {!loading && !error && bookings.length > 0 && (
        <div className="overflow-x-auto rounded-2xl shadow-sm">
          <table className="w-full bg-white text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                {['ID', 'Resource', 'Email', 'Date', 'Time', 'Purpose', 'Attendees', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">#{b.id}</td>
                  <td className="px-4 py-3 text-gray-600">{b.resourceId}</td>
                  <td className="px-4 py-3 text-gray-600">{b.userEmail}</td>
                  <td className="px-4 py-3 text-gray-600">{b.bookingDate}</td>
                  <td className="px-4 py-3 text-gray-600">{b.startTime} – {b.endTime}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{b.purpose}</td>
                  <td className="px-4 py-3 text-gray-600">{b.attendees}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    <Link to={`/bookings/${b.id}`} className="text-indigo-600 hover:underline text-xs">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BookingList;
