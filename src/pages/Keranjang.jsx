import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import ConfirmModal from '../components/ConfirmModal';
import './Keranjang.css';

// --- Static Data (can be replaced with API calls later) ---
const staticUserData = { nama: 'Tok Dalang' };
const staticAddresses = [
  {
    id: 1,
    namaPenerima: 'Rumah Tok Dalang (Utama)',
    detail: 'Jl. Merdeka No. 10, RT 01 RW 02, Kel. Sentosa, Kec. Jaya',
    kota: 'Bandung, 40292',
    isDefault: true,
  },
  {
    id: 2,
    namaPenerima: 'Kantor Tok Dalang',
    detail: 'Gedung Biru Lantai 5, Kawasan Industri',
    kota: 'Jakarta Pusat, 10250',
    isDefault: false,
  },
];
// --- End of Static Data ---

function Keranjang() {
  const { cartItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [viewMode, setViewMode] = useState('cart');
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [deliveryType, setDeliveryType] = useState('kirim');
  const [shippingCost, setShippingCost] = useState(15000);
  const defaultAddress = useMemo(() => staticAddresses.find(addr => addr.isDefault), []);
  const [selectedAddress, setSelectedAddress] = useState(defaultAddress);
  const [notes, setNotes] = useState('');

  // --- MEMOIZED VALUES ---
  const invoiceNumber = useMemo(() => `INV-${Date.now()}`, [viewMode]);
  const totalBayar = totalPrice + shippingCost;

  // --- HANDLER FUNCTIONS ---
  const closeModal = () => setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const handleIncrease = (id, quantity) => updateQuantity(id, quantity + 1);

  const handleConfirmDelete = (id) => {
    removeFromCart(id);
    closeModal();
  };

  const handleDecrease = (id, quantity) => {
    if (quantity === 1) {
      setModalState({
        isOpen: true,
        title: 'Konfirmasi Hapus',
        message: 'Jumlah akan menjadi 0. Hapus produk ini dari keranjang?',
        onConfirm: () => handleConfirmDelete(id),
      });
    } else {
      updateQuantity(id, quantity - 1);
    }
  };

  const handleRemove = (id, name) => {
    setModalState({
      isOpen: true,
      title: 'Konfirmasi Hapus',
      message: `Anda yakin ingin menghapus "${name}" dari keranjang?`,
      onConfirm: () => handleConfirmDelete(id),
    });
  };

  const handleDeliveryChange = (type) => {
    setDeliveryType(type);
    setShippingCost(type === 'ambil' ? 0 : 15000);
  };

  const handleAddressChange = (event) => {
    const addressId = parseInt(event.target.value, 10);
    const newAddress = staticAddresses.find(addr => addr.id === addressId);
    setSelectedAddress(newAddress);
  };

  const handleCreateOrder = () => {
    if (deliveryType === 'kirim' && !selectedAddress) {
      alert('Silakan pilih alamat tujuan pengiriman.');
      return;
    }
    const orderDetails = { invoiceNumber, deliveryType, address: deliveryType === 'kirim' ? selectedAddress : 'Ambil di Toko', recipientName: deliveryType === 'kirim' ? selectedAddress.namaPenerima : staticUserData.nama, items: cartItems, subtotal: totalPrice, shippingCost, total: totalBayar, notes };
    console.log('FINAL ORDER DETAILS:', orderDetails);
    alert('Pesanan berhasil dibuat! Detailnya ada di console. Anda akan diarahkan ke halaman utama.');
    clearCart();
    navigate('/');
  };

  // --- RENDER LOGIC ---

  if (cartItems.length === 0 && viewMode === 'cart') {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <h2>Keranjang Belanja Anda Kosong</h2>
          <p>Sepertinya Anda belum menambahkan produk apapun ke keranjang.</p>
          <Link to="/" className="back-to-shop-btn">Mulai Belanja</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmModal isOpen={modalState.isOpen} title={modalState.title} message={modalState.message} onConfirm={modalState.onConfirm} onCancel={closeModal} />
      <div className="cart-page">
        <h1>{viewMode === 'cart' ? 'Keranjang Saya' : 'Konfirmasi Pesanan'}</h1>

        {viewMode === 'cart' ? (
          // --- CART VIEW ---
          <div className="cart-content">
            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
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
                    <button onClick={() => handleRemove(item.id, item.name)} className="remove-item-btn">&times;</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h2>Ringkasan Pesanan</h2>
              <div className="summary-line">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} item)</span>
                <span>Rp{totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="summary-line total">
                <span>Total</span>
                <span>Rp{totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <button className="checkout-btn-final" onClick={() => setViewMode('checkout')}>
                Lanjut ke Pembayaran
              </button>
            </div>
          </div>
        ) : (
          // --- CHECKOUT VIEW ---
          <div className="checkout-view-layout">
            <div className="checkout-details">
              <div className="info-box"><p><strong>No. Nota:</strong> {invoiceNumber}</p></div>
              <div className="delivery-section info-box">
                <h3>Jenis Pengiriman</h3>
                <div className="delivery-options">
                  <button className={`btn-delivery ${deliveryType === 'ambil' ? 'active' : ''}`} onClick={() => handleDeliveryChange('ambil')}>Ambil di Toko</button>
                  <button className={`btn-delivery ${deliveryType === 'kirim' ? 'active' : ''}`} onClick={() => handleDeliveryChange('kirim')}>Kirim ke Tujuan</button>
                </div>
              </div>
              {deliveryType === 'kirim' && (
                <div className="address-section info-box">
                  <h3>Alamat Tujuan</h3>
                  <select onChange={handleAddressChange} value={selectedAddress.id} className="address-select">
                    {staticAddresses.map(addr => (<option key={addr.id} value={addr.id}>{addr.namaPenerima}</option>))}
                  </select>
                  <div className="address-display">
                    <p><strong>Penerima:</strong> {selectedAddress.namaPenerima}</p>
                    <p>{selectedAddress.detail}, {selectedAddress.kota}</p>
                  </div>
                </div>
              )}
              <div className="notes-section info-box">
                <h3>Catatan untuk Admin</h3>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Misal: Bungkus kado untuk ulang tahun." className="notes-textarea"></textarea>
              </div>
            </div>
            <div className="transaksi-summary">
              <h3>Ringkasan Pesanan</h3>
              <div className="summary-items">
                {cartItems.map(item => (<div key={item.id} className="summary-item"><span>{item.name} (x{item.quantity})</span><span>Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span></div>))}
              </div>
              <div className="summary-line"><span>Subtotal</span><span>Rp{totalPrice.toLocaleString('id-ID')}</span></div>
              <div className="summary-line"><span>Biaya Ongkir</span><span>Rp{shippingCost.toLocaleString('id-ID')}</span></div>
              <div className="summary-line total"><span>Total Bayar</span><span>Rp{totalBayar.toLocaleString('id-ID')}</span></div>
              <div className="checkout-actions">
                <button className="btn-back" onClick={() => setViewMode('cart')}>Kembali ke Keranjang</button>
                <button className="checkout-btn-final" onClick={handleCreateOrder}>Buat Pesanan</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Keranjang;
