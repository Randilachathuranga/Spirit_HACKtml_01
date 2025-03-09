import React from "react";
import "../styles/GuestHome.css";
import Navbar from "../components/Navbar";

const GuestHomePage = () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  return (
    <div>
      <Navbar 
        isLoggedIn={!!token} 
        username={username} 
        role={role}
      />

      <div className="guest-home-content">
        <h2>Welcome to SecureConnect</h2>
        <p>Your secure authentication system for a safe and personalized experience.</p>
      </div>
    </div>
  );
};

export default GuestHomePage;
