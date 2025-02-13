import React from "react";
import '../../styles/components/Modal.css';

const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null; // No mostrar nada si el modal está cerrado

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div class="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
