import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function ReviewCarousel({ tourId }) {
  const [reviews, setReviews] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!tourId) return;

    let isMounted = true;

    fetch(`/api/reviews/tour/${tourId}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted) setReviews(data);
      })
      .catch(err => console.error("Failed to load reviews", err));

    return () => { isMounted = false };
  }, [tourId]);

  const next = () => setIndex((index + 1) % reviews.length);
  const prev = () => setIndex((index - 1 + reviews.length) % reviews.length);

  if (!reviews || reviews.length === 0) return null;

  const current = reviews[index];

  return (
    <div className="review-carousel-container">
      <h2 className="review-title">Traveler’s <span className="shine">Experiences</span></h2>
      <p className="review-subtitle">Here’s what travelers had to say after experiencing this unforgettable tour.</p>

      <div className="review-card">
        <div className="review-header">
          <img
            src={`https://i.pravatar.cc/100?u=${current.id}`}
            alt="avatar"
            className="avatar"
          />
          <div>
            <h4>{current.authorName}</h4>
            <p>{current.location || "Traveler"}</p>
            <div className="stars">
              {[...Array(current.rating)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} color="#facc15" />
              ))}
            </div>
          </div>
        </div>
        <p className="review-text">{current.comment}</p>
      </div>

      <div className="carousel-buttons">
        <button onClick={prev}>&larr;</button>
        <button onClick={next}>&rarr;</button>
      </div>
    </div>
  );
}
