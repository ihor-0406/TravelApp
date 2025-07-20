import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';
import ProfileTabs from '../components/ProfileTabs';
import ProfileInfo from '../components/ProfileInfo';
import ProfileBookings from '../components/ProfileBookings';
import ProfileFavorites from '../components/ProfileFavorites';
import ProfileSettings from '../components/ProfileSettings';
import '../styles/profile.css';
import Footer from '../components/Footer';

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
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/profile', { withCredentials: true })
      .then(res => {
        setProfile(res.data);
        setFormData(res.data);
        if (window.location.pathname === '/admin' && res.data.role !== 'ADMIN') {
          navigate('/unauthorized');
        }
      })
      .catch(() => {
        alert('Failed to load profile');
        navigate('/unauthorized');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

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

   useEffect(() => {
          document.title = 'Profile | Travellins';
      }, []);
  

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
      alert('Profile updated successfully');
    } catch {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarSelect = (e) => {
    setAvatarFile(e.target.files[0] || null);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return alert('Please select an avatar');
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
  const handleDeleteBooking = (id) => {
    axios.delete(`/api/bookings/${id}`, { withCredentials: true })
      .then(() => {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      })
      .catch(err => {
        console.error( err);
      });
  };

  if (loading) return <div class="spinner-border" role="status"> <span class="visually-hidden">Loading...</span> </div>

  return (
    <>
      <header className='bgnProfile'>
        <NavBar />
      </header>
      <div className="min-vh-100 bg-light">
        <div className="container py-4" style={{ maxWidth: 800 }}>
          <h1 className="mb-4 paytone-one-regular">My Profile</h1>
          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === 'profile' && <ProfileInfo profile={profile} />}
          {activeTab === 'bookings' && <ProfileBookings bookings={bookings}   onDelete={handleDeleteBooking} />}
          {activeTab === 'favorites' && <ProfileFavorites favorites={favorites} />}
          {activeTab === 'settings' && (
            <ProfileSettings
              profile={profile}
              formData={formData}
              handleChange={handleChange}
              handleSave={handleSave}
              saving={saving}
              handleAvatarSelect={handleAvatarSelect}
              handleAvatarUpload={handleAvatarUpload}
              uploading={uploading}
            />
          )}
        </div>
      </div>
      <footer>
        <Footer/>
      </footer>
    </>
  );
}
