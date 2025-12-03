import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import ConfirmModal from '../components/ConfirmModal';
import SuccessModal from '../components/SuccessModal';
import { PlusIcon, MinusIcon } from '../components/Icons.jsx';
import api from '../services/api'; 

import './ProductDetail.css'; 
import './Keranjang.css'; 

function Keranjang() {
  const { cartItems, removeFromCart, updateQuantity, toggleItemSelection, toggleAllItems, removeSelectedItems } = useCart();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('cart');
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  
  // --- STATE BARU: ALAMAT DARI DATABASE ---
  const [addressList, setAddressList] = useState([]); // List semua alamat user
  const [selectedAddress, setSelectedAddress] = useState(null); // Alamat yang dipilih
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  // State Data Server
  const [deliveryType, setDeliveryType] = useState('ambil'); 
  const [shippingCost, setShippingCost] = useState(0);
  const [serverTotal, setServerTotal] = useState(0); 
  const [canShip, setCanShip] = useState(false); 
  const [loadingCalc, setLoadingCalc] = useState(false);

  const [notes, setNotes] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [currentInvoiceNumber, setCurrentInvoiceNumber] = useState('');

  // Filter item
  const selectedItems = useMemo(() => cartItems.filter(item => item.selected), [cartItems]);
  const isAllSelected = useMemo(() => cartItems.length > 0 && selectedItems.length === cartItems.length, [cartItems, selectedItems]);
  const localSubTotal = useMemo(() => selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0), [selectedItems]);
  const totalItemsCount = useMemo(() => selectedItems.reduce((total, item) => total + item.quantity, 0), [selectedItems]);

  // --- 1. FETCH ALAMAT DARI API ---
  useEffect(() => {
    const fetchUserAddresses = async () => {
        setIsLoadingAddress(true);
        try {
            const response = await api.get('/addresses');
            if (response.data.success) {
                const list = response.data.data;
                setAddressList(list);
                
                // Otomatis pilih alamat UTAMA (default)
                const defaultAddr = list.find(a => a.utama) || list[0];
                if (defaultAddr) setSelectedAddress(defaultAddr);
            }
        } catch (error) {
            console.error("Gagal ambil alamat:", error);
        } finally {
            setIsLoadingAddress(false);
        }
    };

    fetchUserAddresses();
  }, []);


  // --- 2. LOGIC HITUNG KE BACKEND ---
  useEffect(() => {
    const calculateOnServer = async () => {
      if (selectedItems.length === 0) return;

      setLoadingCalc(true);
      try {
        const payloadItems = selectedItems.map(item => ({
          productId: parseInt(item.productId),
          variantId: parseInt(item.variantId),
          variantName: item.variantName,
          quantity: parseInt(item.quantity)
        }));

        const payload = {
            items: payloadItems,
            deliveryType: deliveryType,
            // Opsional: Kirim ID Wilayah biar backend bisa hitung ongkir real (jika ada logic per wilayah)
            id_wilayah: (deliveryType === 'kirim' && selectedAddress) ? selectedAddress.id_wilayah : null
        };

        const response = await api.post('/cart/calculate', payload);
        
        if (response.data) {
           const { shippingCost, canCheckout, availableShipping } = response.data;
           
           setShippingCost(shippingCost);
           // Total server biasanya = Subtotal + Ongkir (kecuali ada diskon lain)
           // Kita gunakan hitungan lokal + ongkir dari server biar responsif
           
           const isDeliveryAllowed = availableShipping.includes('DIANTAR');
           setCanShip(isDeliveryAllowed);

           if (deliveryType === 'kirim' && !isDeliveryAllowed) {
               setDeliveryType('ambil');
           }
        }
      } catch (error) {
        console.error("Gagal hitung keranjang:", error);
      } finally {
        setLoadingCalc(false);
      }
    };

    calculateOnServer();
  }, [selectedItems, deliveryType, selectedAddress]); // Tambah selectedAddress sebagai dependency


  // --- HELPERS ---
  const closeModal = () => setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const handleConfirmDelete = (id) => { removeFromCart(id); closeModal(); };
  
  const handleIncrease = (id, quantity) => updateQuantity(id, quantity + 1);
  const handleDecrease = (id, quantity) => {
    // ... (Logika decrease sama seperti sebelumnya) ...
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
  
  const handleDeliveryChange = (type) => { setDeliveryType(type); };
  
  // Ganti alamat berdasarkan ID dropdown
  const handleAddressChange = (event) => { 
      const addressId = parseInt(event.target.value, 10); 
      const newAddress = addressList.find(addr => addr.id === addressId); 
      setSelectedAddress(newAddress); 
  };

  // --- 3. CREATE ORDER (FINAL) ---
  const handleCreateOrder = async () => {
    if (selectedItems.length === 0) { alert('Tidak ada produk yang dipilih.'); return; }
    if (deliveryType === 'kirim' && !selectedAddress) { alert('Silakan pilih alamat pengiriman.'); return; }
    
    try {
        const orderPayload = {
            items: selectedItems.map(item => ({
                productId: parseInt(item.productId),
                variantId: parseInt(item.variantId),
                variantName: item.variantName,
                qty: parseInt(item.quantity)
            })),
            jenis_pengiriman: deliveryType === 'kirim' ? 'DIANTAR' : 'AMBIL_SENDIRI',
            metode_pembayaran: 'TRANSFER', 
            
            // --- FIX: Ambil data dari Selected Address yang Real ---
            alamat_tujuan: deliveryType === 'kirim' 
                ? `${selectedAddress.alamat_lengkap}, Kec. ${selectedAddress.wilayah?.nama_kecamatan} (${selectedAddress.label_alamat})` 
                : null,
            
            nama_penerima: deliveryType === 'kirim' ? selectedAddress.nama_penerima : null,

            // FIX: Kirim ID Wilayah yang benar
            id_wilayah: deliveryType === 'kirim' ? selectedAddress.id_wilayah : null,

            catatan: notes
        };

        const response = await api.post('/orders', orderPayload);

        if (response.data.success) {
            const noInvoice = response.data.nota || response.data.data?.nomor_nota;
            setCurrentInvoiceNumber(noInvoice); 
            setSuccessModalOpen(true);
        }

    } catch (error) {
        console.error("Gagal checkout:", error);
        alert(error.response?.data?.message || "Terjadi kesalahan saat membuat pesanan.");
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
    removeSelectedItems(); 
    navigate('/'); 
  };

  // --- UI ---
  if (cartItems.length === 0 && !successModalOpen) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-container product-not-found">
          <h2 className="product-detail-name">Keranjang Kosong</h2>
          <p>Sepertinya Anda belum menambahkan produk apapun ke keranjang.</p>
          <Link to="/" className="add-to-cart-btn" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto' }}>Mulai Belanja</Link>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <ConfirmModal isOpen={modalState.isOpen} title={modalState.title} message={modalState.message} onConfirm={modalState.onConfirm} onCancel={closeModal} />
      <SuccessModal 
        isOpen={successModalOpen} 
        title="Pesanan Berhasil Dibuat!" 
        message="Terima kasih telah berbelanja. Admin kami akan segera memproses pesanan Anda."
        invoiceNumber={currentInvoiceNumber}
        onClose={handleCloseSuccessModal}
      />

      <div className="product-detail-page">
        <div className="product-detail-container" style={{ display: 'block', maxWidth: '1200px', padding: '20px' }}>
          <h1 className="product-detail-name" style={{ marginBottom: '30px' }}>
            {viewMode === 'cart' ? 'Keranjang Saya' : 'Konfirmasi Pesanan'}
          </h1>

          <div className="cart-layout-grid">
            {/* KIRI: ITEM / FORM */}
            <div className="cart-main-content">
              {viewMode === 'cart' ? (
                <>
                  <div className="variant-card select-all-card">
                    <input type="checkbox" id="select-all" checked={isAllSelected} onChange={() => toggleAllItems(!isAllSelected)} />
                    <label htmlFor="select-all">Pilih Semua ({cartItems.length} produk)</label>
                  </div>
                  <div className="variant-card-container">
                    {cartItems.map(item => (
                      <div key={item.id} className={`variant-card ${item.selected ? 'active' : ''}`} onClick={() => toggleItemSelection(item.id)}>
                        <input type="checkbox" className="item-checkbox" checked={item.selected} onChange={() => toggleItemSelection(item.id)} onClick={(e) => e.stopPropagation()} style={{marginRight: '15px'}} />
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
                  <div className="total-order-section">
                    <h3>Jenis Pengiriman</h3>
                    <div className="delivery-options">
                      <button className={`btn-delivery ${deliveryType === 'ambil' ? 'active' : ''}`} onClick={() => handleDeliveryChange('ambil')}>Ambil di Toko</button>
                      <button 
                        className={`btn-delivery ${deliveryType === 'kirim' ? 'active' : ''}`} 
                        onClick={() => handleDeliveryChange('kirim')} 
                        disabled={!canShip} 
                        title={!canShip ? "Belum memenuhi minimal belanja untuk pengiriman" : 'Kirim'}
                      >
                        Kirim Ke Tujuan {!canShip && `(Min. Belanja Kurang)`}
                      </button>
                    </div>
                  </div>

                  {/* LOGIC TAMPILAN ALAMAT DARI DATABASE */}
                  {deliveryType === 'kirim' && canShip && (
                    <div className="total-order-section">
                      <h3>Alamat Tujuan</h3>
                      {isLoadingAddress ? (
                          <p>Memuat alamat...</p>
                      ) : addressList.length > 0 ? (
                        <>
                            <select onChange={handleAddressChange} value={selectedAddress?.id || ''} className="address-select">
                                {addressList.map(addr => (
                                    <option key={addr.id} value={addr.id}>
                                        {addr.label_alamat} - {addr.nama_penerima}
                                    </option>
                                ))}
                            </select>
                            
                            {selectedAddress && (
                                <div className="address-display">
                                    <p><strong>Penerima:</strong> {selectedAddress.nama_penerima} ({selectedAddress.no_hp_penerima})</p>
                                    <p>{selectedAddress.alamat_lengkap}</p>
                                    <p style={{color:'#666', fontSize:'0.9rem'}}>Kec. {selectedAddress.wilayah?.nama_kecamatan}</p>
                                </div>
                            )}
                        </>
                      ) : (
                          <div className="address-display warning">
                              <p>Anda belum memiliki alamat tersimpan.</p>
                              <Link to="/akun" className="btn-link">Kelola Alamat di Akun</Link>
                          </div>
                      )}
                    </div>
                  )}

                  <div className="total-order-section"><h3>Metode Pembayaran</h3><div className="payment-method-display">Transfer Bank / COD (Bayar Nanti)</div></div>
                  <div className="total-order-section"><h3>Catatan</h3><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan untuk admin..." className="notes-textarea"></textarea></div>
                </div>
              )}
            </div>

            {/* KANAN: SUMMARY */}
            <div className="cart-summary-sidebar">
              {viewMode === 'cart' ? (
                <div className="total-order-section">
                  <h3>Ringkasan Pesanan</h3>
                  {loadingCalc ? <p className="text-sm text-gray-500">Menghitung...</p> : (
                      <>
                        <div className="total-order-row"><span>Subtotal ({totalItemsCount} item)</span><span>Rp{localSubTotal.toLocaleString('id-ID')}</span></div>
                        <div className="total-order-row grand-total"><span>Total Estimasi</span><span>Rp{localSubTotal.toLocaleString('id-ID')}</span></div>
                      </>
                  )}
                  <button className="add-to-cart-btn" onClick={() => setViewMode('checkout')} disabled={selectedItems.length === 0}>Lanjut Checkout</button>
                </div>
              ) : (
                 <div className="total-order-section">
                  <h3>Ringkasan Pembayaran</h3>
                  <div className="summary-items">
                    {selectedItems.map(item => (<div key={item.id} className="total-order-row"><span>{item.name} (x{item.quantity})</span><span>Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span></div>))}
                  </div>
                  <hr/>
                  {loadingCalc ? <p>Menghitung final...</p> : (
                    <>
                        <div className="total-order-row"><span>Subtotal</span><span>Rp{localSubTotal.toLocaleString('id-ID')}</span></div>
                        <div className="total-order-row">
                            <span>Biaya Ongkir</span>
                            <span>Rp{shippingCost.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="total-order-row grand-total">
                            <span>Total Bayar</span>
                            <span>Rp{(localSubTotal + shippingCost).toLocaleString('id-ID')}</span>
                        </div>
                    </>
                  )}
                  <div className="checkout-actions-final">
                    <button className="add-to-cart-btn secondary" onClick={() => setViewMode('cart')}>Kembali</button>
                    <button className="add-to-cart-btn" onClick={handleCreateOrder} disabled={loadingCalc}>Buat Pesanan</button>
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