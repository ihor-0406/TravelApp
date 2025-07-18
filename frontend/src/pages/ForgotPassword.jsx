import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import bgrLogin from '../image/login.jpg';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/auth/forgot-password?email=${email}`, {}, {
        withCredentials: true,
      });
      setMessage(response.data.message || 'Please check your email for further instructions.');
    } catch (err) {
      setMessage(err.response?.data || 'Error requesting password reset.');
    }
  };

   useEffect(() => {
          document.title = 'Forgot Password | Travellins';
      }, []);
  
  return (
    <div className='login-wrapper'>
      <div className='login-card'>
        <div className="login-image">
                  <img src={bgrLogin} alt="login" />
         </div>
         <div className='login-form'>
          <h2>Forgot Password?</h2>
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
        />
        <button className='login-btn' type="submit">Send Request</button>
      </form>
      {message && <p className='error-message'>{message}</p>}
      <div className='bottom-links'>
        <button  onClick={() => navigate('/login')}>Back to Login</button>
      </div>
    </div>
         </div>
      </div>
      
  );
};

export default ForgotPassword;