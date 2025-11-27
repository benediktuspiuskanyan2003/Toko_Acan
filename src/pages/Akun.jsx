import React, { useState } from 'react';
import './Akun.css'; 
// Asumsi Anda telah mendefinisikan Akun.css dari jawaban sebelumnya

function Akun() {
  const [userData] = useState({
    photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUuR6lY1HPFS4Q_R2A5r70ECdchXmR_n1b8g&s', 
    nama: 'Tok Dalang',
    hp: '0812345xxx',
    email: 'tokdalang001@gmail.com.com',
  });

  const [addresses] = useState([
    {
      id: 1,
      namaPenerima: 'Tok Dalang (Utama)',
      detail: 'Jl. Merdeka No. 10, RT 01 RW 02, Kel. Sentosa, Kec. Jaya',
      kota: 'Bandung, 40292',
      isDefault: true,
    },
    {
      id: 2,
      namaPenerima: 'Kantor Tok Dalang',
      detail: 'Gedung Biru Lantai 5, Kawasan Industri',
      kota: 'Jakarta Pusat, 10250',
      isDefault: false,
    },
  ]);

  return (
    <div className='akun-container'>
      <h1>Pengaturan Akun</h1>

      <div className='akun-layout'>
        <div className='akun-content'>

          <div className='profile-section'>
            <h2>Informasi Pribadi</h2>
            
            <div className='profile-photo-container'>
              <img 
                src={userData.photoUrl} 
                alt='Foto Profil' 
                className='profile-photo'
              />
              <button className='btn-ubah-foto'>Ubah Foto Profil</button>
            </div>

            <div className='profile-info'>
              <div className='info-row'><span className='info-label'>Nama:</span><span className='info-value'>{userData.nama}</span></div>
              <div className='info-row'><span className='info-label'>Nomor HP:</span><span className='info-value'>{userData.hp}</span></div>
              <div className='info-row'><span className='info-label'>Email:</span><span className='info-value'>{userData.email}</span></div>
            </div>
            
            <button className='btn-edit'>Edit Profile</button>
          </div>

          <div className='address-section'>
            <h2>Alamat Pengiriman</h2>
            <button className='btn-tambah-alamat'>+ Tambah Alamat Baru</button>

            {addresses.map(address => (
              <div key={address.id} className={`address-card ${address.isDefault ? 'default-address' : ''}`}>
                <div className='address-header'>
                  <strong>{address.namaPenerima}</strong> 
                  {address.isDefault && <span className='badge-default'>UTAMA</span>}
                </div>
                <p className='address-detail-text'>{address.detail}</p>
                <p className='address-detail-text'>{address.kota}</p>
                
                <div className='address-actions'>
                  <button className='btn-address-action btn-edit-alamat'>Edit</button>
                  <button className='btn-address-action btn-delete-alamat'>Hapus</button>
                  {!address.isDefault && (
                    <button className='btn-address-action btn-set-default'>Jadikan Utama</button>
                  )}
                </div>
              </div>
            ))}

          </div>

          {/* BLOK 4: Keamanan */}
          <div className='security-section'>
            <h2>Keamanan & Kata Sandi</h2>
            {/* ... Konten Keamanan tetap sama ... */}
            <p>Kelola pengaturan kata sandi dan keamanan akun Anda.</p>
            <ul>
              <li><button className='btn-link'>Ubah Kata Sandi</button></li>
              <li><button className='btn-link'>Verifikasi Dua Langkah (2FA)</button></li>
              <li><button className='btn-link'>Lihat Aktivitas Login</button></li>
            </ul>
          </div>

          <div className='logout-section'>
            <button
             className='btn-logout'
             onClick={()=>{}}
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Akun;