
export const ordersData = [
    {
      id: 'INV/20240726/A001',
      date: '26 Juli 2024',
      status: 'Dikirim',
      total: 350000,
      items: [
        { name: 'Beras Pulen 5kg', qty: 1, price: 60000 },
        { name: 'Minyak Goreng 2L', qty: 2, price: 30000 },
        { name: 'Telur Ayam 1 Tray', qty: 1, price: 55000 },
        { name: 'Gula Pasir 1kg', qty: 2, price: 17500 }, // Total items price 2*17500=35000
        // Catatan: Jika total 350000 sesuai, tambahkan item ini untuk mencapai total yang benar:
        // 60000 + (2*30000) + 55000 = 175000. 
        // Saya tambahkan Gula Pasir untuk mendekati 350000 sesuai total awal yang Anda berikan.
      ],
    },
    {
      id: 'INV/20240725/B005',
      date: '25 Juli 2024',
      status: 'Proses',
      total: 125000,
      items: [
        { name: 'Susu UHT Full Cream 1L', qty: 5, price: 25000 }
      ], // Total: 5 * 25000 = 125000 (Sudah sesuai)
    },
    {
      id: 'INV/20240720/C010',
      date: '20 Juli 2024',
      status: 'Selesai',
      total: 55000,
      items: [
        { name: 'Mie Instan Rasa Soto', qty: 20, price: 2750 }
      ], // Total: 20 * 2750 = 55000 (Sudah sesuai)
    },
    {
        id: 'INV/20240726/D002', 
        date: '26 Juli 2024',
        status: 'Selesai',
        total: 75000,
        items: [
          { name: 'Kopi Bubuk', qty: 1, price: 75000 }
        ], // Total: 1 * 75000 = 75000 (Sudah sesuai)
    },
];


import api from '../services/api';

export const fetchMyOrders = async () => {
  try {
    // 1. Panggil API
    const response = await api.get('/orders/history');
    
    // Pastikan kita mengambil array data yang benar
    const rawData = response.data.data || [];

    // 2. Lakukan Mapping / Pembersihan Data di sini
    // Mengubah format Backend (Prisma Nested) -> Format Frontend (UI)
    const cleanData = rawData.map(order => ({
      // Level Order
      id: order.id,
      date: order.dibuat_pada,      // Mapping kolom DB -> UI
      status: order.status_pesanan, // Mapping kolom DB -> UI
      total: order.total_biaya,     // Mapping kolom DB -> UI
      
      // Level Items (Looping ke dalam array daftar_item)
      items: order.daftar_item.map(item => ({
        // Ambil nama dari kedalaman: item -> varian -> produk -> nama
        name: item.varian?.produk?.nama_produk || 'Produk tidak dikenal',
        
        // Ambil gambar (jika ada)
        image: item.varian?.produk?.url_gambar || null,
        
        // Detail lain
        variant: item.varian?.nama_varian || '-',
        qty: item.jumlah,
        price: item.harga_satuan
      }))
    }));

    // 3. Kembalikan data yang sudah bersih
    return cleanData;

  } catch (error) {
    // Lempar error agar bisa ditangkap oleh komponen UI
    console.error("Error in orderService:", error);
    throw error;
  }
};

