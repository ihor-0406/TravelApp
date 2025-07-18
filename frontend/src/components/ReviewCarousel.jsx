import React, { useState } from 'react';
import '../styles/ReviewCarousel.css';

export default function ReviewCarousel() {
  const [reviews] = useState([
    {
      name: "Anna L.",
      city: "Berlin",
      avatarUrl: "https://randomuser.me/api/portraits/women/12.jpg",
      rating: 5,
      text: "Amazing trip! The guides were fantastic, and I loved every moment of the adventure."
    },
    {
      name: "James K.",
      city: "London",
      avatarUrl: "https://randomuser.me/api/portraits/men/23.jpg",
      rating: 4,
      text: "The landscape was breathtaking. Organization could be slightly better, but overall a great experience."
    },
    {
      name: "Maria G.",
      city: "Barcelona",
      avatarUrl: "https://randomuser.me/api/portraits/women/34.jpg",
      rating: 5,
      text: "Iceland is magical! Every stop on the tour was picture-perfect. Highly recommend."
    },
    {
      name: "Lukas H.",
      city: "Munich",
      avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 5,
      text: "Well-organized, fun, and super friendly guides. Will definitely travel with them again!"
    },
    {
      name: "Elena V.",
      city: "Rome",
      avatarUrl: "https://randomuser.me/api/portraits/women/51.jpg",
      rating: 4,
      text: "Beautiful views and relaxing atmosphere. I especially loved the hot springs."
    },
    {
      name: "David S.",
      city: "Toronto",
      avatarUrl: "https://randomuser.me/api/portraits/men/64.jpg",
      rating: 5,
      text: "It felt like a once-in-a-lifetime experience. Everything went smoothly from start to finish."
    },
    {
      name: "Sophie B.",
      city: "Vienna",
      avatarUrl: "https://randomuser.me/api/portraits/women/75.jpg",
      rating: 5,
      text: "So cozy and personal. Our group was small and the guide was super knowledgeable."
    },
    {
      name: "Tom R.",
      city: "Dublin",
      avatarUrl: "https://randomuser.me/api/portraits/men/38.jpg",
      rating: 4,
      text: "I loved the glacier hike! The weather wasn’t perfect, but it didn’t ruin the experience."
    }
  ]);

  return (
    <div className="container py-5">
      <div className="row flex-nowrap overflow-auto gap-4">
        {reviews.map((r, idx) => (
          <div className="col-12 col-md-4 flex-shrink-0" key={idx}>
            <div className="review-card p-4 shadow-sm rounded-4 bg-white h-100">
              <div className="d-flex align-items-center mb-3">
                <img
                  src={r.avatarUrl}
                  alt={r.name}
                  className="rounded-circle me-3"
                  style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                />
                <div>
                  <h6 className="mb-0 paytone-one-regular ">{r.name}</h6>
                  <small className="text-muted">{r.city}</small>
                  <div className="text-warning">
                    {'★'.repeat(r.rating || 5)}
                  </div>
                </div>
              </div>
              <p className="text-muted small inter-small ">{r.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
