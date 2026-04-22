import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { getBookingById } from '../api/bookingApi';

function CheckIn() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getBookingById(id)
      .then(setBooking)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-20 text-gray-400">Loading...</p>;
  if (error)   return <p className="text-center py-20 text-red-500">{error}</p>;
  if (!booking) return null;

  const isApproved = booking.status === 'APPROVED';
  const qrValue = `BOOKING-${booking.id}|USER-${booking.userId}|RESOURCE-${booking.resourceId}|DATE-${booking.bookingDate}|${booking.startTime}-${booking.endTime}`;

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <button onClick={() => navigate(-1)} className="text-indigo-600 text-sm mb-6 hover:underline">← Back</button>

      <div className={`rounded-2xl border-2 p-8 text-center ${isApproved ? 'border-green-400 bg-green-50' : 'border-red-300 bg-red-50'}`}>

        {/* Status icon */}
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl ${isApproved ? 'bg-green-100' : 'bg-red-100'}`}>
          {isApproved ? '✅' : '❌'}
        </div>

        <h1 className={`text-2xl font-bold mb-1 ${isApproved ? 'text-green-700' : 'text-red-700'}`}>
          {isApproved ? 'Check-In Approved' : 'Check-In Not Available'}
        </h1>
        <p className={`text-sm mb-6 ${isApproved ? 'text-green-600' : 'text-red-500'}`}>
          {isApproved
            ? 'Your booking is confirmed. Show this QR code at the venue.'
            : `This booking is currently ${booking.status}. Only approved bookings can check in.`}
        </p>

        {/* Booking info */}
        <div className="bg-white rounded-xl p-4 text-left text-sm text-gray-600 space-y-1 mb-6">
          <p><span className="font-medium text-gray-800">Booking ID:</span> #{booking.id}</p>
          <p><span className="font-medium text-gray-800">Resource:</span> {booking.resourceId}</p>
          <p><span className="font-medium text-gray-800">Date:</span> {booking.bookingDate}</p>
          <p><span className="font-medium text-gray-800">Time:</span> {booking.startTime} – {booking.endTime}</p>
          <p><span className="font-medium text-gray-800">Purpose:</span> {booking.purpose}</p>
          <p><span className="font-medium text-gray-800">Email:</span> {booking.userEmail}</p>
        </div>

        {/* QR Code — only for approved */}
        {isApproved && (
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white p-4 rounded-xl shadow-sm inline-block">
              <QRCodeSVG value={qrValue} size={180} />
            </div>
            <p className="text-xs text-gray-400">Scan to verify booking at the venue</p>
          </div>
        )}

        {!isApproved && booking.rejectionReason && (
          <p className="text-xs text-red-400 mt-2">Reason: {booking.rejectionReason}</p>
        )}
      </div>
    </div>
  );
}

export default CheckIn;
