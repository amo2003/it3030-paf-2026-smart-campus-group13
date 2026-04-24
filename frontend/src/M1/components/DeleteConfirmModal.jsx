import React from 'react';
import './DeleteConfirmModal.css';

function DeleteConfirmModal({ resource, onCancel, onConfirm, processing }) {
  if (!resource) return null;
  return (
    <div className="del-modal-overlay" onClick={onCancel}>
      <div className="del-modal-box" onClick={e => e.stopPropagation()}>
        <div className="del-modal-top">
          <div className="del-modal-icon">!</div>
          <div>
            <div className="del-modal-title">Delete Resource?</div>
            <p className="del-modal-desc">
              You are about to delete <strong>{resource.name}</strong> ({resource.resourceCode}). This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="del-modal-actions">
          <button className="del-btn-confirm" onClick={onConfirm} disabled={processing}>
            {processing ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button className="del-btn-cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
