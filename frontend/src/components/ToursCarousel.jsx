import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import TourCard from './TourCard';

export default function ToursCarousel() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    axios.get('/api/tours')
         .then(res => setTours(res.data))
         .catch(console.error);
  }, []);

  return (
    <section className="container py-3">
      <Swiper
        modules={[Navigation]} 
        navigation        
        spaceBetween={30}
        breakpoints={{
          320:  { slidesPerView: 1 },
          768:  { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1440: { slidesPerView: 4 },
        }}
      >
        {tours.map(tour => (
          <SwiperSlide key={tour.id}>
            <TourCard tour={tour} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
