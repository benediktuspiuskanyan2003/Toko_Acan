
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="nav-logo">
          Toko Acan
        </NavLink>
        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => (isActive ? "nav-links active" : "nav-links")}>
              Beranda
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/keranjang" className={({ isActive }) => (isActive ? "nav-links active" : "nav-links")}>
              Keranjang
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/transaksi" className={({ isActive }) => (isActive ? "nav-links active" : "nav-links")}>
              Transaksi
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/akun" className={({ isActive }) => (isActive ? "nav-links active" : "nav-links")}>
              Akun
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
