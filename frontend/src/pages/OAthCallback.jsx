// src/pages/OAuthCallback.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Получаем информацию о текущем пользователе после успешной авторизации
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

        navigate('/profile'); // Перенаправляем на профиль
      } catch (error) {
        console.error('Ошибка при получении данных пользователя', error);
        navigate('/login'); // В случае ошибки вернём на логин
      }
    };

    fetchUser();
  }, [navigate]);

  return <p>Загрузка...</p>;
};

export default OAuthCallback;
