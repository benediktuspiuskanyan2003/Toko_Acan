// src/pages/admin/ProductEdit.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nama_produk: '',
    deskripsi: '',
    id_kategori: '',
    url_gambar: '',
    aktif: true 
  });

  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA SAAT LOAD
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Ambil Kategori
        const catRes = await api.get('/categories');
        if (catRes.data.success) setCategories(catRes.data.data);

        // 2. Ambil Detail Produk
        const prodRes = await api.get(`/products/${id}`);
        if (prodRes.data.success) {
          const p = prodRes.data.data;
          setFormData({
            nama_produk: p.nama_produk,
            deskripsi: p.deskripsi || '',
            id_kategori: p.id_kategori,
            url_gambar: p.url_gambar || '',
            aktif: p.aktif
          });
          
          // Map varian dari DB ke format state form
          const mappedVariants = p.daftar_varian.map(v => ({
            id: v.id, // Penting buat update
            name: v.nama_satuan,
            price: v.harga,
            barcode: v.barcode || ''
          }));
          setVariants(mappedVariants);
        }
      } catch (error) {
        console.error("Error fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle Perubahan Input Utama
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // Handle Perubahan Varian (Hanya di Frontend State)
  // Nanti Backend butuh endpoint khusus buat update batch varian, 
  // atau kita update satu-satu.
  // Untuk MVP ini: Kita update Info Produk dulu. Varian agak advanced.
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Update Info Produk Utama
      await api.put(`/admin/products/${id}`, {
        ...formData,
        id_kategori: parseInt(formData.id_kategori)
      });

      // 2. Update Harga Varian (Looping Request)
      // Ini cara "brute force" tapi mudah. Idealnya backend terima array.
      for (const v of variants) {
        await api.put(`/admin/variants/price`, {
          id: v.id,
          price: v.price,
          barcode: v.barcode
        });
      }

      alert('Produk berhasil diperbarui!');
      navigate('/admin/products');

    } catch (error) {
      console.error(error);
      alert('Gagal update produk.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Produk</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Produk</label>
            <input 
              type="text" name="nama_produk" value={formData.nama_produk} onChange={handleChange}
              className="w-full border p-2 rounded" required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select 
              name="id_kategori" value={formData.id_kategori} onChange={handleChange}
              className="w-full border p-2 rounded" required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nama_kategori}</option>
              ))}
            </select>
          </div>

          {/* Status Switch */}
          <div className="flex items-center gap-3">
            <label className="block text-sm font-medium text-gray-700">Status Aktif:</label>
            <input 
              type="checkbox" name="aktif" checked={formData.aktif} onChange={handleChange}
              className="h-5 w-5 text-blue-600"
            />
          </div>
        </div>

        {/* VARIAN EDIT (Simple Version) */}
        <div className="mb-6 border-t pt-4">
          <label className="block text-lg font-medium text-gray-800 mb-4">Edit Harga Varian</label>
          {variants.map((v, index) => (
            <div key={v.id} className="flex gap-4 mb-3 items-center">
              <span className="w-20 font-bold">{v.name}</span>
              <input 
                type="number" value={v.price} 
                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                className="border p-2 rounded w-32"
              />
              <input 
                type="text" value={v.barcode} placeholder="Barcode"
                onChange={(e) => handleVariantChange(index, 'barcode', e.target.value)}
                className="border p-2 rounded flex-1"
              />
            </div>
          ))}
          <p className="text-xs text-gray-500 mt-2">*Untuk menambah varian baru, silakan gunakan fitur Tambah Produk atau request fitur tambahan.</p>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Link to="/admin/products" className="px-5 py-2 bg-gray-200 rounded">Batal</Link>
          <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded">Simpan Perubahan</button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;