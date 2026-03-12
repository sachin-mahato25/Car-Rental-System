import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Car, BookOpen, Users, MapPin,
  Building2, LogOut, Menu, X, ChevronRight
} from 'lucide-react';

const adminNav = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/cars',      icon: Car,             label: 'Cars' },
  { to: '/admin/bookings',  icon: BookOpen,        label: 'Bookings' },
  { to: '/admin/customers', icon: Users,           label: 'Customers' },
];

const customerNav = [
  { to: '/customer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/customer/cars',      icon: Car,             label: 'Browse Cars' },
  { to: '/customer/bookings',  icon: BookOpen,        label: 'My Bookings' },
];

export default function DashboardLayout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const nav = isAdmin ? adminNav : customerNav;

  const handleLogout = () => { logout(); navigate('/login'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
          <Car size={20} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-slate-900 text-sm leading-none">CarRental</p>
          <p className="text-xs text-slate-400 mt-0.5">{isAdmin ? 'Admin Panel' : 'Customer'}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <Icon size={18} />
            <span>{label}</span>
            <ChevronRight size={14} className="ml-auto opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-700 font-semibold text-sm">
              {user?.fullName?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.fullName}</p>
            <p className="text-xs text-slate-400 truncate">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600
                     hover:bg-red-50 transition-colors text-sm font-medium">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden"
             onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar – desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 shadow-sm flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Sidebar – mobile drawer */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl
                         transform transition-transform duration-300 lg:hidden
                         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 px-4 lg:px-8 py-4 flex items-center gap-4 shadow-sm">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Menu size={20} className="text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-slate-900">
              {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
            <span>Welcome,</span>
            <span className="font-semibold text-slate-800">{user?.fullName}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
