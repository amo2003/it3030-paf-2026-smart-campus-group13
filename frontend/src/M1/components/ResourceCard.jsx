import React from 'react';
import './ResourceCard.css';

function formatType(type) {
  if (!type) return '-';
  return type.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function ResourceCard({ resource, onViewDetails, onEdit, onDelete, onStatusChange }) {
  return (
    <article className="res-catalog-card">
      <div className="res-catalog-card-top">
        <div>
          <div className="res-catalog-card-name">{resource.name}</div>
          <div className="res-catalog-card-code">{resource.resourceCode}</div>
        </div>
        <span className={`res-catalog-status ${resource.status}`}>{resource.status}</span>
      </div>

      <div className="res-catalog-meta">
        <div className="res-catalog-meta-item">
          <div className="meta-label">Type</div>
          <div className="meta-value">{formatType(resource.type)}</div>
        </div>
        <div className="res-catalog-meta-item">
          <div className="meta-label">Capacity</div>
          <div className="meta-value">{resource.capacity}</div>
        </div>
        <div className="res-catalog-meta-item">
          <div className="meta-label">Location</div>
          <div className="meta-value">{resource.location}</div>
        </div>
        <div className="res-catalog-meta-item">
          <div className="meta-label">Availability</div>
          <div className="meta-value">{resource.availableFrom || '—'} – {resource.availableTo || '—'}</div>
        </div>
      </div>

      <p className="res-catalog-desc">{resource.description || 'No description provided'}</p>

      {resource.outOfServiceUntil && (
        <div className="res-oos-banner">Out of service until {resource.outOfServiceUntil}</div>
      )}

      <div className="res-catalog-actions">
        <button className="rc-btn dark"  onClick={() => onViewDetails(resource)}>Details</button>
        <button className="rc-btn blue"  onClick={() => onEdit(resource)}>Edit</button>
        <button className="rc-btn rose"  onClick={() => onDelete(resource)}>Delete</button>
      </div>
      <div className="res-catalog-status-btns">
        <button className="rc-btn emerald" onClick={() => onStatusChange(resource, 'ACTIVE')}>Mark Active</button>
        <button className="rc-btn amber"   onClick={() => onStatusChange(resource, 'OUT_OF_SERVICE')}>Mark Out of Service</button>
      </div>
    </article>
  );
}

export default ResourceCard;
