import React, { useState } from 'react';
import ConfigModal from '../config/ConfigModal';

export default function ProfileBookings({ bookings, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [bookingIdToDelete, setBookingIdToDelete] = useState(null);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-success text-white';
      case 'PENDING': return 'bg-warning text-dark';
      case 'CANCELLED': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  };

  const handleDeleteClick = (id) => {
    setBookingIdToDelete(id);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (bookingIdToDelete !== null) {
      onDelete(bookingIdToDelete);
      setShowModal(false);
      setBookingIdToDelete(null);
    }
  };

  return (
    <>
      {bookings.length > 0 ? (
        bookings.map(b => (
          <div
            className="card mb-2 p-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
            key={b.id}
          >
            <div>
              <strong>{b.tourTitle}</strong>
              <div className="text-muted small">{b.bookingDate}</div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className={`badge ${getStatusBadgeClass(b.status)}`}>{b.status}</span>
              <button
                className="btn btn-sm btn-outline-danger rounded-circle ms-2"
                onClick={() => handleDeleteClick(b.id)}
              >
                <i className="fa fa-trash"></i>
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No bookings yet.</p>
      )}

      <ConfigModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
