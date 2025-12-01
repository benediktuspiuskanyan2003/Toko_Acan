import React, { useState, useMemo } from 'react';
import ModalDetailTransaksi from '../components/ModalDetailTransaksi';
// import './Transaksi.css'; // Hapus import CSS, ganti dengan Tailwind
import { ordersData } from '../data/dummyTranaksi';
import { Search } from 'lucide-react'; // Ikon pencarian opsional

function Transaksi() {
    const [orders, setOrders] = useState(ordersData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterDate, setFilterDate] = useState(''); 

    

    // Helper untuk mengubah format tanggal string (misal: "26 Juli 2024") menjadi "YYYY-MM-DD"
    const normalizeDate = (dateString) => {
        const parts = dateString.split(' ');
        if (parts.length !== 3) return ''; 

        const monthMap = {
            'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04',
            'Mei': '05', 'Juni': '06', 'Juli': '07', 'Agustus': '08',
            'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12',
        };
        const month = monthMap[parts[1]];
        const day = parts[0].padStart(2, '0');
        const year = parts[2];
        
        return `${year}-${month}-${day}`;
    };

    const filteredOrders = useMemo(() => {
        if (!filterDate) {
            return orders; 
        }

        return orders.filter(order => {
            const orderNormalizedDate = normalizeDate(order.date);
            // Mencocokkan format YYYY-MM-DD dari date picker dengan tanggal order
            return orderNormalizedDate === filterDate;
        });
    }, [orders, filterDate]);

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    
    
    return (
        <div className='p-4 md:p-8 bg-gray-50 min-h-screen'> 
            {/* Bagian HEADER Statis (Sticky) */}
            <div className='sticky top-0 z-10 bg-gray-50 pt-1 pb-4 border-b border-gray-200 shadow-sm md:shadow-none'>
                <div className='flex justify-between items-center flex-wrap gap-4'>
                    <h1 className='text-3xl font-bold text-gray-800'>Daftar Transaksi</h1>

                    {/* Filter Tanggal Statis */}
                    <div className='filter-controls flex items-center space-x-2 bg-white p-2 rounded-lg border'>
                        <label htmlFor='filter-date' className='text-sm font-medium text-gray-700 whitespace-nowrap'>
                            Filter Tanggal:
                        </label>
                        <input 
                            type="date"
                            id='filter-date'
                            className='w-40 p-1 border-none focus:ring-0 text-gray-700 text-sm cursor-pointer'
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                        {/* Tombol Reset Filter opsional */}
                         {filterDate && (
                            <button
                                onClick={() => setFilterDate('')}
                                className="text-red-500 hover:text-red-700 text-sm"
                                title="Hapus Filter"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Bagian Daftar Transaksi (Scrollable) */}
            <div className='mt-6 space-y-3 pb-20'> 
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <div 
                            key={order.id} 
                            className='order-card-summary bg-white p-4 rounded-xl shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition duration-200 flex justify-between items-center'
                            onClick={() => handleViewDetails(order)}
                        >
                            <div className='summary-info space-y-1'>
                                <span className='text-xs font-medium text-gray-500 block'>{order.date}</span>
                                <strong className='text-base font-semibold text-indigo-700'>#{order.id}</strong>
                            </div>
                            <div className='summary-total-container text-right space-y-1'>
                                {/* Status menggunakan badge Tailwind */}
                                <span className={`summary-status text-xs font-semibold px-2 py-0.5 rounded-full 
                                    ${order.status === 'Selesai' ? 'bg-green-100 text-green-700' : 
                                      order.status === 'Dikirim' ? 'bg-blue-100 text-blue-700' :
                                      'bg-yellow-100 text-yellow-700'}`}
                                >
                                    {order.status}
                                </span>
                                <strong className='summary-total text-lg font-bold text-gray-900 block'>
                                    {formatRupiah(order.total)}
                                </strong>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='no-data-message p-6 text-center text-gray-500 bg-white rounded-xl shadow'>
                        Tidak ada transaksi pada tanggal tersebut.
                    </p>
                )}
            </div>

            {isModalOpen && selectedOrder && (
                <ModalDetailTransaksi 
                    order={selectedOrder} 
                    onClose={handleCloseModal} 
                    formatRupiah={formatRupiah}
                />
            )}
        </div>
    );
}

export default Transaksi;