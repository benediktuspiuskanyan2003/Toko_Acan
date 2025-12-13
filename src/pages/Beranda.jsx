import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Beranda.css';
import fotoTokoAcan from '../assets/fototokoacan.jpg';
import ProductList from '../components/ProductList.jsx';
import api from '../services/api.js';
import { Search, ChevronDown, X } from 'lucide-react';

// --- Sticky Header Component ---
const StickyHeader = ({ 
    selectedCategory, 
    onCategoryChange, 
    searchQuery, 
    onSearchChange,
    allProducts, 
}) => {
    
    const categories = useMemo(() => {
        const uniqueCategories = new Set(allProducts.map(p => p.category));
        const filteredCategories = Array.from(uniqueCategories).filter(cat => cat);
        return ['All', ...filteredCategories];
    }, [allProducts]);
    
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    return (
        <div className='sticky-header-wrapper'>
            <div className="search-and-filter-bar">
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

// --- Beranda Main Component ---
function Beranda() {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    
    // --- NEW: State for lazy loading ---
    const [visibleCount, setVisibleCount] = useState(10); 
    const PRODUCTS_PER_PAGE = 10; // Load 10 products at a time

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await api.get('/products');
                
                if (response.data.success) {
                    const backendData = response.data.data;
                    
                    if (!Array.isArray(backendData)) {
                        setAllProducts([]);
                        return;
                    }

                    const variantSortOrder = ['PCS', 'PCS Grosir', 'RENTENG', 'LUSIN', 'PACK', 'DUS', 'CTN', 'BAL'];

                    const mappedData = backendData.map(item => {
                        const variants = (item.daftar_varian || []).map(v => ({
                            id: v.id,
                            name: v.nama_satuan,
                            price: v.harga,
                            min_quantity: v.min_quantity || 1,
                            isi: v.isi || 1
                        }));

                        variants.sort((a, b) => {
                            const indexA = variantSortOrder.indexOf(a.name.toUpperCase());
                            const indexB = variantSortOrder.indexOf(b.name.toUpperCase());
                            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                            if (indexA !== -1) return -1;
                            if (indexB !== -1) return 1;
                            return a.name.localeCompare(b.name);
                        });

                        return {
                            id: item.id,
                            name: item.nama_produk,
                            category: item.kategori?.nama_kategori || 'Umum',
                            image: item.url_gambar || 'https://via.placeholder.com/150',
                            description: item.deskripsi,
                            variants: variants
                        };
                    });

                    setAllProducts(mappedData);
                }
            } catch (error) {
                console.error("Gagal mengambil produk:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSearchQuery('');
        setVisibleCount(PRODUCTS_PER_PAGE); // Reset count on category change
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setVisibleCount(PRODUCTS_PER_PAGE); // Reset count on search
    };

    const filteredProducts = useMemo(() => {
        return allProducts
            .filter(product => 
                selectedCategory === 'All' || product.category === selectedCategory
            )
            .filter(product => 
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
    }, [allProducts, selectedCategory, searchQuery]);

    // --- NEW: Sliced products to be displayed ---
    const visibleProducts = filteredProducts.slice(0, visibleCount);
    
    // --- NEW: Check if there are more products to load ---
    const hasMore = visibleCount < filteredProducts.length;

    // --- NEW: Function to load more products ---
    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + PRODUCTS_PER_PAGE);
    };

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
            
            <div id="product-list-section" className="product-list-container-wrapper">
                <h2 className="section-title">
                    {loading ? 'Memuat Produk...' : `Produk ${selectedCategory}`}
                </h2>

                <ProductList 
                    isLoading={loading} 
                    products={visibleProducts} // Pass only visible products
                    onLoadMore={handleLoadMore}  // Pass the load more handler
                    hasMore={hasMore}            // Pass the flag to show/hide the button
                />
            </div>
        </div>
    );
}

export default Beranda;
