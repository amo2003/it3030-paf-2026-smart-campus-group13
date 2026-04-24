import React from 'react';
import './EmptyState.css';

function EmptyState({ title, message, onReset }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">📁</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {onReset && (
        <button className="empty-state-btn" onClick={onReset}>Reset Filters</button>
      )}
    </div>
  );
}

export default EmptyState;
