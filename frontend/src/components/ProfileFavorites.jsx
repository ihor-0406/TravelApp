import React from 'react';
import TourCard from './TourCard';

export default function ProfileFavorites({ favorites }) {
  return (
    favorites.length > 0 ? (
      <div className="row g-3">
        {favorites.map(tour => (
          <div className="col-md-6 col-lg-4" key={tour.id}>
            <TourCard tour={tour} />
          </div>
        ))}
      </div>
    ) : <p>No favorites yet.</p>
  );
}