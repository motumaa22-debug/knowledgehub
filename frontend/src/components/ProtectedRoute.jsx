import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Route guard that requires authentication (and optional role check) before rendering children.
 */
export default function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container page-container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <p>Loading session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and preserve requested path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="container page-container">
        <div className="placeholder-box">
          <h2>Access Restricted</h2>
          <p>You do not have permission to access this administrative section.</p>
        </div>
      </div>
    );
  }

  return children;
}
