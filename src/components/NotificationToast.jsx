import React, { useEffect } from 'react';
import './NotificationToast.css';

function NotificationToast({ message, type = 'success', onClose }) {
  // Secara otomatis menutup toast setelah 3 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    // Membersihkan timer jika komponen dilepas atau onClose berubah
    return () => clearTimeout(timer);
  }, [onClose]);

  // Menentukan ikon dan kelas berdasarkan tipe prop
  const icon = type === 'success' ? '✓' : '!';
  const toastClass = `notification-toast ${type}`;

  return (
    <div className={toastClass}>
      <div className="toast-icon">{icon}</div>
      <p className="toast-message">{message}</p>
      <button className="toast-close-btn" onClick={onClose}>&times;</button>
    </div>
  );
}

export default NotificationToast;
