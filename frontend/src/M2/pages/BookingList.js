import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBookings } from '../api/bookingApi';
import StatusBadge from '../components/StatusBadge';
import './BookingList.css';

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
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="booking-list-page">
      <div className="booking-list-header">
        <div>
          <h1>All Bookings</h1>
          <p>{bookings.length} booking(s) found</p>
        </div>
        <Link to="/book" className="btn-primary">+ New Booking</Link>
      </div>

      <div className="filter-tabs">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`filter-tab${filter === s ? ' active' : ''}`}>{s}</button>
        ))}
      </div>

      {loading && <p className="loading-msg">Loading...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!loading && !error && bookings.length === 0 && <p className="empty-msg">No bookings found.</p>}

      {!loading && !error && bookings.length > 0 && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {['ID','Resource','Email','Date','Time','Purpose','Attendees','Status',''].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td className="id-cell">#{b.id}</td>
                  <td>{b.resourceId}</td>
                  <td>{b.userEmail}</td>
                  <td>{b.bookingDate}</td>
                  <td>{b.startTime} – {b.endTime}</td>
                  <td className="truncate">{b.purpose}</td>
                  <td>{b.attendees}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td><Link to={`/bookings/${b.id}`} className="table-link">View</Link></td>
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
