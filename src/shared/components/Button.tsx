import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  ...rest
}) => {
  const base = "btn";
  const variantClass = `btn--${variant}`;
  return (
    <button className={`${base} ${variantClass} ${className}`} {...rest}>
      {children}
    </button>
  );
};
