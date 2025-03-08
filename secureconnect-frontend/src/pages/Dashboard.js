import "../styles/Auth.css";

import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username"); // Get username from localStorage


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="auth-container">
    <div className="auth-box">
      <h2>Hello, {username || "User"}! Welcome to SecureConnect!</h2>
      <button className="auth-button logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  </div>
  );
};

export default Dashboard;
