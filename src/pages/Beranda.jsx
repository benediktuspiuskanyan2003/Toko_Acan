
import React from 'react';
import { Link } from 'react-router-dom';
import './Beranda.css';
import fotoTokoAcan from '../assets/fototokoacan.jpg'; // Import your image
import ProductList from '../components/ProductList'; // Import the ProductList component

function Beranda() {
  return (
    <div className="home-page">
      <div 
        className="hero-section" 
        style={{ backgroundImage: `url(${fotoTokoAcan})` }} // Set background image dynamically
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Toko Acan</h1>
          <p className="hero-subtitle">Temukan semua kebutuhan Anda dengan penawaran terbaik.</p>
          <Link to="/keranjang" className="hero-cta-button">
            Belanja Sekarang
          </Link>
        </div>
      </div>
      
      <ProductList /> {/* Add the ProductList component here */}
    </div>
  );
}

export default Beranda;
