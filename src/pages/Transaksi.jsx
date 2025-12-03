// import React, { useState, useMemo } from 'react';
// import ModalDetailTransaksi from '../components/ModalDetailTransaksi';
// // import './Transaksi.css'; // Hapus import CSS, ganti dengan Tailwind
// import { ordersData } from '../data/dummyTranaksi';
// import { Search } from 'lucide-react'; // Ikon pencarian opsional

// function Transaksi() {
//     const [orders, setOrders] = useState(ordersData);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [filterDate, setFilterDate] = useState(''); 

    

//     // Helper untuk mengubah format tanggal string (misal: "26 Juli 2024") menjadi "YYYY-MM-DD"
//     const normalizeDate = (dateString) => {
//         const parts = dateString.split(' ');
//         if (parts.length !== 3) return ''; 

//         const monthMap = {
//             'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04',
//             'Mei': '05', 'Juni': '06', 'Juli': '07', 'Agustus': '08',
//             'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12',
//         };
//         const month = monthMap[parts[1]];
//         const day = parts[0].padStart(2, '0');
//         const year = parts[2];
        
//         return `${year}-${month}-${day}`;
//     };

//     const filteredOrders = useMemo(() => {
//         if (!filterDate) {
//             return orders; 
//         }

//         return orders.filter(order => {
//             const orderNormalizedDate = normalizeDate(order.date);
//             // Mencocokkan format YYYY-MM-DD dari date picker dengan tanggal order
//             return orderNormalizedDate === filterDate;
//         });
//     }, [orders, filterDate]);

//     const handleViewDetails = (order) => {
//         setSelectedOrder(order);
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setSelectedOrder(null);
//     };

//     const formatRupiah = (number) => {
//         return new Intl.NumberFormat('id-ID', {
//             style: 'currency',
//             currency: 'IDR',
//             minimumFractionDigits: 0,
//         }).format(number);
//     };

    
    
//     return (
//         <div className='p-4 md:p-8 bg-gray-50 min-h-screen'> 
//             {/* Bagian HEADER Statis (Sticky) */}
//             <div className='sticky top-0 z-10 bg-gray-50 pt-1 pb-4 border-b border-gray-200 shadow-sm md:shadow-none'>
//                 <div className='flex justify-between items-center flex-wrap gap-4'>
//                     <h1 className='text-3xl font-bold text-gray-800'>Daftar Transaksi</h1>

//                     {/* Filter Tanggal Statis */}
//                     <div className='filter-controls flex items-center space-x-2 bg-white p-2 rounded-lg border'>
//                         <label htmlFor='filter-date' className='text-sm font-medium text-gray-700 whitespace-nowrap'>
//                             Filter Tanggal:
//                         </label>
//                         <input 
//                             type="date"
//                             id='filter-date'
//                             className='w-40 p-1 border-none focus:ring-0 text-gray-700 text-sm cursor-pointer'
//                             value={filterDate}
//                             onChange={(e) => setFilterDate(e.target.value)}
//                         />
//                         {/* Tombol Reset Filter opsional */}
//                          {filterDate && (
//                             <button
//                                 onClick={() => setFilterDate('')}
//                                 className="text-red-500 hover:text-red-700 text-sm"
//                                 title="Hapus Filter"
//                             >
//                                 Reset
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Bagian Daftar Transaksi (Scrollable) */}
//             <div className='mt-6 space-y-3 pb-20'> 
//                 {filteredOrders.length > 0 ? (
//                     filteredOrders.map((order) => (
//                         <div 
//                             key={order.id} 
//                             className='order-card-summary bg-white p-4 rounded-xl shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition duration-200 flex justify-between items-center'
//                             onClick={() => handleViewDetails(order)}
//                         >
//                             <div className='summary-info space-y-1'>
//                                 <span className='text-xs font-medium text-gray-500 block'>{order.date}</span>
//                                 <strong className='text-base font-semibold text-indigo-700'>#{order.id}</strong>
//                             </div>
//                             <div className='summary-total-container text-right space-y-1'>
//                                 {/* Status menggunakan badge Tailwind */}
//                                 <span className={`summary-status text-xs font-semibold px-2 py-0.5 rounded-full 
//                                     ${order.status === 'Selesai' ? 'bg-green-100 text-green-700' : 
//                                       order.status === 'Dikirim' ? 'bg-blue-100 text-blue-700' :
//                                       'bg-yellow-100 text-yellow-700'}`}
//                                 >
//                                     {order.status}
//                                 </span>
//                                 <strong className='summary-total text-lg font-bold text-gray-900 block'>
//                                     {formatRupiah(order.total)}
//                                 </strong>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <p className='no-data-message p-6 text-center text-gray-500 bg-white rounded-xl shadow'>
//                         Tidak ada transaksi pada tanggal tersebut.
//                     </p>
//                 )}
//             </div>

//             {isModalOpen && selectedOrder && (
//                 <ModalDetailTransaksi 
//                     order={selectedOrder} 
//                     onClose={handleCloseModal} 
//                     formatRupiah={formatRupiah}
//                 />
//             )}
//         </div>
//     );
// }

// export default Transaksi;


// import React, { useState, useEffect, useMemo } from 'react';
// import ModalDetailTransaksi from '../components/ModalDetailTransaksi';
// import { Loader2 } from 'lucide-react'; 

// import { fetchMyOrders } from '../data/DataTransaksi';

// function Transaksi() {
//     const [orders, setOrders] = useState([]); 
//     const [loading, setLoading] = useState(true); 
//     const [error, setError] = useState(''); 

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [filterDate, setFilterDate] = useState(''); 

//     // --- USE EFFECT (Jauh lebih simpel) ---
//     useEffect(() => {
//         const loadData = async () => {
//             setLoading(true);
//             try {
//                 // Panggil service, data yang datang SUDAH rapi
//                 const data = await fetchMyOrders();
//                 setOrders(data);
//             } catch (err) {
//                 setError('Gagal memuat riwayat transaksi.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadData();
//     }, []);

//     // --- FILTER DATA ---
//     // Karena di service kita sudah buat properti 'rawDate', filtering jadi gampang
//     const filteredOrders = useMemo(() => {
//         if (!filterDate) return orders; 
        
//         return orders.filter(order => {
//             // Bandingkan langsung (YYYY-MM-DD === YYYY-MM-DD)
//             return order.rawDate === filterDate;
//         });
//     }, [orders, filterDate]);

//     // Helper Format Rupiah
//     const formatRupiah = (number) => {
//         return new Intl.NumberFormat('id-ID', {
//             style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
//         }).format(number);
//     };

//     const handleViewDetails = (order) => {
//         setSelectedOrder(order);
//         setIsModalOpen(true);
//     };

//     // --- RENDER ---
//     if (loading) return <div className='p-10 text-center'>Loading...</div>;
//     if (error) return <div className='p-10 text-center text-red-500'>{error}</div>;

//     return (
//         <div className='p-4 md:p-8 bg-gray-50 min-h-screen'> 
//             {/* ... Bagian Header & Date Picker (Sama seperti sebelumnya) ... */}
//             <div className='mb-4'>
//                  <input 
//                     type="date" 
//                     value={filterDate} 
//                     onChange={(e) => setFilterDate(e.target.value)}
//                     className="p-2 border rounded"
//                  />
//             </div>

//             <div className='space-y-3 pb-20'> 
//                 {filteredOrders.length > 0 ? (
//                     filteredOrders.map((order) => (
//                         <div 
//                             key={order.id} 
//                             onClick={() => handleViewDetails(order)}
//                             className='bg-white p-4 rounded-xl shadow cursor-pointer flex justify-between items-center'
//                         >
//                             <div>
//                                 {/* Pakai dateDisplay yang sudah diformat di service */}
//                                 <span className='text-xs text-gray-500 block'>{order.dateDisplay}</span>
//                                 {/* Tampilkan Nomor Nota */}
//                                 <strong className='text-indigo-700'>{order.nota}</strong>
//                             </div>
//                             <div className='text-right'>
//                                 <span className='text-xs font-bold px-2 py-1 rounded bg-gray-100'>
//                                     {order.status}
//                                 </span>
//                                 <strong className='block text-gray-900 mt-1'>
//                                     {formatRupiah(order.total)}
//                                 </strong>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <p className='text-center text-gray-500'>Tidak ada transaksi.</p>
//                 )}
//             </div>

//             {isModalOpen && selectedOrder && (
//                 <ModalDetailTransaksi 
//                     order={selectedOrder} 
//                     onClose={() => setIsModalOpen(false)} 
//                     formatRupiah={formatRupiah}
//                 />
//             )}
//         </div>
//     );
// }

// export default Transaksi;



//===============================================================

// import React, { useState, useEffect, useMemo } from 'react';
// import ModalDetailTransaksi from '../components/ModalDetailTransaksi';
// import { Loader2, Calendar } from 'lucide-react'; // Tambah icon Calendar biar cantik

// // Import data sesuai kodinganmu
// import { fetchMyOrders } from '../data/DataTransaksi';
// import { createPortal } from 'react-dom';

// function Transaksi() {
//     const [orders, setOrders] = useState([]); 
//     const [loading, setLoading] = useState(true); 
//     const [error, setError] = useState(''); 

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedOrder, setSelectedOrder] = useState(null);
    
//     // 1. UBAH STATE: Dari satu tanggal jadi dua (Start & End)
//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');

//     useEffect(() => {
//         const loadData = async () => {
//             setLoading(true);
//             try {
//                 const data = await fetchMyOrders();
//                 setOrders(data);
//             } catch (err) {
//                 setError('Gagal memuat riwayat transaksi.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadData();
//     }, []);

//     // 2. LOGIC FILTER RENTANG TANGGAL
//     const filteredOrders = useMemo(() => {
//         return orders.filter(order => {
//             // Jika filter kosong, tampilkan semua
//             if (!startDate && !endDate) return true;

//             const orderDate = order.rawDate; // Format YYYY-MM-DD dari service

//             // Cek Batas Awal (orderDate harus >= startDate)
//             if (startDate && orderDate < startDate) return false;
            
//             // Cek Batas Akhir (orderDate harus <= endDate)
//             if (endDate && orderDate > endDate) return false;

//             return true;
//         });
//     }, [orders, startDate, endDate]);

//     const formatRupiah = (number) => {
//         return new Intl.NumberFormat('id-ID', {
//             style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
//         }).format(number);
//     };

//     const handleViewDetails = (order) => {
//         setSelectedOrder(order);
//         setIsModalOpen(true);
//     };

//     // Fungsi Reset
//     const handleResetFilter = () => {
//         setStartDate('');
//         setEndDate('');
//     };

//     if (loading) return (
//         <div className='flex justify-center items-center min-h-screen bg-gray-50'>
//             <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
//         </div>
//     );
    
//     if (error) return <div className='p-10 text-center text-red-500'>{error}</div>;

//     return (
//         <div className='p-4 md:p-8 bg-gray-50 min-h-screen'> 
//             {/* 3. HEADER STATIC / STICKY */}
//             <div className='sticky top-0 z-10 bg-gray-50 pt-1 pb-4 border-b border-gray-200 shadow-sm md:shadow-none mb-6'>
//                 <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
//                     <h1 className='text-3xl font-bold text-gray-800'>Daftar Transaksi</h1>
                    
//                     {/* UI FILTER RENTANG TANGGAL */}
//                     <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex flex-wrap items-center gap-2 w-full md:w-auto">
//                         <div className="flex items-center gap-2 mr-2">
//                             <Calendar size={18} className="text-gray-500" />
//                             <span className="text-sm font-medium text-gray-600 hidden md:inline">Periode:</span>
//                         </div>
                        
//                         <input 
//                             type="date" 
//                             value={startDate} 
//                             onChange={(e) => setStartDate(e.target.value)}
//                             className="p-2 border rounded text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none flex-1 md:flex-none"
//                             placeholder="Dari"
//                         />
//                         <span className="text-gray-400 font-bold">-</span>
//                         <input 
//                             type="date" 
//                             value={endDate} 
//                             onChange={(e) => setEndDate(e.target.value)}
//                             className="p-2 border rounded text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none flex-1 md:flex-none"
//                             placeholder="Sampai"
//                         />

//                         {/* Tombol Reset muncul kalau ada filter aktif */}
//                         {(startDate || endDate) && (
//                             <button 
//                                 onClick={handleResetFilter}
//                                 className="ml-2 text-sm text-red-600 hover:text-red-800 font-medium underline"
//                             >
//                                 Reset
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* List Transaksi */}
//             <div className='space-y-3 pb-20'> 
//                 {filteredOrders.length > 0 ? (
//                     filteredOrders.map((order) => (
//                         <div 
//                             key={order.id} 
//                             onClick={() => handleViewDetails(order)}
//                             className='bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition duration-200 flex justify-between items-center'
//                         >
//                             <div>
//                                 <span className='text-xs text-gray-500 block'>{order.dateDisplay}</span>
//                                 <strong className='text-indigo-700 text-sm md:text-base'>{order.nota}</strong>
//                             </div>
//                             <div className='text-right'>
//                                 <span className={`text-xs font-bold px-2 py-1 rounded inline-block mb-1 ${
//                                     order.status === 'Selesai' ? 'bg-green-100 text-green-700' : 
//                                     order.status === 'Batal' ? 'bg-red-100 text-red-700' :
//                                     order.status === 'Dikirim' ? 'bg-blue-100 text-blue-700' :
//                                     'bg-yellow-100 text-yellow-700'
//                                 }`}>
//                                     {order.status}
//                                 </span>
//                                 <strong className='block text-gray-900 text-sm md:text-base'>
//                                     {formatRupiah(order.total)}
//                                 </strong>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <div className='text-center py-10 bg-white rounded-xl border border-dashed border-gray-300'>
//                         <p className='text-gray-500'>Tidak ada transaksi pada periode ini.</p>
//                         {(startDate || endDate) && (
//                             <button onClick={handleResetFilter} className='mt-2 text-indigo-600 text-sm font-medium hover:underline'>
//                                 Hapus Filter
//                             </button>
//                         )}
//                     </div>
//                 )}
//             </div>

//             {isModalOpen && selectedOrder && (
//                 <ModalDetailTransaksi 
//                     order={selectedOrder} 
//                     onClose={() => setIsModalOpen(false)} 
//                     formatRupiah={formatRupiah}
//                 />
//             )}
//         </div>
//     );
// }

// export default Transaksi;

//++++===================================================================================+++

import React, { useState, useEffect, useMemo } from 'react';
import ModalDetailTransaksi from '../components/ModalDetailTransaksi';
import { Loader2, Calendar } from 'lucide-react'; 

// Pastikan path import ini sesuai dengan struktur project Anda
import { fetchMyOrders } from '../data/DataTransaksi';

function Transaksi() {
    const [orders, setOrders] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(''); 

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    // State Filter Tanggal
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // --- 1. EFEK KUNCI SCROLL (KAYAK YANG TADI) ---
    // Logika ini akan mematikan scroll body saat isModalOpen = true
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden'; // Kunci scroll
        } else {
            document.body.style.overflow = 'unset'; // Buka kunci
        }

        // Cleanup saat component unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchMyOrders();
                setOrders(data);
            } catch (err) {
                setError('Gagal memuat riwayat transaksi.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Logic Filter
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            if (!startDate && !endDate) return true;

            const orderDate = order.rawDate; 

            if (startDate && orderDate < startDate) return false;
            if (endDate && orderDate > endDate) return false;

            return true;
        });
    }, [orders, startDate, endDate]);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
        }).format(number);
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleResetFilter = () => {
        setStartDate('');
        setEndDate('');
    };

    if (loading) return (
        <div className='flex justify-center items-center min-h-screen bg-gray-50'>
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
        </div>
    );
    
    if (error) return <div className='p-10 text-center text-red-500'>{error}</div>;

    return (
        <div className='p-4 md:p-8 bg-gray-50 min-h-screen'> 
            {/* Header Sticky */}
            <div className='sticky top-0 z-10 bg-gray-50 pt-1 pb-4 border-b border-gray-200 shadow-sm md:shadow-none mb-6'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                    <h1 className='text-3xl font-bold text-gray-800'>Daftar Transaksi</h1>
                    
                    {/* UI Filter */}
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-2 mr-2">
                            <Calendar size={18} className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-600 hidden md:inline">Periode:</span>
                        </div>
                        
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)}
                            className="p-2 border rounded text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none flex-1 md:flex-none"
                            placeholder="Dari"
                        />
                        <span className="text-gray-400 font-bold">-</span>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)}
                            className="p-2 border rounded text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none flex-1 md:flex-none"
                            placeholder="Sampai"
                        />

                        {(startDate || endDate) && (
                            <button 
                                onClick={handleResetFilter}
                                className="ml-2 text-sm text-red-600 hover:text-red-800 font-medium underline"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* List Transaksi */}
            <div className='space-y-3 pb-20'> 
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <div 
                            key={order.id} 
                            onClick={() => handleViewDetails(order)}
                            className='bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition duration-200 flex justify-between items-center'
                        >
                            <div>
                                <span className='text-xs text-gray-500 block'>{order.dateDisplay}</span>
                                <strong className='text-indigo-700 text-sm md:text-base'>{order.nota}</strong>
                            </div>
                            <div className='text-right'>
                                <span className={`text-xs font-bold px-2 py-1 rounded inline-block mb-1 ${
                                    order.status === 'Selesai' ? 'bg-green-100 text-green-700' : 
                                    order.status === 'Batal' ? 'bg-red-100 text-red-700' :
                                    order.status === 'Dikirim' ? 'bg-blue-100 text-blue-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {order.status}
                                </span>
                                <strong className='block text-gray-900 text-sm md:text-base'>
                                    {formatRupiah(order.total)}
                                </strong>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-center py-10 bg-white rounded-xl border border-dashed border-gray-300'>
                        <p className='text-gray-500'>Tidak ada transaksi pada periode ini.</p>
                        {(startDate || endDate) && (
                            <button onClick={handleResetFilter} className='mt-2 text-indigo-600 text-sm font-medium hover:underline'>
                                Hapus Filter
                            </button>
                        )}
                    </div>
                )}
            </div>

            {isModalOpen && selectedOrder && (
                <ModalDetailTransaksi 
                    order={selectedOrder} 
                    onClose={() => setIsModalOpen(false)} 
                    formatRupiah={formatRupiah}
                />
            )}
        </div>
    );
}

export default Transaksi;