import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, ...rest }, ref) => {
    const inputId = id ?? rest.name;
    return (
      <div className="field">
        {label && (
          <label className="field__label" htmlFor={inputId}>
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`field__input ${error ? "field__input--error" : ""}`}
          {...rest}
        />
        {error && <div className="field__error">{error}</div>}
      </div>
    );
  }
);

Input.displayName = "Input";
