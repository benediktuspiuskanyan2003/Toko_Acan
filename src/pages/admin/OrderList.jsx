// src/pages/admin/OrderList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('MENUNGGU'); // Default tab

  // Warna status biar cantik
  const statusColor = {
    MENUNGGU: 'bg-yellow-100 text-yellow-800',
    DIPROSES: 'bg-blue-100 text-blue-800',
    SELESAI: 'bg-green-100 text-green-800',
    BATAL: 'bg-red-100 text-red-800',
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Panggil API dengan filter status
      const response = await api.get(`/admin/orders?status=${filterStatus}`);
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Gagal ambil pesanan:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Daftar Pesanan</h2>

      {/* --- TAB FILTER --- */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['MENUNGGU', 'DIPROSES', 'SELESAI', 'BATAL'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${filterStatus === status 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* --- TABEL --- */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat pesanan...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nota</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pembeli</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Info</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Tidak ada pesanan "{filterStatus}".
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{order.nomor_nota}</div>
                      <div className="text-xs text-gray-500">{formatDate(order.dibuat_pada)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.pengguna?.nama_lengkap}</div>
                      <div className="text-xs text-gray-500">{order.pengguna?.no_wa}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{formatRupiah(order.total_bayar)}</div>
                      <span className={`text-xs px-2 py-0.5 rounded ${statusColor[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.jenis_pengiriman}<br/>
                      {order.metode_pembayaran}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/admin/orders/${order.id}`}
                        state={{ orderData: order }} 
                        className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                      >
                        Detail →
                      </Link>
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

export default OrderList;