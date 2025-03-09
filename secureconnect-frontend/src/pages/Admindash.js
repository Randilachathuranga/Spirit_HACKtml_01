import React from 'react';
import "../styles/Dashboard.css";
import Navbar from "../components/Navbar";

const Admindash = () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  return (
    <div className="dashboard-container">
      <Navbar 
        isLoggedIn={!!token} 
        username={username} 
        role={role}
      />

      <div className="dashboard-content">
        <h2>Admin Dashboard</h2>
        <p>Welcome to the admin dashboard, {username}.</p>
        <div className="admin-controls">
          {/* Admin controls can be added here */}
        </div>
      </div>
    </div>
  );
};

export default Admindash;
