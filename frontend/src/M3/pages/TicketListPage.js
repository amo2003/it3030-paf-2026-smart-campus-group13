import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ticketService from '../services/ticketService';
import './TicketListPage.css';

function TicketListPage() {
  const [tickets, setTickets]             = useState([]);
  const [error, setError]                 = useState('');
  const [statusFilter, setStatusFilter]   = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchTerm, setSearchTerm]       = useState('');

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async () => {
    try { const r = await ticketService.getAllTickets(); setTickets(r.data); }
    catch { setError('Failed to load tickets'); }
  };

  const dashboard = useMemo(() => ({
    total:      tickets.length,
    open:       tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolved:   tickets.filter(t => t.status === 'RESOLVED').length,
    closed:     tickets.filter(t => t.status === 'CLOSED').length,
    rejected:   tickets.filter(t => t.status === 'REJECTED').length,
  }), [tickets]);

  const filtered = useMemo(() => tickets.filter(t => {
    const s = searchTerm.toLowerCase();
    return (statusFilter === 'ALL' || t.status === statusFilter) &&
           (priorityFilter === 'ALL' || t.priority === priorityFilter) &&
           (t.title?.toLowerCase().includes(s) || t.description?.toLowerCase().includes(s) || t.resourceLocation?.toLowerCase().includes(s));
  }), [tickets, statusFilter, priorityFilter, searchTerm]);

  return (
    <div className="ticket-list-page">
      <div className="ticket-list-header">
        <div>
          <h1>Ticket Dashboard</h1>
          <p>Track incidents, priorities, and current workflow status.</p>
        </div>
        {/*<Link to="/tickets/create" className="btn-create">+ Create Ticket</Link>*/}
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="ticket-stats">
        {[
          { label: 'Total',       val: dashboard.total,      cls: 'total'  },
          { label: 'Open',        val: dashboard.open,       cls: 'open'   },
          { label: 'In Progress', val: dashboard.inProgress, cls: 'prog'   },
          { label: 'Resolved',    val: dashboard.resolved,   cls: 'res'    },
          { label: 'Closed',      val: dashboard.closed,     cls: 'closed' },
          { label: 'Rejected',    val: dashboard.rejected,   cls: 'rej'    },
        ].map(s => (
          <div key={s.label} className={`ticket-stat ${s.cls}`}>
            <div className="ticket-stat-val">{s.val}</div>
            <div className="ticket-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="ticket-filters">
        <input
          type="text" placeholder="Search by title, description or location..."
          value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="ALL">All Statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
          <option value="ALL">All Priorities</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
      </div>

      {filtered.length === 0
        ? <div className="ticket-empty">No tickets found for the selected filters.</div>
        : (
          <div className="ticket-grid">
            {filtered.map(t => (
              <Link to={`/tickets/${t.id}`} key={t.id}
                className={`ticket-card ${t.status?.toLowerCase()}`}>
                <div className="ticket-card-top">
                  <h3>{t.title}</h3>
                  <span className={`badge badge-${t.status?.toLowerCase()}`}>{t.status}</span>
                </div>
                <p className="ticket-desc">
                  {t.description?.length > 90 ? `${t.description.substring(0, 90)}...` : t.description}
                </p>
                <div className="ticket-meta-row">
                  <span className="meta-pill">{t.category}</span>
                  <span className={`meta-pill priority-pill ${t.priority}`}>{t.priority}</span>
                </div>
                <p><strong>Location:</strong> {t.resourceLocation}</p>
                <p><strong>Created By:</strong> {t.createdBy}</p>
                <p><strong>Technician:</strong> {t.assignedTechnician || 'Not Assigned'}</p>
              </Link>
            ))}
          </div>
        )
      }
    </div>
  );
}

export default TicketListPage;
