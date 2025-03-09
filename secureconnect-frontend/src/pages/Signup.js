import React, { useState, useEffect } from "react";
import InputField from "../components/InputField";
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [touched, setTouched] = useState({
    username: false,
    password: false,
    confirmPassword: false
  });
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(2);
  const navigate = useNavigate();

  // Handle countdown and redirect after successful signup
  useEffect(() => {
    let timer;
    if (signupSuccess && redirectCountdown > 0) {
      timer = setTimeout(() => {
        setRedirectCountdown(prev => prev - 1);
      }, 1000);
    } else if (signupSuccess && redirectCountdown === 0) {
      navigate("/login");
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [signupSuccess, redirectCountdown, navigate]);

  // Validate username
  const validateUsername = (value) => {
    if (!value) {
      // Return empty string (no error) when field is empty
      return "";
    } else if (value.length < 8) {
      return "Username must be at least 8 characters long";
    }
    return "";
  };

  // Validate password
  const validatePassword = (value) => {
    if (!value) {
      // Return empty string (no error) when field is empty
      return "";
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/;
      if (!passwordRegex.test(value)) {
        return "Password must contain uppercase, lowercase, and special character";
      }
    }
    return "";
  };

  // Validate confirm password
  const validateConfirmPassword = (value) => {
    if (!value) {
      // Return empty string (no error) when field is empty
      return "";
    } else if (value !== password) {
      return "Passwords do not match";
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
    
    // Update password error
    const passwordError = validatePassword(value);
    
    // Also update confirmPassword validation if it's been touched and not empty
    let confirmPasswordError = errors.confirmPassword;
    if (touched.confirmPassword && confirmPassword) {
      confirmPasswordError = confirmPassword !== value ? "Passwords do not match" : "";
    }
    
    setErrors(prev => ({ 
      ...prev, 
      password: passwordError,
      confirmPassword: confirmPasswordError
    }));
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setTouched(prev => ({ ...prev, confirmPassword: true }));
    setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(value) }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      username: true,
      password: true,
      confirmPassword: true
    });
    
    // For form submission, we DO want to validate empty fields
    const validateForSubmission = (field, value) => {
      if (!value) {
        return `${field} is required`;
      }
      
      if (field === 'Username') {
        return value.length < 8 ? "Username must be at least 8 characters long" : "";
      } else if (field === 'Password') {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/;
        return !passwordRegex.test(value) ? 
          "Password must contain uppercase, lowercase, and special character" : "";
      } else if (field === 'Confirm Password') {
        return value !== password ? "Passwords do not match" : "";
      }
      
      return "";
    };
    
    // Validate all fields before submission
    const usernameError = validateForSubmission('Username', username);
    const passwordError = validateForSubmission('Password', password);
    const confirmPasswordError = validateForSubmission('Confirm Password', confirmPassword);
    
    setErrors({
      username: usernameError,
      password: passwordError,
      confirmPassword: confirmPasswordError
    });

    if (usernameError || passwordError || confirmPasswordError) {
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/signup", {
        username,
        password,
      });
      
      // Set signup success state instead of alert
      setSignupSuccess(true);
      setFormError("");
      
    } catch (err) {
      setFormError(err.response?.data?.error || "Signup failed!");
    }
  };

  // Get all active error messages
  const getErrorMessages = () => {
    const errorMessages = [];
    if (errors.username) errorMessages.push(errors.username);
    if (errors.password) errorMessages.push(errors.password);
    if (errors.confirmPassword) errorMessages.push(errors.confirmPassword);
    return errorMessages;
  };

  // Render success dialog if signup was successful
  if (signupSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-box success-box">
          <div className="success-icon">✓</div>
          <h2>Registration Successful!</h2>
          <p>Your account has been created successfully.</p>
          <p>Redirecting to login page in {redirectCountdown} seconds...</p>
          <button 
            className="auth-button" 
            onClick={() => navigate("/login")}
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Signup</h2>
        
        {/* Display validation errors in one place */}
        <div className="validation-errors">
          {getErrorMessages().map((error, index) => (
            <p key={index} className="error-text">{error}</p>
          ))}
        </div>
        
        <form onSubmit={handleSignup}>
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
          <PasswordStrengthIndicator password={password} />
          <InputField
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            error={errors.confirmPassword}
          />
          
          {/* Display authentication errors above the button */}
          {formError && (
            <div className="auth-error">
              <p className="error-text">{formError}</p>
            </div>
          )}
          
          <button className="auth-button" type="submit">Signup</button>
        </form>
        <div className="auth-links">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
