import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get('/api/reviews/admin/comments')
      .then(res => setReviews(res.data))
      .catch(err => console.error( err));
  }, []);

  const deleteReview = (id) => {
    axios.delete(`/api/reviews/admin/comments/${id}`)
      .then(() => {
        setReviews(prev => prev.filter(r => r.id !== id));
      })
      .catch(err => console.error( err));
  };

  return (
    <div className="container py-4">
      <h4 className="mb-4">Reviews Management</h4>
      {reviews.map(r => (
        <div
          key={r.id}
          className="border rounded shadow-sm p-3 mb-3 position-relative bg-white"
        >
          <button
            className="btn btn-outline-danger btn-sm position-absolute top-0 end-0 m-2"
            onClick={() => deleteReview(r.id)}
            title="Delete review"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          <p className="mb-1"><strong>Last Name:</strong> {r.lastName}</p>
          <p className="mb-1"><strong>Comment:</strong> {r.comment}</p>
          <p className="mb-1"><strong>Rating:</strong> {r.rating}</p>
          <p className="mb-0"><strong>Date:</strong> {r.date || '–'}</p>
        </div>
      ))}
    </div>
  );
}
