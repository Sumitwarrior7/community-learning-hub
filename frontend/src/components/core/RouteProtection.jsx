// components/core/PrivateRoute.jsx
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function PrivateRoute() {
  const { user, loading } = useAuth();

  // 1️⃣ Still checking token/profile? show a loader (or null)
  if (loading) {
    return <div>Loading...</div>;
  }

  // 2️⃣ Once loading is done: 
  //   • if no user (invalid/no token) → redirect to login
  //   • otherwise render all nested routes
  return user 
    ? <Outlet /> 
    : <Navigate to="/login" replace />;
}

export function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // if no user, redirect to login; if not admin, redirect to dashboard
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === 'admin'
    ? <Outlet />
    : <Navigate to="/" replace />;
}



