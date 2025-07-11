import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import bgrLogin from '../image/login.jpg';
import '../styles/login.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    try {
      await axios.post(`http://localhost:8080/api/auth/reset-password?token=${token}`, { password }, { withCredentials: true });
      setMessage('Password successfully reset.');
      setTimeout(() => navigate('/login'), 2000); 
    } catch (err) {
      setMessage(err.response?.data || 'Error resetting password.');
    }
  };

  return (
    <div className='login-wrapper'>
      <div className='login-card'>
        <div className="login-image">
                  <img src={bgrLogin} alt="login" />
        </div>
        <div className='login-form'>
          <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          required
        />
        <button type="submit" className='login-btn'>Reset Password</button>
      </form>
      {message && <p className='error-message'>{message}</p>}
      <div className='bottom-links'>
        <button onClick={() => navigate('/login')}>Back to Login</button>
      </div>
    </div>
        </div>

      </div>
      
  );
};

export default ResetPassword;