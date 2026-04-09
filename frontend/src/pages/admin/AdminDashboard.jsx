import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    Promise.all([
      adminAPI.getDashboard(),
      adminAPI.getBookings()
    ])
      .then(([s, b]) => { setStats(s.data); setBookings(b.data.sort((a, b) => b.bookingId - a.bookingId).slice(0, 8)); })
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => { setLoading(false); setTimeout(() => setVisible(true), 50); });
  }, []);

  const statusColor = s => s === 'CONFIRMED' ? '#16a34a' : s === 'CANCELLED' ? '#dc2626' : s === 'COMPLETED' ? '#2563eb' : '#ca8a04';

  const cardLinks = ['/admin/cars', '/admin/customers', '/admin/bookings', '/admin/bookings', '/admin/cars', '/admin/bookings'];

  const cards = stats ? [
    { label: 'Total Cars',      value: stats.totalCars,      sub: `${stats.availableCars} available`,  icon: '🚗', grad: 'linear-gradient(135deg,#2563eb,#1d4ed8)' },
    { label: 'Total Customers', value: stats.totalCustomers, sub: '',                                   icon: '👥', grad: 'linear-gradient(135deg,#7c3aed,#6d28d9)' },
    { label: 'Total Bookings',  value: stats.totalBookings,  sub: `${stats.activeBookings} active`,    icon: '📋', grad: 'linear-gradient(135deg,#16a34a,#15803d)' },
    { label: 'Active Bookings', value: stats.activeBookings, sub: '',                                   icon: '⚡', grad: 'linear-gradient(135deg,#ea580c,#c2410c)' },
    { label: 'Available Cars',  value: stats.availableCars,  sub: '',                                   icon: '✅', grad: 'linear-gradient(135deg,#0891b2,#0e7490)' },
    { label: 'Total Revenue',   value: `₹${(stats.totalRevenue||0).toLocaleString()}`, sub: '',         icon: '💰', grad: 'linear-gradient(135deg,#059669,#047857)' },
  ] : [];

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <p style={{ color: '#64748b' }}>Loading dashboard...</p>
    </div>
  );

  return (
    <>
      <style>{`
        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: default;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          opacity: 0;
          transform: translateY(24px);
        }
        .stat-card.show {
          opacity: 1;
          transform: translateY(0);
        }
        .stat-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.12);
        }
        .stat-card:hover .card-icon {
          transform: scale(1.12) rotate(-4deg);
        }
        .card-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          flex-shrink: 0;
          transition: transform 0.25s ease;
          box-shadow: 0 4px 14px rgba(0,0,0,0.18);
        }
        .table-row { transition: background 0.15s; }
        .table-row:hover { background: #f8fafc; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' }}>Dashboard Overview</h2>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '32px' }}>
        {cards.map((c, i) => (
          <Link key={i} to={cardLinks[i]} style={{ textDecoration: 'none' }}>
          <div
            className={`stat-card ${visible ? 'show' : ''}`}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 6px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.label}</p>
              <p style={{ fontSize: '34px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', lineHeight: 1 }}>{c.value}</p>
              {c.sub && <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{c.sub}</p>}
            </div>
            <div className="card-icon" style={{ background: c.grad }}>
              {c.icon}
            </div>
          </div>
          </Link>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Recent Bookings</h3>
          <Link to="/admin/bookings" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>View all →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['ID', 'CUSTOMER', 'CAR', 'PICKUP', 'RETURN', 'PRICE', 'STATUS'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.6px', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No bookings yet</td></tr>
              ) : bookings.map((b, i) => (
                <tr key={b.bookingId} className="table-row" style={{ borderBottom: i < bookings.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>#{b.bookingId}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#0f172a', fontWeight: '600' }}>{b.customerName}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#374151' }}>{b.companyName} {b.variantName}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#374151' }}>{b.pickupDate}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#374151' }}>{b.returnDate}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#0f172a', fontWeight: '700' }}>₹{(b.totalPrice||0).toLocaleString()}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: statusColor(b.status), letterSpacing: '0.3px', padding: '4px 10px', borderRadius: '20px', background: statusColor(b.status) + '18' }}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
