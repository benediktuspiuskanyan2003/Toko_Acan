import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Explicitly add .jsx extension to the import path
import { CartProvider } from './context/CartContext.jsx'; 
import Beranda from './pages/Beranda.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Navbar from './components/Navbar.jsx';
import Keranjang from './pages/Keranjang.jsx';
import Transaksi from './pages/Transaksi.jsx';
import Akun from './pages/Akun.jsx';
import './App.css';

function App() {
  return (
    // Wrap the entire app in CartProvider so all components can access the cart
    <CartProvider>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Beranda />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/keranjang" element={<Keranjang />} />
            <Route path="/transaksi" element={<Transaksi />} />
            <Route path="/akun" element={<Akun />} />
          </Routes>
        </main>
      </div>
    </CartProvider>
  );
}

export default App;
