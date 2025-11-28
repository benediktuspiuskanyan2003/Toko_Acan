import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import ConfirmModal from '../components/ConfirmModal';
import SuccessModal from '../components/SuccessModal'; // NEW: Import the new success modal
import './Keranjang.css';

// Static data remains the same
const staticUserData = { nama: 'Tok Dalang' };
const staticAddresses = [
  { id: 1, namaPenerima: 'Rumah Tok Dalang (Utama)', detail: 'Jl. Merdeka No. 10, RT 01 RW 02, Kel. Sentosa, Kec. Jaya', kota: 'Bandung, 40292', isDefault: true },
  { id: 2, namaPenerima: 'Kantor Tok Dalang', detail: 'Gedung Biru Lantai 5, Kawasan Industri', kota: 'Jakarta Pusat, 10250', isDefault: false },
];

function Keranjang() {
  const { cartItems, removeFromCart, updateQuantity, toggleItemSelection, toggleAllItems, removeSelectedItems } = useCart();
  const navigate = useNavigate();

  // --- LOCAL STATE ---
  const [viewMode, setViewMode] = useState('cart');
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [deliveryType, setDeliveryType] = useState('kirim');
  const [shippingCost, setShippingCost] = useState(15000);
  const defaultAddress = useMemo(() => staticAddresses.find(addr => addr.isDefault), []);
  const [selectedAddress, setSelectedAddress] = useState(defaultAddress);
  const [notes, setNotes] = useState('');

  // NEW: State for the custom success modal
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [currentInvoiceNumber, setCurrentInvoiceNumber] = useState('');


  // --- DERIVED AND MEMOIZED STATE ---
  const selectedItems = useMemo(() => cartItems.filter(item => item.selected), [cartItems]);
  const currentTotalPrice = useMemo(() => selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0), [selectedItems]);
  const currentTotalItems = useMemo(() => selectedItems.reduce((total, item) => total + item.quantity, 0), [selectedItems]);
  const isAllSelected = useMemo(() => cartItems.length > 0 && selectedItems.length === cartItems.length, [cartItems, selectedItems]);
  
  const invoiceNumber = useMemo(() => `INV-${Date.now()}`, [viewMode]);
  const totalBayar = currentTotalPrice + (deliveryType === 'kirim' ? shippingCost : 0);

  
  // --- HANDLER FUNCTIONS ---
  const closeModal = () => setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const handleConfirmDelete = (id) => { removeFromCart(id); closeModal(); };
  const handleIncrease = (id, quantity) => updateQuantity(id, quantity + 1);
  const handleDecrease = (id, quantity) => {
    if (quantity === 1) {
      setModalState({ isOpen: true, title: 'Konfirmasi Hapus', message: 'Jumlah akan menjadi 0. Hapus produk ini dari keranjang?', onConfirm: () => handleConfirmDelete(id) });
    } else { updateQuantity(id, quantity - 1); }
  };
  const handleRemove = (id, name) => setModalState({ isOpen: true, title: 'Konfirmasi Hapus', message: `Anda yakin ingin menghapus "${name}" dari keranjang?`, onConfirm: () => handleConfirmDelete(id) });
  const handleDeliveryChange = (type) => { setDeliveryType(type); setShippingCost(type === 'ambil' ? 0 : 15000); };
  const handleAddressChange = (event) => { const addressId = parseInt(event.target.value, 10); const newAddress = staticAddresses.find(addr => addr.id === addressId); setSelectedAddress(newAddress); };

  // MODIFIED: This function now opens the custom success modal instead of showing an alert
  const handleCreateOrder = () => {
    if (selectedItems.length === 0) { alert('Tidak ada produk yang dipilih untuk di-checkout.'); return; }
    if (deliveryType === 'kirim' && !selectedAddress) { alert('Silakan pilih alamat tujuan pengiriman.'); return; }
    
    const finalInvoiceNumber = `INV-${Date.now()}`;
    setCurrentInvoiceNumber(finalInvoiceNumber);

    const orderDetails = { 
      invoiceNumber: finalInvoiceNumber, 
      deliveryType, 
      paymentMethod: 'Transfer Bank', 
      address: deliveryType === 'kirim' ? selectedAddress : 'Ambil di Toko', 
      recipientName: deliveryType === 'kirim' ? selectedAddress.namaPenerima : staticUserData.nama, 
      items: selectedItems, 
      subtotal: currentTotalPrice, 
      shippingCost: deliveryType === 'kirim' ? shippingCost : 0, 
      total: totalBayar, 
      notes 
    };
    
    console.log('FINAL ORDER DETAILS:', orderDetails);
    setSuccessModalOpen(true); // Open the custom modal
  };

  // NEW: Handler for closing the success modal and performing final actions
  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
    removeSelectedItems();
    navigate('/');
  };

  // --- RENDER LOGIC ---
  if (cartItems.length === 0 && !successModalOpen) {
    return (
      <div className="cart-page"><div className="cart-empty"><h2>Keranjang Belanja Anda Kosong</h2><p>Sepertinya Anda belum menambahkan produk apapun ke keranjang.</p><Link to="/" className="back-to-shop-btn">Mulai Belanja</Link></div></div>
    );
  }

  return (
    <>
      {/* MODALS */}
      <ConfirmModal isOpen={modalState.isOpen} title={modalState.title} message={modalState.message} onConfirm={modalState.onConfirm} onCancel={closeModal} />
      <SuccessModal 
        isOpen={successModalOpen} 
        title="Pesanan Berhasil Dibuat!" 
        message="Terima kasih telah berbelanja. Detail pesanan Anda telah dicatat. Silakan lanjutkan pembayaran agar pesanan Anda dapat segera diproses."
        invoiceNumber={currentInvoiceNumber}
        onClose={handleCloseSuccessModal}
      />

      <div className="cart-page">
        <h1>{viewMode === 'cart' ? 'Keranjang Saya' : 'Konfirmasi Pesanan'}</h1>

        {viewMode === 'cart' ? (
          <div className="cart-content">
             {/* ... cart view content ... */}
            <div className="cart-items-list">
              <div className="cart-list-header">
                <input type="checkbox" id="select-all" checked={isAllSelected} onChange={() => toggleAllItems(!isAllSelected)} />
                <label htmlFor="select-all">Pilih Semua ({cartItems.length} produk)</label>
              </div>
              {cartItems.map(item => (
                <div key={item.id} className={`cart-item ${!item.selected ? 'item-deselected' : ''}`}>
                  <input type="checkbox" className="item-checkbox" checked={item.selected} onChange={() => toggleItemSelection(item.id)} />
                  <div className="cart-item-main">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-info">
                      <p className="cart-item-name">{item.name}</p>
                      <p className="cart-item-price">Rp{item.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="cart-item-controls">
                    <div className="cart-item-quantity">
                      <button onClick={() => handleDecrease(item.id, item.quantity)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleIncrease(item.id, item.quantity)}>+</button>
                    </div>
                    <p className="cart-item-total">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</p>
                    <button onClick={() => handleRemove(item.id, item.name)} className="remove-item-btn" title="Hapus item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h2>Ringkasan Pesanan</h2>
              <div className="summary-line">
                <span>Subtotal ({currentTotalItems} item)</span>
                <span>Rp{currentTotalPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="summary-line total">
                <span>Total</span>
                <span>Rp{currentTotalPrice.toLocaleString('id-ID')}</span>
              </div>
              <button className="checkout-btn-final" onClick={() => setViewMode('checkout')} disabled={selectedItems.length === 0}>
                Checkout ({currentTotalItems})
              </button>
            </div>
          </div>
        ) : (
          <div className="checkout-view-layout">
            {/* ... checkout view content ... */}
            <div className="checkout-details"> 
              <div className="info-box"><p><strong>No. Nota:</strong> {invoiceNumber}</p></div>
              <div className="delivery-section info-box"><h3>Jenis Pengiriman</h3><div className="delivery-options"><button className={`btn-delivery ${deliveryType === 'ambil' ? 'active' : ''}`} onClick={() => handleDeliveryChange('ambil')}>Ambil di Toko</button><button className={`btn-delivery ${deliveryType === 'kirim' ? 'active' : ''}`} onClick={() => handleDeliveryChange('kirim')}>Kirim ke Tujuan</button></div></div>
              {deliveryType === 'kirim' && (
                <div className="address-section info-box"><h3>Alamat Tujuan</h3><select onChange={handleAddressChange} value={selectedAddress.id} className="address-select">{staticAddresses.map(addr => (<option key={addr.id} value={addr.id}>{addr.namaPenerima}</option>))}</select><div className="address-display"><p><strong>Penerima:</strong> {selectedAddress.namaPenerima}</p><p>{selectedAddress.detail}, {selectedAddress.kota}</p></div></div>
              )}
              <div className="payment-section info-box">
                <h3>Metode Pembayaran</h3>
                <div className="payment-method-display">
                  <span>Transfer Bank</span>
                </div>
              </div>
              <div className="notes-section info-box"><h3>Catatan untuk Admin</h3><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Misal: Bungkus kado untuk ulang tahun." className="notes-textarea"></textarea></div>
            </div>
            <div className="transaksi-summary">
              <h3>Ringkasan Pesanan</h3>
              <div className="summary-items">
                {selectedItems.map(item => (<div key={item.id} className="summary-item"><span>{item.name} (x{item.quantity})</span><span>Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span></div>))}
              </div>
              <div className="summary-line"><span>Subtotal</span><span>Rp{currentTotalPrice.toLocaleString('id-ID')}</span></div>
              <div className="summary-line"><span>Biaya Ongkir</span><span>Rp{(deliveryType === 'kirim' ? shippingCost : 0).toLocaleString('id-ID')}</span></div>
              <div className="summary-line total"><span>Total Bayar</span><span>Rp{totalBayar.toLocaleString('id-ID')}</span></div>
              <div className="checkout-actions"><button className="btn-back" onClick={() => setViewMode('cart')}>Kembali ke Keranjang</button><button className="checkout-btn-final" onClick={handleCreateOrder}>Buat Pesanan</button></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Keranjang;
