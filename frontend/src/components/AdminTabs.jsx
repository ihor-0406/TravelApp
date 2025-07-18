import React from 'react';

export default function AdminTabs({ activeTab, setActiveTab }) {
  return (
    <ul className="nav nav-tabs mb-4">
      <li className="nav-item">
        <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          Users
        </button>
      </li>
      <li className="nav-item">
        <button className={`nav-link ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
          Logs
        </button>
      </li>
    </ul>
  );
}
