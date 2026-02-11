import React from "react";

interface LayoutProps {
  header?: React.ReactNode;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ header, children }) => {
  return (
    <div className="app-root">
      {header && <header>{header}</header>}
      <main className="app-main">{children}</main>
    </div>
  );
};
