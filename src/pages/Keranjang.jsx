import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx'; // Add .jsx extension
import './Keranjang.css';

function Keranjang() {
  // Get all necessary data and functions from the cart context
  const { cartItems, totalPrice, removeFromCart, updateQuantity } = useCart();

  // Handle quantity increase
  const handleIncrease = (id, currentQuantity) => {
    updateQuantity(id, currentQuantity + 1);
  };

  // Handle quantity decrease
  const handleDecrease = (id, currentQuantity) => {
    updateQuantity(id, currentQuantity - 1); // The context handles removal if quantity is 0
  };

  // --- RENDER LOGIC ---

  // 1. If the cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <h2>Keranjang Belanja Anda Kosong</h2>
          <p>Sepertinya Anda belum menambahkan produk apapun ke keranjang.</p>
          <Link to="/" className="back-to-shop-btn">
            Mulai Belanja
          </Link>
        </div>
      </div>
    );
  }

  // 2. If the cart has items
  return (
    <div className="cart-page">
      <h1>Keranjang Saya</h1>
      <div className="cart-content">
        <div className="cart-items-list">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-info">
                <p className="cart-item-name">{item.name}</p>
                <p className="cart-item-price">Rp{item.price.toLocaleString('id-ID')}</p>
              </div>
              <div className="cart-item-quantity">
                <button onClick={() => handleDecrease(item.id, item.quantity)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleIncrease(item.id, item.quantity)}>+</button>
              </div>
              <p className="cart-item-total">
                Rp{(item.price * item.quantity).toLocaleString('id-ID')}
              </p>
              <button onClick={() => removeFromCart(item.id)} className="remove-item-btn">
                &times; {/* This is a multiplication sign, often used as a close icon */}
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Ringkasan Pesanan</h2>
          <div className="summary-line">
            <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} item)</span>
            <span>Rp{totalPrice.toLocaleString('id-ID')}</span>
          </div>
          {/* You can add lines for shipping, discounts etc. here */}
          <div className="summary-line total">
            <span>Total</span>
            <span>Rp{totalPrice.toLocaleString('id-ID')}</span>
          </div>
          <Link to="/transaksi" className="checkout-btn">
            Lanjut ke Pembayaran
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Keranjang;
