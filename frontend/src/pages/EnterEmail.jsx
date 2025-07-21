import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EnterEmail() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      await axios.post('/enter-email', { email });
      navigate('/profile');
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Пользователь с таким email уже существует');
      } else {
        setError('Ошибка при сохранении email');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Укажите email для завершения входа</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Введите email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn btn-success">Подтвердить</button>
      </form>
      {error && <p className="text-danger mt-2">{error}</p>}
    </div>
  );
}
