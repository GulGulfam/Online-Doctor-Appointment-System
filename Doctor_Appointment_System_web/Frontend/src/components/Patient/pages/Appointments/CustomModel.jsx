import React from 'react';
import Modal from 'react-modal';
import './CustomModal.css';

const CustomModal = ({ isOpen, onRequestClose, title, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={title}
      className="custom-modal-content"
      overlayClassName="custom-modal-overlay"
    >
      <h2>{title}</h2>
      <div className="custom-modal-body">
        {children}
      </div>
    </Modal>
  );
};

export default CustomModal;
