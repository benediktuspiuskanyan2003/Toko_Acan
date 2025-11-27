import React, { useState, useMemo } from 'react';
import ModalDetailTransaksi from '../components/ModalDetailTransaksi';
import './Transaksi.css';

function Transaksi() {
  const [orders] = useState([
    {
      id: 'INV/20240726/A001',
      date: '26 Juli 2024',
      status: 'Dikirim',
      total: 350000,
      items: [
        { name: 'Beras Pulen 5kg', qty: 1, price: 60000 },
        { name: 'Minyak Goreng 2L', qty: 2, price: 30000 },
        { name: 'Telur Ayam 1 Tray', qty: 1, price: 55000 },
      ],
    },
    {
      id: 'INV/20240725/B005',
      date: '25 Juli 2024',
      status: 'Menunggu Pembayaran',
      total: 125000,
      items: [{ name: 'Susu UHT Full Cream 1L', qty: 5, price: 25000 }],
    },
    {
      id: 'INV/20240720/C010',
      date: '20 Juli 2024',
      status: 'Selesai',
      total: 55000,
      items: [{ name: 'Mie Instan Rasa Soto', qty: 20, price: 2750 }],
    },
    {
        id: 'INV/20240726/D002', 
        date: '26 Juli 2024',
        status: 'Selesai',
        total: 75000,
        items: [{ name: 'Kopi Bubuk', qty: 1, price: 75000 }],
    },
  ]);

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const [filterDate, setFilterDate] = useState(''); 

  
  const filteredOrders = useMemo(() => {
    if (!filterDate) {
      return orders; 
    }

    
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

    return orders.filter(order => {
      const orderNormalizedDate = normalizeDate(order.date);
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
    <div className='transaction-container'> 
      <h1>Transaksi        
      </h1>

      <div className='transaction-section'>
        <div className='transaction-header-controls'>
            
            
            {/* Input Filter Tanggal Baru */}
            <div className='filter-controls'>
                <label htmlFor='filter-date'>Filter Tanggal:</label>
                <input 
                    type="date"
                    id='filter-date'
                    className='input-date-filter'
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
            </div>
        </div>

        {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className='order-card-summary'
                onClick={() => handleViewDetails(order)}
              >
                <div className='summary-info'>
                  <span className='summary-date'>{order.date}</span>
                  <strong className='summary-id'>#{order.id}</strong>
                </div>
                <div className='summary-total-container'>
                    <span className='summary-status'>{order.status}</span>
                    <strong className='summary-total'>{formatRupiah(order.total)}</strong>
                </div>
              </div>
            ))
        ) : (
            <p className='no-data-message'>Tidak ada transaksi pada tanggal tersebut.</p>
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