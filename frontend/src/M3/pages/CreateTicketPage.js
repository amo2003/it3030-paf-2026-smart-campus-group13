import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ticketService from "../services/ticketService";

function CreateTicketPage() {
  const navigate = useNavigate();

  const [ticket, setTicket] = useState({
    title: "",
    description: "",
    category: "EQUIPMENT",
    priority: "HIGH",
    preferredContact: "",
    resourceLocation: "",
    createdBy: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setTicket({
      ...ticket,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await ticketService.createTicket(ticket);
      navigate(`/tickets/${response.data.id}`);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to create ticket"
      );
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Create Ticket</h1>
          <p className="subtext">Report a campus maintenance or incident issue.</p>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <form className="ticket-form better-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div>
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter ticket title"
              value={ticket.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Created By</label>
            <input
              type="text"
              name="createdBy"
              placeholder="Enter your name"
              value={ticket.createdBy}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Describe the issue clearly"
            value={ticket.description}
            onChange={handleChange}
            rows="5"
          />
        </div>

        <div className="form-row">
          <div>
            <label>Category</label>
            <select
              name="category"
              value={ticket.category}
              onChange={handleChange}
            >
              <option value="ELECTRICAL">ELECTRICAL</option>
              <option value="NETWORK">NETWORK</option>
              <option value="EQUIPMENT">EQUIPMENT</option>
              <option value="FACILITY">FACILITY</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          <div>
            <label>Priority</label>
            <select
              name="priority"
              value={ticket.priority}
              onChange={handleChange}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Preferred Contact</label>
            <input
              type="text"
              name="preferredContact"
              placeholder="Phone or email"
              value={ticket.preferredContact}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Resource / Location</label>
            <input
              type="text"
              name="resourceLocation"
              placeholder="e.g. Lecture Hall 3"
              value={ticket.resourceLocation}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="primary-btn">Create Ticket</button>
      </form>
    </div>
  );
}

export default CreateTicketPage;