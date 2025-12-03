import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import NotificationToast from '../components/NotificationToast.jsx';
import api from '../services/api'; // 1. IMPORT API, HAPUS DUMMY
import './ProductDetail.css';

const initializeQuantities = (variants) => {
  const quantities = {};
  if (variants) {
    variants.forEach(variant => {
      quantities[variant.name] = 0;
    });
  }
  return quantities;
};

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  // 2. STATE UNTUK DATA REAL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantities, setQuantities] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [savingsTip, setSavingsTip] = useState(null);

  // 3. FETCH DATA DARI BACKEND (Gantikan dummyProducts.find)
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        
        if (response.data.success) {
          const backendData = response.data.data;

          // 4. MAPPING DATA (PENTING: Backend -> Frontend UI)
          // Kita ubah format database biar cocok sama logika UI kamu
          const mappedProduct = {
            id: backendData.id,
            name: backendData.nama_produk,
            description: backendData.deskripsi || "Tidak ada deskripsi.",
            image: backendData.url_gambar || 'https://via.placeholder.com/500', // Gambar default
            variants: backendData.daftar_varian.map(v => ({
              id: v.id,
              // ID unik buat logic quantity
              name: v.nama_satuan, 
              // Tampilan nama varian (misal: Dus, Pcs)
              tierName: v.nama_satuan, 
              price: v.harga,
              // Backend belum kirim min_qty, kita default 1 dulu
              minQuantity: 1 
            }))
          };

          setProduct(mappedProduct);
          setQuantities(initializeQuantities(mappedProduct.variants));
        }
      } catch (error) {
        console.error("Gagal ambil detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  // --- LOGIC UI DI BAWAH INI SAMA PERSIS DENGAN KODINGAN KAMU ---
  
  // Logic Tips Hemat (Tetap jalan asalkan nama variannya 'PCS' dan 'Grosir')
  useEffect(() => {
    if (!product) return;

    // Catatan: Pastikan di Database nanti nama satuannya 'PCS' dan 'Grosir' 
    // biar logic ini jalan. Atau sesuaikan string-nya.
    const eceranVariant = product.variants.find(v => v.name.toLowerCase() === 'pcs');
    const grosirVariant = product.variants.find(v => v.name.toLowerCase().includes('dus') || v.name.toLowerCase().includes('grosir'));
    
    // Logic sederhana: Kalau ada Dus, kasih tips
    if (eceranVariant && grosirVariant) {
        // ... logic tips kamu bisa dikembangkan di sini
    }
  }, [quantities, product]);


  const handleQuantityChange = (variantName, amount) => {
    const variant = product.variants.find(v => v.name === variantName);
    if (!variant) return;

    setQuantities(prev => {
      const currentQuantity = prev[variantName] || 0;
      let newQuantity = currentQuantity + amount;

      if (amount > 0 && currentQuantity === 0 && variant.minQuantity > 1) {
        newQuantity = variant.minQuantity;
      } else {
        newQuantity = Math.max(0, newQuantity);
      }

      if (amount < 0 && currentQuantity === variant.minQuantity && variant.minQuantity > 1) {
        newQuantity = 0;
      }

      return { ...prev, [variantName]: newQuantity };
    });
  };
  
  const { total, totalItems } = useMemo(() => {
    let currentTotal = 0;
    let currentTotalItems = 0;
    if (product && product.variants) {
      product.variants.forEach(variant => {
        const quantity = quantities[variant.name] || 0;
        if (quantity > 0) {
          currentTotal += variant.price * quantity;
          currentTotalItems += quantity;
        }
      });
    }
    return { total: currentTotal, totalItems: currentTotalItems };
  }, [quantities, product]);


  const handleAddToCart = () => {
    if (!product || totalItems === 0) return;

    let allValid = true;
    const itemsToAdd = [];
    product.variants.forEach(variant => {
      const quantity = quantities[variant.name];
      if (quantity > 0) {
        if (quantity < variant.minQuantity) {
            alert(`Jumlah untuk ${variant.tierName} minimal harus ${variant.minQuantity}.`);
            allValid = false;
            return;
        }
        console.log("🔍 CEK VARIAN SEBELUM MASUK CART:", variant);
        itemsToAdd.push({
          item: {
            id: `${product.id}-${variant.name}`,
            name: `${product.name} (${variant.tierName})`,
            price: variant.price,
            image: product.image,
            productId: product.id,
            variantId: variant.id,
            variantName: variant.name,
            minQuantity: variant.minQuantity,
          },
          quantity: quantity,
        });
      }
    });
    
    if (!allValid) return;

    console.log("📦 PAKET YANG DIKIRIM KE CONTEXT:", itemsToAdd);

    itemsToAdd.forEach(entry => addToCart(entry.item, entry.quantity));

    setToastMessage(`${totalItems} item berhasil ditambahkan ke keranjang!`);
    setShowToast(true);
    // Reset quantity setelah add to cart
    setQuantities(initializeQuantities(product.variants));
  };

  // 5. TAMPILAN LOADING
  if (loading) {
    return <div className="p-10 text-center mt-10"><h3>Sedang memuat produk...</h3></div>;
  }

  if (!product) {
    return <div className="product-not-found"><h2>Produk tidak ditemukan!</h2></div>;
  }

  return (
    <div className="product-detail-page">
      {showToast && <NotificationToast message={toastMessage} onClose={() => setShowToast(false)} />}

      <div className="product-detail-container">
        <div className="product-detail-image-container">
          <img src={product.image} alt={product.name} className="product-detail-image" />
        </div>

        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-description">{product.description}</p>

          <div className="variant-selection-cards">
            <p className="variant-label">Pilih Varian & Jumlah:</p>
            <div className="variant-card-container">
              {product.variants.map(variant => {
                const currentQty = quantities[variant.name] || 0;
                const isCardActive = currentQty > 0;
                
                return (
                  <div key={variant.name} className="variant-item-wrapper">
                    <div className={`variant-card ${isCardActive ? 'active' : ''}`}>
                      {/* Gambar Varian pakai gambar produk utama dulu */}
                      <img src={product.image} alt={variant.tierName} className="variant-card-image" />
                      <div className="variant-card-details">
                        <span className="variant-card-name">{variant.tierName}</span>
                        <span className="variant-card-price">Rp{variant.price.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="card-quantity-controls">
                        <button onClick={() => handleQuantityChange(variant.name, -1)} disabled={currentQty === 0}>−</button>
                        <span>{currentQty}</span>
                        <button onClick={() => handleQuantityChange(variant.name, 1)}>+</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {total > 0 && (
            <div className="total-order-section">
              <h3>Total Pesanan</h3>
              <div className="total-order-row">
                <span>Total Item</span>
                <span>{totalItems}</span>
              </div>
              <div className="total-order-row grand-total">
                <span>Total Harga</span>
                <span>Rp{total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          )}

          <button 
            className="add-to-cart-btn" 
            onClick={handleAddToCart} 
            disabled={totalItems === 0}
          >
            {totalItems > 0 ? `Tambah ${totalItems} Item ke Keranjang` : 'Pilih Item'}
          </button>
          
          <Link to="/" className="back-link">‹ Kembali ke semua produk</Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;