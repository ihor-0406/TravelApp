import React from "react";
import { useSearchParams } from "react-router-dom";

export default function Success() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-5 text-center">
        <h2> Thank you for your reservation!</h2>
        <p>Your payment was successful, and your booking is now confirmed.</p>
        <p><strong>Session ID:</strong> {sessionId}</p>
        <p>You can now start getting excited — your adventure awaits!</p>
        <a href="/profile" className="btn btn-success mt-3">View Your Booking</a>
      </div>
    </div>
  );
}
