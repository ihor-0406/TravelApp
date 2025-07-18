import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Line, Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement} from 'chart.js';

Chart.register( ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);


Chart.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, tours: 0, bookings: 0 });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = () => {
    axios.get('/api/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error( err));
  };

  const fetchUsers = () => {
    axios.get('/api/admin/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  const toggleUserRole = (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';

    axios.post(`/api/admin/user/${userId}/role`, `"${newRole}"`, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(() => {
        setUsers(prev => prev.map(u =>
          u.id === userId ? { ...u, role: newRole } : u
        ));
      })
      .catch(err => console.error( err));
  };

  const deleteUser = (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    axios.delete(`/api/admin/user/${userId}`)
      .then(() => {
        setUsers(prev => prev.filter(u => u.id !== userId));
        fetchStats(); 
      })
      .catch(err => console.error( err));
  };

  const pieData = {
    labels: ['Users', 'Tours', 'Bookings'],
    datasets: [{
      data: [stats.users, stats.tours, stats.bookings],
      backgroundColor: ['#36A2EB', '#4BC0C0', '#FF6384'],
    }]
  };
  const [bookingByDate, setBookingByDate] = useState([]);
const [bookingByStatus, setBookingByStatus] = useState({});

useEffect(() => {
  axios.get('/api/admin/bookings-per-day')
    .then(res => setBookingByDate(res.data))
    .catch(err => console.error( err));

  axios.get('/api/admin/bookings-by-status')
    .then(res => setBookingByStatus(res.data))
    .catch(err => console.error( err));
}, []);
const lineData = {
  labels: bookingByDate.map(b => b.date),
  datasets: [{
    label: 'Bookings',
    data: bookingByDate.map(b => b.count),
    fill: false,
    borderColor: '#36A2EB',
    tension: 0.3
  }]
};

const doughnutData = {
  labels: Object.keys(bookingByStatus),
  datasets: [{
    data: Object.values(bookingByStatus),
    backgroundColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'],
  }]
};


  return (
    <div className="container mt-4">
      <h2 className="mb-4 inter-large ">Admin Dashboard</h2>

      <div className="row mb-5">
        <div className="col-md-4">
          <div className="card text-center p-3 shadow-sm">
            <h5>Total Users</h5>
            <h3>{stats.users}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center p-3 shadow-sm">
            <h5>Total Tours</h5>
            <h3>{stats.tours}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center p-3 shadow-sm">
            <h5>Total Bookings</h5>
            <h3>{stats.bookings}</h3>
          </div>
        </div>
      </div>

      <div className="row text-center mb-5">
  <div className="col-md-4">
    <h6>Users vs Tours vs Bookings</h6>
    <div style={{ height: '300px' }}>
      <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  </div>
  <div className="col-md-4">
    <h6>Bookings Per Day</h6>
    <div style={{ height: '300px' }}>
      <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  </div>
  <div className="col-md-4">
    <h6>Bookings by Status</h6>
    <div style={{ height: '300px' }}>
      <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  </div>
</div>



      <div className="mt-5 ">
        <h5 className='inter-large '>User List</h5>
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className={`btn btn-sm ${user.role === 'ADMIN' ? 'btn-outline-danger' : 'btn-outline-success'} me-2`}
                    onClick={() => toggleUserRole(user.id, user.role)}
                  >
                    {user.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
