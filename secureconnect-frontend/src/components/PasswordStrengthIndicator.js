import React from 'react';
import '../styles/PasswordStrengthIndicator.css';

const PasswordStrengthIndicator = ({ password }) => {
  // Calculate password strength
  const calculateStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength += 1; // lowercase
    if (/[A-Z]/.test(password)) strength += 1; // uppercase
    if (/[0-9]/.test(password)) strength += 1; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1; // special characters
    
    // Normalize to 0-4 scale
    return Math.min(4, Math.floor(strength / 1.5));
  };
  
  const getStrengthLabel = (strengthScore) => {
    switch (strengthScore) {
      case 0: return "Very Weak";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      default: return "";
    }
  };
  
  const getStrengthColor = (strengthScore) => {
    switch (strengthScore) {
      case 0: return "#ff3860"; // red
      case 1: return "#ff8c00"; // dark orange
      case 2: return "#ffcc00"; // yellow
      case 3: return "#9acd32"; // yellowgreen
      case 4: return "#32cd32"; // limegreen
      default: return "#cccccc"; // gray
    }
  };
  
  const strengthScore = calculateStrength(password);
  const strengthLabel = getStrengthLabel(strengthScore);
  const strengthColor = getStrengthColor(strengthScore);
  
  // Only show indicator if user has started typing a password
  if (!password) return null;
  
  return (
    <div className="password-strength-indicator">
      <div className="strength-bars">
        {[...Array(4)].map((_, index) => (
          <div 
            key={index} 
            className="strength-bar"
            style={{
              backgroundColor: index < strengthScore ? strengthColor : '#ddd',
              width: `${100 / 4}%`
            }}
          />
        ))}
      </div>
      <div className="strength-label" style={{ color: strengthColor }}>
        Password strength: <strong>{strengthLabel}</strong>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator; 