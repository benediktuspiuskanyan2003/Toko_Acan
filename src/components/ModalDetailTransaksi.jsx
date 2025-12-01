import React from 'react';
import { X } from 'lucide-react';
import { dummyProducts } from '../data/dummyProducts';

/**
 * Komponen Modal Detail Transaksi (Tampilan Full-Screen)
 * @param {object} order - Data pesanan yang dipilih.
 * @param {function} onClose - Fungsi untuk menutup modal.
 * @param {function} formatRupiah - Fungsi helper format Rupiah.
 */
const ModalDetailTransaksi = ({ order, onClose, formatRupiah }) => {
    // Menghitung Total Harga Item (Item Price * Qty) untuk ditampilkan
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = order.total - subtotal; // Asumsi sisanya adalah pajak/biaya layanan

    // LOGIKA BARU: Tentukan apakah pesanan bisa dibatalkan
    const isCancellable = order.status === 'Proses';

    const handleCancelOrder = () => {
        // DI SINI ADALAH LOGIKA NYATA UNTUK MENGUPDATE STATUS DI BACKEND
        
        // PENTING: Mengganti window.confirm dan alert dengan komponen modal kustom 
        // disarankan karena pembatasan lingkungan iframe. Namun, untuk menjaga 
        // fungsi cepat, saya menggunakan console.log dan onClose.
        if (window.confirm(`Anda yakin ingin membatalkan pesanan #${order.id}?`)) {
          
            console.log(`[PEMBATALAN DIPROSES] Pesanan #${order.id} dibatalkan.`);
            alert(`Pesanan #${order.id} telah dibatalkan.`);
            onClose(); // Tutup modal setelah pembatalan
        }
    };

    const isDone = order.status === 'Selesai';

    

    return (
        // 1. OVERLAY (Latar Belakang Gelap)
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-end md:items-center">
            
            {/* 2. MODAL CONTAINER (Full Screen Mobile / Besar di Desktop) */}
            <div 
                className="bg-white w-full h-full md:w-4/5 md:max-w-xl md:h-5/6 rounded-none md:rounded-xl shadow-2xl 
                           transform translate-y-0 transition-transform duration-300 ease-out 
                           flex flex-col overflow-hidden"
            >
                
                {/* HEADER MODAL */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Detail Transaksi</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-100 transition"
                        aria-label="Tutup"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* CONTENT MODAL (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    
                    {/* INFO UTAMA */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">ID Transaksi:</p>
                        <p className="text-2xl font-extrabold text-indigo-600 mb-2">#{order.id}</p>
                        <p className="text-sm text-gray-600">Tanggal: {order.date}</p>
                        <p className={`text-sm font-semibold mt-1 ${order.status === 'Selesai' || order.status === 'Dikirim' ? 'text-green-600' : 'text-yellow-600'}`}>
                            Status: {order.status}
                        </p>
                    </div>

                    {/* DAFTAR ITEM */}
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-3">Item Pembelian</h3>
                        <div className="space-y-3">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span className="text-gray-700 w-3/5">
                                        {item.name} <span className="text-gray-500">({item.qty}x)</span>
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {formatRupiah(item.price * item.qty)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RINGKASAN HARGA */}
                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm text-gray-700">
                            <span>Subtotal Barang:</span>
                            <span>{formatRupiah(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-700">
                            <span>Pajak/Biaya Layanan:</span>
                            <span>{formatRupiah(tax)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-bold text-lg text-gray-900">
                            <span>Total Pembayaran:</span>
                            <span>{formatRupiah(order.total)}</span>
                        </div>
                    </div>

                    {/* RUANG KOSONG AGAR TERLIHAT RAPI SAAT SCROLL */}
                    <div className="h-20"></div> 

                    <div className="p-4 border-t flex flex-col md:flex-row gap-3">
                    
                    {/* Tombol BATAL PESANAN (Hanya tampil jika isCancellable = true) */}
                    {isCancellable && (
                        <button 
                            onClick={handleCancelOrder}
                            // Menggunakan w-full agar tombol mengambil lebar penuh
                            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                        >
                            Batalkan Pesanan
                        </button>
                    )}

                    {isDone&&(
                      <button
                        className='w-full bg-red-500 text-white py-2 rounded-lg hover:bg-green-600 transition'
                      >Cetak Struk</button>
                    )};
                    
                    
                    
                </div>
                </div>

                {/* FOOTER (Hanya Opsi Batal Pesanan) */}
                

            </div>
        </div>
    );
};

export default ModalDetailTransaksi;