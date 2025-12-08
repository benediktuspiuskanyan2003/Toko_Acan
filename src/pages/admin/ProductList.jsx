// src/pages/admin/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Ambil data saat halaman dibuka
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // Kita panggil API public /products karena isinya sama saja
            // Nanti bisa difilter di backend kalau mau yg spesifik admin
            const timestamp = new Date().getTime();
            const response = await api.get(`/products?showAll=true&t=${timestamp}`);
            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (error) {
            console.error("Gagal ambil produk:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, namaProduk) => {
        if (window.confirm(`Yakin ingin menghapus produk "${namaProduk}"?`)) {
            try {
                await api.delete(`/admin/products/${id}`);
                // Refresh data setelah hapus biar tabel update
                fetchProducts();
                alert('Produk berhasil dinonaktifkan.');
            } catch (error) {
                console.error("Gagal menghapus:", error);
                alert('Gagal menghapus produk.');
            }
        }
    };

    // Helper untuk format rupiah
    const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

    return (
        <div>
            {/* HEADER: Judul & Tombol Tambah */}
            <div className="flex justify-between items-center mb-4"> {/* mb-6 -> mb-4 (dibuat lebih ringkas) */}
                <h2 className="text-xl font-bold text-gray-800">Daftar Produk</h2> {/* text-2xl -> text-xl */}
                <Link
                    to="/admin/products/add"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1"
                    /* px-4 py-2 -> px-3 py-1.5 | text-sm -> text-xs | gap-2 -> gap-1 */
                >
                    + Tambah Produk
                </Link>
            </div>

            {/* TABEL */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center text-sm text-gray-500">Memuat data produk...</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Info Produk</th> {/* px-6 py-3 -> px-4 py-2 */}
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th> {/* px-6 py-3 -> px-4 py-2 */}
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Varian & Harga</th> {/* px-6 py-3 -> px-4 py-2 */}
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> {/* px-6 py-3 -> px-4 py-2 */}
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th> {/* px-6 py-3 -> px-4 py-2 */}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-3 text-center text-sm text-gray-500">
                                        Belum ada produk. Silakan tambah produk baru.
                                    </td> {/* px-6 py-4 -> px-4 py-3 | text-base -> text-sm */}
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">

                                        {/* Kolom 1: Gambar & Nama */}
                                        <td className="px-4 py-3 whitespace-nowrap"> {/* px-6 py-4 -> px-4 py-3 */}
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8"> {/* h-10 w-10 -> h-8 w-8 (Ikon/Gambar lebih kecil) */}
                                                    {product.url_gambar ? (
                                                        <img className="h-8 w-8 rounded object-cover" src={product.url_gambar} alt="" />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">IMG</div> 
                                                    )}
                                                </div>
                                                <div className="ml-3"> {/* ml-4 -> ml-3 */}
                                                    <div className="text-sm font-small text-gray-900 max-w-[200px] truncate">{product.nama_produk}</div> {/* text-sm -> tetap sm (supaya nama produk tetap terbaca) */}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Kolom 2: Kategori */}
                                        <td className="px-4 py-3 whitespace-nowrap"> {/* px-6 py-4 -> px-4 py-3 */}
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {product.kategori?.nama_kategori || '-'}
                                            </span>
                                        </td>

                                        {/* Kolom 3: Varian (Looping Anak) */}
                                        <td className="px-4 py-3"> {/* px-6 py-4 -> px-4 py-3 */}
                                            <div className="text-xs text-gray-500 space-y-1"> {/* text-sm -> text-xs */}
                                                {product.daftar_varian.map((v) => (
                                                    <div key={v.id} className="flex justify-between w-32"> {/* w-40 -> w-32 (dibuat lebih sempit) */}
                                                        <span className='truncate'>{v.nama_satuan}:</span> {/* Tambah truncate untuk nama satuan panjang */}
                                                        <span className="font-medium text-gray-900">{formatRupiah(v.harga)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>

                                        {/* Kolom 4: Status */}
                                        <td className="px-4 py-3 whitespace-nowrap"> {/* px-6 py-4 -> px-4 py-3 */}
                                            {product.aktif ? (
                                                <span className="text-green-600 text-xs font-medium">Aktif</span>
                                            ) : (
                                                <span className="text-red-600 text-xs font-medium">Non-Aktif</span> 
                                            )}
                                        </td>

                                        {/* Kolom 5: Aksi */}
                                        <td className="px-4 py-3 whitespace-nowrap text-right text-xs font-medium"> {/* px-6 py-4 -> px-4 py-3 | text-sm -> text-xs */}
                                            <Link
                                                to={`/admin/products/edit/${product.id}`}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3" 
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id, product.nama_produk)}
                                                className="text-red-600 hover:text-red-900">Hapus</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ProductList;