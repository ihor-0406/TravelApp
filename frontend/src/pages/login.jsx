import React, { useState, useEffect } from 'react';
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
      '/api/auth/login',
      { email, password }
    );

    if (response.status === 200) {
      const userRes = await axios.get('/api/profile');
      const role = userRes.data?.role;

      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    }
  } catch (err) {
    console.error('Login error:', err.response?.data || err.message);
    setError('Invalid email or password');
  }
};

 useEffect(() => {
        document.title = 'Sing in | Travellins';
    }, []);


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

            <input type="email"  placeholder="Email" value={email}  onChange={(e) => setEmail(e.target.value)} required/>
            
            <input type="password"  placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}  required/>

            <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            <button type="submit" className="login-btn">Sign in</button>

            <div className="social-buttons">
              <a href="https://travel-app01-04b23cb7210b.herokuapp.com/oauth2/authorization/google" className="social-btn google">
                <i className="fab fa-google"></i> Continue with Google
              </a>
              <a href="https://travel-app01-04b23cb7210b.herokuapp.com/oauth2/authorization/facebook" className="social-btn facebook">
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