import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ticketService from '../services/ticketService';
import { addLocalNotification } from '../../M4/services/localNotifications';
import './CreateTicketPage.css';

const RESOURCES_API = 'http://localhost:8080/api/module1/resources';

function CreateTicketPage() {
  const navigate = useNavigate();

  const [ticket, setTicket] = useState({
    title: '', description: '', category: 'EQUIPMENT', priority: 'HIGH',
    preferredContact: '', resourceLocation: '', createdBy: '',
  });
  const [error, setError] = useState('');

  // resources dropdown state
  const [resources, setResources]       = useState([]);
  const [resLoading, setResLoading]     = useState(true);
  const [resError, setResError]         = useState('');
  const [customLocation, setCustomLocation] = useState(false);

  useEffect(() => {
    fetch(RESOURCES_API)
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(data => setResources(data))
      .catch(() => setResError('Could not load resources'))
      .finally(() => setResLoading(false));
  }, []);

  const handleChange = e => setTicket({ ...ticket, [e.target.name]: e.target.value });

  // when user picks from dropdown
  const handleResourceSelect = (e) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setCustomLocation(true);
      setTicket(t => ({ ...t, resourceLocation: '' }));
    } else {
      setCustomLocation(false);
      setTicket(t => ({ ...t, resourceLocation: val }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      await ticketService.createTicket(ticket);
      addLocalNotification(
        'TICKET_CREATED',
        'Ticket Submitted',
        `Ticket "${ticket.title}" (${ticket.priority} · ${ticket.category}) submitted by ${ticket.createdBy || 'you'} at ${ticket.resourceLocation || 'N/A'}.`
      );
      navigate(`/`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create ticket');
    }
  };

  // build the selected dropdown value
  const dropdownValue = customLocation
    ? '__custom__'
    : (ticket.resourceLocation || '');

  return (
    <div className="create-ticket-page">
      <div className="create-ticket-header">
        <h1>Create Ticket</h1>
        <p>Report a campus maintenance or incident issue.</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      <form className="ticket-form-card" onSubmit={handleSubmit}>

        {/* Row 1 — title + created by */}
        <div className="form-row-2">
          <div className="form-field">
            <label>Title</label>
            <input
              type="text" name="title" placeholder="Enter ticket title"
              value={ticket.title} onChange={handleChange} required
            />
          </div>
          <div className="form-field">
            <label>Created By</label>
            <input
              type="text" name="createdBy" placeholder="Your name"
              value={ticket.createdBy} onChange={handleChange}
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-field">
          <label>Description</label>
          <textarea
            name="description" placeholder="Describe the issue clearly"
            value={ticket.description} onChange={handleChange} rows={5}
          />
        </div>

        {/* Row 2 — category + priority */}
        <div className="form-row-2">
          <div className="form-field">
            <label>Category</label>
            <select name="category" value={ticket.category} onChange={handleChange}>
              <option value="ELECTRICAL">ELECTRICAL</option>
              <option value="NETWORK">NETWORK</option>
              <option value="EQUIPMENT">EQUIPMENT</option>
              <option value="FACILITY">FACILITY</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
          <div className="form-field">
            <label>Priority</label>
            <select name="priority" value={ticket.priority} onChange={handleChange}>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>
        </div>

        {/* Row 3 — contact + resource/location */}
        <div className="form-row-2">
          <div className="form-field">
            <label>Preferred Contact</label>
            <input
              type="text" name="preferredContact" placeholder="Phone or email"
              value={ticket.preferredContact} onChange={handleChange}
            />
          </div>

          {/* Resource / Location — dropdown linked to all bookings */}
          <div className="form-field">
            <label>
              Resource / Location
              {resLoading && <span className="res-loading-tag">Loading...</span>}
              {resError   && <span className="res-error-tag">⚠ offline</span>}
            </label>

            {/* dropdown */}
            <div className="res-location-wrap">
              <select
                value={dropdownValue}
                onChange={handleResourceSelect}
                className="res-location-select"
                disabled={resLoading}
              >
                <option value="">— Select a resource —</option>

                {/* group: active */}
                {resources.filter(r => r.status === 'ACTIVE').length > 0 && (
                  <optgroup label="✅ Active Resources">
                    {resources
                      .filter(r => r.status === 'ACTIVE')
                      .map(r => (
                        <option key={r.id} value={`${r.name} — ${r.location}`}>
                          {r.name} ({r.type?.replaceAll('_', ' ')}) · {r.location}
                        </option>
                      ))}
                  </optgroup>
                )}

                {/* group: maintenance */}
                {resources.filter(r => r.status === 'UNDER_MAINTENANCE').length > 0 && (
                  <optgroup label="🔧 Under Maintenance">
                    {resources
                      .filter(r => r.status === 'UNDER_MAINTENANCE')
                      .map(r => (
                        <option key={r.id} value={`${r.name} — ${r.location}`}>
                          {r.name} ({r.type?.replaceAll('_', ' ')}) · {r.location}
                        </option>
                      ))}
                  </optgroup>
                )}

                {/* group: out of service */}
                {resources.filter(r => r.status === 'OUT_OF_SERVICE').length > 0 && (
                  <optgroup label="🚫 Out of Service">
                    {resources
                      .filter(r => r.status === 'OUT_OF_SERVICE')
                      .map(r => (
                        <option key={r.id} value={`${r.name} — ${r.location}`}>
                          {r.name} ({r.type?.replaceAll('_', ' ')}) · {r.location}
                        </option>
                      ))}
                  </optgroup>
                )}

                <option value="__custom__">✏️ Type a custom location...</option>
              </select>

              {/* selected resource info pill */}
              {ticket.resourceLocation && !customLocation && (
                <div className="res-selected-pill">
                  📍 {ticket.resourceLocation}
                </div>
              )}
            </div>

            {/* custom text input — shown when user picks "type custom" */}
            {customLocation && (
              <input
                type="text"
                name="resourceLocation"
                placeholder="e.g. Lecture Hall 3, Floor 2"
                value={ticket.resourceLocation}
                onChange={handleChange}
                className="res-custom-input"
                autoFocus
              />
            )}
          </div>
        </div>

        <button type="submit" className="btn-submit-ticket">Create Ticket</button>
      </form>
    </div>
  );
}

export default CreateTicketPage;
