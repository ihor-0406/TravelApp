import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import axios from 'axios';

export default function ToursCarousel() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    axios.get('/api/tours')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.content || [];
        setTours(data);
      })
      .catch(err => {
        console.error(err);
        setTours([]); 
      });
  }, []);

  if (!Array.isArray(tours)) return <p>Ошибка загрузки туров</p>;

  return (
    <Swiper slidesPerView={1} spaceBetween={10}>
      {tours.map(tour => (
        <SwiperSlide key={tour.id}>
          <div>{tour.title}</div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
