import React from "react";

const InputField = ({ type, placeholder, value, onChange, error, label }) => {
  return (
    <div className="input-field">
      {label && <label>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={error ? "input-error" : ""}
      />
    </div>
  );
};

export default InputField;
