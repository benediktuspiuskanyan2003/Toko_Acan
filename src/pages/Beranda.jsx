import React, { useState, useEffect, useMemo } from 'react'; 
import { Link } from 'react-router-dom';
import './Beranda.css';
import fotoTokoAcan from '../assets/fototokoacan.jpg';
import ProductList from '../components/ProductList.jsx';
import api from '../services/api.js';
import { Search, ChevronDown, X } from 'lucide-react'; 

// --- Komponen Sticky Header ---
const StickyHeader = ({ 
    selectedCategory, 
    onCategoryChange, 
    searchQuery, 
    onSearchChange,
    allProducts, 
}) => {
    
    const categories = useMemo(() => {
        // PERBAIKAN: Menggunakan 'p.category' yang benar
        const uniqueCategories = new Set(allProducts.map(p => p.category));
        
        const filteredCategories = Array.from(uniqueCategories).filter(cat => cat); 
        
        return ['All', ...filteredCategories];
    }, [allProducts]);
    
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    return (
        <div className='sticky-header-wrapper'>
            <div className="search-and-filter-bar">
                {/* ... (Search Bar dan Tombol Kategori) ... */}
                {/* Konten tetap sama */}
                <div className="search-input-container">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={searchQuery}
                        onChange={onSearchChange}
                        className="search-input"
                    />
                    {searchQuery && (
                        <X size={20} className="clear-icon" onClick={() => onSearchChange({ target: { value: '' } })} />
                    )}
                </div>

                <button 
                    className="category-button"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                    {selectedCategory === 'All' ? 'All' : selectedCategory}
                    <ChevronDown size={18} className={`ml-2 transition-transform ${isCategoryOpen ? 'rotate-180' : 'rotate-0'}`} />
                </button>
            </div>

            {isCategoryOpen && (
                <div className="category-dropdown">
                    <div className="category-list-grid">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => {
                                    onCategoryChange(category);
                                    setIsCategoryOpen(false);
                                }}
                                className={`category-item ${selectedCategory === category ? 'selected' : ''}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
        </div>
    );
};

// ------------------------------------------------------------------
// --- Komponen Utama Beranda ---
// ------------------------------------------------------------------
function Beranda() {
    const [allProducts, setAllProducts] = useState([]); 
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await api.get('/products');
                
                if (response.data.success) {
                    const backendData = response.data.data;
                    console.log("DEBUG: Data Mentah Backend Diterima:", backendData); // 👈 PENTING: Cek ini
                    
                    if (!Array.isArray(backendData) || backendData.length === 0) {
                        console.warn("DEBUG: Data produk kosong atau bukan array.");
                        setAllProducts([]);
                        setLoading(false);
                        return;
                    }

                    const mappedData = backendData.map(item => ({
                        id: item.id,
                        name: item.nama_produk, 
                        category: item.kategori?.nama_kategori || 'Umum', 
                        image: item.url_gambar || 'https://via.placeholder.com/150', 
                        price: item.daftar_varian[0]?.harga || 0,
                        unit: item.daftar_varian[0]?.nama_satuan || 'Pcs',
                        description: item.deskripsi
                    }));

                    console.log("DEBUG: Data Termapping Frontend (Jumlah):", mappedData.length); // 👈 PENTING: Cek jumlah ini
                    setAllProducts(mappedData);
                } else {
                    console.error("DEBUG: API Respon: success=false", response.data.message);
                }
            } catch (error) {
                console.error("DEBUG: GAGAL FETCH PRODUK (NETWORK ERROR/CORS):", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSearchQuery('');
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

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
                {/* ... (Hero Content) ... */}
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">Toko Acan</h1>
                    <p className="hero-subtitle">Temukan semua kebutuhan Anda dengan penawaran terbaik.</p>
                    <Link to="#product-list-section" className="hero-cta-button" 
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('product-list-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                    >
                        Belanja Sekarang
                    </Link>
                </div>
            </div>
            
            <StickyHeader 
                selectedCategory={selectedCategory} 
                onCategoryChange={handleCategoryChange}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                allProducts={allProducts}
            />
            
            {/* Tampilkan Loading State atau ProductList */}
            <div id="product-list-section" className="product-list-container-wrapper">
                 <div style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>
                     {/* DEBUG STATUS: {loading ? 'LOADING...' : `SIAP RENDER (${filteredProducts.length} Produk)`} */}
                 </div>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <p>Sedang memuat produk...</p>
                    </div>
                ) : (
                    <>
                        <h2 className="section-title">Produk {selectedCategory}</h2>
                        {filteredProducts.length > 0 ? (
                             <ProductList products={filteredProducts} />
                        ) : (
                            <p className="text-center text-gray-500 py-10">
                                Tidak ada produk ditemukan untuk kriteria ini. 
                                {allProducts.length > 0 && <span> (Total produk awal: {allProducts.length})</span>}
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Beranda;