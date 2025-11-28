import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import Navigate
import api from '../services/api'; // 2. Import API Jembatan
// import './Akun.css'; 
import './LoginPage.css'; 

function Register() {
  const navigate = useNavigate(); // 3. Hook navigasi

  // State untuk menyimpan nilai input
  const [namaLengkap, setNamaLengkap] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  
  // State tambahan
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State Loading

  // Fungsi helper untuk validasi dasar Nomor HP
  const isValidPhoneNumber = (value) => {
    return /^\+?\d{8,}$/.test(value);
  };

  // Fungsi yang dipanggil saat form disubmit
  const handleSubmit = async (e) => { // 4. Jadikan Async
    e.preventDefault(); 
    setError('');

    // --- VALIDASI CLIENT (Punya Temanmu) ---
    if (!namaLengkap || !phoneNumber || !password || !confirmPassword) {
      setError('Semua kolom harus diisi.');
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
        setError('Masukkan Nomor HP yang valid (minimal 8 digit).');
        return;
    }
    
    if (password.length < 6) { // Sesuaikan dengan backend (kalau backend 6, di sini 6)
        setError('Kata sandi minimal harus 6 karakter.');
        return;
    }
    
    if (password !== confirmPassword) {
        setError('Konfirmasi Kata Sandi tidak cocok dengan Kata Sandi yang dimasukkan.');
        return;
    }

    // --- LOGIC BACKEND MULAI ---
    setLoading(true); // Mulai loading

    try {
      // 5. Tembak API Register
      // Perhatikan mapping nama field: 
      // Kiri (Backend) : Kanan (State Frontend)
      const response = await api.post('/auth/register', {
        nama_lengkap: namaLengkap,
        no_wa: phoneNumber,
        password: password
      });

      if (response.data.success) {
        alert(`Pendaftaran ${namaLengkap} berhasil! Silakan masuk.`);
        navigate('/login'); // 6. Redirect pakai React Router
      }

    } catch (err) {
      console.error(err);
      // Tampilkan error dari backend (misal: No WA sudah terdaftar)
      setError(err.response?.data?.message || 'Gagal mendaftar. Coba lagi.');
    } finally {
      setLoading(false); // Selesai loading
    }
  };

  return (
    <div className='login-container'> 
      <div className='login-box'>
        <h2>Buat Akun Baru</h2>
        <img src="https://img.freepik.com/vektor-gratis/logo-vektor-gradien-warna-warni-burung_343694-1365.jpg?semt=ais_hybrid&w=740&q=80" alt="Logo Toko" className='login-logo'/>
        
        <p>Isi data diri Anda untuk mendaftar.</p>

        {/* Tampilkan Error */}
        {error && <div className='error-message' style={{color: 'red', textAlign:'center', marginBottom:'10px'}}>{error}</div>}

        <form onSubmit={handleSubmit}>
          
          {/* Input Nama Lengkap */}
          <div className='form-group'>
            <label htmlFor='nama'>Nama Lengkap</label>
            <input
              type='text'
              id='nama'
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              placeholder='Masukkan Nama Lengkap Anda'
              required
              className='form-input'
              disabled={loading} // Disable saat loading
            />
          </div>

          {/* Input Nomor HP */}
          <div className='form-group'>
            <label htmlFor='phoneNumber'>Nomor HP</label>
            <input
              type='text'
              id='phoneNumber'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder='Masukkan Nomor HP Anda (contoh: 0812xxxxxx)'
              required
              className='form-input'
              disabled={loading}
            />
          </div>

          {/* Input Kata Sandi */}
          <div className='form-group'>
            <label htmlFor='password'>Buat Kata Sandi</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Minimal 6 karakter'
              required
              className='form-input'
              disabled={loading}
            />
          </div>
          
          {/* Input KONFIRMASI KATA SANDI */}
          <div className='form-group'>
            <label htmlFor='confirmPassword'>Konfirmasi Kata Sandi</label>
            <input
              type='password'
              id='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Ulangi kata sandi'
              required
              className='form-input'
              disabled={loading}
            />
          </div>

          <button type='submit' className='btn-login' disabled={loading}>
            {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className='login-footer'>
          <span>Sudah punya akun? <a href='/login'>Masuk di sini</a></span>
        </div>
      </div>
    </div>
  );
}

export default Register;