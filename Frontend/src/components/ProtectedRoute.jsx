import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { accessToken, loading, user } = useAuth();
  const location = useLocation();

  // 1. Show Loading Screen while restoring session via HttpOnly Cookie
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // 2. Redirect to /login if NOT authenticated after loading finishes
  //    Save the attempted location so we can redirect back after login
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Admin Route Guard: If user role is NOT 'admin' (e.g. 'user'), redirect back to /
  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet/>;
};

export default ProtectedRoute;
