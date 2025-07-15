import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import TourCard from '../components/TourCard';
import { Offcanvas } from 'react-bootstrap';

const LOCATIONS = ['Reykjavík', 'Vik', 'Akureyri', 'Snæfellsnes', 'Húsavík'];
const TYPES = ['EXTREME', 'BEACH', 'CULTURAL', 'NATURAL', 'FAMILY', 'ADVENTURE'];
const PEOPLE_OPTIONS = [10, 20, 30, 40, 50];
const DIFFICULTY_OPTIONS = ['EASY', 'MEDIUM', 'HARD'];
const AVAILABILITY_OPTIONS = ['YEAR', 'SUMMER', 'WINTER'];
// const RATINGS = [5, 4, 3, 2, 1];
const SORT_OPTIONS = [
  { value: 'priceAsc', label: 'Price: Low to High' },
  { value: 'priceDesc', label: 'Price: High to Low' },
  // { value: 'ratingDesc', label: 'Rating: High to Low' },
  { value: 'alphaAsc', label: 'Alphabetical: A-Z' },
  { value: 'alphaDesc', label: 'Alphabetical: Z-A' },
];

export default function ToursPage() {
  const [tours, setTours] = useState([]);
  const [filters, setFilters] = useState({
    locations: [],
    types: [],
    maxPeople: [],
    difficulty: [],
    availability: [],
    // ratings: [],
    minPrice: 50,
    maxPrice: 500,
    sortBy: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const size = 6;

  useEffect(() => {
    fetchTours(0, true);
  }, [filters]);

  const fetchTours = (pageNumber = 0, reset = false) => {
  setLoading(true);

  fetch(`http://localhost:8080/api/tours/filter?page=${pageNumber}&size=${size}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
  })
    .then(res => res.ok ? res.json() : Promise.reject("Server Error"))
    .then(data => {
      if (!data || !Array.isArray(data.content)) throw new Error("Invalid response");

      if (reset) {
        setTours(data.content);
      } else {
        setTours(prevTours => [...prevTours, ...data.content]);
      }

      setPage(data.number);
      setHasMore(!data.last);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching tours:", err);
      setLoading(false);
    });
};


  const toggleFilter = (key, value) => {
    setFilters(prev => {
      const current = prev[key];
      return {
        ...prev,
        [key]: current.includes(value) ? current.filter(v => v !== value) : [...current, value],
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      locations: [],
      types: [],
      maxPeople: [],
      difficulty: [],
      availability: [],
      // ratings: [],
      minPrice: 50,
      maxPrice: 500,
      sortBy: '',
    });
  };

  return (
    <>
      <header className="tourBackraund">
        <NavBar />
      </header>

      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-outline-secondary d-md-none" onClick={() => setShowFilters(true)}>
            Filters
          </button>
          <select
            className="form-select w-auto ms-auto"
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          >
            <option value="">Sort By</option>
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="row">
          <div className="col-md-3 d-none d-md-block">{renderFilters()}</div>
          <div className="col-md-9">
            {tours.length === 0 ? (
              <p>No tours found.</p>
            ) : (
              <div className="row">
                {tours.map(tour => (
                  <div className="col-md-6 col-lg-4 mb-4" key={tour.id}>
                    <TourCard tour={tour} />
                  </div>
                ))}
              </div>
            )}
            {hasMore && (
              <div className="text-center">
                <button className="btn btn-outline-primary" onClick={() => fetchTours(page + 1)}>
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>{renderFilters()}</Offcanvas.Body>
      </Offcanvas>
    </>
  );

  function renderFilters() {
    return (
      <div>
        {renderCheckboxFilter("Locations", LOCATIONS, "locations")}
        {renderCheckboxFilter("Types", TYPES, "types")}
        {renderCheckboxFilter("Max People", PEOPLE_OPTIONS, "maxPeople", true)}
        {renderCheckboxFilter("Difficulty", DIFFICULTY_OPTIONS, "difficulty")}
        {renderCheckboxFilter("Availability", AVAILABILITY_OPTIONS, "availability")}
        {/* {renderCheckboxFilter("Ratings", RATINGS, "ratings", true)} */}
        <hr />
        <label className="form-label fw-bold">Max Price: €{filters.maxPrice}</label>
        <input
          type="range"
          min="50"
          max="500"
          step="10"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: +e.target.value })}
          className="form-range"
        />
        <button className="btn btn-sm btn-outline-danger mt-3" onClick={clearFilters}>
          Clear filters
        </button>
      </div>
    );
  }

  function renderCheckboxFilter(label, options, key, isNumeric = false) {
    return (
      <div className="mb-3">
        <h6 className="fw-bold">{label}</h6>
        {options.map(opt => (
          <div className="form-check" key={opt}>
            <input
              type="checkbox"
              className="form-check-input"
              checked={filters[key].includes(opt)}
              onChange={() => toggleFilter(key, opt)}
              id={`${key}-${opt}`}
            />
            <label className="form-check-label" htmlFor={`${key}-${opt}`}>
              {isNumeric ? `≤ ${opt}` : opt}
            </label>
          </div>
        ))}
      </div>
    );
  }
}
