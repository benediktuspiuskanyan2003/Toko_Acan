// src/pages/admin/OrderDetail.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const OrderDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.orderData);
  const [loading, setLoading] = useState(false);

  if (!order) return <div className="p-8">Data tidak ditemukan. <Link to="/admin/orders">Kembali</Link></div>;

  const handleUpdateStatus = async (newStatus) => {
    if (!window.confirm(`Ubah status jadi ${newStatus}?`)) return;
    setLoading(true);
    try {
      await api.patch(`/admin/orders/${order.id}`, {
        status: newStatus,
        catatan_admin: `Status diubah ke ${newStatus} oleh Admin`
      });
      alert('Status berhasil diupdate!');
      navigate('/admin/orders');
    } catch (error) {
      alert('Gagal update status');
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link to="/admin/orders" className="text-gray-500 hover:text-gray-700">← Kembali</Link>
        <h2 className="text-2xl font-bold text-gray-800">Detail Pesanan</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KIRI: DATA BARANG */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold border-b pb-2 mb-4">Item ({order.nomor_nota})</h3>
          <div className="space-y-3">
            {order.daftar_item.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <div className="font-medium">{item.varian?.produk?.nama_produk || 'Produk Dihapus'}</div>
                  <div className="text-sm text-gray-500">{item.jumlah} {item.varian?.nama_satuan}</div>
                </div>
                <div className="font-bold">{formatRupiah(item.total_per_item)}</div>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 font-bold text-lg flex justify-between">
            <span>Total Bayar</span>
            <span>{formatRupiah(order.total_bayar)}</span>
          </div>
        </div>

        {/* KANAN: AKSI */}
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h3 className="font-bold mb-3">Aksi Pesanan</h3>
          <div className="flex flex-col gap-2">
            {order.status === 'MENUNGGU' && (
              <>
                <button onClick={() => handleUpdateStatus('DIPROSES')} disabled={loading} className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Proses Pesanan</button>
                <button onClick={() => handleUpdateStatus('BATAL')} disabled={loading} className="bg-red-100 text-red-600 py-2 rounded hover:bg-red-200">Tolak Pesanan</button>
              </>
            )}
            {order.status === 'DIPROSES' && (
              <button onClick={() => handleUpdateStatus('SELESAI')} disabled={loading} className="bg-green-600 text-white py-2 rounded hover:bg-green-700">Selesaikan Pesanan</button>
            )}
            {order.status === 'SELESAI' && (
              <div className="text-center text-green-600 bg-green-50 py-2 rounded font-bold">✅ Transaksi Selesai</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;