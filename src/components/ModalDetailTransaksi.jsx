import React from 'react';

// Hapus impor CSS di sini

function ModalDetailTransaksi({ order, onClose, formatRupiah }) {
  // Logic perhitungan (tetap sama)
  const totalItemsPrice = order.items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shippingFee = order.total - totalItemsPrice;
  
  // Helper untuk kelas status di modal
  const statusClass = order.status.split(' ')[0].toLowerCase(); 

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2>Detail Transaksi #{order.id}</h2>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-status-info">
            <p>Status: <span className={`modal-status-badge status-${statusClass}`}>{order.status}</span></p>
            <p>Tanggal: <strong>{order.date}</strong></p>
        </div>

        <div className="modal-body-list">
          <h3>Daftar Barang ({order.items.length} jenis)</h3>
          
          {order.items.map((item, index) => (
            <div key={index} className="modal-item-row">
              <span className="item-name">{item.name}</span>
              <span className="item-qty">x {item.qty}</span>
              <span className="item-price">{formatRupiah(item.price * item.qty)}</span>
            </div>
          ))}

          <div className="modal-summary">
            <div className="summary-row">
              <span>Subtotal Barang:</span>
              <strong>{formatRupiah(totalItemsPrice)}</strong>
            </div>
            <div className="summary-row">
              <span>Biaya Pengiriman:</span>
              <strong>{formatRupiah(shippingFee)}</strong>
            </div>
            <div className="summary-row total-final">
              <span>Total Akhir:</span>
              <strong>{formatRupiah(order.total)}</strong>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ModalDetailTransaksi;