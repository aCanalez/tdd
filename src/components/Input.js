import React from "react";

const Input = (props) => {
  const { id, label, onChange, help, type } = props;
  let inputClass = "form-control";
  if (help) {
    inputClass += " is-invalid";
  }
  return (
    <div className="mb-3">
      <label htmlFor={id}>{label}</label>
      <input
        alt="input"
        placeholder={label}
        className={inputClass}
        id={id}
        onChange={onChange}
        type={type || "text"}
      />
      {help && (
        <span data-testid="feedback" className="invalid-feedback">
          {help}
        </span>
      )}
    </div>
  );
};

export default Input;
