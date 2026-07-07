import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Corrected '=>' to 'from'
import { useAuth } from '../context/AuthContext'; // Use our AuthContext

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    // You can render a loading spinner or component here
    return <div style={{textAlign: 'center', padding: '50px'}}>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    // Not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Authenticated but not authorized, redirect to an unauthorized page or homepage
    return <Navigate to="/" replace />; // Or a dedicated /unauthorized page
  }

  // Authenticated and authorized, render the child routes
  return <Outlet />;
};

export default PrivateRoute;