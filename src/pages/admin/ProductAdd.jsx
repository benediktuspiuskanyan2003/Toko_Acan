// src/pages/admin/ProductAdd.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const ProductAdd = () => {
  const navigate = useNavigate();
  
  // State untuk Data Produk Induk
  const [formData, setFormData] = useState({
    nama_produk: '',
    deskripsi: '',
    id_kategori: '',
    url_gambar: '' // Sementara input text URL dulu (nanti bisa upgrade upload)
  });

  // State untuk Kategori (Dropdown)
  const [categories, setCategories] = useState([]);

  // State untuk Varian (Array Dinamis)
  // Default minimal ada 1 baris varian (misal Pcs)
  const [variants, setVariants] = useState([
    { name: '', price: '', barcode: '' }
  ]);

  const [loading, setLoading] = useState(false);

  // 1. Ambil Data Kategori saat halaman dibuka
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Gagal ambil kategori", error);
      }
    };
    fetchCategories();
  }, []);

  // 2. Handle Perubahan Input Produk Induk
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Perubahan Input Varian (Agak Tricky karena Array)
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  // 4. Tambah Baris Varian Baru
  const addVariant = () => {
    setVariants([...variants, { name: '', price: '', barcode: '' }]);
  };

  // 5. Hapus Baris Varian
  const removeVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  // 6. SUBMIT KE BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Susun Payload sesuai maunya Backend
      const payload = {
        ...formData,
        id_kategori: parseInt(formData.id_kategori), // Pastikan Int
        varian: variants // Kirim array varian
      };

      await api.post('/admin/products', payload);
      
      alert('Produk berhasil ditambahkan!');
      navigate('/admin/products'); // Balik ke tabel

    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan produk. Cek console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tambah Produk Baru</h2>

      <form onSubmit={handleSubmit}>
        
        {/* --- BAGIAN 1: INFO PRODUK --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Produk</label>
            <input 
              type="text" 
              name="nama_produk" 
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
              required
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select 
              name="id_kategori" 
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
              required
              onChange={handleChange}
              defaultValue=""
            >
              <option value="" disabled>Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nama_kategori}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <textarea 
              name="deskripsi" 
              rows="3"
              className="w-full border border-gray-300 rounded-lg p-2.5"
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">URL Gambar (Link Foto)</label>
            <input 
              type="text" 
              name="url_gambar" 
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-lg p-2.5"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* --- BAGIAN 2: VARIAN HARGA (DINAMIS) --- */}
        <div className="mb-6 border-t pt-4">
          <label className="block text-lg font-medium text-gray-800 mb-4">Varian & Harga</label>
          
          {variants.map((variant, index) => (
            <div key={index} className="flex gap-4 mb-3 items-end">
              <div className="flex-1">
                <label className="text-xs text-gray-500">Satuan (Pcs/Dus)</label>
                <input 
                  type="text" 
                  placeholder="Cth: Pcs"
                  className="w-full border p-2 rounded"
                  value={variant.name}
                  onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500">Harga (Rp)</label>
                <input 
                  type="number" 
                  placeholder="3000"
                  className="w-full border p-2 rounded"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500">Barcode (Opsional)</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded"
                  value={variant.barcode}
                  onChange={(e) => handleVariantChange(index, 'barcode', e.target.value)}
                />
              </div>
              
              {/* Tombol Hapus Baris */}
              {variants.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeVariant(index)}
                  className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button 
            type="button" 
            onClick={addVariant}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            + Tambah Varian Lain
          </button>
        </div>

        {/* TOMBOL ACTION */}
        <div className="flex justify-end gap-3 border-t pt-6">
          <Link to="/admin/products" className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
            Batal
          </Link>
          <button 
            type="submit" 
            disabled={loading}
            className="px-5 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProductAdd;