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

    // EFEK KUNCI SCROLL
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden'; 
        } else {
            document.body.style.overflow = 'unset'; 
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    // FETCH DATA
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

    // LOGIC FILTER (MEMOIZED)
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            if (!startDate && !endDate) return true;

            const orderDate = order.rawDate; 

            if (startDate && orderDate < startDate) return false;
            if (endDate && orderDate > endDate) return false;

            return true;
        });
    }, [orders, startDate, endDate]);

    // FORMAT RUPIAH
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
        }).format(number);
    };

    // HANDLERS
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
            {/* Header Filter - PERBAIKAN DI SINI: top-0 diterapkan ke semua ukuran, lalu ditimpa oleh md:top-[64px] */}
            <div className='sticky top-0 z-10 bg-gray-50 pt-1 pb-4 border-b border-gray-200 shadow-sm md:shadow-none mb-6 md:top-[64px]'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                    {/* <h1 className='text-3xl font-bold text-gray-800'>Daftar Transaksi</h1> */}
                    
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