import React, { useState } from 'react';
// import './Akun.css'; 
import './LoginPage.css'; 

function Register() {
  // State untuk menyimpan nilai input
  const [namaLengkap, setNamaLengkap] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  // State BARU untuk konfirmasi kata sandi
  const [confirmPassword, setConfirmPassword] = useState(''); 
  
  // State untuk pesan kesalahan
  const [error, setError] = useState('');

  // Fungsi helper untuk validasi dasar Nomor HP
  const isValidPhoneNumber = (value) => {
    // Regex: minimal 8 digit, hanya angka, dan bisa dimulai dengan '+'
    return /^\+?\d{8,}$/.test(value);
  };

  // Fungsi yang dipanggil saat form disubmit
  const handleSubmit = (e) => {
    e.preventDefault(); 
    setError('');

    // 1. Validasi Kosong (termasuk confirmPassword)
    if (!namaLengkap || !phoneNumber || !password || !confirmPassword) {
      setError('Semua kolom harus diisi.');
      return;
    }

    // 2. Validasi Nomor HP
    if (!isValidPhoneNumber(phoneNumber)) {
        setError('Masukkan Nomor HP yang valid (minimal 8 digit).');
        return;
    }
    
    // 3. Validasi Panjang Kata Sandi
    if (password.length < 6) {
        setError('Kata sandi minimal harus 6 karakter.');
        return;
    }
    
    // 4. VALIDASI KATA SANDI SAMA ATAU TIDAK (BARU)
    if (password !== confirmPassword) {
        setError('Konfirmasi Kata Sandi tidak cocok dengan Kata Sandi yang dimasukkan.');
        return;
    }

    // Jika semua validasi lolos
    
    console.log('Mencoba mendaftar dengan:', { namaLengkap, phoneNumber, password });
    
    // Contoh sukses (Hanya simulasi)
    alert(`Pendaftaran ${namaLengkap} berhasil! Silakan masuk.`);
    // Redirect ke halaman Login setelah berhasil
    // window.location.href = '/login'; 
  };

  return (
    <div className='login-container'> 
      <div className='login-box'>
        <h2>Buat Akun Baru</h2>
        <img src="https://img.freepik.com/vektor-gratis/logo-vektor-gradien-warna-warni-burung_343694-1365.jpg?semt=ais_hybrid&w=740&q=80" alt="Logo Toko" className='login-logo'/>
        
        <p>Isi data diri Anda untuk mendaftar.</p>

        {error && <div className='error-message'>{error}</div>}

        <form onSubmit={handleSubmit}>
          
          {/* Input Nama Lengkap (Tetap) */}
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
            />
          </div>

          {/* Input Nomor HP (Tetap) */}
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
            />
          </div>

          {/* Input Kata Sandi (Tetap) */}
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
            />
          </div>
          
          {/* Input KONFIRMASI KATA SANDI (BARU) */}
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
            />
          </div>

          <button type='submit' className='btn-login'>
            Daftar Sekarang
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