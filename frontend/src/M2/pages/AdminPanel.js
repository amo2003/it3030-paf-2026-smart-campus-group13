import React, { useEffect, useState } from 'react';
import { getAllBookings, approveBooking, rejectBooking, cancelBooking, deleteBooking } from '../api/bookingApi';
import StatusBadge from '../components/StatusBadge';
import './AdminPanel.css';

const TABS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

function AdminPanel() {
  const [bookings, setBookings]       = useState([]);
  const [tab, setTab]                 = useState('ALL');
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = React.useCallback(() => {
    setLoading(true);
    getAllBookings(tab === 'ALL' ? null : tab)
      .then(setBookings).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [tab]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleApprove = async (id) => {
    setActionLoading(true);
    try { await approveBooking(id); fetchBookings(); }
    catch (e) { alert(e.message); } finally { setActionLoading(false); }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return alert('Please enter a rejection reason.');
    setActionLoading(true);
    try { await rejectBooking(rejectModal, rejectReason); setRejectModal(null); setRejectReason(''); fetchBookings(); }
    catch (e) { alert(e.message); } finally { setActionLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    setActionLoading(true);
    try { await cancelBooking(id); fetchBookings(); }
    catch (e) { alert(e.message); } finally { setActionLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking permanently?')) return;
    setActionLoading(true);
    try { await deleteBooking(id); fetchBookings(); }
    catch (e) { alert(e.message); } finally { setActionLoading(false); }
  };

  return (
    <div className="admin-panel-page">

      {/* Hero */}
      <div className="admin-panel-hero">
        <div className="admin-panel-hero-text">
          <div className="admin-panel-hero-badge">⚙️ Admin Control</div>
          <h1>Booking Management</h1>
          <p>Review, approve or reject all campus resource booking requests</p>
        </div>
        <div style={{ zIndex: 1, position: 'relative' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#fff' }}>{bookings.length}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>Total Bookings</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`tab-btn${tab === t ? ' active ' + t : ''}`}>
            {t === 'ALL' ? '📋 All' :
             t === 'PENDING'   ? '⏳ Pending' :
             t === 'APPROVED'  ? '✅ Approved' :
             t === 'REJECTED'  ? '❌ Rejected' : '🚫 Cancelled'}
          </button>
        ))}
      </div>

      {loading && <p className="state-msg">Loading bookings...</p>}
      {error && (
        <div style={{
          background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 14,
          padding: '18px 22px', display: 'flex', gap: 14, alignItems: 'flex-start',
          marginBottom: 20,
        }}>
          <span style={{ fontSize: 24 }}>🔌</span>
          <div>
            <div style={{ fontWeight: 800, color: '#b91c1c', fontSize: 14, marginBottom: 4 }}>
              Cannot connect to backend
            </div>
            <div style={{ color: '#dc2626', fontSize: 13 }}>{error}</div>
            <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 6 }}>
              Make sure the Spring Boot server is running on <strong>http://localhost:8080</strong>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="admin-empty">
          <div className="empty-icon">📭</div>
          <p>No bookings found for this filter.</p>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {['ID','Resource','Email','Date','Time','Purpose','Attendees','Status','Actions'].map(h => (
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
                  <td style={{ whiteSpace: 'nowrap' }}>{b.bookingDate}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{b.startTime} – {b.endTime}</td>
                  <td className="truncate-cell">{b.purpose}</td>
                  <td>{b.attendees}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>
                    <div className="action-btns">
                      {b.status === 'PENDING' && (
                        <>
                          <button className="act-btn approve" onClick={() => handleApprove(b.id)} disabled={actionLoading}>✓ Approve</button>
                          <button className="act-btn reject"  onClick={() => { setRejectModal(b.id); setRejectReason(''); }} disabled={actionLoading}>✕ Reject</button>
                        </>
                      )}
                      {b.status === 'APPROVED' && (
                        <button className="act-btn cancel" onClick={() => handleCancel(b.id)} disabled={actionLoading}>⊘ Cancel</button>
                      )}
                      <button className="act-btn delete" onClick={() => handleDelete(b.id)} disabled={actionLoading}>🗑</button>
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
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-header-icon">❌</div>
              <div>
                <h2>Reject Booking #{rejectModal}</h2>
                <p>This action will notify the user by email</p>
              </div>
            </div>
            <div className="modal-body">
              <label>Rejection Reason</label>
              <textarea
                rows={3} placeholder="Enter a clear reason for rejection..."
                value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              />
              <div className="modal-actions">
                <button className="modal-btn-confirm" onClick={handleReject} disabled={actionLoading}>
                  {actionLoading ? 'Rejecting...' : '✕ Confirm Reject'}
                </button>
                <button className="modal-btn-cancel" onClick={() => setRejectModal(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
