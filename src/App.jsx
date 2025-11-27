import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Beranda from './pages/Beranda';
import ProductDetail from './pages/ProductDetail';
import Navbar from './components/Navbar';
import Keranjang from './pages/Keranjang'; // Import new page
import Transaksi from './pages/Transaksi'; // Import new page
import Akun from './pages/Akun';       // Import new page
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          {/* Add routes for the new pages */}
          <Route path="/keranjang" element={<Keranjang />} />
          <Route path="/transaksi" element={<Transaksi />} />
          <Route path="/akun" element={<Akun />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
