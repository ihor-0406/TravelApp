import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BookingModal({ onClose, tourId, tourTitle, date, people, userEmail }) {
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [count, setCount] = useState(people);
  const [pickup, setPickup] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tour, setTour] = useState(null);

  useEffect(() => {
    axios.get(`/api/tours/${tourId}`)
      .then(res => setTour(res.data))
      .catch(err => console.error("Failed to load tour data", err));
  }, [tourId]);

  const handleBookAndPay = async () => {
  if (!userEmail) {
    window.location.href = '/login';
    return;
  }

  setSubmitting(true);
  try {
    const res = await axios.post('/api/payment/create-checkout-session', {
      tourId: parseInt(tourId, 10),
      tourTitle,
      adults: count,
      email: userEmail,
    }, { withCredentials: true });

    if (res.data.url) {
      window.location.href = res.data.url;
    } else {
      console.error("No checkout session URL received");
    }
  } catch (err) {
    console.error( err);
  } finally {
    setSubmitting(false);
  }
};


  const price = tour?.discountPrice ?? tour?.price ?? 0;
  const basePrice = tour?.price ?? 0;
  const isDiscounted = tour?.discountPrice !== null && tour?.discountPrice !== undefined;
  const totalPrice = (price * count).toFixed(2);


  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>
      <div className="bg-white rounded-4 p-4 shadow position-relative" style={{ maxWidth: 500, width: '100%' }}>
        <button className="btn-close position-absolute top-0 end-0 m-3" onClick={onClose}></button>

        <h4 className="fw-bold mb-4">{tourTitle}</h4>

        <div className="mb-3">
          <label className="form-label fw-semibold">Date of travel</label>
          <input type="text" className="form-control" value={date.toLocaleDateString()} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Pick a time</label>
         <div className="d-flex gap-3 flex-wrap">
          {['08:00', '10:00', '12:00', '14:00', '16:00'].map(time => (
            <button
              key={time}
              className={`btn ${selectedTime === time ? 'btn-success text-white' : 'btn-outline-secondary'}`}
              onClick={() => setSelectedTime(time)}
              type="button"
            >
              {time}
            </button>
          ))}
        </div>

        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Participants</label>
          <div className="d-flex align-items-center">
            <button type="button" className="btn btn-outline-success btn-sm rounded-circle" onClick={() => setCount(p => Math.max(1, p - 1))}>-</button>
            <span className="mx-2">{count}</span>
            <button type="button" className="btn btn-outline-success rounded-circle btn-sm" onClick={() => setCount(p => p + 1)}>+</button>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Pick Up</label>
         <select className="form-select" value={pickup} onChange={e => setPickup(e.target.value)}>
          <option value="">Selected Option</option>
          <option value="Reykjavik">Reykjavik</option>
          <option value="Keflavik">Keflavik</option>
          <option value="Akureyri">Akureyri</option>
          <option value="Hvolsvöllur">Hvolsvöllur</option>
          <option value="Selfoss">Selfoss</option>
          <option value="Hella">Hella</option>
          <option value="Vík í Mýrdal">Vík í Mýrdal</option>
        </select>

        </div>

        <div className="border-top pt-3 mb-3">
        <div className="d-flex justify-content-between">
          <span>Price breakdown</span>
          <span>
            {isDiscounted && (
              <del className="text-muted me-2">${basePrice}</del>
            )}
            <strong>${price}</strong> x {count}
          </span>
        </div>
        <div className="d-flex justify-content-between fw-bold">
          <span>Total price</span>
          <span>${totalPrice}</span>
        </div>
      </div>


        <button
          type="button"
          className="btn btn-success w-100 d-flex justify-content-between align-items-center"
          onClick={handleBookAndPay}
          disabled={submitting}
        >
          {submitting ? <span>Processing...</span> : <span>Book and Pay</span>}
        </button>

        <p className="text-muted mt-3 small text-center">
          Questions? Call us at +354.123.4567 or email us at hello@aurora.com
        </p>
      </div>
    </div>
  );
}
