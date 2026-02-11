import React from "react";
import { Button } from "./Button";

interface ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label="Close modal">
            ✕
          </Button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
};
