import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import Menu from './Pages/Menu';
import Bronirovanie from './Pages/Bronirovanie';
import Novosti from './Pages/Novosti';
import AboutUs from './Pages/AboutUs';
import Contacts from './Pages/Contacts';
import './styles/global.css';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/booking" element={<Bronirovanie />} />
        <Route path="/novosti" element={<Novosti />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

