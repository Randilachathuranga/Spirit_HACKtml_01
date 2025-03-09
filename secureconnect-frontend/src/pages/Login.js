import React, { useState } from "react";

import InputField from "../components/InputField";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    password: ""
  });
  const [touched, setTouched] = useState({
    username: false,
    password: false
  });
  const navigate = useNavigate();

  // Validate username
  const validateUsername = (value) => {
    // No error for empty fields during typing
    if (!value) {
      return "";
    }
    return "";
  };

  // Validate password
  const validatePassword = (value) => {
    // No error for empty fields during typing
    if (!value) {
      return "";
    }
    return "";
  };

  // Handle username change
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setTouched(prev => ({ ...prev, username: true }));
    setErrors(prev => ({ ...prev, username: validateUsername(value) }));
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setTouched(prev => ({ ...prev, password: true }));
    setErrors(prev => ({ ...prev, password: validatePassword(value) }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      username: true,
      password: true
    });
    
    // For form submission, we DO want to validate empty fields
    const validateForSubmission = (field, value) => {
      if (!value) {
        return `${field} is required`;
      }
      return "";
    };
    
    // Validate all fields before submission
    const usernameError = validateForSubmission('Username', username);
    const passwordError = validateForSubmission('Password', password);
    
    setErrors({
      username: usernameError,
      password: passwordError
    });

    if (usernameError || passwordError) {
      return;
    }

    try {
      // First, authenticate the user by sending username and password
      const res = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });
  
      localStorage.setItem("token", res.data.token); // Store token
      localStorage.setItem("username", username);
  
      // Fetch user role from /get-role route
      const roleRes = await axios.post("http://localhost:5000/api/get-role", {
        username,
        password,
      });
  
      // Store the role in localStorage
      localStorage.setItem("role", roleRes.data.role);
  
      // Check role and navigate accordingly
      if (roleRes.data.role === "admin") {
        navigate("/admindashboard"); // Navigate to admin dashboard if role is admin
      } else {
        navigate("/dashboard"); // Navigate to user dashboard if role is user
      }
    } catch (err) {
      setFormError(err.response?.data?.error || "Login failed!");
    }
  };
  
  // Function to navigate to GuestHomePage
  const handleGuestLogin = () => {
    localStorage.setItem("username", "Guest");
    navigate("/");
  };

  // Get all active error messages
  const getErrorMessages = () => {
    const errorMessages = [];
    if (errors.username) errorMessages.push(errors.username);
    if (errors.password) errorMessages.push(errors.password);
    return errorMessages;
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        
        {/* Display validation errors in one place */}
        <div className="validation-errors">
          {getErrorMessages().map((error, index) => (
            <p key={index} className="error-text">{error}</p>
          ))}
        </div>
        
        <form onSubmit={handleLogin}>
          <InputField
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            error={errors.username}
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            error={errors.password}
          />
          
          {/* Display authentication errors above the button */}
          {formError && (
            <div className="auth-error">
              <p className="error-text">{formError}</p>
            </div>
          )}
          
          <div className="auth-button-group">  
            <button className="auth-button" type="submit">
              Login
            </button>
            <button type="button" className="auth-button" onClick={handleGuestLogin}>
              Login as a Guest
            </button>
          </div>
        </form>
        <div className="auth-links">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
