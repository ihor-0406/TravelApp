import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import bgrLogin from '../image/login.jpg';
import '../styles/login.css';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/datepicker.css'

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        email,
        password,
        dateOfBirth,
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
      setError(err.response?.data || 'Registration error');
    }
  };

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
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {/* <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
        /> */}
        <DatePicker
  selected={dateOfBirth}
  onChange={(date) => setDateOfBirth(date)}
  placeholderText="Date of Birth"
  dateFormat="dd-MM-yyyy"
  showMonthDropdown
  showYearDropdown
  dropdownMode="select"
  className="form-control"
/>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          required
        />
        <button className='login-btn' type="submit">Register</button>
        <div className='bottom-links'>
          <button type="button" onClick={() => navigate('/login')}>Sign in</button>
        </div>
      </form>
        </div>
        
     
      </div>
     
    </div>
  );
};

export default Register;