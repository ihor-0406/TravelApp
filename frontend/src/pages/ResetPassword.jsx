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
  const [submitting, setSubmitting] = useState(false);       
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
    if (!allValid) return setMessage('Password does not meet the requirements.');
    if (password !== confirmPassword) return setMessage('Passwords do not match.');
    if (!token) return setMessage('Invalid or expired token.');

    try {
      setSubmitting(true);
      const res = await axios.post(
        `/api/auth/reset-password?token=${encodeURIComponent(token)}`,
        { password },
        { withCredentials: true }
      );

      if (res.status === 200 || res.status === 204) {
        navigate('/login', { replace: true, state: { reset: 'success' } });
        return;
      }

      setMessage('Unexpected server response. Please try again.');
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Error resetting password.';
      setMessage(msg);
    } finally {
      setSubmitting(false);
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
              disabled={submitting}
            />

            {passwordFocused && (
              <ul className="password-checklist">
                <li style={{ color: isPasswordValid.length ? 'green' : 'red' }}>At least 8 characters</li>
                <li style={{ color: isPasswordValid.upperCase ? 'green' : 'red' }}>At least 1 uppercase letter</li>
                <li style={{ color: isPasswordValid.number ? 'green' : 'red' }}>At least 1 number</li>
                <li style={{ color: isPasswordValid.specialChar ? 'green' : 'red' }}>At least 1 special character</li>
              </ul>
            )}

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={submitting}
            />

            <button type="submit" className='login-btn' disabled={!allValid || submitting}>
              {submitting ? 'Processing…' : 'Reset Password'}
            </button>
          </form>

          {message && <p className='error-message'>{message}</p>}

          <div className='bottom-links'>
            <button onClick={() => navigate('/login')} disabled={submitting}>Back to Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
