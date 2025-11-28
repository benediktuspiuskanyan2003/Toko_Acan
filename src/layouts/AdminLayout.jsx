// src/layouts/AdminLayout.jsx
import { Outlet, Link, useNavigate, Navigate } from 'react-router-dom';

const AdminLayout = () => {
    const navigate = useNavigate();

    // --- LOGIC SATPAM (PROTECTION) ---

    // 1. Ambil data dari kantong (LocalStorage)
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    // 2. Cek: Apakah belum login?
    if (!token || !user) {
        // Tendang ke halaman Login
        return <Navigate to="/login" replace />;
    }

    // 3. Cek: Apakah dia login tapi BUKAN Admin?
    if (user.role !== 'ADMIN') {
        // Tendang ke Beranda User (atau halaman Forbidden)
        alert("Anda tidak memiliki akses ke halaman ini!");
        return <Navigate to="/" replace />;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
                    <p className="text-sm text-gray-500">Toko Acan</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                        📊 Dashboard
                    </Link>
                    <Link to="/admin/products" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                        📦 Kelola Produk
                    </Link>
                    <Link to="/admin/orders" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
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
            <main className="flex-1 overflow-y-auto p-8">
                {/* Outlet ini nanti akan diganti otomatis oleh React Router dengan halaman yang kita buka */}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;