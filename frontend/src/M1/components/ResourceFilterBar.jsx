import React from 'react';
import './ResourceFilterBar.css';

function ResourceFilterBar({ filters, onChange, onSearch, onReset }) {
  const handleSubmit = (e) => { e.preventDefault(); onSearch(); };
  return (
    <form className="res-filter-bar" onSubmit={handleSubmit}>
      <div className="res-filter-bar-header">
        <h2>Search & Filters</h2>
        <span className="res-filter-module-tag">Module 1</span>
      </div>
      <div className="res-filter-grid">
        <div className="res-filter-field">
          <label>Keyword</label>
          <input type="text" name="keyword" placeholder="Name or code" value={filters.keyword} onChange={onChange} />
        </div>
        <div className="res-filter-field">
          <label>Type</label>
          <select name="type" value={filters.type} onChange={onChange}>
            <option value="">All Types</option>
            <option value="LECTURE_HALL">Lecture Hall</option>
            <option value="LAB">Lab</option>
            <option value="MEETING_ROOM">Meeting Room</option>
            <option value="EQUIPMENT">Equipment</option>
          </select>
        </div>
        <div className="res-filter-field">
          <label>Min Capacity</label>
          <input type="number" name="minCapacity" placeholder="20" value={filters.minCapacity} onChange={onChange} />
        </div>
        <div className="res-filter-field">
          <label>Location</label>
          <input type="text" name="location" placeholder="Admin Block" value={filters.location} onChange={onChange} />
        </div>
        <div className="res-filter-field">
          <label>Status</label>
          <select name="status" value={filters.status} onChange={onChange}>
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="OUT_OF_SERVICE">Out of Service</option>
            <option value="UNDER_MAINTENANCE">Under Maintenance</option>
          </select>
        </div>
      </div>
      <div className="res-filter-actions">
        <button type="submit" className="res-filter-btn-search">Search</button>
        <button type="button" className="res-filter-btn-reset" onClick={onReset}>Reset</button>
      </div>
    </form>
  );
}

export default ResourceFilterBar;
