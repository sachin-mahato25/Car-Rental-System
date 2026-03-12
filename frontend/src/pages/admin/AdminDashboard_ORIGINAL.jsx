import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, bookingsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminAPI.getDashboard(),
      adminAPI.getBookings()
    ])
      .then(([s, b]) => { setStats(s.data); setBookings(b.data.slice(0, 8)); })
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = s => s === 'CONFIRMED' ? '#16a34a' : s === 'CANCELLED' ? '#dc2626' : s === 'COMPLETED' ? '#2563eb' : '#ca8a04';

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <p style={{ color: '#64748b' }}>Loading dashboard...</p>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' }}>Dashboard Overview</h2>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', marginBottom: '32px', background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {[
          { label: 'Total Cars',      value: stats?.totalCars,      sub: `${stats?.availableCars} available`,  icon: '🚗', iconBg: '#2563eb' },
          { label: 'Total Customers', value: stats?.totalCustomers, sub: '',                                    icon: '👥', iconBg: '#7c3aed' },
          { label: 'Total Bookings',  value: stats?.totalBookings,  sub: `${stats?.activeBookings} active`,    icon: '📖', iconBg: '#16a34a' },
          { label: 'Active Bookings', value: stats?.activeBookings, sub: '',                                    icon: '✅', iconBg: '#ea580c' },
          { label: 'Available Cars',  value: stats?.availableCars,  sub: '',                                    icon: '📈', iconBg: '#0891b2' },
          { label: 'Total Revenue',   value: `₹${(stats?.totalRevenue||0).toLocaleString()}`, sub: '',         icon: '💲', iconBg: '#16a34a' },
        ].map((c, i) => (
          <div key={i} style={{ padding: '24px 28px', borderRight: i % 3 !== 2 ? '1px solid #e5e7eb' : 'none', borderBottom: i < 3 ? '1px solid #e5e7eb' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 6px', fontWeight: '500' }}>{c.label}</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' }}>{c.value}</p>
              {c.sub && <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{c.sub}</p>}
            </div>
            <div style={{ width: '52px', height: '52px', background: c.iconBg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
              {c.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Recent Bookings</h3>
          <Link to="/admin/bookings" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>View all →</Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['ID', 'CUSTOMER', 'CAR', 'PICKUP', 'RETURN', 'PRICE', 'STATUS'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#94a3b8', letterSpacing: '0.5px', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No bookings yet</td></tr>
              ) : bookings.map((b, i) => (
                <tr key={b.bookingId} style={{ borderBottom: i < bookings.length - 1 ? '1px solid #f1f5f9' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>#{b.bookingId}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#0f172a', fontWeight: '600' }}>{b.customerName}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#374151' }}>{b.companyName} {b.variantName}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#374151' }}>{b.startDate}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#374151' }}>{b.endDate}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#0f172a', fontWeight: '600' }}>₹{(b.totalAmount||0).toLocaleString()}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: statusColor(b.status), letterSpacing: '0.3px' }}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
