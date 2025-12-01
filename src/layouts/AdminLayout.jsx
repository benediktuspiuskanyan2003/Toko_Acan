// // src/layouts/AdminLayout.jsx
// import { Outlet, Link, useNavigate, Navigate } from 'react-router-dom';

// const AdminLayout = () => {
//     const navigate = useNavigate();

//     // --- LOGIC SATPAM (PROTECTION) ---

//     // 1. Ambil data dari kantong (LocalStorage)
//     const token = localStorage.getItem('token');
//     const userString = localStorage.getItem('user');
//     const user = userString ? JSON.parse(userString) : null;

//     // 2. Cek: Apakah belum login?
//     if (!token || !user) {
//         // Tendang ke halaman Login
//         return <Navigate to="/login" replace />;
//     }

//     // 3. Cek: Apakah dia login tapi BUKAN Admin?
//     if (user.role !== 'ADMIN') {
//         // Tendang ke Beranda User (atau halaman Forbidden)
//         alert("Anda tidak memiliki akses ke halaman ini!");
//         return <Navigate to="/" replace />;
//     }

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         navigate('/login');
//     };

//     return (
//         <div className="flex h-screen bg-gray-100 font-sans">
//             {/* SIDEBAR */}
//             <aside className="w-64 bg-white shadow-md flex flex-col">
//                 <div className="p-6 border-b">
//                     <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
//                     <p className="text-sm text-gray-500">Toko Acan</p>
//                 </div>

//                 <nav className="flex-1 p-4 space-y-2">
//                     <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
//                         📊 Dashboard
//                     </Link>
//                     <Link to="/admin/products" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
//                         📦 Kelola Produk
//                     </Link>
//                     <Link to="/admin/orders" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
//                         🛒 Pesanan
//                     </Link>
//                     <a href="/" target="_blank" className="block px-4 py-2 text-green-700 hover:bg-green-50 rounded mt-4 border border-green-200">
//                         🏠 Lihat Halaman Toko
//                     </a>
//                 </nav>

//                 <div className="p-4 border-t">
//                     <button
//                         onClick={handleLogout}
//                         className="w-full px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded"
//                     >
//                         Keluar
//                     </button>
//                 </div>
//             </aside>

//             {/* CONTENT AREA */}
//             <main className="flex-1 overflow-y-auto p-8">
//                 {/* Outlet ini nanti akan diganti otomatis oleh React Router dengan halaman yang kita buka */}
//                 <Outlet />
//             </main>
//         </div>
//     );
// };

// export default AdminLayout;


// src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link, useNavigate, Navigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Impor ikon untuk menu

const AdminLayout = () => {
    const navigate = useNavigate();
    // 1. STATE untuk mengontrol tampilan Sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- LOGIC SATPAM (PROTECTION) ---
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'ADMIN') {
        console.error("Akses Ditolak: Anda bukan Admin.");
        return <Navigate to="/" replace />;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };
    
    // Fungsi untuk menutup menu setelah navigasi di mobile
    const handleLinkClick = () => {
        if (isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            
            {/* 2. OVERLAY untuk tampilan mobile/tablet */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)} // Tutup saat klik overlay
                ></div>
            )}

            {/* SIDEBAR */}
            <aside 
                // Di layar besar (md:), Sidebar selalu terlihat (flex). 
                // Di layar kecil, kita gunakan transisi dan translate-x untuk efek slider.
                className={`
                    w-64 bg-white shadow-md flex flex-col fixed inset-y-0 left-0 
                    transform transition-transform duration-300 ease-in-out z-30
                    md:relative md:translate-x-0 md:flex
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Burger/Close button di dalam Sidebar (Hanya terlihat di mobile) */}
                <div className='md:hidden flex justify-end p-4'>
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className='text-gray-600 hover:text-red-500'
                        aria-label="Tutup Menu"
                    >
                        <X className='w-6 h-6' />
                    </button>
                </div>
                
                {/* Logo/Judul Admin Panel */}
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
                    <p className="text-sm text-gray-500">Toko Acan</p>
                </div>

                {/* Navigasi */}
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" onClick={handleLinkClick} className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                        📊 Dashboard
                    </Link>
                    <Link to="/admin/products" onClick={handleLinkClick} className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                        📦 Kelola Produk
                    </Link>
                    <Link to="/admin/orders" onClick={handleLinkClick} className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                        🛒 Pesanan
                    </Link>
                    <a href="/" target="_blank" className="block px-4 py-2 text-green-700 hover:bg-green-50 rounded mt-4 border border-green-200">
                        🏠 Lihat Halaman Toko
                    </a>
                    
                </nav>

                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded"
                    >
                        Keluar
                    </button>
                </div>
            </aside>

            {/* CONTENT AREA */}
            <main className="flex-1 overflow-y-auto">
                {/* 3. BURGER MENU BUTTON (Hanya terlihat di mobile/tablet) */}
                <div className="p-4 md:hidden flex justify-start items-center bg-white shadow-sm">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className='text-gray-600 hover:text-blue-600'
                        aria-label="Buka Menu"
                    >
                        <Menu className='w-6 h-6' />
                    </button>
                    <span className="ml-4 text-lg font-semibold text-gray-800">Admin Panel</span>
                </div>
                
                {/* Konten Halaman Anak */}
                <div className='p-4 md:p-8'>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;