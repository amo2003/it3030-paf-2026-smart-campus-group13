import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ticketService from '../services/ticketService';
import './MyTicketsPage.css';

const STATUS_FILTERS = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

const STATUS_META = {
  OPEN:        { label: 'Open',        color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
  IN_PROGRESS: { label: 'In Progress', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  RESOLVED:    { label: 'Resolved',    color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  CLOSED:      { label: 'Closed',      color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' },
  REJECTED:    { label: 'Rejected',    color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
};

const PRIORITY_META = {
  HIGH:   { color: '#991b1b', bg: '#fee2e2' },
  MEDIUM: { color: '#92400e', bg: '#fef3c7' },
  LOW:    { color: '#065f46', bg: '#d1fae5' },
};

export default function MyTicketsPage() {
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [keyword, setKeyword]           = useState('');
  const [selected, setSelected]         = useState(null); // modal ticket

  useEffect(() => {
    ticketService.getAllTickets()
      .then(r => setAllTickets(r.data))
      .catch(() => setError('Failed to load tickets'))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    return allTickets.filter(t => {
      const statusMatch = statusFilter === 'ALL' || t.status === statusFilter;
      const kw = keyword.toLowerCase();
      const kwMatch = !kw ||
        t.title?.toLowerCase().includes(kw) ||
        t.description?.toLowerCase().includes(kw) ||
        t.resourceLocation?.toLowerCase().includes(kw) ||
        t.createdBy?.toLowerCase().includes(kw);
      return statusMatch && kwMatch;
    });
  }, [allTickets, statusFilter, keyword]);

  const stats = useMemo(() => ({
    total:      allTickets.length,
    open:       allTickets.filter(t => t.status === 'OPEN').length,
    inProgress: allTickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolved:   allTickets.filter(t => t.status === 'RESOLVED').length,
    closed:     allTickets.filter(t => t.status === 'CLOSED').length,
    rejected:   allTickets.filter(t => t.status === 'REJECTED').length,
  }), [allTickets]);

  const statusKey = s => s?.toLowerCase() || '';
  const sm = t => STATUS_META[t?.status] || STATUS_META.CLOSED;
  const pm = t => PRIORITY_META[t?.priority] || PRIORITY_META.LOW;

  // close modal on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="my-tickets-page">

      {/* Hero */}
      <div className="my-tickets-hero">
        <div className="my-tickets-hero-text">
          <h1>My Tickets</h1>
          <p>Track all submitted incident tickets · click any card to view details</p>
        </div>
        <div className="my-tickets-hero-actions">
          <Link to="/tickets/create" className="btn-create-ticket">+ New Ticket</Link>
        </div>
      </div>

      {/* Search */}
      <div className="mts-search-bar">
        <div className="mts-search-field" style={{ flex: 1 }}>
          <label>Search Tickets</label>
          <div className="mts-input-wrap">
            <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="1.5" viewBox="0 0 16 16">
              <circle cx="6.5" cy="6.5" r="4.5"/><line x1="10" y1="10" x2="14" y2="14"/>
            </svg>
            <input
              type="text"
              placeholder="Search by title, description, location or creator..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
            {keyword && <button className="mts-clear-btn" onClick={() => setKeyword('')}>×</button>}
          </div>
        </div>
      </div>

      {loading && <p className="state-msg">Loading tickets...</p>}
      {error   && <p className="state-msg" style={{ color: '#ef4444' }}>{error}</p>}

      {!loading && !error && (
        <>
          {/* Stats */}
          <div className="my-tickets-stats">
            {[
              { label: 'Total',       val: stats.total,      cls: 'total'  },
              { label: 'Open',        val: stats.open,       cls: 'open'   },
              { label: 'In Progress', val: stats.inProgress, cls: 'prog'   },
              { label: 'Resolved',    val: stats.resolved,   cls: 'res'    },
              { label: 'Closed',      val: stats.closed,     cls: 'closed' },
              { label: 'Rejected',    val: stats.rejected,   cls: 'rej'    },
            ].map(s => (
              <div key={s.label} className={`mts-stat ${s.cls}`}>
                <div className="mts-stat-val">{s.val}</div>
                <div className="mts-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Status filter tabs */}
          <div className="my-tickets-filters">
            {STATUS_FILTERS.map(f => (
              <button key={f}
                className={`mts-filter-btn${statusFilter === f ? ' active' : ''}`}
                onClick={() => setStatusFilter(f)}>
                {f === 'ALL' ? 'All Statuses' : f.replace('_', ' ')}
              </button>
            ))}
          </div>

          {keyword && (
            <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>
              {visible.length} result{visible.length !== 1 ? 's' : ''} for "{keyword}"
            </p>
          )}

          {/* Empty */}
          {visible.length === 0 && (
            <div className="my-tickets-empty">
              <div className="empty-icon">🎫</div>
              <h3>No tickets found</h3>
              <p>
                {keyword
                  ? `No tickets match "${keyword}".`
                  : statusFilter !== 'ALL'
                    ? `No tickets with status "${statusFilter}".`
                    : 'No tickets have been created yet.'}
              </p>
              <Link to="/tickets/create" className="btn-create-ticket">Create a Ticket</Link>
            </div>
          )}

          {/* Cards — div not Link, opens modal */}
          {visible.length > 0 && (
            <div className="my-tickets-grid">
              {visible.map(t => {
                const s = STATUS_META[t.status] || STATUS_META.CLOSED;
                const p = PRIORITY_META[t.priority] || PRIORITY_META.LOW;
                return (
                  <div
                    key={t.id}
                    className={`mt-card ${statusKey(t.status)}`}
                    onClick={() => setSelected(t)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setSelected(t)}
                  >
                    <div className="mt-card-top">
                      <div>
                        <div className="mt-card-title">{t.title}</div>
                        <div className="mt-card-id">#{t.id} · by {t.createdBy || '—'}</div>
                      </div>
                      <span className="mt-badge" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                        {t.status?.replace('_', ' ')}
                      </span>
                    </div>

                    {t.description && <p className="mt-card-desc">{t.description}</p>}

                    <div className="mt-card-meta">
                      <span className="mt-meta-pill">{t.category}</span>
                      <span className="mt-meta-pill" style={{ background: p.bg, color: p.color }}>{t.priority}</span>
                      {t.resourceLocation && <span className="mt-meta-pill">📍 {t.resourceLocation}</span>}
                    </div>

                    <div className="mt-card-footer">
                      <span>{t.assignedTechnician ? `🔧 ${t.assignedTechnician}` : '🔧 Not assigned'}</span>
                      <span className="view-link">View Details →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── Ticket Detail Modal ── */}
      {selected && (
        <div className="tkt-modal-overlay" onClick={() => setSelected(null)}>
          <div className="tkt-modal" onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div className="tkt-modal-header" style={{ borderLeftColor: sm(selected).color }}>
              <div className="tkt-modal-header-left">
                <span className="tkt-modal-id">Ticket #{selected.id}</span>
                <h2 className="tkt-modal-title">{selected.title}</h2>
              </div>
              <button className="tkt-modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            {/* Status banner */}
            <div className="tkt-modal-status-banner"
              style={{ background: sm(selected).bg, borderColor: sm(selected).border }}>
              <div className="tkt-status-dot" style={{ background: sm(selected).color }} />
              <span style={{ color: sm(selected).color, fontWeight: 700, fontSize: 13 }}>
                {selected.status?.replace('_', ' ')}
              </span>
              <span className="tkt-modal-priority"
                style={{ background: pm(selected).bg, color: pm(selected).color }}>
                {selected.priority}
              </span>
              <span className="tkt-modal-category">{selected.category}</span>
            </div>

            {/* Info rows */}
            <div className="tkt-modal-body">
              {[
                { icon: '📝', label: 'Description',        value: selected.description },
                { icon: '📍', label: 'Location',           value: selected.resourceLocation },
                { icon: '👤', label: 'Created By',         value: selected.createdBy },
                { icon: '📞', label: 'Preferred Contact',  value: selected.preferredContact },
                { icon: '🔧', label: 'Assigned Technician',value: selected.assignedTechnician || 'Not assigned yet' },
                { icon: '✅', label: 'Resolution Notes',   value: selected.resolutionNotes },
                { icon: '❌', label: 'Rejection Reason',   value: selected.rejectionReason },
              ].filter(r => r.value).map(r => (
                <div key={r.label} className="tkt-modal-row">
                  <span className="tkt-modal-row-icon">{r.icon}</span>
                  <div className="tkt-modal-row-content">
                    <span className="tkt-modal-row-label">{r.label}</span>
                    <span className="tkt-modal-row-value"
                      style={r.label === 'Rejection Reason' ? { color: '#dc2626' } :
                             r.label === 'Resolution Notes'  ? { color: '#16a34a' } : {}}>
                      {r.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="tkt-modal-footer">
              <button className="tkt-modal-close-btn" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
