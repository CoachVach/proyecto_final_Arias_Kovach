import React from 'react';

const FormInput = ({ label, type, id, name, value, onChange, required }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

export default FormInput;
