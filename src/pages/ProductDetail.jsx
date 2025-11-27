import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// Import the centralized dummy data
import { dummyProducts } from '../data/dummyProducts.js';
import { useCart } from '../context/CartContext.jsx';
import './ProductDetail.css'; 

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  // --- DATA FETCHING LOGIC ---
  // Find the correct product from the dummy data array using the ID from the URL.
  // The ID from useParams is a string, so it needs to be converted to a number.
  const product = dummyProducts.find(p => p.id === Number(id));

  // --- STATE MANAGEMENT ---
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Effect to set the default variant once the product is loaded.
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  // --- HANDLER FUNCTIONS ---
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };
  
  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const itemToAdd = {
      id: `${product.id}-${selectedVariant.name}`,
      name: `${product.name} (${selectedVariant.name})`,
      price: selectedVariant.price,
      image: product.image,
      productId: product.id,
      variantName: selectedVariant.name,
    };

    addToCart(itemToAdd, quantity);
    alert(`${quantity}x ${itemToAdd.name} telah ditambahkan ke keranjang!`);
  };

  // --- RENDER LOGIC ---
  // This check now correctly handles cases where the ID is invalid.
  if (!product) { // Simplified check, as selectedVariant is set in useEffect
    return (
      <div className="product-not-found">
        <h2>Produk tidak ditemukan!</h2>
        <p>Maaf, kami tidak dapat menemukan produk yang Anda cari.</p>
        <Link to="/">Kembali ke Beranda</Link>
      </div>
    );
  }

  // This check handles the case where a product exists but variants are loading or absent
  if (!selectedVariant) {
      return (
          <div className="product-not-found">
              <h2>Memuat detail produk...</h2>
          </div>
      );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-detail-image-container">
          <img src={product.image} alt={product.name} className="product-detail-image" />
        </div>
        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>
          
          <p className="product-detail-price">
            Rp{selectedVariant.price.toLocaleString('id-ID')}
          </p>
          
          <p className="product-detail-category">Kategori: {product.category}</p>

          <div className="variant-selection">
            <p className="variant-label">Pilih Varian:</p>
            <div className="variant-buttons">
              {product.variants.map(variant => (
                <button 
                  key={variant.name}
                  className={`variant-btn ${selectedVariant.name === variant.name ? 'active' : ''}`}
                  onClick={() => handleVariantChange(variant)}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>

          <div className="quantity-control">
            <p className="quantity-label">Jumlah:</p>
            <div className="quantity-input-group">
              <button onClick={handleDecreaseQuantity} disabled={quantity <= 1}>-</button>
              <span>{quantity}</span>
              <button onClick={handleIncreaseQuantity}>+</button>
            </div>
          </div>

          <p className="product-detail-description">{product.description}</p>
          
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Tambah ke Keranjang
          </button>
          
          <Link to="/" className="back-link">‹ Kembali ke semua produk</Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
