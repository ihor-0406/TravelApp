import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import NavBar from '../components/NavBar';
import ReviewCarousel from '../components/ReviewCarousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import ReviewList from '../components/ReviewList';
import BookingModal from '../components/BookingModal';
import '../styles/Tour.css'
import TourImageAlbum from '../components/TourImageAlbum';

export default function TourDetails() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [date, setDate] = useState(new Date());
  const [people, setPeople] = useState(1);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [account, setAccount] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get(`/api/tours/${id}`)
      .then(res => setTour(res.data))
      .catch(err => console.error('Error loading tour:', err));

    axios.get('http://localhost:8080/api/profile', { withCredentials: true })
      .then(res => setAccount(res.data))
      .catch(() => setAccount(null));
  }, [id]);

  const handleSubmitReview = () => {
    axios.post(`/api/reviews/tour/${id}`, { comment, rating }, { withCredentials: true })
      .then(() => {
        setComment("");
        setRating(0);
        alert("Review submitted");
      })
      .catch(() => alert("Error submitting review"));
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    return (
      <>
        {[...Array(5)].map((_, i) => (
          <FontAwesomeIcon
            key={i}
            icon={i < fullStars ? solidStar : regularStar}
            className="text-warning me-1"
          />
        ))}
      </>
    );
  };

  const incrementPeople = () => setPeople(p => p + 1);
  const decrementPeople = () => setPeople(p => (p > 1 ? p - 1 : 1));

  if (!tour) return <div className="text-center py-5">Loading tour...</div>;

  return (
    <>
    <header className='tourBackraund'>
        <NavBar />
      </header>
    <div>
      <h1 className="fw-bold mb-3">{tour.title}</h1>
      <p className="text-muted mb-2">{tour.description}</p>
      <div className="mb-3">{renderStars(tour.averageRating || 0)}</div>

      <div className="row mb-5">
        <div className="col-md-7">
          <img src={tour.imageUrl || "https://via.placeholder.com/800x400"} className="img-fluid rounded-4 mb-3" alt={tour.title} />
          <div className="row text-center">
            <div className="col"><strong>{tour.location}</strong><br />Departs from</div>
            <div className="col"><strong>{tour.duration}</strong><br />Duration</div>
            <div className="col"><strong>{tour.maxPeople}</strong><br />Group size</div>
            <div className="col"><strong>{tour.availability}</strong><br />Availability</div>
            <div className="col"><strong>{tour.difficulty}</strong><br />Difficulty</div>
            <div className="col"><strong>{tour.type}</strong><br />Tour type</div>
          </div>

          <h5 className="fw-bold mt-5">What's Included</h5>
          <ul>
            <li>English-speaking driver guide</li>
            <li>Pick-up and drop-off</li>
            <li>Snacks & drinks</li>
            <li>Entrance fees</li>
          </ul>

          <h5 className="fw-bold mt-4">What to Bring</h5>
          <ul>
            <li>Warm Outdoor Clothing</li>
            <li>Waterproof Jacket and Pants</li>
            <li>Hiking Boots</li>
            <li>Lunch & Snacks</li>
          </ul>
        </div>

        <div className="col-md-5">
          <div className="border rounded-4 p-4 shadow-sm">
            <h5>Select a Date</h5>
            <Calendar onChange={setDate} value={date} className="mb-4" />

            <div className="mb-3">
              <label className="form-label fw-bold">Number of People</label>
              <div className="d-flex align-items-center">
                <button onClick={decrementPeople} className="btn btn-outline-secondary me-2">&lt;</button>
                <span className="px-3 fw-bold">{people}</span>
                <button onClick={incrementPeople} className="btn btn-outline-secondary ms-2">&gt;</button>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold">Total:</span>
              <span className="fs-5">€{(tour.price * people).toFixed(2)}</span>
            </div>

            <button className="btn btn-outline-dark w-100 mb-2">Add to cart</button>
            <button className="btn btn-success w-100" onClick={() => setShowModal(true)}>Book now</button>
          </div>
        </div>
      </div>
      
      <TourImageAlbum tourId={id} />

      <ReviewList tourId={id} />

      {account ? (
        <>
          <h5 className="fw-bold mt-5">Leave a Review</h5>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="form-control mb-2"
            placeholder="Your comment..."
          />
          <div className="mb-3">
            <label className="form-label fw-bold">Your Rating</label>
            <div className="d-flex align-items-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  onClick={() => setRating(num)}
                  style={{ cursor: 'pointer' }}
                >
                  <FontAwesomeIcon
                    icon={num <= rating ? solidStar : regularStar}
                    className="text-warning fs-4"
                  />
                </span>
              ))}
              <span className="ms-2">({rating}/5)</span>
            </div>
          </div>

          <button className="btn btn-outline-primary mb-4" onClick={handleSubmitReview}>
            Submit Review
          </button>
        </>
      ) : (
        <div className="alert alert-info mt-5">
          Please <a href="/login" className="alert-link">sign in</a> to leave a review.
        </div>
      )}

      {showModal && (
        <BookingModal
          onClose={() => setShowModal(false)}
          tourId={id}
          tourTitle={tour.title}
          date={date}
          people={people}
          userEmail={account.email}
        />
      )}
    </div>
    </>
    
  );
}
