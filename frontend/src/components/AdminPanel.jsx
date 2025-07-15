import React, { useState } from 'react';
import AdminTours from './AdminTours';
import AdminComments from './AdminComments';
import AdminBookings from './AdminBookings';
import AdminDashboard from './AdminDashboard';
import AdminDiscounts from './AdminDiscounts';

export default function AdminPanel() {
  const [tab, setTab] = useState('info'); 

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Panel</h2>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}> Info
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'tours' ? 'active' : ''}`} onClick={() => setTab('tours')}>Tours
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'reviews' ? 'active' : ''}`} onClick={() => setTab('reviews')}> Reviews
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>Bookings
          </button>
        </li>
        <li className="nav-item">
            <button className={`nav-link ${tab === 'discounts' ? 'active' : ''}`} onClick={() => setTab('discounts')}>Discounts</button>
        </li>
      </ul>

      {tab === 'info' && <AdminDashboard />}
      {tab === 'tours' && <AdminTours />}
      {tab === 'reviews' && <AdminComments />}
      {tab === 'bookings' && <AdminBookings />}
      {tab === 'discounts' && <AdminDiscounts />}
    </div>
  );
}
