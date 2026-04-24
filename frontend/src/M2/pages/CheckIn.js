import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { getBookingById } from '../api/bookingApi';
import './CheckIn.css';

function CheckIn() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getBookingById(id).then(setBooking).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="state-msg">Loading...</p>;
  if (error)   return <p className="state-msg error">{error}</p>;
  if (!booking) return null;

  const isApproved = booking.status === 'APPROVED';
  const qrValue = `BOOKING-${booking.id}|USER-${booking.userId}|RESOURCE-${booking.resourceId}|DATE-${booking.bookingDate}|${booking.startTime}-${booking.endTime}`;

  return (
    <div className="checkin-page">
      <button className="checkin-back" onClick={() => navigate(-1)}>← Back</button>

      <div className={`checkin-card ${isApproved ? 'approved' : 'rejected'}`}>
        <div className="checkin-status-icon">{isApproved ? '✅' : '❌'}</div>

        <h1 className="checkin-title">
          {isApproved ? 'Check-In Approved' : 'Check-In Not Available'}
        </h1>
        <p className="checkin-desc">
          {isApproved
            ? 'Your booking is confirmed. Show this QR code at the venue.'
            : `This booking is currently ${booking.status}. Only approved bookings can check in.`}
        </p>

        <div className="checkin-info-box">
          <div className="checkin-info-row"><strong>Booking ID:</strong> #{booking.id}</div>
          <div className="checkin-info-row"><strong>Resource:</strong> {booking.resourceId}</div>
          <div className="checkin-info-row"><strong>Date:</strong> {booking.bookingDate}</div>
          <div className="checkin-info-row"><strong>Time:</strong> {booking.startTime} – {booking.endTime}</div>
          <div className="checkin-info-row"><strong>Purpose:</strong> {booking.purpose}</div>
          <div className="checkin-info-row"><strong>Email:</strong> {booking.userEmail}</div>
        </div>

        {isApproved && (
          <div className="checkin-qr-wrap">
            <div className="checkin-qr-box">
              <QRCodeSVG value={qrValue} size={180} />
            </div>
            <p className="checkin-qr-hint">Scan to verify booking at the venue</p>
          </div>
        )}

        {!isApproved && booking.rejectionReason && (
          <p className="checkin-reject-reason">Reason: {booking.rejectionReason}</p>
        )}
      </div>
    </div>
  );
}

export default CheckIn;
