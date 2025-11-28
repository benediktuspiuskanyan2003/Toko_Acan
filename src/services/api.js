// src/services/api.js
import axios from 'axios';

// Ganti URL ini kalau nanti sudah deploy ke Railway
const BASE_URL = 'https://localorder-backend-production.up.railway.app/api'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR (Satpam Otomatis)
// Setiap kali frontend nembak API, otomatis selipkan Token JWT dari LocalStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;