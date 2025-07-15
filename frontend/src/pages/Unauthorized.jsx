import React from "react";

export default function Unauthorized() {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4 text-danger">403 - Access Denied</h1>
      <p className="lead">You do not have permission to view this page.</p>
      <a href="/" className="btn btn-primary mt-3">Back to Home</a>
    </div>
  );
}
