import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import axios from 'axios';

export default function TourImageAlbum({ tourId }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!tourId) return;

    axios.get(`/api/tours/${tourId}/images`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setImages(res.data);
        } else {
          console.warn( res.data);
          setImages([]);
        }
      })
      .catch(err => console.error( err));
  }, [tourId]);

  if (!Array.isArray(images) || images.length === 0) {
    return <p className="text-muted">No images found</p>;
  }

  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={1}
      loop={true}
      pagination={{ clickable: true }}
      modules={[Pagination]}
      className="my-3"
    >
      {images.map((img, index) => (
        <SwiperSlide key={index}>
          <img
            src={img.imageUrls}
            alt={`Tour image ${index + 1}`}
            className="img-fluid rounded w-100"
            style={{ maxHeight: '400px',  }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
