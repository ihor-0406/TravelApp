import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import TourCard from '../components/TourCard';

export default function Profile() {
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [bookings, setBookings]   = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [formData, setFormData]   = useState({});
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    axios.get('/api/profile', { withCredentials: true })
      .then(res => {
        setProfile(res.data);
        setFormData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'bookings') {
      axios.get('/api/profile/bookings', { withCredentials: true })
        .then(res => setBookings(res.data))
        .catch(() => setBookings([]));
    }
    if (activeTab === 'favorites') {
      axios.get('/api/profile/favorites', { withCredentials: true })
        .then(res => setFavorites(res.data))
        .catch(() => setFavorites([]));
    }
  }, [activeTab]);

  if (loading) return <div className="p-4 text-center">Loading profile…</div>;

  const onChange = e => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(fd => ({
        ...fd,
        address: { ...fd.address, [field]: value }
      }));
    } else {
      setFormData(fd => ({ ...fd, [name]: value }));
    }
  };

  const onSave = () => {
    setSaving(true);
    axios.put('/api/profile', formData, { withCredentials: true })
      .then(res => {
        setProfile(res.data);
        setFormData(res.data);
        alert('Changes saved');
      })
      .catch(() => alert('Save error'))
      .finally(() => setSaving(false));
  };

  return (
    <div className="min-vh-100 bg-light">
      <NavBar />
      <div className="container py-4" style={{ maxWidth: 800 }}>
        <h1 className="mb-4">My Profile</h1>

        <ul className="nav nav-tabs mb-4">
          {['profile','bookings','favorites','settings'].map(tab => (
            <li className="nav-item" key={tab}>
              <button
                className={'nav-link' + (activeTab===tab? ' active':'')}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>

        {activeTab === 'profile' && (
          <dl className="row">
            <dt className="col-sm-3">Name</dt>
            <dd className="col-sm-9">
              {profile.firstName} {profile.lastName}
            </dd>
            <dt className="col-sm-3">Email</dt>
            <dd className="col-sm-9">{profile.email}</dd>
            <dt className="col-sm-3">Phone</dt>
            <dd className="col-sm-9">{profile.phone || '—'}</dd>
            <dt className="col-sm-3">Date of Birth</dt>
            <dd className="col-sm-9">{profile.dateOfBirth || '—'}</dd>
            <dt className="col-sm-3">Gender</dt>
            <dd className="col-sm-9">{profile.gender || '—'}</dd>
            <dt className="col-sm-3">Address</dt>
            <dd className="col-sm-9">
              {profile.address
                ? `${profile.address.street}, ${profile.address.city}, ${profile.address.postalCode}, ${profile.address.country}`
                : '—'}
            </dd>
          </dl>
        )}

        {activeTab === 'bookings' && (
          <div>
            {bookings.length
              ? bookings.map(b => (
                  <div key={b.id} className="card p-3 mb-2">
                    <strong>{b.tourTitle}</strong>
                    <div className="small text-muted">
                      {b.date} — {b.status}
                    </div>
                  </div>
                ))
              : <p>You have no bookings.</p>
            }
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="row g-3">
            {favorites.length
              ? favorites.map(t => (
                  <div className="col-md-6 col-lg-4" key={t.id}>
                    <TourCard tour={t}/>
                  </div>
                ))
              : <p>You have no favorites yet.</p>
            }
          </div>
        )}


        {activeTab === 'settings' && (
          <div className="card p-4">
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                name="firstName"
                className="form-control"
                value={formData.firstName || ''}
                onChange={onChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                name="lastName"
                className="form-control"
                value={formData.lastName || ''}
                onChange={onChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                value={formData.email}
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                name="phone"
                className="form-control"
                value={formData.phone || ''}
                onChange={onChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                className="form-control"
                value={formData.dateOfBirth || ''}
                onChange={onChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                className="form-select"
                value={formData.gender || ''}
                onChange={onChange}
              >
                <option value="">— select —</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <h5 className="mt-4">Address</h5>
            {['street','city','postalCode','country'].map(field => (
              <div className="mb-3" key={field}>
                <label className="form-label">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  name={`address.${field}`}
                  className="form-control"
                  value={formData.address?.[field] || ''}
                  onChange={onChange}
                />
              </div>
            ))}

            <button
              className="btn btn-primary mt-3"
              onClick={onSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
