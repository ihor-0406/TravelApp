import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function ReviewList({ tourId }) {
  const [reviews, setReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    if (!tourId) return;

    fetch(`/api/reviews/tour/${tourId}`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error("Failed to load reviews", err));
  }, [tourId]);

  if (!reviews || reviews.length === 0) {
    return <div className="alert alert-info">No reviews yet.</div>;
  }

  return (
    <div className="review-list-container mt-5">
      <h2 className="review-title">Traveler’s <span className="shine">Experiences</span></h2>
      <p className="review-subtitle">Here’s what travelers had to say after this unforgettable tour.</p>

      {reviews.slice(0, visibleCount).map(review => (
        <div key={review.id} className="border rounded-3 p-3 mb-3 shadow-sm bg-light">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <strong>{review.lastName || 'Traveler'}</strong>
            <div>
              {[...Array(review.rating)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} color="#facc15" />
              ))}
            </div>
          </div>
          <p className="mb-0">{review.comment}</p>
        </div>
      ))}

      {visibleCount < reviews.length && (
        <div className="text-center">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setVisibleCount(reviews.length)}
          >
            Show all reviews
          </button>
        </div>
      )}
    </div>
  );
}
