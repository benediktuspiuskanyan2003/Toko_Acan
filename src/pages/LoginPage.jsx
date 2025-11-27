import React, { useState } from 'react';

import './LoginPage.css';

function Login() {
  
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');

  
  const isValidPhoneNumber = (value) => {
    
    return /^\+?\d{8,}$/.test(value);
  };

  
  const handleSubmit = (e) => {
    e.preventDefault(); 

    
    if (!phoneNumber || !password) {
      setError('Nomor HP dan Kata Sandi harus diisi.'); 
      return;
    }

    
    if (password.length < 6) {
        setError('Kata sandi minimal harus 6 karakter.');
        return;
    }
    
    
    if (!isValidPhoneNumber(phoneNumber)) {
        setError('Masukkan Nomor HP yang valid.');
        return;
    }
    
    setError('');
    
    const loginType = 'phone';

    console.log('Mencoba login dengan:', { [loginType]: phoneNumber, password });
    
    
    window.location.href = '/dashboard'; 
  };

  return (
    <div className='login-container'>
      <div className='login-box'>
        <h2>Selamat Datang!</h2>
        <img src="https://img.freepik.com/vektor-gratis/logo-vektor-gradien-warna-warni-burung_343694-1365.jpg?semt=ais_hybrid&w=740&q=80" alt="Logo Toko" className='login-logo'/>
        
        {error && <div className='error-message'>{error}</div>}

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