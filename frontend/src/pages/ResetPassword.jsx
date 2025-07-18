import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import bgrLogin from '../image/login.jpg';
import '../styles/login.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const isPasswordValid = {
    length: password.length >= 8,
    upperCase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const allValid = Object.values(isPasswordValid).every(Boolean);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!allValid) {
      setMessage('Password does not meet the requirements.');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    try {
      await axios.post(`/api/auth/reset-password?token=${token}`, { password }, { withCredentials: true });
      setMessage('Password successfully reset.');
      setTimeout(() => navigate('/login'), 2000); 
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error resetting password.');

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
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder="Enter new password"
              required
            />
            {passwordFocused && (
              <ul className="password-checklist">
                <li style={{ color: isPasswordValid.length ? 'green' : 'red' }}>
                  At least 8 characters
                </li>
                <li style={{ color: isPasswordValid.upperCase ? 'green' : 'red' }}>
                  At least 1 uppercase letter
                </li>
                <li style={{ color: isPasswordValid.number ? 'green' : 'red' }}>
                  At least 1 number
                </li>
                <li style={{ color: isPasswordValid.specialChar ? 'green' : 'red' }}>
                  At least 1 special character
                </li>
              </ul>
            )}
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
            <button type="submit" className='login-btn' disabled={!allValid}>
              Reset Password
            </button>
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
