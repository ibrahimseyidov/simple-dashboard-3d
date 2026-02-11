import React from "react";

interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange
}) => {
  return (
    <div className="field">
      {label && <label className="field__label">{label}</label>}
      <div className="color-picker">
        <input
          type="color"
          className="color-picker__input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="color-picker__value">{value.toUpperCase()}</span>
      </div>
    </div>
  );
};
