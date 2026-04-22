import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ticketService from "../services/ticketService";

function TicketListPage() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await ticketService.getAllTickets();
      setTickets(response.data);
    } catch (err) {
      setError("Failed to load tickets");
    }
  };

  const dashboard = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "OPEN").length,
      inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
      resolved: tickets.filter((t) => t.status === "RESOLVED").length,
      closed: tickets.filter((t) => t.status === "CLOSED").length,
      rejected: tickets.filter((t) => t.status === "REJECTED").length,
      high: tickets.filter((t) => t.priority === "HIGH").length,
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesStatus =
        statusFilter === "ALL" || ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" || ticket.priority === priorityFilter;

      const search = searchTerm.toLowerCase();
      const matchesSearch =
        ticket.title?.toLowerCase().includes(search) ||
        ticket.description?.toLowerCase().includes(search) ||
        ticket.resourceLocation?.toLowerCase().includes(search);

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tickets, statusFilter, priorityFilter, searchTerm]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Ticket Dashboard</h1>
          <p className="subtext">Track incidents, priorities, and current workflow status.</p>
        </div>
        <Link to="/tickets/create" className="primary-link">
          + Create Ticket
        </Link>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{dashboard.total}</h3>
          <p>Total Tickets</p>
        </div>
        <div className="stat-card">
          <h3>{dashboard.open}</h3>
          <p>Open</p>
        </div>
        <div className="stat-card">
          <h3>{dashboard.inProgress}</h3>
          <p>In Progress</p>
        </div>
        <div className="stat-card">
          <h3>{dashboard.resolved}</h3>
          <p>Resolved</p>
        </div>
        <div className="stat-card">
          <h3>{dashboard.closed}</h3>
          <p>Closed</p>
        </div>
        <div className="stat-card">
          <h3>{dashboard.rejected}</h3>
          <p>Rejected</p>
        </div>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search by title, description, or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ALL">All Statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
          <option value="REJECTED">REJECTED</option>
        </select>

        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="ALL">All Priorities</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
      </div>

      <div className="ticket-grid">
        {filteredTickets.length === 0 ? (
          <div className="empty-state">No tickets found for the selected filters.</div>
        ) : (
          filteredTickets.map((ticket) => (
            <Link to={`/tickets/${ticket.id}`} key={ticket.id} className="ticket-card improved-card">
              <div className="ticket-card-top">
                <h3>{ticket.title}</h3>
                <span className={`badge badge-${ticket.status?.toLowerCase()}`}>
                  {ticket.status}
                </span>
              </div>

              <p className="ticket-desc">
                {ticket.description?.length > 90
                  ? `${ticket.description.substring(0, 90)}...`
                  : ticket.description}
              </p>

              <div className="ticket-meta-row">
                <span className="meta-pill">{ticket.category}</span>
                <span className="meta-pill priority-pill">{ticket.priority}</span>
              </div>

              <p><strong>Location:</strong> {ticket.resourceLocation}</p>
              <p><strong>Created By:</strong> {ticket.createdBy}</p>
              <p><strong>Technician:</strong> {ticket.assignedTechnician || "Not Assigned"}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default TicketListPage;