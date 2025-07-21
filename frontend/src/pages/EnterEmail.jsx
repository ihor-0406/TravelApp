import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EnterEmail() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      await axios.post('/enter-email', { email });
      navigate('/profile');
    } catch (err) {
      if (err.response?.status === 409) {
        setError('A user with this email already exists');
      } else {
        setError('Failed to save email');
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex flex-column align-items-center">
        <h2>Please enter your email to complete login</h2>
        <form onSubmit={handleSubmit} className="w-100 d-flex flex-column align-items-center">
          <input
            type="email"
            className="form-control my-4 px-5 rounded-pill"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ maxWidth: '400px' }}
          />
          <button type="submit" className="btn btn-outline-dark rounded-pill">
            Confirm
          </button>
        </form>
        {error && <p className="text-danger mt-2">{error}</p>}
      </div>
    </div>
  );
}
