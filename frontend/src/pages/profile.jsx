import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import TourCard from '../components/TourCard';
import ProfileTabs from '../components/ProfileTabs';
import ProfileInfo from '../components/ProfileInfo';
import ProfileBookings from '../components/ProfileBookings';
import ProfileFavorites from '../components/ProfileFavorites';
import ProfileSettings from '../components/ProfileSettings';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    axios.get('/api/profile', { withCredentials: true })
      .then(res => {
        setProfile(res.data);
        setFormData(res.data);
      })
      .catch(() => alert('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const fetchTabData = async () => {
      try {
        if (activeTab === 'bookings') {
          const res = await axios.get('/api/profile/bookings', { withCredentials: true });
          setBookings(res.data);
        } else if (activeTab === 'favorites') {
          const res = await axios.get('/api/profile/favorites', { withCredentials: true });
          setFavorites(res.data);
        }
      } catch {
        activeTab === 'bookings' ? setBookings([]) : setFavorites([]);
      }
    };

    fetchTabData();
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put('/api/profile', formData, { withCredentials: true });
      setProfile(res.data);
      setFormData(res.data);
      alert('Profile updated');
    } catch {
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarSelect = (e) => {
    setAvatarFile(e.target.files[0] || null);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return alert('Please select an avatar image');
    setUploading(true);
    const data = new FormData();
    data.append('file', avatarFile);

    try {
      const res = await axios.post('/api/profile/avatar', data, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(prev => ({ ...prev, avatarUrl: res.data.avatarUrl }));
      alert('Avatar uploaded');
    } catch {
      alert('Avatar upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading profile…</div>;

  return (
    <div className="min-vh-100 bg-light">
      <NavBar />
      <div className="container py-4" style={{ maxWidth: 800 }}>
        <h1 className="mb-4">My Profile</h1>

        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'profile' && <ProfileInfo profile={profile} />}
        {activeTab === 'bookings' && <ProfileBookings bookings={bookings} />}
        {activeTab === 'favorites' && <ProfileFavorites favorites={favorites} />}
        {activeTab === 'settings' && (
          <ProfileSettings
            profile={profile}
            formData={formData}
            onChange={handleChange}
            onSave={handleSave}
            saving={saving}
            avatarFile={avatarFile}
            onAvatarSelect={handleAvatarSelect}
            onAvatarUpload={handleAvatarUpload}
            uploading={uploading}
          />
        )}
      </div>
    </div>
  );
}
