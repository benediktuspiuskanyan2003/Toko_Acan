// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api'; // Import jembatan tadi

const Dashboard = () => {
  // State untuk menyimpan data dari backend
  const [stats, setStats] = useState({
    pesanan_menunggu: 0,
    omset_hari_ini: 0,
    pesanan_diproses: 0,
  });

  const [loading, setLoading] = useState(true);

  // Fungsi Format Rupiah biar cantik
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Nembak ke Backend
        const response = await api.get('/admin/dashboard-stats');
        if (response.data.success) {
            console.log(response.data.data);
          setStats(response.data.data); // Simpan data ke state
        }
      } catch (error) {
        console.error("Gagal ambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Ringkasan Toko</h2>

      {loading ? (
        <p>Sedang memuat data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Kartu 1: Pesanan Baru (MENUNGGU) */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-medium">Pesanan Baru</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {stats.pesanan_menunggu}
            </p>
          </div>

          {/* Kartu 2: Omset Hari Ini */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-medium">Omset Hari Ini</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {formatRupiah(stats.omset_hari_ini)}
            </p>
          </div>

          {/* Kartu 3: Sedang Diproses */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <h3 className="text-gray-500 text-sm font-medium">Sedang Diproses</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {stats.pesanan_diproses}
            </p>
          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;