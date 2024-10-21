import React from 'react';
import './Model.css';

const Modal = ({ isOpen, onClose, onConfirm, message, confirmText, cancelText, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{message}</h2>
        {children}
        <div className="modal-buttons">
          <button onClick={onConfirm}>{confirmText}</button>
          <button onClick={onClose}>{cancelText}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
