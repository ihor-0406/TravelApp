import React from 'react';

export default function ProfileTabs({ activeTab, setActiveTab }) {
  const tabs = ['profile', 'bookings', 'favorites', 'settings'];
  return (
    <ul className="nav nav-tabs mb-4">
      {tabs.map(tab => (
        <li className="nav-item" key={tab}>
          <button
            className={`nav-link${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        </li>
      ))}
    </ul>
  );
}