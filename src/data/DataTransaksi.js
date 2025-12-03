
import api from '../services/api';

export const fetchMyOrders = async () => {
  try {
    // 1. Tembak API
    const response = await api.get('/orders/history');

    // 2. Cek Success
    if (response.data.success) {
      
      // 3. LOGIKA MAPPING (Sesuai kode kamu)
      const formattedData = response.data.data.map(order => ({
        id: order.id,
        nota: order.nomor_nota, // Kita simpan nomor nota
        
        // Format Tanggal untuk Tampilan (contoh: 2 Desember 2025)
        dateDisplay: new Date(order.dibuat_pada).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        }),
        
        // Format Tanggal Asli untuk Filter (YYYY-MM-DD)
        rawDate: order.dibuat_pada.split('T')[0], 
        
        total: order.total_bayar,
        status: order.status,
        
        // Data detail yang kamu request
        details: {
            items: order.daftar_item,
            paymentMethod: order.metode_pembayaran,
            shippingType: order.jenis_pengiriman,
            shippingCost: order.biaya_ongkir,
            receiver: order.nama_penerima,
            address: order.alamat_tujuan
        }
      }));

      return formattedData; // Kembalikan data yang sudah rapi
    }
    
    return []; // Kembalikan array kosong jika success false

  } catch (error) {
    console.error("Gagal ambil transaksi di service:", error);
    throw error;
  }
};