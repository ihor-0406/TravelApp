import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import AdminTours from './AdminTours';
import AdminComments from './AdminComments';
import AdminBookings from './AdminBookings';
import AdminDashboard from './AdminDashboard';
import AdminDiscounts from './AdminDiscounts';
import { Link } from 'react-router-dom';


export default function AdminPanel() {
  const [tab, setTab] = useState('info');
  const navigate = useNavigate();

   useEffect(() => {
          document.title = 'Admin panel | Travellins';
      }, []);
  
 
  return (
    <div className="container mt-4">
      <div className='d-flex justify-content-between mb-4'>
        <h2 className="paytone-one-regular">Admin Panel</h2>
       <Link to="/" className="btn btn-outline-dark rounded-pill  px-4 pb-2  inter-small">
               Back to
       </Link>
      </div>
      

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>Info</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'tours' ? 'active' : ''}`} onClick={() => setTab('tours')}>Tours</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'reviews' ? 'active' : ''}`} onClick={() => setTab('reviews')}>Reviews</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>Bookings</button>
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
