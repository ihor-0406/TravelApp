import React, { useEffect, useMemo, useState, useCallback } from 'react';
import NavBar from '../components/NavBar';
import TourCard from '../components/TourCard';
import { Offcanvas } from 'react-bootstrap';
import '../styles/Tour.css';
import Footer from '../components/Footer';

const LOCATIONS = ['Reykjavík', 'Vik', 'Akureyri', 'Snæfellsnes', 'Húsavík'];
const TYPES = ['EXTREME', 'BEACH', 'CULTURAL', 'NATURAL', 'FAMILY', 'ADVENTURE'];
const PEOPLE_OPTIONS = [10, 20, 30, 40, 50];
const DIFFICULTY_OPTIONS = ['EASY', 'MEDIUM', 'HARD'];
const AVAILABILITY_OPTIONS = ['YEAR', 'SUMMER', 'WINTER'];
const SORT_OPTIONS = [
  { value: 'priceAsc', label: 'Price: Low to High' },
  { value: 'priceDesc', label: 'Price: High to Low' },
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
    minPrice: 50,
    maxPrice: 500,
  });

  const [sortBy, setSortBy] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const size = 12;

  const sortParam = useMemo(() => {
    switch (sortBy) {
      case 'priceAsc': 
       return 'price,asc';
      case 'priceDesc':
         return 'price,desc';
      case 'alphaAsc':
          return 'title,asc';
      case 'alphaDesc':
         return 'title,desc';
      default:         
       return '';
    }
  }, [sortBy]);

  useEffect(() => { document.title = 'Tours | Travellins'; }, []);

  const fetchTours = useCallback((pageNumber = 0) => {
    setLoading(true);

    const url =
      `/api/tours/filter?page=${pageNumber}&size=${size}` +
      (sortParam ? `&sort=${encodeURIComponent(sortParam)}` : '');

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
    })
      .then(res => (res.ok ? res.json() : Promise.reject('Server Error')))
      .then(data => {
        if (!data || !Array.isArray(data.content)) throw new Error('Invalid response');
        setTours(prev => (pageNumber === 0 ? data.content : [...prev, ...data.content]));
        setHasMore(!data.last);
      })
      .catch(err => console.error('Error:', err))
      .finally(() => setLoading(false));
  }, [filters, sortParam, size]);

  useEffect(() => {
    setTours([]); setHasMore(true);
    if (page === 0) fetchTours(0); else setPage(0);
  }, [filters]);

  useEffect(() => {
    setTours([]); setHasMore(true);
    if (page === 0) fetchTours(0); else setPage(0);
  }, [sortBy]);

  useEffect(() => {
    fetchTours(page);
  }, [page, fetchTours]);

  const toggleFilter = (key, value) => {
    setFilters(prev => {
      const current = prev[key];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value],
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
      minPrice: 50,
      maxPrice: 500,
    });
  };

  return (
    <>
      <header className="tourBackraund">
        <NavBar />
        <div className="mt-3">
          <nav style={{ ['--bs-breadcrumb-divider']: "'>'" }} aria-label="breadcrumb">
            <ol className="breadcrumb mt-2">
              <li className="breadcrumb-item inter-very-small ms-4">
                <a className="text-white text-decoration-none" href="/">Home</a>
              </li>
              <li className="breadcrumb-item active inter-very-small text-white" aria-current="page">Tours</li>
            </ol>
          </nav>
        </div>
        <div className="m-5">
          <h3 className="paytone-one-large">Unlock the Magic of Iceland</h3>
          <p className="inter-small pb-5">
            Your next great adventure starts here - <br />
            explore wild nature, glaciers and timeless beauty.
          </p>
        </div>
      </header>

      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            className="btn btn-outline-secondary rounded-pill px-5 d-md-none inter-medium"
            onClick={() => setShowFilters(true)}
          >
            Filters
          </button>

          <select
            className="form-select bg-transparent border border-dark w-auto ms-auto rounded-pill inter-small"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option className="p-5 bg-transparent" value="">Sort By</option>
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="row">
          <div className="col-md-3 d-none d-md-block">{renderFilters()}</div>

          <div className="col-md-9">
            {tours.length === 0 && !loading ? (
              <p className="inter-medium">No tours found.</p>
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
                <button
                  className="btn btn-outline-dark rounded-pill px-4 py-2 inter-small"
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </>
                  ) : (
                    'Load More'
                  )}
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

      <footer>
        <Footer />
      </footer>
    </>
  );

  function renderFilters() {
    return (
      <div className="inter-small">
        {renderCheckboxFilter('Locations', LOCATIONS, 'locations')}
        {renderCheckboxFilter('Types', TYPES, 'types')}
        {renderCheckboxFilter('Max People', PEOPLE_OPTIONS, 'maxPeople', true)}
        {renderCheckboxFilter('Difficulty', DIFFICULTY_OPTIONS, 'difficulty')}
        {renderCheckboxFilter('Availability', AVAILABILITY_OPTIONS, 'availability')}
        <hr />
        <label className="form-label fw-bold inter-small">Max Price: €{filters.maxPrice}</label>
        <input
          type="range"
          min="50"
          max="500"
          step="10"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: +e.target.value })}
          className="form-range"
        />
        <button className="btn btn-sm btn-outline-danger rounded-pill px-2 mt-3" onClick={clearFilters}>
          Clear filters
        </button>
      </div>
    );
  }

  function renderCheckboxFilter(label, options, key, isNumeric = false) {
    return (
      <div className="mb-3">
        <h6 className="fw-bold inter-medium border-bottom border-dark pb-2">{label}</h6>
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
