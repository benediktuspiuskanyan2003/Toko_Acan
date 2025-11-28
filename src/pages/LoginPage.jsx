import React, { useState } from 'react';
import api from '../services/api'; // 1. Import API Jembatan kita
import './LoginPage.css';

function Login() {
  
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // 2. Tambah state loading

  
  const isValidPhoneNumber = (value) => {
    // Validasi sederhana: minimal 8 digit angka
    return /^\+?\d{8,}$/.test(value);
  };

  
  const handleSubmit = async (e) => { // 3. Jadikan async
    e.preventDefault(); 

    // --- VALIDASI CLIENT SIDE (Punya temanmu) ---
    if (!phoneNumber || !password) {
      setError('Nomor HP dan Kata Sandi harus diisi.'); 
      return;
    }

    if (password.length < 3) { // Saya kurangi jadi 3 biar admin123 masuk (opsional)
        setError('Kata sandi minimal harus diisi.');
        return;
    }
    
    if (!isValidPhoneNumber(phoneNumber)) {
        setError('Masukkan Nomor HP yang valid.');
        return;
    }
    
    setError('');
    setLoading(true); // Mulai Loading

    try {
      // --- LOGIC BACKEND MULAI DISINI ---
      
      // 4. Tembak API Login (Mapping: phoneNumber -> no_wa)
      const response = await api.post('/auth/login', {
        no_wa: phoneNumber, 
        password: password
      });

      if (response.data.success) {
        // 5. Ambil data dari server
        const { token, user } = response.data;

        // 6. Simpan Token (Wajib!)
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        console.log('Login Berhasil:', user);

        // 7. Redirect Sesuai Role
        if (user.role === 'ADMIN') {
          window.location.href = '/admin'; // Masuk Dashboard Admin
        } else {
          window.location.href = '/';      // Masuk Beranda Toko
        }
      }

    } catch (err) {
      console.error(err);
      // Tampilkan pesan error dari Backend (misal: Password salah)
      setError(err.response?.data?.message || 'Gagal login. Periksa koneksi.');
    } finally {
      setLoading(false); // Selesai Loading
    }
  };

  return (
    <div className='login-container'>
      <div className='login-box'>
        <h2>Selamat Datang!</h2>
        <img src="https://img.freepik.com/vektor-gratis/logo-vektor-gradien-warna-warni-burung_343694-1365.jpg?semt=ais_hybrid&w=740&q=80" alt="Logo Toko" className='login-logo'/>
        
        {/* Tampilkan Error jika ada */}
        {error && <div className='error-message' style={{color: 'red', marginBottom: '10px', textAlign: 'center'}}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Input Nomor HP */}
          <div className='form-group'>
            <label htmlFor='phoneNumber'>Nomor HP</label> 
            <input
              type='text' 
              id='phoneNumber' 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)} 
              placeholder='Masukkan Nomor HP Anda' 
              required
              className='form-input'
              disabled={loading} // Kunci input pas loading
            />
          </div>

          
          <div className='form-group'>
            <label htmlFor='password'>Kata Sandi</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Masukkan kata sandi'
              required
              className='form-input'
              disabled={loading}
            />
          </div>

          <button type='submit' className='btn-login' disabled={loading}>
            {loading ? 'Memuat...' : 'Masuk'}
          </button>
        </form>

        <div className='login-footer'>
          <a href='/forgot-password'>Lupa Kata Sandi?</a>
          <span>Belum punya akun? <a href='/register'>Daftar</a></span>
        </div>
      </div>
    </div>
  );
}

export default Login;