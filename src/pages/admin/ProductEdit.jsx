// src/pages/admin/ProductEdit.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // State Data Utama
  const [formData, setFormData] = useState({
    nama_produk: '',
    deskripsi: '',
    id_kategori: '',
    url_gambar: '',
    aktif: true 
  });

  const [categories, setCategories] = useState([]);

  // State Varian (Array of Objects) yang Dinamis
  const [variants, setVariants] = useState([
    // Format Default:
    // { satuan: 'Pcs', harga: 0, barcode: '', grosir: [] }
  ]);

  // --- 1. FETCH DATA SAAT LOAD ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil Kategori
        const catRes = await api.get('/categories');
        if (catRes.data.success) setCategories(catRes.data.data);

        // Ambil Detail Produk
        const prodRes = await api.get(`/products/${id}`);
        if (prodRes.data.success) {
          const p = prodRes.data.data;
          
          // Isi Form Utama
          setFormData({
            nama_produk: p.nama_produk,
            deskripsi: p.deskripsi || '',
            id_kategori: p.kategori?.id || '', // Pastikan ID kategori terambil
            url_gambar: p.url_gambar || '',
            aktif: p.aktif
          });

          // PENTING: Map Varian DB ke State Form Frontend
          const mappedVariants = p.daftar_varian.map(v => ({
            satuan: v.nama_satuan,
            harga: v.harga,
            barcode: v.barcode || '',
            // Map Grosir juga
            grosir: v.daftar_grosir.map(g => ({
              min_qty: g.min_qty,
              harga_potongan: g.harga_potongan
            }))
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

  // --- 2. HANDLERS UTAMA ---
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // --- 3. HANDLERS VARIAN DINAMIS ---
  
  // Tambah Varian Baru
  const addVariant = () => {
    setVariants([...variants, { satuan: '', harga: 0, barcode: '', grosir: [] }]);
  };

  // Hapus Varian
  const removeVariant = (index) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  // Ubah Data Varian (Satuan, Harga, Barcode)
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  // --- 4. HANDLERS GROSIR DINAMIS ---

  // Tambah Aturan Grosir ke Varian Tertentu
  const addGrosir = (variantIndex) => {
    const newVariants = [...variants];
    newVariants[variantIndex].grosir.push({ min_qty: 0, harga_potongan: 0 });
    setVariants(newVariants);
  };

  // Hapus Aturan Grosir
  const removeGrosir = (variantIndex, grosirIndex) => {
    const newVariants = [...variants];
    newVariants[variantIndex].grosir.splice(grosirIndex, 1);
    setVariants(newVariants);
  };

  // Ubah Data Grosir
  const handleGrosirChange = (variantIndex, grosirIndex, field, value) => {
    const newVariants = [...variants];
    newVariants[variantIndex].grosir[grosirIndex][field] = value;
    setVariants(newVariants);
  };

  // --- 5. SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Kita kirim payload yang strukturnya SAMA dengan "Tambah Produk"
      const payload = {
        ...formData,
        kategori_id: formData.id_kategori, // Sesuaikan nama field backend
        variants: variants // Kirim array varian lengkap
      };

      // Hit API Update (PUT)
      // Pastikan route backend: router.put('/admin/products/:id', ...)
      await api.put(`/admin/products/${id}`, payload);

      alert('Produk berhasil diperbarui!');
      navigate('/admin/products');

    } catch (error) {
      console.error(error);
      alert('Gagal update produk.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Memuat Data Produk...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Produk</h2>

      <form onSubmit={handleSubmit}>
        {/* === INFO UTAMA === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Produk</label>
            <input 
              type="text" name="nama_produk" value={formData.nama_produk} onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500" required 
            />
          </div>
          
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select 
              name="id_kategori" value={formData.id_kategori} onChange={handleChange}
              className="w-full border p-2 rounded" required
            >
               <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nama_kategori}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <textarea 
              name="deskripsi" value={formData.deskripsi} onChange={handleChange}
              className="w-full border p-2 rounded" rows="3"
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">URL Gambar</label>
            <input 
              type="text" name="url_gambar" value={formData.url_gambar} onChange={handleChange}
              className="w-full border p-2 rounded" placeholder="https://..."
            />
          </div>
          
          <div className="flex items-center gap-2">
             <input 
              type="checkbox" name="aktif" checked={formData.aktif} onChange={handleChange}
              className="h-5 w-5" id="checkActive"
            />
            <label htmlFor="checkActive" className="text-sm font-medium text-gray-700">Status Aktif</label>
          </div>
        </div>

        <hr className="my-6 border-gray-200"/>

        {/* === VARIAN & HARGA (DINAMIS) === */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Varian & Harga</h3>
          
          {variants.map((variant, vIndex) => (
            <div key={vIndex} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 relative">
              {/* Tombol Hapus Varian (Muncul jika lebih dari 1 varian) */}
              {variants.length > 1 && (
                <button 
                    type="button" 
                    onClick={() => removeVariant(vIndex)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-bold"
                >
                    ✕ Hapus Varian
                </button>
              )}

              {/* Input Varian Utama */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Satuan</label>
                    <input 
                        type="text" placeholder="Contoh: Pcs, Dus"
                        value={variant.satuan}
                        onChange={(e) => handleVariantChange(vIndex, 'satuan', e.target.value)}
                        className="w-full border p-2 rounded bg-white" required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Harga Normal</label>
                    <input 
                        type="number" placeholder="0"
                        value={variant.harga}
                        onChange={(e) => handleVariantChange(vIndex, 'harga', e.target.value)}
                        className="w-full border p-2 rounded bg-white" required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Barcode (Opsional)</label>
                    <input 
                        type="text" placeholder="Scan Barcode..."
                        value={variant.barcode}
                        onChange={(e) => handleVariantChange(vIndex, 'barcode', e.target.value)}
                        className="w-full border p-2 rounded bg-white"
                    />
                </div>
              </div>

              {/* Sub-Section: Harga Grosir */}
              <div className="pl-4 border-l-2 border-blue-200">
                <p className="text-sm font-semibold text-gray-600 mb-2">Aturan Harga Grosir (Opsional)</p>
                
                {variant.grosir.map((g, gIndex) => (
                    <div key={gIndex} className="flex gap-2 mb-2 items-center">
                        <span className="text-sm">Beli Min.</span>
                        <input 
                            type="number" className="w-20 border p-1 rounded text-center"
                            value={g.min_qty}
                            onChange={(e) => handleGrosirChange(vIndex, gIndex, 'min_qty', e.target.value)}
                        />
                        <span className="text-sm">Harga jadi Rp</span>
                        <input 
                            type="number" className="w-32 border p-1 rounded"
                            value={g.harga_potongan}
                            onChange={(e) => handleGrosirChange(vIndex, gIndex, 'harga_potongan', e.target.value)}
                        />
                        <button type="button" onClick={() => removeGrosir(vIndex, gIndex)} className="text-red-500 font-bold ml-2">×</button>
                    </div>
                ))}

                <button 
                    type="button" 
                    onClick={() => addGrosir(vIndex)}
                    className="text-sm text-blue-600 hover:underline mt-1"
                >
                    + Tambah Harga Grosir
                </button>
              </div>

            </div>
          ))}

          <button 
            type="button" 
            onClick={addVariant}
            className="text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1"
          >
            <span className="text-xl">+</span> Tambah Varian Lain
          </button>
        </div>

        {/* === TOMBOL ACTION === */}
        <div className="flex justify-end gap-3 pt-6 border-t mt-8">
          <Link to="/admin/products" className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
            Batal
          </Link>
          <button 
            type="submit" 
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow-lg"
          >
            Simpan Perubahan
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProductEdit;