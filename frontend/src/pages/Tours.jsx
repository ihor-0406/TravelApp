import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import TourCard from '../components/TourCard';
import { Offcanvas } from 'react-bootstrap';

const LOCATIONS = ['Reykjavík', 'Vik', 'Akureyri', 'Snæfellsnes', 'Húsavík'];
const TYPES = ['EXTREME', 'BEACH', 'CULTURAL', 'NATURAL', 'FAMILY', 'ADVENTURE'];
const PEOPLE_OPTIONS = [10, 20, 30, 40, 50];

export default function ToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: [],
    type: [],
    maxPeople: [],
    minPrice: 50,
    maxPrice: 500,
  });

  useEffect(() => {
    fetch('http://localhost:8080/api/tours')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch tours');
        return res.json();
      })
      .then((data) => {
        setTours(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleFilter = (category, value) => {
    setFilters((prev) => {
      const current = prev[category];
      return {
        ...prev,
        [category]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const clearFilters = () => {
    setFilters({ location: [], type: [], maxPeople: [], minPrice: 50, maxPrice: 500 });
  };

  const filteredTours = tours.filter((tour) => {
    const matchLocation = filters.location.length === 0 || filters.location.includes(tour.location);
    const matchType = filters.type.length === 0 || filters.type.includes(tour.type);
    const matchPeople = filters.maxPeople.length === 0 || filters.maxPeople.some(p => tour.maxPeople <= p);
    const matchPrice = typeof tour.price === 'number' && tour.price >= filters.minPrice && tour.price <= filters.maxPrice;
    return matchLocation && matchType && matchPeople && matchPrice;
  });

  return (
    <>
      <NavBar />
      <div className="container my-4">
        <button className="btn btn-outline-secondary d-md-none w-100 mb-3" onClick={() => setShowFilters(true)}>
          Open Filters
        </button>

        <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="start">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Filters</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>{renderFilters()}</Offcanvas.Body>
        </Offcanvas>

        <div className="row g-4">
          <div className="col-md-3 d-none d-md-block">{renderFilters()}</div>

          <div className="col-md-9">
            <div className="mb-3 d-flex flex-wrap gap-2">
              {filters.location.map(loc => <span key={loc} className="badge bg-primary">{loc}</span>)}
              {filters.type.map(type => <span key={type} className="badge bg-success">{type}</span>)}
              {filters.maxPeople.map(p => <span key={p} className="badge bg-warning text-dark">&le; {p}</span>)}
              <span className="badge bg-info text-dark">&euro; &le; {filters.maxPrice}</span>
              {(filters.location.length + filters.type.length + filters.maxPeople.length > 0 || filters.maxPrice < 500) && (
                <button className="btn btn-sm btn-outline-danger ms-auto" onClick={clearFilters}>Clear</button>
              )}
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-danger">Error: {error}</p>
            ) : (
              <div className="row">
                {filteredTours.map((tour) => (
                  <div className="col-md-6 col-lg-4 mb-4" key={tour.id}>
                    <TourCard tour={tour} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  function renderFilters() {
    return (
      <>
        <h5 className="fw-bold mb-2">Location</h5>
        {LOCATIONS.map(loc => (
          <div key={loc} className="form-check">
            <input type="checkbox" className="form-check-input" checked={filters.location.includes(loc)} onChange={() => toggleFilter('location', loc)} />
            <label className="form-check-label">{loc}</label>
          </div>
        ))}
        <hr />

        <h5 className="fw-bold mb-2">Type</h5>
        {TYPES.map(type => (
          <div key={type} className="form-check">
            <input type="checkbox" className="form-check-input" checked={filters.type.includes(type)} onChange={() => toggleFilter('type', type)} />
            <label className="form-check-label">{type}</label>
          </div>
        ))}
        <hr />

        <h5 className="fw-bold mb-2">Max People</h5>
        {PEOPLE_OPTIONS.map(p => (
          <div key={p} className="form-check">
            <input type="checkbox" className="form-check-input" checked={filters.maxPeople.includes(p)} onChange={() => toggleFilter('maxPeople', p)} />
            <label className="form-check-label">&le; {p}</label>
          </div>
        ))}
        <hr />

        <label className="form-label fw-bold">Max Price: &euro;{filters.maxPrice}</label>
        <input
          type="range"
          className="form-range"
          min="50"
          max="500"
          step="10"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
        />
      </>
    );
  }
}
