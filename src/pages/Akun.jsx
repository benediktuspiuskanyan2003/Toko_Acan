import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Import API
import './Akun.css'; 

function Akun() {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [userData, setUserData] = useState({
    photoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    nama: 'Memuat...',
    hp: '-',
    email: '-',
    role: 'USER'
  });

  const [addresses, setAddresses] = useState([]); // Data Alamat Real
  const [wilayahList, setWilayahList] = useState([]); // Data Kecamatan untuk Dropdown
  const [showAddForm, setShowAddForm] = useState(false); // Buka/Tutup Form Tambah

  // State Form Tambah Alamat
  const [newAddress, setNewAddress] = useState({
    label_alamat: 'Rumah',
    nama_penerima: '',
    no_hp_penerima: '',
    alamat_lengkap: '',
    id_wilayah: ''
  });

  // --- 1. FETCH DATA SAAT LOAD ---
  useEffect(() => {
    loadUserData();
    fetchAddresses();
    fetchWilayah();
  }, []);

  const loadUserData = () => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData({
          ...userData,
          nama: parsedUser.nama || 'Pengguna',
          hp: parsedUser.no_wa || '-',
          email: parsedUser.email || '-',
          role: parsedUser.role || 'USER'
        });
      } catch (error) { console.error(error); }
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/addresses');
      if (response.data.success) {
        setAddresses(response.data.data);
      }
    } catch (error) {
      console.error("Gagal ambil alamat:", error);
    }
  };

  const fetchWilayah = async () => {
    try {
      const response = await api.get('/wilayah');
      if (response.data.success) {
        setWilayahList(response.data.data);
      }
    } catch (error) {
      console.error("Gagal ambil wilayah:", error);
    }
  };

  // --- 2. ACTION HANDLERS ---
  
  const handleInputChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.id_wilayah) return alert("Pilih Kecamatan dulu!");

    try {
      await api.post('/addresses', newAddress);
      alert("Alamat berhasil ditambahkan!");
      setShowAddForm(false);
      fetchAddresses(); // Refresh list alamat
      // Reset form
      setNewAddress({ label_alamat: 'Rumah', nama_penerima: '', no_hp_penerima: '', alamat_lengkap: '', id_wilayah: '' });
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan alamat.");
    }
  };

  const handleSetPrimary = async (addressId) => {
    try {
      await api.put('/addresses/set-primary', { addressId });
      fetchAddresses(); // Refresh biar urutannya berubah (Utama pindah ke atas)
    } catch (error) {
      alert("Gagal mengubah alamat utama");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Yakin ingin keluar?")) {
      localStorage.clear();
      navigate('/login');
      window.location.reload();
    }
  };

  return (
    <div className='akun-container'>
      <h1>Pengaturan Akun</h1>

      <div className='akun-layout'>
        <div className='akun-content'>

          {/* --- PROFILE SECTION --- */}
          <div className='profile-section'>
            <h2>Informasi Pribadi</h2>
            <div className='profile-photo-container'>
              <img src={userData.photoUrl} alt='Foto Profil' className='profile-photo' />
              <div className="role-badge">{userData.role === 'ADMIN' ? '👑 ADMIN' : '👤 MEMBER'}</div>
            </div>
            <div className='profile-info'>
              <div className='info-row'><span className='info-label'>Nama:</span><span className='info-value'>{userData.nama}</span></div>
              <div className='info-row'><span className='info-label'>WhatsApp:</span><span className='info-value'>{userData.hp}</span></div>
            </div>
          </div>

          {/* --- ALAMAT SECTION --- */}
          <div className='address-section'>
            <div className="section-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h2>Daftar Alamat</h2>
                <button className='btn-tambah-alamat' onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? 'Batal' : '+ Tambah Alamat'}
                </button>
            </div>

            {/* FORM TAMBAH ALAMAT (Muncul jika tombol ditekan) */}
            {showAddForm && (
                <form className="add-address-form" onSubmit={handleSubmitAddress}>
                    <h3>Tambah Alamat Baru</h3>
                    
                    <div className="form-group">
                        <label>Label Alamat</label>
                        <select name="label_alamat" value={newAddress.label_alamat} onChange={handleInputChange}>
                            <option value="Rumah">Rumah</option>
                            <option value="Kantor">Kantor</option>
                            <option value="Toko">Toko</option>
                            <option value="Kost">Kost</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Nama Penerima</label>
                        <input type="text" name="nama_penerima" required value={newAddress.nama_penerima} onChange={handleInputChange} placeholder="Contoh: Budi Santoso" />
                    </div>

                    <div className="form-group">
                        <label>No HP Penerima</label>
                        <input type="text" name="no_hp_penerima" required value={newAddress.no_hp_penerima} onChange={handleInputChange} placeholder="08xxxxxxxx" />
                    </div>

                    <div className="form-group">
                        <label>Kecamatan (Wilayah)</label>
                        <select name="id_wilayah" required value={newAddress.id_wilayah} onChange={handleInputChange}>
                            <option value="">-- Pilih Kecamatan --</option>
                            {wilayahList.map(w => (
                                <option key={w.id} value={w.id}>{w.nama_kecamatan} (Ongkir: {w.biaya_ongkir.toLocaleString()})</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Alamat Lengkap</label>
                        <textarea name="alamat_lengkap" required value={newAddress.alamat_lengkap} onChange={handleInputChange} placeholder="Nama Jalan, No Rumah, RT/RW, Patokan..." rows="3"></textarea>
                    </div>

                    <button type="submit" className="btn-save-address">Simpan Alamat</button>
                </form>
            )}

            {/* LIST ALAMAT */}
            {addresses.length === 0 ? (
                <p style={{color: '#888', fontStyle: 'italic', marginTop: '10px'}}>Belum ada alamat tersimpan.</p>
            ) : (
                addresses.map(address => (
                <div key={address.id} className={`address-card ${address.utama ? 'default-address' : ''}`}>
                    <div className='address-header'>
                        <strong>{address.label_alamat} - {address.nama_penerima}</strong> 
                        {address.utama && <span className='badge-default'>UTAMA</span>}
                    </div>
                    <p className='address-detail-text'>{address.no_hp_penerima}</p>
                    <p className='address-detail-text'>{address.alamat_lengkap}</p>
                    <p className='address-detail-text' style={{fontWeight: 'bold', color: '#007bff'}}>
                        Kec. {address.wilayah?.nama_kecamatan}
                    </p>
                    
                    <div className='address-actions'>
                        {!address.utama && (
                            <button className='btn-address-action btn-set-default' onClick={() => handleSetPrimary(address.id)}>
                                Jadikan Utama
                            </button>
                        )}
                        {/* Tombol Edit/Hapus bisa ditambahkan nanti */}
                    </div>
                </div>
                ))
            )}
          </div>
          
          <div className='logout-section'>
            <button className='btn-logout' onClick={handleLogout}>Keluar / Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Akun;