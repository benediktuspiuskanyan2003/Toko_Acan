import React, { useState } from 'react';
import api from '../services/api';

const TestCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleTestOrder = async () => {
    setLoading(true);
    setResult(null);

    // DATA DUMMY (Pura-pura belanja)
    const payload = {
      // Pastikan ID ini ada di database kamu!
      items: [
        { variantId: 4, qty: 200 } 
      ],
      jenis_pengiriman: "AMBIL_SENDIRI", // atau "DIANTAR"
      metode_pembayaran: "COD",
      nama_penerima: "Budi Tester Frontend",
      alamat_tujuan: "Jalan Testing No 1"
    };

    try {
      const response = await api.post('/orders', payload);
      setResult(response.data);
      alert('✅ Order Berhasil Masuk!');
    } catch (error) {
      console.error(error);
      setResult(error.response?.data || { message: "Error tidak diketahui" });
      alert('❌ Gagal Order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Simulasi Checkout</h2>
        
        <p className="mb-4 text-sm text-gray-600">
          Klik tombol di bawah untuk mencoba mengirim pesanan palsu ke Backend.
        </p>

        <button 
          onClick={handleTestOrder}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 font-bold"
        >
          {loading ? 'Mengirim...' : '🚀 Tembak Order Palsu'}
        </button>

        {/* Area Hasil Response */}
        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded text-xs font-mono overflow-auto">
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCheckout;