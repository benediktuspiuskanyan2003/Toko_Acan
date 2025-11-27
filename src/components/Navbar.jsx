import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx'; // Add .jsx extension
import './Navbar.css';

// Import custom icons
import iconBeranda from '../assets/beranda.png';
import iconKeranjang from '../assets/basket.png';
import iconTransaksi from '../assets/transaction.png';
import iconAkun from '../assets/profile.png';

function Navbar() {
  const { totalItems } = useCart(); // Get totalItems from cart context

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="nav-logo">
          Toko Acan
        </NavLink>
        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => (isActive ? "nav-links active" : "nav-links")}>
              <img src={iconBeranda} alt="Beranda" className="nav-icon" />
              <span>Beranda</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/keranjang" className={({ isActive }) => (isActive ? "nav-links active" : "nav-links")}>
              <img src={iconKeranjang} alt="Keranjang" className="nav-icon" />
              <span>Keranjang</span>
              {/* Display badge only if there are items in the cart */}
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/transaksi" className={({ isActive }) => (isActive ? "nav-links active" : "nav-links")}>
              <img src={iconTransaksi} alt="Transaksi" className="nav-icon" />
              <span>Transaksi</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/akun" className={({ isActive }) => (isActive ? "nav-links active" : "nav-links")}>
              <img src={iconAkun} alt="Akun" className="nav-icon" />
              <span>Akun</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
