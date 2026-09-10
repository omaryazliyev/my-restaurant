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
import ProductDetail from './Pages/ProductDetail';
import Profile from './Pages/Profile';
import Checkout from './Pages/Checkout';
import AdminLayout from './Pages/Admin/AdminLayout';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminCategories from './Pages/Admin/AdminCategories';
import AdminMenu from './Pages/Admin/AdminMenu';
import AdminOrders from './Pages/Admin/AdminOrders';
import AdminReservations from './Pages/Admin/AdminReservations';
import AdminUsers from './Pages/Admin/AdminUsers';
import AdminNews from './Pages/Admin/AdminNews';
import './styles/global.css';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/booking" element={<Bronirovanie />} />
        <Route path="/novosti" element={<Novosti />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/product" element={<ProductDetail />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="news" element={<AdminNews />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}


