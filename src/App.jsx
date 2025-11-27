
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Beranda from './pages/Beranda';
import Keranjang from './pages/Keranjang';
import Transaksi from './pages/Transaksi';
import Akun from './pages/Akun';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/keranjang" element={<Keranjang />} />
          <Route path="/transaksi" element={<Transaksi />} />
          <Route path="/akun" element={<Akun />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
