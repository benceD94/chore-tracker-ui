import { Button } from "@mui/material";
import React from "react";
import { Link, Outlet } from "react-router";
import { useAuth } from "./authentication/AuthContext";

export const AppLayout: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 220, padding: 16, borderRight: "1px solid #eee" }}>
        <Button variant="contained" size="small" onClick={() => logout()}>Logout</Button>
        <h2>Chore Tracker</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/chores">Chores</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/household">Household</Link>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
};
