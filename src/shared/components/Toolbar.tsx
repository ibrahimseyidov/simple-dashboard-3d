import React from "react";

interface ToolbarProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export const Toolbar: React.FC<ToolbarProps> = ({ left, right }) => {
  return (
    <div className="toolbar">
      <div className="toolbar__left">{left}</div>
      <div className="toolbar__right">{right}</div>
    </div>
  );
};
