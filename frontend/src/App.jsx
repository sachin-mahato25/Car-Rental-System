import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage      from './pages/auth/LoginPage';
import RegisterPage   from './pages/auth/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCars      from './pages/admin/AdminCars';
import AdminBookings  from './pages/admin/AdminBookings';
import AdminCustomers from './pages/admin/AdminCustomers';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import BrowseCars     from './pages/customer/BrowseCars';
import MyBookings     from './pages/customer/MyBookings';
import BookingPage    from './pages/customer/BookingPage';
import DashboardLayout from './layouts/DashboardLayout';

// ── Route Guards ─────────────────────────────────────────────────────────
const PrivateRoute = ({ children, adminOnly }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/customer/dashboard" replace />;
  return children;
};

function AppRoutes() {
  const { user, isAdmin } = useAuth();
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={!user ? <LoginPage />    : <Navigate to={isAdmin ? '/admin/dashboard' : '/customer/dashboard'} />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/customer/dashboard" />} />

      {/* Admin */}
      <Route path="/admin" element={<PrivateRoute adminOnly><DashboardLayout /></PrivateRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="cars"      element={<AdminCars />} />
        <Route path="bookings"  element={<AdminBookings />} />
        <Route path="customers" element={<AdminCustomers />} />
      </Route>

      {/* Customer */}
      <Route path="/customer" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="cars"      element={<BrowseCars />} />
        <Route path="book/:id" element={<BookingPage />} />
        <Route path="bookings"  element={<MyBookings />} />
      </Route>

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{ duration: 3000,
          style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif' }
        }} />
      </BrowserRouter>
    </AuthProvider>
  );
}
