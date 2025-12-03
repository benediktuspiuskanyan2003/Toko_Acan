// import React from 'react';
// import { X } from 'lucide-react';

// import { dummyProducts } from '../data/dummyProducts';

// /**
 
//  * @param {object} order 
//  * @param {function} onClose
//  * @param {function} formatRupiah 
//  */
// const ModalDetailTransaksi = ({ order, onClose, formatRupiah }) => {
    
//     const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
//     const tax = order.total - subtotal; 

    
//     const isCancellable = order.status === 'Proses';

//     const handleCancelOrder = () => {

//         if (window.confirm(`Anda yakin ingin membatalkan pesanan #${order.id}?`)) {
          
//             console.log(`[PEMBATALAN DIPROSES] Pesanan #${order.id} dibatalkan.`);
//             alert(`Pesanan #${order.id} telah dibatalkan.`);
//             onClose(); 
//         }
//     };

//     const isDone = order.status === 'Selesai';

    

//     return (
//         // 1. OVERLAY (Latar Belakang Gelap)
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-end md:items-center">
            
//             {/* 2. MODAL CONTAINER (Full Screen Mobile / Besar di Desktop) */}
//             <div 
//                 className="bg-white w-full h-full md:w-4/5 md:max-w-xl md:h-5/6 rounded-none md:rounded-xl shadow-2xl 
//                            transform translate-y-0 transition-transform duration-300 ease-out 
//                            flex flex-col overflow-hidden"
//             >
                
//                 {/* HEADER MODAL */}
//                 <div className="flex justify-between items-center p-4 border-b">
//                     <h2 className="text-xl font-bold text-gray-800">Detail Transaksi</h2>
//                     <button 
//                         onClick={onClose}
//                         className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-100 transition"
//                         aria-label="Tutup"
//                     >
//                         <X className="w-6 h-6" />
//                     </button>
//                 </div>

//                 {/* CONTENT MODAL (Scrollable) */}
//                 <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    
//                     {/* INFO UTAMA */}
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                         <p className="text-sm text-gray-500">ID Transaksi:</p>
//                         <p className="text-2xl font-extrabold text-indigo-600 mb-2">#{order.id}</p>
//                         <p className="text-sm text-gray-600">Tanggal: {order.date}</p>
//                         <p className={`text-sm font-semibold mt-1 ${order.status === 'Selesai' || order.status === 'Dikirim' ? 'text-green-600' : 'text-yellow-600'}`}>
//                             Status: {order.status}
//                         </p>
//                     </div>

//                     {/* DAFTAR ITEM */}
//                     <div>
//                         <h3 className="text-lg font-semibold border-b pb-2 mb-3">Item Pembelian</h3>
//                         <div className="space-y-3">
//                             {order.items.map((item, index) => (
//                                 <div key={index} className="flex justify-between text-sm">
//                                     <span className="text-gray-700 w-3/5">
//                                         {item.name} <span className="text-gray-500">({item.qty}x)</span>
//                                     </span>
//                                     <span className="font-medium text-gray-900">
//                                         {formatRupiah(item.price * item.qty)}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* RINGKASAN HARGA */}
//                     <div className="border-t pt-4 space-y-2">
//                         <div className="flex justify-between text-sm text-gray-700">
//                             <span>Subtotal Barang:</span>
//                             <span>{formatRupiah(subtotal)}</span>
//                         </div>
//                         <div className="flex justify-between text-sm text-gray-700">
//                             <span>Pajak/Biaya Layanan:</span>
//                             <span>{formatRupiah(tax)}</span>
//                         </div>
//                         <div className="flex justify-between pt-2 border-t font-bold text-lg text-gray-900">
//                             <span>Total Pembayaran:</span>
//                             <span>{formatRupiah(order.total)}</span>
//                         </div>
//                     </div>

//                     {/* RUANG KOSONG AGAR TERLIHAT RAPI SAAT SCROLL */}
//                     <div className="h-20"></div> 

//                     <div className="p-4 border-t flex flex-col md:flex-row gap-3">
                    
//                     {/* Tombol BATAL PESANAN (Hanya tampil jika isCancellable = true) */}
//                     {isCancellable && (
//                         <button 
//                             onClick={handleCancelOrder}
//                             // Menggunakan w-full agar tombol mengambil lebar penuh
//                             className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
//                         >
//                             Batalkan Pesanan
//                         </button>
//                     )}

//                     {isDone&&(
//                       <button
//                         className='w-full bg-red-500 text-white py-2 rounded-lg hover:bg-green-600 transition'
//                       >Cetak Struk</button>
//                     )};
                    
                    
                    
//                 </div>
//                 </div>

//                 {/* FOOTER (Hanya Opsi Batal Pesanan) */}
                

//             </div>
//         </div>
//     );
// };

// export default ModalDetailTransaksi;

//=======================================================================================

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom'; // PENTING: Untuk render di luar root div (menutupi navbar)
import { X } from 'lucide-react';

/**
 * Komponen Modal Detail Transaksi
 * @param {object} order - Data pesanan (bisa format API atau Dummy)
 * @param {function} onClose - Fungsi untuk menutup modal
 * @param {function} formatRupiah - Helper format currency
 */
const ModalDetailTransaksi = ({ order, onClose, formatRupiah }) => {
    
    // --- 1. KUNCI SCROLL BODY (Agar Navbar tidak muncul saat scroll) ---
    useEffect(() => {
        // Matikan scroll pada halaman utama (body) saat modal terbuka
        document.body.style.overflow = 'hidden';
        
        // Hidupkan kembali scroll saat modal ditutup (cleanup function)
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Jika order null (safety check), jangan render apa-apa
    if (!order) return null;

    // --- 2. ADAPTASI DATA (Mapping Data API vs Dummy) ---
    
    // Ambil list item. Prioritas: 1. API Admin/User (daftar_item), 2. API Lama (details.items), 3. Dummy (items)
    const itemsList = order.daftar_item || order.details?.items || order.items || [];
    
    // Format Tanggal: Coba parsing ISO date dari API, kalau gagal pakai string biasa
    const displayDate = order.dibuat_pada ? new Date(order.dibuat_pada).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }) : (order.dateDisplay || order.date);

    // ID Transaksi: API (nomor_nota) atau Dummy (id)
    const displayId = order.nomor_nota || order.nota || order.id;
    
    // Total Bayar
    const totalBayar = order.total_bayar || order.total || 0;

    // --- 3. LOGIKA HITUNGAN ---
    const subtotal = itemsList.reduce((sum, item) => {
        // Jika API sudah menyediakan total per item, pakai itu
        if (item.total_per_item) return sum + item.total_per_item;
        
        // Fallback: Hitung manual (Harga * Qty)
        const qty = item.jumlah || item.qty || 0;
        // Cek harga di berbagai level nesting
        const price = item.harga_satuan || item.price || item.varian?.produk?.harga_satuan || 0;
        
        return sum + (price * qty);
    }, 0);

    // Asumsi pajak/biaya admin adalah selisih Total Bayar - Subtotal Barang
    const tax = totalBayar - subtotal; 

    // --- 4. NORMALISASI STATUS & TOMBOL ---
    // Ubah status jadi huruf kecil semua untuk pengecekan (biar "PROSES" == "proses")
    const statusLower = (order.status || '').toLowerCase();
    
    // Logika Tombol Batalkan: Muncul jika status 'menunggu' atau 'menunggu pembayaran'
    const isCancellable = statusLower === 'menunggu' || 
                          statusLower === 'menunggu pembayaran'; 
    
    // Logika Tombol Cetak: Muncul jika status 'selesai'
    const isDone = statusLower === 'selesai';


    // Handler tombol Batal
    const handleCancelOrder = () => {
        if (window.confirm(`Anda yakin ingin membatalkan pesanan #${displayId}?`)) {
            // Disini tempat memanggil API Cancel Order nantinya
            console.log(`[PEMBATALAN DIPROSES] Pesanan #${displayId} dibatalkan.`);
            alert(`Pesanan #${displayId} telah dibatalkan.`);
            onClose(); 
        }
    };

    // --- 5. RENDER KE BODY LANGSUNG (PORTAL) ---
    // createPortal memindahkan elemen ini keluar dari hierarki DOM komponen induk.
    // Hasilnya: Modal ini dirender sejajar dengan div #root, sehingga z-indexnya mutlak menutupi navbar sticky.
    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex justify-center items-end md:items-center">
            
            {/* CONTAINER MODAL */}
            <div 
                className="bg-white w-full h-full md:w-4/5 md:max-w-xl md:h-5/6 rounded-none md:rounded-xl shadow-2xl 
                           transform translate-y-0 transition-transform duration-300 ease-out 
                           flex flex-col overflow-hidden"
            >
                {/* HEADER */}
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

                {/* CONTENT (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    
                    {/* INFO UTAMA */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">ID Transaksi:</p>
                        <p className="text-2xl font-extrabold text-indigo-600 mb-2">#{displayId}</p>
                        <p className="text-sm text-gray-600">Tanggal: {displayDate}</p>
                        
                        <p className={`text-sm font-semibold mt-1 ${
                            statusLower === 'selesai' ? 'text-green-600' : 
                            statusLower === 'diproses' ? 'text-blue-600' :
                            statusLower === 'batal' ? 'text-red-600' :
                            'text-yellow-600'
                        }`}>
                            Status: {order.status}
                        </p>
                    </div>

                    {/* DAFTAR ITEM */}
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-3">Item Pembelian</h3>
                        <div className="space-y-3">
                            {itemsList.map((item, index) => {
                                // Logic Nama Produk (Handle Nested Data Prisma)
                                const name = item.varian?.produk?.nama_produk || 
                                             item.nama_produk || 
                                             item.name || 
                                             'Produk Dihapus';
                                
                                const variantInfo = item.varian?.nama_varian || item.variant;
                                const unitInfo = item.varian?.nama_satuan || '';

                                const qty = item.jumlah || item.qty || 0;
                                // Logic Harga
                                const totalItemPrice = item.total_per_item || ((item.harga_satuan || item.price || item.varian?.produk?.harga_satuan || 0) * qty);
                                const unitPrice = (qty > 0 ? totalItemPrice / qty : 0);

                                return (
                                    <div key={index} className="flex justify-between text-sm">
                                        <div className="text-gray-700 w-3/5">
                                            <p className="font-medium">{name}</p>
                                            <p className="text-xs text-gray-500">
                                                {qty} {unitInfo} x {formatRupiah(unitPrice)}
                                            </p>
                                            {variantInfo && (
                                                <p className='text-xs text-gray-400'>Varian: {variantInfo}</p>
                                            )}
                                        </div>
                                        <span className="font-medium text-gray-900 self-start">
                                            {formatRupiah(totalItemPrice)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RINGKASAN HARGA */}
                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm text-gray-700">
                            <span>Subtotal Barang:</span>
                            <span>{formatRupiah(subtotal)}</span>
                        </div>
                        {tax > 0 && (
                            <div className="flex justify-between text-sm text-gray-700">
                                <span>Pajak/Biaya Layanan:</span>
                                <span>{formatRupiah(tax)}</span>
                            </div>
                        )}
                        <div className="flex justify-between pt-2 border-t font-bold text-lg text-gray-900">
                            <span>Total Pembayaran:</span>
                            <span>{formatRupiah(totalBayar)}</span>
                        </div>
                    </div>

                    {/* Spacer agar tombol tidak mepet bawah saat scroll */}
                    <div className="h-20"></div> 

                    {/* FOOTER ACTIONS */}
                    <div className="p-4 border-t flex flex-col md:flex-row gap-3">
                        {isCancellable && (
                            <button 
                                onClick={handleCancelOrder}
                                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                            >
                                Batalkan Pesanan
                            </button>
                        )}

                        {isDone && (
                          <button
                            className='w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition'
                          >
                              Cetak Struk
                          </button>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body // Target Portal ke Body
    );
};

export default ModalDetailTransaksi;



