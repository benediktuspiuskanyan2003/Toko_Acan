import React, { useState, useEffect } from 'react'; // 1. Tambah useEffect
import { Link } from 'react-router-dom';
import './Beranda.css';
import fotoTokoAcan from '../assets/fototokoacan.jpg';
import ProductList from '../components/ProductList.jsx';
import api from '../services/api'; // 2. Import API Jembatan kita

// Hapus import dummyProducts, kita tidak butuh lagi
// import { dummyProducts } from '../data/dummyProducts.js';

function Beranda() {
  // 3. Ubah allProducts jadi State, bukan variabel mati
  const [allProducts, setAllProducts] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 4. Fetch Data saat halaman dibuka
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Ambil semua produk aktif dari Backend
        const response = await api.get('/products');
        
        if (response.data.success) {
          const backendData = response.data.data;

          // 5. DATA MAPPING (PENTING!)
          // Kita ubah format Backend (Snake Case) jadi format Frontend (Camel Case/English)
          // Biar kodingan temanmu di bawah tidak error.
          const mappedData = backendData.map(item => ({
            id: item.id,
            // Backend: nama_produk -> Frontend: name
            name: item.nama_produk, 
            // Backend: kategori.nama_kategori -> Frontend: category
            category: item.kategori?.nama_kategori || 'Umum', 
            // Backend: url_gambar -> Frontend: image
            image: item.url_gambar || 'https://via.placeholder.com/150', 
            // Ambil harga varian pertama (Pcs) sebagai harga default
            price: item.daftar_varian[0]?.harga || 0,
            // Tambahan info varian untuk Detail nanti
            unit: item.daftar_varian[0]?.nama_satuan || 'Pcs',
            description: item.deskripsi
          }));

          setAllProducts(mappedData);
        }
      } catch (error) {
        console.error("Gagal ambil produk:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // 6. Logic Filter Temanmu (TETAP AMAN)
  // Karena 'allProducts' sudah kita mapping formatnya, filter ini tetap jalan.
  const filteredProducts = allProducts
    .filter(product => 
      selectedCategory === 'All' || product.category === selectedCategory
    )
    .filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="home-page">
      <div 
        className="hero-section" 
        style={{ backgroundImage: `url(${fotoTokoAcan})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Toko Acan</h1>
          <p className="hero-subtitle">Temukan semua kebutuhan Anda dengan penawaran terbaik.</p>
          <Link to="/" className="hero-cta-button" onClick={() => window.scrollTo(0, 500)}>
            Belanja Sekarang
          </Link>
        </div>
      </div>
      
      {/* 7. Tampilkan Loading State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Sedang memuat produk...</p>
        </div>
      ) : (
        <ProductList 
          products={filteredProducts} 
          selectedCategory={selectedCategory} 
          onCategoryChange={handleCategoryChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          allProductsForCategories={allProducts}
        />
      )}
    </div>
  );
}

export default Beranda;