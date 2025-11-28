import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import ConfirmModal from '../components/ConfirmModal';
import SuccessModal from '../components/SuccessModal';
import { PlusIcon, MinusIcon } from '../components/Icons.jsx';
// We are reusing the product detail CSS for a consistent look and feel
import './ProductDetail.css'; 
// We will also keep Keranjang.css for any specific overrides if needed
import './Keranjang.css'; 

const staticUserData = { nama: 'Tok Dalang' };
const staticAddresses = [
  { id: 1, namaPenerima: 'Rumah Tok Dalang (Utama)', detail: 'Jl. Merdeka No. 10, RT 01 RW 02, Kel. Sentosa, Kec. Jaya', kota: 'Bandung, 40292', isDefault: true },
  { id: 2, namaPenerima: 'Kantor Tok Dalang', detail: 'Gedung Biru Lantai 5, Kawasan Industri', kota: 'Jakarta Pusat, 10250', isDefault: false },
];
const MIN_SHIPPING_ORDER = 500000;

function Keranjang() {
  const { cartItems, removeFromCart, updateQuantity, toggleItemSelection, toggleAllItems, removeSelectedItems } = useCart();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('cart');
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [deliveryType, setDeliveryType] = useState('kirim');
  const [shippingCost, setShippingCost] = useState(15000);
  const defaultAddress = useMemo(() => staticAddresses.find(addr => addr.isDefault), []);
  const [selectedAddress, setSelectedAddress] = useState(defaultAddress);
  const [notes, setNotes] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [currentInvoiceNumber, setCurrentInvoiceNumber] = useState('');

  const selectedItems = useMemo(() => cartItems.filter(item => item.selected), [cartItems]);
  const currentTotalPrice = useMemo(() => selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0), [selectedItems]);
  const currentTotalItems = useMemo(() => selectedItems.reduce((total, item) => total + item.quantity, 0), [selectedItems]);
  const isAllSelected = useMemo(() => cartItems.length > 0 && selectedItems.length === cartItems.length, [cartItems, selectedItems]);
  
  const canShip = useMemo(() => currentTotalPrice >= MIN_SHIPPING_ORDER, [currentTotalPrice]);

  useEffect(() => {
    if (deliveryType === 'kirim' && !canShip) {
      setDeliveryType('ambil');
      setShippingCost(0);
    }
  }, [canShip, deliveryType]);

  const invoiceNumber = useMemo(() => `INV-${Date.now()}`, [viewMode]);
  const totalBayar = currentTotalPrice + (deliveryType === 'kirim' && canShip ? shippingCost : 0);

  const closeModal = () => setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const handleConfirmDelete = (id) => { removeFromCart(id); closeModal(); };
  const handleIncrease = (id, quantity) => updateQuantity(id, quantity + 1);

  const handleDecrease = (id, quantity) => {
    const item = cartItems.find(cartItem => cartItem.id === id);
    if (!item) return;
    const minQuantity = item.minQuantity || 1;

    if (minQuantity > 1 && quantity === minQuantity) {
      setModalState({
        isOpen: true,
        title: 'Hapus Produk Grosir?',
        message: `Jumlah minimal untuk harga grosir adalah ${minQuantity}. Apakah Anda ingin menghapus produk ini?`,
        onConfirm: () => handleConfirmDelete(id),
      });
    } else if (quantity === 1) {
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

  const handleRemove = (id, name) => setModalState({ isOpen: true, title: 'Konfirmasi Hapus', message: `Anda yakin ingin menghapus "${name}"?`, onConfirm: () => handleConfirmDelete(id) });
  const handleDeliveryChange = (type) => { 
    if (type === 'kirim' && !canShip) return;
    setDeliveryType(type); 
    setShippingCost(type === 'ambil' ? 0 : 15000); 
  };
  const handleAddressChange = (event) => { const addressId = parseInt(event.target.value, 10); const newAddress = staticAddresses.find(addr => addr.id === addressId); setSelectedAddress(newAddress); };

  const handleCreateOrder = () => {
    if (selectedItems.length === 0) { alert('Tidak ada produk yang dipilih.'); return; }
    if (deliveryType === 'kirim' && !selectedAddress) { alert('Silakan pilih alamat pengiriman.'); return; }
    
    const finalInvoiceNumber = `INV-${Date.now()}`;
    setCurrentInvoiceNumber(finalInvoiceNumber);

    const orderDetails = { 
      invoiceNumber: finalInvoiceNumber, 
      deliveryType, 
      paymentMethod: 'Transfer Bank', 
      address: deliveryType === 'kirim' ? selectedAddress : 'Ambil di Toko', 
      items: selectedItems, 
      total: totalBayar, 
      notes 
    };
    
    console.log('FINAL ORDER DETAILS:', orderDetails);
    setSuccessModalOpen(true);
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
    removeSelectedItems();
    navigate('/');
  };

  // --- Empty Cart View ---
  if (cartItems.length === 0 && !successModalOpen) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-container product-not-found">
          <h2 className="product-detail-name">Keranjang Kosong</h2>
          <p>Sepertinya Anda belum menambahkan produk apapun ke keranjang.</p>
          <Link to="/" className="add-to-cart-btn" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto' }}>
            Mulai Belanja
          </Link>
        </div>
      </div>
    );
  }
  
  // --- Main Cart & Checkout View ---
  return (
    <>
      <ConfirmModal isOpen={modalState.isOpen} title={modalState.title} message={modalState.message} onConfirm={modalState.onConfirm} onCancel={closeModal} />
      <SuccessModal 
        isOpen={successModalOpen} 
        title="Pesanan Berhasil Dibuat!" 
        message="Terima kasih telah berbelanja. Silakan lanjutkan pembayaran."
        invoiceNumber={currentInvoiceNumber}
        onClose={handleCloseSuccessModal}
      />

      <div className="product-detail-page">
        <div className="product-detail-container" style={{ display: 'block', maxWidth: '1200px', padding: '20px' }}>
          <h1 className="product-detail-name" style={{ marginBottom: '30px' }}>
            {viewMode === 'cart' ? 'Keranjang Saya' : 'Konfirmasi Pesanan'}
          </h1>

          <div className="cart-layout-grid">
            {/* --- Left Column: Cart Items or Checkout Details --- */}
            <div className="cart-main-content">
              {viewMode === 'cart' ? (
                <>
                  <div className="variant-card select-all-card">
                    <input type="checkbox" id="select-all" checked={isAllSelected} onChange={() => toggleAllItems(!isAllSelected)} />
                    <label htmlFor="select-all">Pilih Semua ({cartItems.length} produk)</label>
                  </div>
                  <div className="variant-card-container">
                    {cartItems.map(item => (
                      <div key={item.id} className={`variant-card ${item.selected ? 'active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => toggleItemSelection(item.id)}>
                        <input 
                          type="checkbox" 
                          className="item-checkbox" 
                          checked={item.selected} 
                          onChange={() => toggleItemSelection(item.id)} // Handles the state change
                          onClick={(e) => e.stopPropagation()} // Prevents the click from bubbling to the parent div
                          style={{marginRight: '15px'}}
                        />
                        <img src={item.image} alt={item.name} className="variant-card-image" />
                        <div className="variant-card-details">
                          <span className="variant-card-name">{item.name}</span>
                          <span className="variant-card-price">Rp{item.price.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="card-quantity-controls" onClick={e => e.stopPropagation()}>
                          <button onClick={(e) => { e.stopPropagation(); handleDecrease(item.id, item.quantity); }}><MinusIcon /></button>
                          <span>{item.quantity}</span>
                          <button onClick={(e) => { e.stopPropagation(); handleIncrease(item.id, item.quantity); }}><PlusIcon /></button>
                        </div>
                         <button onClick={(e) => {e.stopPropagation(); handleRemove(item.id, item.name)}} className="remove-item-btn-new" title="Hapus item">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="checkout-details-container">
                  <div className="total-order-section"><p><strong>No. Nota:</strong> {invoiceNumber}</p></div>
                  <div className="total-order-section">
                    <h3>Jenis Pengiriman</h3>
                    <div className="delivery-options">
                      <button className={`btn-delivery ${deliveryType === 'ambil' ? 'active' : ''}`} onClick={() => handleDeliveryChange('ambil')}>Ambil di Toko</button>
                      <button className={`btn-delivery ${deliveryType === 'kirim' ? 'active' : ''}`} onClick={() => handleDeliveryChange('kirim')} disabled={!canShip} title={!canShip ? `Min. belanja Rp${MIN_SHIPPING_ORDER.toLocaleString('id-ID')}` : 'Kirim'}>
                        Kirim Ke Tujuan {!canShip && `(min. Rp${(MIN_SHIPPING_ORDER/1000)}rb)`}
                      </button>
                    </div>
                  </div>
                  {deliveryType === 'kirim' && canShip && (
                    <div className="total-order-section">
                      <h3>Alamat Tujuan</h3>
                      <select onChange={handleAddressChange} value={selectedAddress.id} className="address-select">{staticAddresses.map(addr => (<option key={addr.id} value={addr.id}>{addr.namaPenerima}</option>))}</select>
                      <div className="address-display"><p><strong>Penerima:</strong> {selectedAddress.namaPenerima}</p><p>{selectedAddress.detail}, {selectedAddress.kota}</p></div>
                    </div>
                  )}
                  <div className="total-order-section"><h3>Metode Pembayaran</h3><div className="payment-method-display">Transfer Bank</div></div>
                  <div className="total-order-section"><h3>Catatan</h3><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan untuk admin..." className="notes-textarea"></textarea></div>
                </div>
              )}
            </div>

            {/* --- Right Column: Summary --- */}
            <div className="cart-summary-sidebar">
              {viewMode === 'cart' ? (
                <div className="total-order-section">
                  <h3>Ringkasan Pesanan</h3>
                  <div className="total-order-row">
                    <span>Subtotal ({currentTotalItems} item)</span>
                    <span>Rp{currentTotalPrice.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="total-order-row grand-total">
                    <span>Total</span>
                    <span>Rp{currentTotalPrice.toLocaleString('id-ID')}</span>
                  </div>
                  <button className="add-to-cart-btn" onClick={() => setViewMode('checkout')} disabled={selectedItems.length === 0}>
                    Checkout ({currentTotalItems})
                  </button>
                </div>
              ) : (
                 <div className="total-order-section">
                  <h3>Ringkasan Pesanan</h3>
                  <div className="summary-items">
                    {selectedItems.map(item => (<div key={item.id} className="total-order-row"><span>{item.name} (x{item.quantity})</span><span>Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span></div>))}
                  </div>
                  <hr/>
                  <div className="total-order-row"><span>Subtotal</span><span>Rp{currentTotalPrice.toLocaleString('id-ID')}</span></div>
                  <div className="total-order-row"><span>Biaya Ongkir</span><span>Rp{(deliveryType === 'kirim' && canShip ? shippingCost : 0).toLocaleString('id-ID')}</span></div>
                  <div className="total-order-row grand-total"><span>Total Bayar</span><span>Rp{totalBayar.toLocaleString('id-ID')}</span></div>
                  <div className="checkout-actions-final">
                    <button className="add-to-cart-btn secondary" onClick={() => setViewMode('cart')}>Kembali</button>
                    <button className="add-to-cart-btn" onClick={handleCreateOrder}>Buat Pesanan</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Keranjang;
