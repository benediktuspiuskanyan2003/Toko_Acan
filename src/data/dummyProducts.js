
export const dummyProducts = [
    {
        id: 1,
        name: 'Indomie Goreng',
        description: 'Indomie Goreng adalah salah satu varian mie instan yang paling populer di Indonesia, bahkan di dunia. Dikenal dengan bumbunya yang khas dan rasanya yang gurih, produk ini menjadi pilihan favorit banyak orang untuk santapan cepat dan lezat.',
        image: '/src/assets/Indomie_Goreng.png', // Pastikan path ini benar
        category: 'Makanan Instan',
        variants: [
            { name: 'PCS', tierName: 'Eceran', price: 3000, minQuantity: 1 },
            { name: 'PCS Grosir', tierName: 'Grosir (min. 3 pcs)', price: 2500, minQuantity: 3 },
            { name: 'RENTENG', tierName: '1 Renteng (10 pcs)', price: 27500, minQuantity: 1 },
            { name: 'DUS', tierName: '1 Dus (40 pcs)', price: 114000, minQuantity: 1 },
        ],
    },
    {
        id: 2,
        name: 'Sedaap Goreng',
        description: 'Mie Sedaap Goreng adalah pesaing utama di pasar mie instan goreng. Terkenal dengan tambahan bawang goreng renyah (kriuk-kriuk) yang memberikan sensasi tekstur berbeda saat dinikmati.',
        image: '/src/assets/Sedaap_Goreng.png', // Pastikan path ini benar
        category: 'Makanan Instan',
        variants: [
            { name: 'PCS', tierName: 'Eceran', price: 2800, minQuantity: 1 },
            { name: 'DUS', tierName: '1 Dus (40 pcs)', price: 108000, minQuantity: 1 },
        ],
    },
    {
        id: 3,
        name: 'Susu UHT Ultramilk',
        description: 'Ultramilk adalah susu UHT berkualitas tinggi yang dibuat dari susu sapi segar. Tersedia dalam berbagai varian rasa, susu ini cocok untuk konsumsi harian seluruh anggota keluarga.',
        image: '/src/assets/Ultramilk.png', // Pastikan path ini benar
        category: 'Minuman',
        variants: [
            { name: 'Cokelat', tierName: 'Cokelat 250ml', price: 6500, minQuantity: 1 },
            { name: 'Stroberi', tierName: 'Stroberi 250ml', price: 6500, minQuantity: 1 },
            { name: 'Full Cream', tierName: 'Full Cream 250ml', price: 6000, minQuantity: 1 },
        ],
    },
    // Tambahkan produk lain di sini jika perlu
];