import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dummyProducts } from '../data/dummyProducts.js';
import { useCart } from '../context/CartContext.jsx';
import NotificationToast from '../components/NotificationToast.jsx';
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
  const product = dummyProducts.find(p => p.id === Number(id));

  const [quantities, setQuantities] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [savingsTip, setSavingsTip] = useState(null); // NEW: State for savings tip

  useEffect(() => {
    if (product) {
      setQuantities(initializeQuantities(product.variants));
    }
  }, [product]);

  // NEW: useEffect to watch for savings opportunities
  useEffect(() => {
    if (!product) return;

    const eceranVariant = product.variants.find(v => v.name === 'PCS');
    const grosirVariant = product.variants.find(v => v.name === 'PCS Grosir');
    const eceranQuantity = quantities[eceranVariant?.name] || 0;

    if (eceranVariant && grosirVariant && eceranQuantity >= grosirVariant.minQuantity) {
      setSavingsTip({
        target: eceranVariant.name,
        message: `✨ Tips: Pilih penawaran "${grosirVariant.tierName}" untuk harga lebih hemat (Rp ${grosirVariant.price.toLocaleString('id-ID')}/pcs).`
      });
    } else {
      setSavingsTip(null); // Clear tip if condition is not met
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

      // Special rule: if user decreases from minQuantity, it should go to 0
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
            alert(`Jumlah untuk ${variant.tierName} minimal harus ${variant.minQuantity}. Pesanan Anda saat ini ${quantity}.`);
            allValid = false;
            return;
        }
        itemsToAdd.push({
          item: {
            id: `${product.id}-${variant.name}`,
            name: `${product.name} (${variant.tierName})`,
            price: variant.price,
            image: product.image,
            productId: product.id,
            variantName: variant.name,
            // MODIFIED: Pass minQuantity to the cart context
            minQuantity: variant.minQuantity,
          },
          quantity: quantity,
        });
      }
    });
    
    if (!allValid) return;

    itemsToAdd.forEach(entry => addToCart(entry.item, entry.quantity));

    setToastMessage(`${totalItems} item berhasil ditambahkan ke keranjang!`);
    setShowToast(true);
    setQuantities(initializeQuantities(product.variants));
  };

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
                const minQty = variant.minQuantity || 1;

                return (
                  // NEW: Wrapper for card + tip
                  <div key={variant.name} className="variant-item-wrapper">
                    <div className={`variant-card ${isCardActive ? 'active' : ''}`}>
                      <img src={product.image} alt={variant.tierName} className="variant-card-image" />
                      <div className="variant-card-details">
                        <span className="variant-card-name">{variant.tierName}</span>
                        <span className="variant-card-price">Rp{variant.price.toLocaleString('id-ID')} / pcs</span>
                      </div>
                      <div className="card-quantity-controls">
                        <button onClick={() => handleQuantityChange(variant.name, -1)} disabled={currentQty === 0}>−</button>
                        <span>{currentQty}</span>
                        <button onClick={() => handleQuantityChange(variant.name, 1)}>+</button>
                      </div>
                    </div>
                    {/* NEW: Savings Tip Render */}
                    {savingsTip && savingsTip.target === variant.name && (
                      <div className="savings-tip">
                        {savingsTip.message}
                      </div>
                    )}
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
