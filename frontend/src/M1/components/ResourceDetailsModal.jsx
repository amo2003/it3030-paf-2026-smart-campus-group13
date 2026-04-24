import React from 'react';
import './ResourceDetailsModal.css';

function fmt(type) { return type ? type.replaceAll('_',' ').toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()) : '-'; }
function fmtDT(v) { return v ? v.replace('T',' ') : '-'; }

function ResourceDetailsModal({ resource, onClose }) {
  if (!resource) return null;
  const fields = [
    { label:'Resource Name',     value: resource.name,                    full: false },
    { label:'Type',              value: fmt(resource.type),               full: false },
    { label:'Capacity',          value: resource.capacity,                full: false },
    { label:'Location',          value: resource.location,                full: false },
    { label:'Available From',    value: resource.availableFrom || '-',    full: false },
    { label:'Available To',      value: resource.availableTo || '-',      full: false },
    { label:'Status',            value: resource.status,                  full: false },
    { label:'Out Of Service Until', value: fmtDT(resource.outOfServiceUntil), full: false },
    { label:'Description',       value: resource.description || 'No description available', full: true },
    { label:'Created At',        value: fmtDT(resource.createdAt),        full: false },
    { label:'Updated At',        value: fmtDT(resource.updatedAt),        full: false },
  ];
  return (
    <div className="res-modal-overlay" onClick={onClose}>
      <div className="res-modal-box" onClick={e => e.stopPropagation()}>
        <div className="res-modal-header">
          <div>
            <h2>Resource Details</h2>
            <p>{resource.resourceCode}</p>
          </div>
          <button className="res-modal-close" onClick={onClose}>Close</button>
        </div>
        <div className="res-modal-body">
          {fields.map(f => (
            <div key={f.label} className={`res-modal-field${f.full ? ' full' : ''}`}>
              <div className="field-label">{f.label}</div>
              <div className="field-value">{f.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResourceDetailsModal;
