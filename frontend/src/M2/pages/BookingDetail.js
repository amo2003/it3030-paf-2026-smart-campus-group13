import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBookingById, cancelBooking, deleteBooking } from '../api/bookingApi';
import { addLocalNotification } from '../../M4/services/localNotifications';
import './BookingDetail.css';

const STATUS_ICONS = { PENDING: '⏳', APPROVED: '✅', REJECTED: '❌', CANCELLED: '🚫' };

const INFO_ROWS = (b) => [
  { icon: '🔖', label: 'Booking ID',  value: `#${b.id}`,                      highlight: true },
  { icon: '🏢', label: 'Resource ID', value: b.resourceId },
  { icon: '👤', label: 'User ID',     value: b.userId },
  { icon: '📧', label: 'Email',       value: b.userEmail },
  { icon: '📅', label: 'Date',        value: b.bookingDate },
  { icon: '⏰', label: 'Time',        value: `${b.startTime} – ${b.endTime}` },
  { icon: '📝', label: 'Purpose',     value: b.purpose },
  { icon: '👥', label: 'Attendees',   value: b.attendees },
];

function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking]             = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getBookingById(id)
      .then(setBooking)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this booking?')) return;
    setActionLoading(true);
    try {
      const updated = await cancelBooking(id);
      setBooking(updated);
      addLocalNotification(
        'BOOKING_CANCELLED',
        'Booking Cancelled',
        `Booking #${id} for Resource ${booking.resourceId} on ${booking.bookingDate} has been cancelled.`
      );
    }
    catch (e) { alert(e.message); }
    finally { setActionLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this booking permanently?')) return;
    setActionLoading(true);
    try {
      await deleteBooking(id);
      addLocalNotification(
        'BOOKING_DELETED',
        'Booking Deleted',
        `Booking #${id} for Resource ${booking.resourceId} on ${booking.bookingDate} has been permanently deleted.`
      );
      navigate('/');
    }
    catch (e) { alert(e.message); setActionLoading(false); }
  };

  if (loading) return <div className="booking-detail-page"><div className="bd-state loading">Loading booking details...</div></div>;
  if (error)   return <div className="booking-detail-page"><div className="bd-state error">{error}</div></div>;
  if (!booking) return null;

  const status = booking.status || 'PENDING';

  return (
    <div className="booking-detail-page">

      <button className="bd-back" onClick={() => navigate(-1)}>Back</button>

      <div className="bd-hero">
        <div className="bd-hero-inner">
          <div>
            <div className="bd-hero-id">Booking Reference</div>
            <div className="bd-hero-title">#{booking.id}</div>
            <div className="bd-hero-meta">
              <div className="bd-hero-meta-item">📅 <strong>{booking.bookingDate}</strong></div>
              <div className="bd-hero-meta-item">⏰ <strong>{booking.startTime} – {booking.endTime}</strong></div>
              <div className="bd-hero-meta-item">🏢 Resource <strong>{booking.resourceId}</strong></div>
            </div>
          </div>
          <div className={`bd-status-pill ${status}`}>
            <span className="bd-status-dot" />
            {STATUS_ICONS[status]} {status}
          </div>
        </div>
      </div>

      {booking.rejectionReason && (
        <div className="bd-rejection-box">
          <div className="bd-rejection-icon">❌</div>
          <div>
            <div className="bd-rejection-label">Rejection Reason</div>
            <div className="bd-rejection-text">{booking.rejectionReason}</div>
          </div>
        </div>
      )}

      <div className="bd-info-card">
        <div className="bd-info-card-header">
          <div className="bd-info-card-icon">📋</div>
          <h3>Booking Information</h3>
        </div>
        <div className="bd-info-rows">
          {INFO_ROWS(booking).map(row => (
            <div key={row.label} className="bd-info-row">
              <div className="bd-info-row-icon">{row.icon}</div>
              <div className="bd-info-row-label">{row.label}</div>
              <div className={`bd-info-row-value${row.highlight ? ' highlight' : ''}`}>{row.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bd-actions">
        <div className="bd-actions-label">Actions</div>
        {status === 'APPROVED' && (
          <>
            <Link to={`/checkin/${booking.id}`} className="bd-btn bd-btn-qr">📱 QR Check-In</Link>
            <button onClick={handleCancel} disabled={actionLoading} className="bd-btn bd-btn-cancel">
              Cancel Booking
            </button>
          </>
        )}
        <button onClick={handleDelete} disabled={actionLoading} className="bd-btn bd-btn-delete">
          Delete Booking
        </button>
      </div>

    </div>
  );
}

export default BookingDetail;
