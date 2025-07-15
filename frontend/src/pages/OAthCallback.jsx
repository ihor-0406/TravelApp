import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/me', {
          withCredentials: true,
        });

        const user = response.data;

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', user.firstName || 'User');
        localStorage.setItem('avatarUrl', user.avatarUrl || '');
        localStorage.setItem('role', user.role || 'USER');

        navigate('/profile'); 
      } catch (error) {
        console.error('Ошибка при получении данных пользователя', error);
        navigate('/login'); 
      }
    };

    fetchUser();
  }, [navigate]);

  return <p>...</p>;
};

export default OAuthCallback;
