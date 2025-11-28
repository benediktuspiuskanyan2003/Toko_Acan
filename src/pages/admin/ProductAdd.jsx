// src/pages/admin/ProductAdd.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

const ProductAdd = () => {
   const navigate = useNavigate();

   // State Produk Induk
   const [formData, setFormData] = useState({
      nama_produk: "",
      deskripsi: "",
      id_kategori: "",
      url_gambar: "",
   });

   const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(false);

   // State Varian (Nested Array: Varian -> Wholesale Rules)
   const [variants, setVariants] = useState([
      { name: "", price: "", barcode: "", wholesale: [] },
   ]);

   // 1. Ambil Kategori
   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const response = await api.get("/categories");
            if (response.data.success) {
               setCategories(response.data.data);
            }
         } catch (error) {
            console.error("Gagal ambil kategori", error);
         }
      };
      fetchCategories();
   }, []);

   // 2. Handle Input Produk Utama
   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   // 3. Handle Input Varian (Nama, Harga, Barcode)
   const handleVariantChange = (index, field, value) => {
      const newVariants = [...variants];
      newVariants[index][field] = value;
      setVariants(newVariants);
   };

   // --- LOGIC BARU: HARGA GROSIR ---

   const addWholesaleRule = (variantIndex) => {
      const newVariants = [...variants];
      newVariants[variantIndex].wholesale.push({ minQty: "", price: "" });
      setVariants(newVariants);
   };

   const removeWholesaleRule = (variantIndex, ruleIndex) => {
      const newVariants = [...variants];
      newVariants[variantIndex].wholesale = newVariants[
         variantIndex
      ].wholesale.filter((_, i) => i !== ruleIndex);
      setVariants(newVariants);
   };

   const handleWholesaleChange = (variantIndex, ruleIndex, field, value) => {
      const newVariants = [...variants];
      newVariants[variantIndex].wholesale[ruleIndex][field] = value;
      setVariants(newVariants);
   };

   // --- MANAJEMEN VARIAN ---

   const addVariant = () => {
      setVariants([
         ...variants,
         { name: "", price: "", barcode: "", wholesale: [] },
      ]);
   };

   const removeVariant = (index) => {
      const newVariants = variants.filter((_, i) => i !== index);
      setVariants(newVariants);
   };

   // 4. SUBMIT DATA
   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
         const payload = {
            ...formData,
            id_kategori: parseInt(formData.id_kategori),

            // Mapping Varian + Grosir ke Format Backend
            varian: variants.map((v) => ({
               name: v.name,
               price: parseInt(v.price),
               barcode: v.barcode,
               // FIX: Filter dulu data sampah
               grosir: v.wholesale
                  .filter((w) => w.minQty && w.price) // Hanya ambil yg isinya lengkap
                  .map((w) => ({
                     min_qty: parseInt(w.minQty),
                     price: parseInt(w.price),
                  })),
            })),
         };

         await api.post("/admin/products", payload);
         alert("Produk berhasil ditambahkan!");
         navigate("/admin/products");
      } catch (error) {
         console.error(error);
         alert("Gagal menyimpan produk.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
         <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Tambah Produk Baru
         </h2>

         <form onSubmit={handleSubmit}>
            {/* BAGIAN 1: INFO UMUM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Nama Produk
                  </label>
                  <input
                     type="text"
                     name="nama_produk"
                     required
                     onChange={handleChange}
                     className="w-full border p-2.5 rounded-lg border-gray-300"
                  />
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Kategori
                  </label>
                  <select
                     name="id_kategori"
                     required
                     onChange={handleChange}
                     defaultValue=""
                     className="w-full border p-2.5 rounded-lg border-gray-300"
                  >
                     <option value="" disabled>
                        Pilih Kategori
                     </option>
                     {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                           {cat.nama_kategori}
                        </option>
                     ))}
                  </select>
               </div>

               <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Deskripsi
                  </label>
                  <textarea
                     name="deskripsi"
                     rows="3"
                     onChange={handleChange}
                     className="w-full border p-2.5 rounded-lg border-gray-300"
                  ></textarea>
               </div>

               <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     URL Gambar
                  </label>
                  <input
                     type="text"
                     name="url_gambar"
                     placeholder="https://..."
                     onChange={handleChange}
                     className="w-full border p-2.5 rounded-lg border-gray-300"
                  />
               </div>
            </div>

            {/* BAGIAN 2: VARIAN & HARGA GROSIR */}
            <div className="mb-6 border-t pt-4">
               <label className="block text-lg font-medium text-gray-800 mb-4">
                  Varian & Harga
               </label>

               {variants.map((variant, index) => (
                  <div
                     key={index}
                     className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                     {/* Baris Input Varian Utama */}
                     <div className="flex gap-4 mb-3 items-end">
                        <div className="flex-1">
                           <label className="text-xs text-gray-500 font-bold">
                              Satuan
                           </label>
                           <input
                              type="text"
                              placeholder="Pcs"
                              required
                              value={variant.name}
                              onChange={(e) =>
                                 handleVariantChange(
                                    index,
                                    "name",
                                    e.target.value
                                 )
                              }
                              className="w-full border p-2 rounded"
                           />
                        </div>
                        <div className="flex-1">
                           <label className="text-xs text-gray-500 font-bold">
                              Harga Normal
                           </label>
                           <input
                              type="number"
                              placeholder="5000"
                              required
                              value={variant.price}
                              onChange={(e) =>
                                 handleVariantChange(
                                    index,
                                    "price",
                                    e.target.value
                                 )
                              }
                              className="w-full border p-2 rounded"
                           />
                        </div>
                        <div className="flex-1">
                           <label className="text-xs text-gray-500 font-bold">
                              Barcode
                           </label>
                           <input
                              type="text"
                              value={variant.barcode}
                              onChange={(e) =>
                                 handleVariantChange(
                                    index,
                                    "barcode",
                                    e.target.value
                                 )
                              }
                              className="w-full border p-2 rounded"
                           />
                        </div>

                        {variants.length > 1 && (
                           <button
                              type="button"
                              onClick={() => removeVariant(index)}
                              className="bg-red-100 text-red-600 p-2 rounded"
                           >
                              ✕
                           </button>
                        )}
                     </div>

                     {/* Sub-Section: Aturan Grosir */}
                     <div className="ml-4 pl-4 border-l-2 border-blue-200">
                        <p className="text-xs text-blue-600 font-bold mb-2">
                           Aturan Harga Grosir (Opsional)
                        </p>

                        {variant.wholesale.map((rule, wIndex) => (
                           <div
                              key={wIndex}
                              className="flex gap-3 mb-2 items-center"
                           >
                              <span className="text-sm text-gray-500">
                                 Beli Min.
                              </span>
                              <input
                                 type="number"
                                 placeholder="3"
                                 value={rule.minQty}
                                 onChange={(e) =>
                                    handleWholesaleChange(
                                       index,
                                       wIndex,
                                       "minQty",
                                       e.target.value
                                    )
                                 }
                                 className="w-20 border p-1 rounded text-sm"
                              />
                              <span className="text-sm text-gray-500">
                                 Harga Jadi Rp
                              </span>
                              <input
                                 type="number"
                                 placeholder="4500"
                                 value={rule.price}
                                 onChange={(e) =>
                                    handleWholesaleChange(
                                       index,
                                       wIndex,
                                       "price",
                                       e.target.value
                                    )
                                 }
                                 className="w-28 border p-1 rounded text-sm"
                              />
                              <button
                                 type="button"
                                 onClick={() =>
                                    removeWholesaleRule(index, wIndex)
                                 }
                                 className="text-red-500 text-xs underline"
                              >
                                 Hapus
                              </button>
                           </div>
                        ))}

                        <button
                           type="button"
                           onClick={() => addWholesaleRule(index)}
                           className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 mt-1"
                        >
                           + Tambah Harga Grosir
                        </button>
                     </div>
                  </div>
               ))}

               <button
                  type="button"
                  onClick={addVariant}
                  className="mt-2 text-sm text-blue-600 font-bold"
               >
                  + Tambah Varian Lain
               </button>
            </div>

            {/* TOMBOL SAVE */}
            <div className="flex justify-end gap-3 border-t pt-6">
               <Link
                  to="/admin/products"
                  className="px-5 py-2.5 bg-gray-100 rounded-lg text-gray-700"
               >
                  Batal
               </Link>
               <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
               >
                  {loading ? "Menyimpan..." : "Simpan Produk"}
               </button>
            </div>
         </form>
      </div>
   );
};

export default ProductAdd;
