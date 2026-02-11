import React from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  allowEmptyOption?: boolean;
  emptyLabel?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      id,
      options,
      allowEmptyOption = false,
      emptyLabel = "Select...",
      ...rest
    },
    ref
  ) => {
    const selectId = id ?? rest.name;
    return (
      <div className="field">
        {label && (
          <label className="field__label" htmlFor={selectId}>
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`field__input field__input--select ${
            error ? "field__input--error" : ""
          }`}
          {...rest}
        >
          {allowEmptyOption && <option value="">{emptyLabel}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <div className="field__error">{error}</div>}
      </div>
    );
  }
);

Select.displayName = "Select";
