import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import bgrLogin from '../image/login.jpg';
import '../styles/login.css';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Register = () => {
  useEffect(() => {
    document.title = 'Sign Up | Travellins';
  }, []);

  const navigate = useNavigate();
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPasswordValid = {
    length: password.length >= 8,
    upperCase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    specialChar: /[!@#$%^&*()_+\-\=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const allValid = Object.values(isPasswordValid).every(Boolean);

  const formatDateLocal = (d) => {
    if(!d) return null;
    
    const y = d.getFullYear();
    const m = String(d.getMonth() +1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    
    return `${y}-${m}-${day}`;
  }

  const isEmpty = (v) => v === null || v === undefined || String(v).trim() === '';


  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError('');

    if(
      isEmpty(email) || isEmpty(password) || !dateOfBirth || isEmpty(firstName) || isEmpty(lastName) || isEmpty(phone)
    ){
      setError('Please fill in all required fields');
      return;
    }
    if (!allValid) {
      setError('Password does not meet the requirements');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/auth/register', {
        email,
        password,
        dateOfBirth: formatDateLocal(dateOfBirth),
        firstName,
        lastName,
        phone,
      }, {
        withCredentials: true,
      });

      if (response.status === 200) {
        navigate('/login');
      }
    } catch (err) {
      const data = err.response?.data;
      const msg =
        (typeof data === 'string' && data) ||
        data?.message ||
        data?.error ||
        'Registration error';
      setError(msg);
    }finally{
      setLoading(false);
    }
  };

  const invalidCls = (cond) => (submitted && cond ? 'invalid' : '');

  return (
    <div className='login-wrapper'>
      <div className='login-card'>
        <div className="login-image">
          <img src={bgrLogin} alt="login" />
        </div>
        <div className='login-form'>
          <h2>Sign up</h2>
          <form onSubmit={handleRegister}>
            {error && <p className="error-message">{error}</p>}

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className={invalidCls(isEmpty(email))}
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder="Password"
              required
              className={invalidCls(isEmpty(password))}
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

            <DatePicker
              selected={dateOfBirth}
              onChange={(date) => setDateOfBirth(date)}
              placeholderText="Date of Birth"
              dateFormat="dd-MM-yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              className={`form-control${invalidCls(!dateOfBirth)}`}
              maxDate={new Date()}
              isClearable
            />

            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              required
              className={invalidCls(isEmpty(firstName))}
            />

            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              required
              className={invalidCls(isEmpty(lastName))}
            />

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              required
              className={invalidCls(isEmpty(phone))}
            />

            <button className='login-btn' type="submit" disabled={!allValid || loading}>
              {loading ? 'Processing…' : 'Register'}
            </button>

            <div className='bottom-links'>
              <button type="button" onClick={() => navigate('/login')}>Sign in</button>
            </div>
          </form>
        </div>
      </div>

      {loading && (
        <div className="modal fade show" style={{ display: 'block' }} role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content text-center p-4">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div className="spinner-border" role="status" aria-hidden="true"></div>
                <div>
                  <h6 className="mb-1">Processing…</h6>
                  <small className="text-muted">Please wait</small>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
};

export default Register;
