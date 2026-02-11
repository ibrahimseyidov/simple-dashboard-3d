import React from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { DesignersPage } from "../pages/DesignersPage";
import { EditorPage } from "../pages/EditorPage";
import { Layout } from "../shared/components/Layout";
import "./layout.css";

export const App: React.FC = () => {
  return (
    <Layout
      header={
        <div className="top-nav">
          <div className="top-nav__title">Simple Dashboard 3D</div>
          <nav className="top-nav__links">
            <NavLink
              to="/designers"
              className={({ isActive }) =>
                isActive ? "top-nav__link top-nav__link--active" : "top-nav__link"
              }
            >
              Designers
            </NavLink>
            <NavLink
              to="/editor"
              className={({ isActive }) =>
                isActive ? "top-nav__link top-nav__link--active" : "top-nav__link"
              }
            >
              Editor
            </NavLink>
          </nav>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Navigate to="/designers" replace />} />
        <Route path="/designers" element={<DesignersPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="*" element={<Navigate to="/designers" replace />} />
      </Routes>
    </Layout>
  );
};
