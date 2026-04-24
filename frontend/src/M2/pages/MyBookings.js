import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBookingsByUser } from '../api/bookingApi';
import StatusBadge from '../components/StatusBadge';
import './MyBookings.css';

function MyBookings() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  // pre-fill with logged-in user's ID
  const [userId, setUserId]         = useState(currentUser?.id ? String(currentUser.id) : '');
  const [searching, setSearching]   = useState(false);
  const [isMyView, setIsMyView]     = useState(!!currentUser?.id);

  // on mount: load current user's bookings automatically
  useEffect(() => {
    if (currentUser?.id) {
      loadByUser(currentUser.id);
    } else {
      // no logged-in user — show empty
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadByUser = (id) => {
    setLoading(true); setError('');
    getBookingsByUser(id)
      .then(setBookings)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      // if cleared, go back to current user's bookings
      if (currentUser?.id) {
        setIsMyView(true);
        loadByUser(currentUser.id);
      }
      return;
    }
    setSearching(true); setError('');
    setIsMyView(String(userId) === String(currentUser?.id));
    try { setBookings(await getBookingsByUser(userId)); }
    catch (err) { setError(err.message); }
    finally { setSearching(false); }
  };

  const handleClear = () => {
    setUserId(currentUser?.id ? String(currentUser.id) : '');
    setIsMyView(!!currentUser?.id);
    if (currentUser?.id) {
      loadByUser(currentUser.id);
    } else {
      setBookings([]);
    }
  };

  return (
    <div className="mybookings-page">

      {/* Hero */}
      <div className="mybookings-hero">
        <div className="mybookings-hero-text">
          <div className="mybookings-hero-badge">📋 Booking Management</div>
          <h1>{isMyView ? 'My Bookings' : `Bookings for User #${userId}`}</h1>
          <p>
            {isMyView && currentUser?.name
              ? `Showing all bookings for ${currentUser.name}`
              : 'View and manage campus resource reservations'}
          </p>
        </div>
        <Link to="/reslist" style={{
          background: '#fff', color: '#4f46e5', fontWeight: 800, fontSize: 13,
          padding: '11px 22px', borderRadius: 12, textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(0,0,0,.15)',
          display: 'inline-block', zIndex: 1, position: 'relative',
        }}>+ New Booking</Link>
      </div>

      {/* Search — only show for admins or if they want to look up another user */}
      <form className="mybookings-search" onSubmit={handleSearch}>
        <span className="mybookings-search-label">Filter by User ID</span>
        <div className="mybookings-search-wrap">
          <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="1.5" viewBox="0 0 16 16">
            <circle cx="8" cy="5.5" r="3"/><path d="M2 14c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/>
          </svg>
          <input
            type="number"
            placeholder={currentUser?.id ? `Your ID: ${currentUser.id}` : 'Enter User ID...'}
            value={userId}
            onChange={e => setUserId(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-search" disabled={searching}>
          {searching ? 'Searching...' : '🔍 Search'}
        </button>
        {String(userId) !== String(currentUser?.id) && (
          <button type="button" className="btn-clear" onClick={handleClear}>
            ↩ My Bookings
          </button>
        )}
      </form>

      {loading && <p className="state-msg">Loading bookings...</p>}
      {error   && <p className="state-msg error">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <div className="mybookings-empty">
          <div className="empty-icon">📭</div>
          <h3>No bookings found</h3>
          <p>
            {isMyView
              ? "You haven't made any bookings yet."
              : `No bookings found for User ID ${userId}.`}
          </p>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <>
          <p className="mybookings-count">{bookings.length} booking(s) found</p>
          <div className="bookings-grid">
            {bookings.map(b => (
              <div key={b.id} className="booking-card">
                <div className={`booking-card-accent ${b.status}`} />
                <div className="booking-card-inner">
                  <div className="booking-card-header">
                    <span className="booking-card-id">{b.id}</span>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="booking-card-meta">
                    <div className="booking-card-meta-row">
                      <span className="meta-icon">📅</span>
                      <span className="meta-val">{b.bookingDate}</span>
                    </div>
                    <div className="booking-card-meta-row">
                      <span className="meta-icon">⏰</span>
                      <span className="meta-val">{b.startTime} – {b.endTime}</span>
                    </div>
                    <div className="booking-card-meta-row">
                      <span className="meta-icon">🏢</span>
                      Resource: <span className="meta-val">{b.resourceId}</span>
                    </div>
                    <div className="booking-card-meta-row">
                      <span className="meta-icon">📝</span>
                      <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.purpose}</span>
                    </div>
                  </div>
                  {b.rejectionReason && (
                    <div className="booking-card-reject">❌ {b.rejectionReason}</div>
                  )}
                  <div className="booking-card-footer">
                    <span style={{fontSize:11,color:'#94a3b8'}}>#{b.id}</span>
                    <Link to={`/bookings/${b.id}`} className="booking-card-link">
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default MyBookings;
