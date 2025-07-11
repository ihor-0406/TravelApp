import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';
import bgrLogin from '../image/login.jpg';

axios.defaults.withCredentials = true;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        { email, password }
      );

      if (response.status === 200) {
        navigate('/profile');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-image">
          <img src={bgrLogin} alt="login" />
        </div>
        <div className="login-form">
          <h2>Sign in</h2>
          <form onSubmit={handleLogin}>
            {error && <div className="error-message">{error}</div>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            <button type="submit" className="login-btn">Sign in</button>

            <div className="social-buttons">
              <a href="http://localhost:8080/oauth2/authorization/google" className="social-btn google">
                <i className="fab fa-google"></i> Continue with Google
              </a>
              <a href="http://localhost:8080/login/oauth2/code/facebook" className="social-btn facebook">
                <i className="fab fa-facebook-f"></i> Continue with Facebook
              </a>
            </div>
            <div className="bottom-links">
              <button type="button" onClick={() => navigate('/register')}>Sign up</button>
              <button type="button" onClick={() => navigate('/')}>Back</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;