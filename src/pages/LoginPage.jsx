import React, { useState } from 'react';
// Asumsikan Anda menggunakan file CSS utama, misalnya 'App.css' atau 'Akun.css'
// import './Akun.css'; 
import './LoginPage.css';

function Login() {
  // State untuk menyimpan nilai input dari form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State untuk menyimpan pesan kesalahan (error message)
  const [error, setError] = useState('');

  // Fungsi yang dipanggil saat form disubmit
  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah refresh halaman default

    // Logika Validasi Sederhana
    if (!email || !password) {
      setError('Email dan Kata Sandi harus diisi.');
      return;
    }

    if (password.length < 6) {
        setError('Kata sandi minimal harus 6 karakter.');
        return;
    }
    
    // Reset error jika validasi berhasil
    setError('');

    // --- LOGIKA OTENTIKASI NYATA DI SINI ---
    // Di sini Anda akan memanggil API (Axios/Fetch) untuk mengirim
    // email dan password ke server untuk proses login.
    
    console.log('Mencoba login dengan:', { email, password });
    
    // Contoh sukses (Hanya simulasi)
    alert(`Login berhasil! Selamat datang, ${email}.`);
    // Redirect ke halaman dashboard atau home
    // window.location.href = '/dashboard'; 
  };

  return (
    <div className='login-container'>
      <div className='login-box'>
        <h2>Selamat Datang!</h2>
        <img src="https://img.freepik.com/vektor-gratis/logo-vektor-gradien-warna-warni-burung_343694-1365.jpg?semt=ais_hybrid&w=740&q=80" alt="" className='login-logo'/>
        
        {/* Pesan Kesalahan */}
        {error && <div className='error-message'>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Input Email */}
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Masukkan email Anda'
              required
              className='form-input'
            />
          </div>

          {/* Input Kata Sandi */}
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
            />
          </div>

          <button type='submit' className='btn-login'>
            Masuk
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