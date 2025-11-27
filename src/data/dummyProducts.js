import productImage1 from '../assets/Indomie_Goreng.png';
// The file for productImage2 is currently missing.
// import productImage2 from '../assets/Sedaap_Goreng.png'; 
import productImage3 from '../assets/Ultramilk.png';

// This data is used as a placeholder until the API is implemented.
export const dummyProducts = [
  {
    id: 1,
    name: 'Indomie Goreng',
    category: 'Makanan Instan',
    description: 'Indomie Goreng adalah salah satu varian mie instan yang paling populer di Indonesia, diproduksi oleh Indofood. Dikenal dengan cita rasa gurih dan manisnya yang khas, serta dilengkapi dengan bawang goreng renyah.',
    image: productImage1,
    variants: [
      { name: 'PCS', price: 3000 },
      { name: 'DUS', price: 115000 },
      { name: 'RENTENG', price: 28000 },
    ],
  },
  // {
  //   id: 2,
  //   name: 'Sedaap Goreng',
  //   category: 'Makanan Instan',
  //   description: 'Mie Sedaap Goreng adalah mie instan dari Wings Food yang terkenal dengan kriuknya yang renyah. Memiliki bumbu yang khas dan rasa yang kuat, menjadi salah satu pesaing utama di pasar mie instan.',
  //   image: productImage2, // This image is currently missing
  //   variants: [
  //     { name: 'PCS', price: 3000 },
  //     { name: 'DUS', price: 114000 },
  //     { name: 'RENTENG', price: 27500 },
  //   ],
  // },
  {
    id: 3,
    name: 'Susu UHT Ultramilk Coklat 250ml',
    category: 'Minuman',
    description: 'Susu UHT dari Ultrajaya dengan rasa coklat yang lezat. Dibuat dari susu sapi segar berkualitas tinggi dan diproses dengan teknologi UHT untuk menjaga nutrisi dan kesegarannya.',
    image: productImage3,
    variants: [
      { name: 'PCS', price: 5500 },
      { name: 'LUSIN', price: 65000 },
      { name: 'DUS', price: 130000 },
    ],
  },
];
