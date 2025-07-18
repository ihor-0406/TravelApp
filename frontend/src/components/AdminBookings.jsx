import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);


  useEffect(() => {
    
    axios.get('/api/bookings', { withCredentials: true })
      .then(res => {
        setBookings(res.data);
      })
      .catch(err => {
        console.error( err);
      });
  }, []);

  const handleDelete = (id) => {
    console.log( id);

    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    axios.delete(`/api/bookings/admin/${id}`, { withCredentials: true })
      .then(() => {
        setBookings(prev => prev.filter(b => b.id !== id));
      })
      .catch(err => {
        console.error( err);
        alert("Failed to delete booking");
      });
  };

  
  const handleStatusChange = (id, newStatus) => {
    console.log("Изменение статуса:", id, "→", newStatus);

    axios.put(`/api/bookings/admin/${id}/status`, { status: newStatus }, { withCredentials: true })
      .then(() => {
        setBookings(prev =>
          prev.map(b => b.id === id ? { ...b, status: newStatus } : b)
        );
      })
      .catch(err => {
        console.error( err);
        alert("Failed to update status");
      });
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Booking Management(Admin)</h4>

      {bookings.length === 0 && (
        <p className="text-muted">No bookings found or failed to load data</p>
      )}

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>User Email</th>
            <th>Tour</th>
            <th>Date</th>
            <th>People</th>
            <th>Status</th>
            <th>Change Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.accountEmail || '—'}</td>
              <td>{b.tourTitle}</td>
              <td>{b.bookingDate}</td>
              <td>{b.numberOfPeople}</td>
              <td>{b.status}</td>
              <td>
                <select
                  className="form-select form-select-sm"
                  value={b.status}
                  onChange={e => handleStatusChange(b.id, e.target.value)}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-danger rounded-pill"
                  onClick={() => handleDelete(b.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


 