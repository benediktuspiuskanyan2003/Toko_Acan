import React from 'react';
import './SuccessModal.css';

function SuccessModal({ isOpen, title, message, invoiceNumber, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="success-modal-overlay">
      <div className="success-modal-content">
        <div className="success-modal-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2>{title}</h2>
        <p>{message}</p>
        {invoiceNumber && <p className="invoice-number">No. Nota: <strong>{invoiceNumber}</strong></p>}
        <button onClick={onClose} className="success-modal-close-btn">
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;