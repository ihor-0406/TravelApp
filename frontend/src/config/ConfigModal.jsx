import React from 'react';

export default function ConfigModal({ show, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div className="modal-backdrop" style={backdropStyle}>
      <div className="modal-dialog" style={modalStyle}>
        <div className="modal-content p-4 text-center">
          <h5 className="mb-3">Are you sure you want to delete this booking?</h5>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-danger" onClick={onConfirm}>Yes</button>
            <button className="btn btn-secondary" onClick={onClose}>No</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const backdropStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1050,
};

const modalStyle = {
  backgroundColor: 'white',
  borderRadius: '10px',
  maxWidth: '400px',
  width: '100%',
};
