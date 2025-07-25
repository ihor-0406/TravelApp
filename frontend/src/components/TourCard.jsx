import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function TourCard({ tour }) {
  const [isFavorite, setIsFavorite] = useState(!!tour.isFavorite);
  const [loadingFav, setLoadingFav] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/tours/${tour.id}/favorite`, { withCredentials: true })
      .then(res => {
        setIsFavorite(res.data.isFavorite);
      })
      .catch(() => {});
  }, [tour.id]);

  const addFavorite = () => {
    setLoadingFav(true);
    axios.post(`/api/tours/${tour.id}/favorite`, {}, { withCredentials: true })
      .then(() => setIsFavorite(true))
      .catch(err => console.error(err))
      .finally(() => setLoadingFav(false));
  };

  const removeFavorite = () => {
    setLoadingFav(true);
    axios.delete(`/api/tours/${tour.id}/favorite`, { withCredentials: true })
      .then(() => setIsFavorite(false))
      .catch(err => console.error(err))
      .finally(() => setLoadingFav(false));
  };

  const handleFavoriteToggle = () => {
    if (loadingFav) return;
    isFavorite ? removeFavorite() : addFavorite();
  };

  const duration = tour.duration || '2.5h';
  const availability = tour.availability || 'Year-round';
  const difficulty = tour.difficulty || 'Easy';
  const price = tour.price || 0;
  const discountPrice = tour.discountPrice;
  const discountValue = tour.discountValue;
  const rating = tour.rating ? tour.rating.toFixed(1) : '0.0';

  const hasDiscount = discountValue > 0;

  return (
    <div className="card shadow rounded-4  overflow-hidden position-relative h-100">
      {hasDiscount && (
        <span className="badge bg-danger rounded-pill position-absolute top-0 start-0 m-2 px-3 py-2 fs-6">
          -{Math.round(discountValue)}%
        </span>
      )}

      <button
        type="button"
        className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle p-2 d-flex align-items-center justify-content-center"
        onClick={handleFavoriteToggle}
        disabled={loadingFav}
        aria-label={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        style={{ width: '2.5rem', height: '2.5rem' }}
      >
        <i className={isFavorite ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart text-danger'} />
      </button>

      <img
        src={tour.imageUrl || 'https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg'}
        className="card-img-top"
        alt={tour.title || 'Tour Image'}
        style={{ objectFit: 'cover', aspectRatio: '4/3' }}
      />

      <div className="card-body d-flex flex-column">
        <h5 className="card-title paytone-one-regular">{tour.title || 'Untitled Tour'}</h5>
        <p className="text-muted small inter-small">{tour.location || 'Unknown Location'}</p>

        <div className="d-flex flex-wrap gap-3 text-muted small mb-2 inter-small">
          <span><i className="fa-regular fa-clock "></i> {duration}</span>
          <span><i className="fa-regular fa-calendar-days"></i> {availability}</span>
          <span><i className="fa-solid fa-gauge"></i> {difficulty}</span>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="text-warning ">
            <i className="fa-solid fa-star"></i> {rating}
          </span>
          {hasDiscount ? (
            <div>
              <span className="text-muted text-decoration-line-through me-1">€{price}</span>
              <strong className="text-danger">€{discountPrice}</strong>
            </div>
          ) : (
            <strong>€{price}</strong>
          )}
        </div>

        <Link
          to={`/tours/${tour.id}`}
          className="btn btn-outline-dark w-100 mt-3 rounded-pill"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
