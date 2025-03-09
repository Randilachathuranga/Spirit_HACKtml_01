import React from "react";
import "../styles/Dashboard.css";
import Navbar from "../components/Navbar";

const Dashboard = () => {
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
        <h2>Hello, {username || "User"}! Welcome to SecureConnect!</h2>
        <p>Your personalized dashboard is now ready.</p>
      </div>
    </div>
  );
};

export default Dashboard;
