import React, { useEffect, useState } from 'react';
import { getAllBookings, approveBooking, rejectBooking, cancelBooking, deleteBooking } from '../api/bookingApi';
import StatusBadge from '../components/StatusBadge';

const TABS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

function AdminPanel() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = () => {
    setLoading(true);
    getAllBookings(tab === 'ALL' ? null : tab)
      .then(setBookings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, [tab]);

  const handleApprove = async (id) => {
    setActionLoading(true);
    try { await approveBooking(id); fetchBookings(); }
    catch (e) { alert(e.message); }
    finally { setActionLoading(false); }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return alert('Please enter a rejection reason.');
    setActionLoading(true);
    try { await rejectBooking(rejectModal, rejectReason); setRejectModal(null); setRejectReason(''); fetchBookings(); }
    catch (e) { alert(e.message); }
    finally { setActionLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    setActionLoading(true);
    try { await cancelBooking(id); fetchBookings(); }
    catch (e) { alert(e.message); }
    finally { setActionLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking permanently?')) return;
    setActionLoading(true);
    try { await deleteBooking(id); fetchBookings(); }
    catch (e) { alert(e.message); }
    finally { setActionLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
      <p className="text-gray-500 mb-8">Manage all campus resource bookings.</p>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              tab === t ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-400 text-center py-12">Loading...</p>}
      {error && <p className="text-red-500 text-center py-12">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-gray-500">No bookings found.</p>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="overflow-x-auto rounded-2xl shadow-sm">
          <table className="w-full bg-white text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                {['ID', 'Resource', 'Email', 'Date', 'Time', 'Purpose', 'Attendees', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">#{b.id}</td>
                  <td className="px-4 py-3 text-gray-600">{b.resourceId}</td>
                  <td className="px-4 py-3 text-gray-600">{b.userEmail}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{b.bookingDate}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{b.startTime} – {b.endTime}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{b.purpose}</td>
                  <td className="px-4 py-3 text-gray-600">{b.attendees}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {b.status === 'PENDING' && (
                        <>
                          <button onClick={() => handleApprove(b.id)} disabled={actionLoading}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-green-600 disabled:opacity-50">
                            Approve
                          </button>
                          <button onClick={() => { setRejectModal(b.id); setRejectReason(''); }} disabled={actionLoading}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-600 disabled:opacity-50">
                            Reject
                          </button>
                        </>
                      )}
                      {b.status === 'APPROVED' && (
                        <button onClick={() => handleCancel(b.id)} disabled={actionLoading}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-yellow-600 disabled:opacity-50">
                          Cancel
                        </button>
                      )}
                      <button onClick={() => handleDelete(b.id)} disabled={actionLoading}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-gray-300 disabled:opacity-50">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Reject Booking #{rejectModal}</h2>
            <textarea rows={3} placeholder="Enter rejection reason..."
              value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 mb-4" />
            <div className="flex gap-3">
              <button onClick={handleReject} disabled={actionLoading}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-600 disabled:opacity-50">
                Confirm Reject
              </button>
              <button onClick={() => setRejectModal(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
