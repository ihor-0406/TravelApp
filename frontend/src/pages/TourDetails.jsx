import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar } from 'react-calendar';
import { enUS } from 'date-fns/locale';
import { Link } from 'react-router-dom';

import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import NavBar from '../components/NavBar';
// import ReviewCarousel from '../components/ReviewCarousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import ReviewList from '../components/ReviewList';
import BookingModal from '../components/BookingModal';
import '../styles/TourDetails.css'
import TourImageAlbum from '../components/TourImageAlbum';
import ToursCarousel from '../components/ToursCarousel';
import Footer from '../components/Footer';

export default function TourDetails() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [date, setDate] = useState(new Date());
  const [people, setPeople] = useState(1);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [account, setAccount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const location = tour?.location;

useEffect(() => {
  if (tour?.title) {
    document.title = `${tour.title} | Travellins`;
  }
}, [tour]);

  useEffect(() => {
  axios.get(`/api/tours/${id}`)
    .then(res => 
      setTour(res.data))
    .catch(err => console.error( err));

  axios.get('/api/profile', { withCredentials: true })
    .then(res => setAccount(res.data))
    .catch(() => setAccount(null));
}, [id]);



 const handleSubmitReview = () => {
  axios.get('/api/profile', { withCredentials: true })
    .then(res => {
      const currentUser = res.data;
      if (!currentUser) {
        alert("Please log in to submit a review");
        return;
      }

      axios.post(`/api/reviews/tour/${id}`, { comment, rating }, { withCredentials: true })
        .then(() => {
          setComment("");
          setRating(0);
          alert("Review submitted");
        })
        .catch(() => alert("Error submitting review"));
    })
    .catch(() => {
      alert("Please log in to submit a review");
    });
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

  if (!tour) return <div class="spinner-border" role="status"> <span class="visually-hidden">Loading...</span> </div>

  return (
    <>
    <header className='tourDetailsBackraund'>
        <NavBar />
         <div className="mt-3">
             <nav  style={{ ['--bs-breadcrumb-divider']: "'>'" }} aria-label="breadcrumb">
              <ol className="breadcrumb mt-2">
                <li className="breadcrumb-item    inter-very-small ms-4">
                  <a className='text-white text-decoration-none' href="/">Home</a>
               </li>
                <li className="breadcrumb-item   inter-very-small ms-4">
                  <a className='text-white text-decoration-none' href="/tours">Tours</a>
               </li>
               <li className="breadcrumb-item active inter-very-small text-white" aria-current="page">{tour?.title} </li>
              </ol>
              </nav>
          </div>
      </header>
      <div className='m-5'>
        <div className="row my-5 align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <h2 className="fw-bold mb-3 paytone-one-regular">{tour?.title}</h2>
            <div className="d-flex align-items-center mb-2">
              {renderStars(tour.averageRating || 0)}
              <span className="ms-2 text-muted small inter-very-small">{tour.averageRating?.toFixed(1) || '0.0'} · {tour.reviewCount || 0} reviews</span>
            </div>
            <p className="text-muted inter-medium ">{tour.description}</p>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-success rounded-pill px-3 mt-3">
            <i className="fa-solid fa-map me-2"></i> Map
            <i className="fa-solid fa-arrow-up-right-from-square ms-2"></i>
            </a>
      </div>
      <div className="col-md-6">
        <img
          src={tour.imageUrl || "https://via.placeholder.com/800x400"}
          className="img-fluid rounded-4 shadow"
          alt={tour.title}
          style={{ objectFit: 'cover', width: '100%', maxHeight: '400px', position: 'center' }}
        />
      </div>
    </div>
  </div>


   <div className="m-5">
  <div className="row mb-5 ">
    <div className="col-md-7  ">
      <div className="row text-center border-bottom border-top border-dark py-3 me-3 text-muted mb-4">
        <div className="col mb-3">
          <i className="fa-solid fa-map-location"></i>
          <p className='inter-very-small'>Depart`s from</p>
          <div className="inter-small ">{tour.location}</div>
        </div>
        <div className="col mb-3">
          <i className="fa-solid fa-clock"></i>
          <p className='inter-very-small'>Duration</p>
          <div className="pt-3 inter-small ">{tour.duration}</div>
        </div>
        <div className="col mb-3">
          <i className="fa-solid fa-user-group"></i>
          <p className='inter-very-small'>Group size</p>
          <div className="pt-3 inter-small ">{tour.maxPeople}</div>
        </div>
        <div className="col mb-3">
          <i className="fa-solid fa-cloud-sun-rain"></i>
          <p className='inter-very-small'>Availability</p>
          <div className="pt-3 inter-small ">{tour.availability}</div>
      
        </div>
        <div className="col mb-3">
          <i className="fa-solid fa-gauge-high"></i>
          <p className='inter-very-small'>Difficulty</p>
          <div className=" pt-3 inter-small ">{tour.difficulty}</div>
      
        </div>
        <div className="col mb-3">
         <i className="fa-solid fa-location-dot"></i>
         <p className='inter-very-small'>Tour type</p>
          <div className=" pt-3 inter-small ">{tour.type}</div>
        </div>
      </div>
      <div className='ms-5'>
        <h5 className="fw-bold mt-5 ">Higlights</h5>
      <ul className="list-unstyled text-muted">
        <li><i className="fa-solid fa-thumbtack me-2"></i> Experience the total solar eclipse</li>
        <li><i className="fa-solid fa-thumbtack me-2"></i> Reach the best observation spot</li>
        <li><i className="fa-solid fa-thumbtack me-2"></i> Celebrate the event with free drinks</li>
        <li><i className="fa-solid fa-thumbtack me-2"></i> Visit the stunning Snasafellsnes Peninsula</li>
      </ul>


      <h5 className="fw-bold mt-5">What’s Included</h5>
      <ul className="list-unstyled text-muted">
        <li><i className="fa-solid fa-check text-success me-2"></i> English-speaking driver guide</li>
        <li><i className="fa-solid fa-check text-success me-2"></i> Pick-up and drop-off</li>
        <li><i className="fa-solid fa-check text-success me-2"></i> Snacks & drinks</li>
        <li><i className="fa-solid fa-check text-success me-2"></i> Entrance fees</li>
      </ul>

      <h5 className="fw-bold mt-4">What to Bring</h5>
      <ul className="list-unstyled text-muted">
        <li><i className="fa-solid fa-xmark text-danger me-2"></i> Warm Outdoor Clothing</li>
        <li><i className="fa-solid fa-xmark text-danger me-2"></i> Waterproof Jacket and Pants</li>
        <li><i className="fa-solid fa-xmark text-danger me-2"></i> Hiking Boots</li>
        <li><i className="fa-solid fa-xmark text-danger me-2"></i> Lunch & Snacks</li>
      </ul>
    </div>
    </div>
      

        <div className="col-md-5">
          <div className="border border-dark rounded-4 p-4 shadow-sm">
            <h5 className='paytone-one-regular p-2'>Select a Date</h5>
            <Calendar onChange={setDate} value={date} locale="en-US" className="mb-4 rounded-4 bg-secondary-subtle"/>
         <div className="mb-3">
            <label className="form-label fw-bold">Number of People</label>
            <div className="d-flex align-items-center p-2">
              <button
                type="button"
                onClick={() => setPeople((prev) => (prev > 1 ? prev - 1 : 1))}
                className="btn btn-outline-secondary rounded-circle me-2"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <span className="px-3 fw-bold">{people}</span>
              <button
                type="button"
                onClick={() => setPeople((prev) => prev + 1)}
                className="btn btn-outline-secondary rounded-circle ms-2"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

            
            <div className="d-flex align-items-center gap-2">
              {tour.discountValue && tour.discountPrice && tour.discountValue > 0 ? (
                <>
                <span className="text-decoration-line-through text-muted inter-small">
                  €{Number(tour.price).toFixed(2)}</span>
                <span className="text-danger  inter-large">€{Number(tour.discountPrice).toFixed(2)} <small className="text-danger inter-medium ">(-{tour.discountValue}%)</small></span></>
                ) : (
                <span className="h5 mb-0 ">€{Number(tour.price).toFixed(2)}</span>)}
            </div>


            <button className="btn btn-success rounded-pill my-3 w-100" onClick={() => setShowModal(true)}>Book now</button>
          </div>
        </div>
      </div>
       
       
        <div className='bgr-contacts-tourDetailes'>
             <div className='d-flex justify-content-between align-items-center flex-column m-auto py-5 px-auto'>
               <h1 className=' inter-large '>
                 Need help planning your adventure?
               </h1>
               <p className='inter-small py-2'>
                 Contact us and we`ll make your Iceland trip unforgettable.
               </p>
                <Link  className="btn btn-outline-light rounded-pill px-5 py-2 my-3 inter-small">
                Contact us
                </Link>
             </div>
           </div>
      
      <TourImageAlbum tourId={id} />

<div className='d-flex justify-content-between align-items-center  flex-column flex-md-row   p-4 mx-5'>
           <div className='d-flex flex-column flex-md-row align-items-md-end align-items-sm-center'>
            <div className='px-4 fw-bolder fs-2 mt-5'>
              <h1 className='paytone-one-large'>
                You may <br />
                also like
             </h1>
           </div>
           <div className='ps-md-3 pt-3'>
            <p className='inter-very-small'>
              Grom breathtaking giaciers to hiffen hot springs - <br />
              these are the tours that capture the spirit of Iceland. <br />
              <span className='fw-bolder'>
               Handpicked based on real traveler experiences <br />
               and expert recomendations.
             </span>
           </p>
         </div>
       </div>
       <div className='mt-5'>
                <Link to="/tours" className="btn btn-outline-dark rounded-pill px-4 py-2 inter-small">
                See More Tours 
                </Link>
              </div>
    </div>
    <div className=' pb-5'>
            <ToursCarousel/>
    </div>

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

          <button className="btn btn-outline-dark rounded-pill px-4 py-2 inter-small" onClick={handleSubmitReview}>
            Submit Review
          </button>
        </>
      ) : (
        <div className="alert alert-info mt-5 rounded-pill inter-medium">
          Please <a href="/login" className="alert-link text-warning">sign in</a> to leave a review.
        </div>
      )}

      {showModal && (
  <BookingModal
    onClose={() => setShowModal(false)}
    tourId={id}
    tourTitle={tour.title}
    date={date}
    people={people}
    userEmail={account?.email || ""}
  />
)}

    </div>
    <footer>
      <Footer/>
    </footer>
    </>
    
  );
}
