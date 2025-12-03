import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import api from '../services/api'; 
import './LoginPage.css'; 

// 1. IMPORT ICON
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

function Register() {
  const navigate = useNavigate(); 
  
  // State ini akan mengontrol visibilitas KEDUA password sekaligus
  const [showPassword, setShowPassword] = useState(false); 

  const [namaLengkap, setNamaLengkap] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 

  const isValidPhoneNumber = (value) => {
    return /^\+?\d{8,}$/.test(value);
  };

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setError('');

    if (!namaLengkap || !phoneNumber || !password || !confirmPassword) {
      setError('Semua kolom harus diisi.');
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
        setError('Masukkan Nomor HP yang valid (minimal 8 digit).');
        return;
    }
    
    if (password.length < 6) { 
        setError('Kata sandi minimal harus 6 karakter.');
        return;
    }
    
    if (password !== confirmPassword) {
        setError('Konfirmasi Kata Sandi tidak cocok dengan Kata Sandi yang dimasukkan.');
        return;
    }

    setLoading(true); 

    try {
      const response = await api.post('/auth/register', {
        nama_lengkap: namaLengkap,
        no_wa: phoneNumber,
        password: password
      });

      if (response.data.success) {
        alert(`Pendaftaran ${namaLengkap} berhasil! Silakan masuk.`);
        navigate('/login'); 
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Gagal mendaftar. Coba lagi.');
    } finally {
      setLoading(false); 
    }
  };

  // Style untuk icon mata (biar rapi dan bisa dipakai ulang)
  const iconStyle = {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#666',
    display: 'flex',
    alignItems: 'center'
  };

  return (
    <div className='login-container'> 
      <div className='login-box'>
        <h2>Buat Akun Baru</h2>
        <img src="https://img.freepik.com/vektor-gratis/logo-vektor-gradien-warna-warni-burung_343694-1365.jpg?semt=ais_hybrid&w=740&q=80" alt="Logo Toko" className='login-logo'/>
        
        <p>Isi data diri Anda untuk mendaftar.</p>

        {error && <div className='error-message' style={{color: 'red', textAlign:'center', marginBottom:'10px'}}>{error}</div>}

        <form onSubmit={handleSubmit}>
          
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
              disabled={loading} 
            />
          </div>

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

          {/* --- INPUT KATA SANDI UTAMA --- */}
          <div className='form-group'>
            <label htmlFor='password'>Buat Kata Sandi</label>
            <div style={{ position: 'relative' }}>
                <input
                // 2. Ubah Type sesuai state showPassword
                type={showPassword ? 'text' : 'password'}
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Minimal 6 karakter'
                required
                className='form-input'
                disabled={loading}
                style={{ paddingRight: '40px' }} // Kasih jarak biar gak nabrak icon
                />
                
                {/* 3. Tombol Icon Mata */}
                <span style={iconStyle} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEye size={20}/> : <FaEyeSlash size={20}/> }
                </span>
            </div>
          </div>
          
          {/* --- INPUT KONFIRMASI KATA SANDI --- */}
          <div className='form-group'>
            <label htmlFor='confirmPassword'>Konfirmasi Kata Sandi</label>
            <div style={{ position: 'relative' }}>
                <input
                // 4. Ini juga ikut berubah Type-nya
                type={showPassword ? 'text' : 'password'}
                id='confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='Ulangi kata sandi'
                required
                className='form-input'
                disabled={loading}
                style={{ paddingRight: '40px' }}
                />

                {/* Tombol Icon Mata (Opsional: Bisa dihapus kalau cukup 1 di atas) */}
                <span style={iconStyle} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEye size={20}/> : <FaEyeSlash size={20}/> }
                </span>
            </div>
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