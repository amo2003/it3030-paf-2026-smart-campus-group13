import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBookingById, cancelBooking, deleteBooking } from '../api/bookingApi';
import StatusBadge from '../components/StatusBadge';

function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getBookingById(id).then(setBooking).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this booking?')) return;
    setActionLoading(true);
    try { setBooking(await cancelBooking(id)); }
    catch (e) { alert(e.message); }
    finally { setActionLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this booking permanently?')) return;
    setActionLoading(true);
    try { await deleteBooking(id); navigate('/bookings'); }
    catch (e) { alert(e.message); setActionLoading(false); }
  };

  if (loading) return <p className="text-center py-20 text-gray-400">Loading...</p>;
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;
  if (!booking) return null;

  const rows = [
    ['Booking ID', `#${booking.id}`],
    ['Resource ID', booking.resourceId],
    ['User ID', booking.userId],
    ['Email', booking.userEmail],
    ['Date', booking.bookingDate],
    ['Time', `${booking.startTime} – ${booking.endTime}`],
    ['Purpose', booking.purpose],
    ['Attendees', booking.attendees],
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <button onClick={() => navigate(-1)} className="text-indigo-600 text-sm mb-6 hover:underline">← Back</button>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Booking #{booking.id}</h1>
        <StatusBadge status={booking.status} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            {rows.map(([label, value]) => (
              <tr key={label}>
                <td className="px-6 py-3 text-gray-500 font-medium w-40">{label}</td>
                <td className="px-6 py-3 text-gray-800">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {booking.rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-6 text-sm text-red-700">
          <span className="font-semibold">Rejection Reason:</span> {booking.rejectionReason}
        </div>
      )}

      <div className="flex gap-3">
        {booking.status === 'APPROVED' && (
          <>
            <Link to={`/checkin/${booking.id}`}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
              📱 QR Check-In
            </Link>
            <button onClick={handleCancel} disabled={actionLoading}
              className="bg-yellow-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition disabled:opacity-50">
              Cancel Booking
            </button>
          </>
        )}
        <button onClick={handleDelete} disabled={actionLoading}
          className="bg-red-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50">
          Delete
        </button>
      </div>
    </div>
  );
}

export default BookingDetail;
