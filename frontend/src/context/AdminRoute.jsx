import React from 'react';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children, account, isLoading }) {
  if (isLoading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!account) {
    return <Navigate to="/login" replace />;
  }

  if (account.role !== 'ADMIN') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
