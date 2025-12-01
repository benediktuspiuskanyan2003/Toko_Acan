import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <>
      <Navbar /> {/* HANYA DI SINI NAVBAR PUBLIK DIRENDER */}
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;