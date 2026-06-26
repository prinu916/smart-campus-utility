import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const ProtectedRoute = ({
  children,
  adminOnly = false,
  studentOnly = false,
}) => {
  const { user, loading, isAdmin, isStudent, getDashboardPath } = useAuth();
  const location = useLocation();

  // Show loader while checking auth
  if (loading) {
    return <Loader />;
  }

  // User not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Admin Route Protection
  if (adminOnly && !isAdmin) {
    return <Navigate to={getDashboardPath(user)} replace />;
  }

  // Student Route Protection
  if (studentOnly && !isStudent) {
    return <Navigate to={getDashboardPath(user)} replace />;
  }

  return children;
};

export default ProtectedRoute;