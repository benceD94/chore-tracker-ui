import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../AuthContext/hooks";

export const RootRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};
