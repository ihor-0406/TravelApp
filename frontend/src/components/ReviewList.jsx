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
      .then(data => {
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.error("Expected array but got:", data);
          setReviews([]);
        }
      })
      .catch(err => console.error("Failed to load reviews", err));
  }, [tourId]);

  if (!reviews || reviews.length === 0) {
    return <div className="alert alert-info rounded-pill inter-medium">No reviews yet.</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="review-title inter-medium">Traveler’s <span className="shine">Experiences</span></h2>
      <p className="review-subtitle">Here’s what travelers had to say after this unforgettable tour.</p>

      {reviews.slice(0, visibleCount).map((review, idx) => {
        const account = review.account || {}; // если в review есть account
        return (
          <div key={review.id || idx} className="bg-white rounded-4 p-4 shadow-sm mb-4 w-100">
            <div className="d-flex align-items-center mb-3">
              <img
                src={review.avatarUrl || "https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg"}
                alt={review.firstName || "Traveler"}
                className="rounded-circle me-3"
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
              />
              <div>
                <h6 className="mb-0 paytone-one-regular">{account.firstName} {account.lastName || "Traveler"}</h6>
                <small className="text-muted">{review.city || "Unknown"}</small>
                <div className="text-warning">
                  {[...Array(review.rating || 0)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-muted mb-0">{review.comment}</p>
          </div>
        );
      })}

      {visibleCount < reviews.length && (
        <div className="text-center mt-3">
          <button
            className="btn btn-outline-dark rounded-pill px-4 py-2 inter-small"
            onClick={() => setVisibleCount(reviews.length)}
          >
            Show all reviews
          </button>
        </div>
      )}
    </div>
  );
}
