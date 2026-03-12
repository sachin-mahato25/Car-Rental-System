import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const STATUS_STYLE = {
  CONFIRMED: { background: '#dbeafe', color: '#1d4ed8' },
  PENDING:   { background: '#fef9c3', color: '#854d0e' },
  COMPLETED: { background: '#dcfce7', color: '#15803d' },
  CANCELLED: { background: '#fee2e2', color: '#b91c1c' }
};

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingsAPI.getMy()
      .then(r => setBookings(r.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const confirmed  = bookings.filter(b => b.status === 'CONFIRMED').length;
  const completed  = bookings.filter(b => b.status === 'COMPLETED').length;
  const totalSpent = bookings.filter(b => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const stats = [
    { emoji: '📋', label: 'Total Bookings', value: bookings.length,  bg: '#eff6ff', color: '#1d4ed8' },
    { emoji: '✅', label: 'Active',          value: confirmed,         bg: '#f0fdf4', color: '#15803d' },
    { emoji: '🕐', label: 'Completed',       value: completed,         bg: '#faf5ff', color: '#7c3aed' },
    { emoji: '💰', label: 'Total Spent',     value: `₹${totalSpent.toLocaleString()}`, bg: '#fff7ed', color: '#c2410c' },
  ];

  return (
    <div>
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
        borderRadius: '16px', padding: '28px', marginBottom: '24px'
      }}>
        <p style={{ color: '#bfdbfe', fontSize: '13px', margin: '0 0 4px' }}>Welcome back,</p>
        <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '700', margin: '0 0 8px' }}>{user?.fullName} 👋</h2>
        {user?.phone && <p style={{ color: '#bfdbfe', fontSize: '13px', margin: '0 0 4px' }}>📞 {user.phone}</p>}
        <p style={{ color: '#bfdbfe', fontSize: '13px', margin: '0 0 16px' }}>Manage your car rentals and bookings here.</p>
        <Link to="/customer/cars" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'white', color: '#1d4ed8', padding: '10px 20px',
          borderRadius: '12px', fontWeight: '600', fontSize: '14px', textDecoration: 'none'
        }}>
          🚗 Browse Available Cars
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '20px', textAlign: 'center' }}>
            <div style={{ width: '44px', height: '44px', background: s.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', margin: '0 auto 12px' }}>
              {s.emoji}
            </div>
            <p style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', margin: '0' }}>{s.value}</p>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '600', color: '#0f172a', margin: '0' }}>Recent Bookings</h3>
          <Link to="/customer/bookings" style={{ fontSize: '13px', color: '#2563eb', fontWeight: '500', textDecoration: 'none' }}>View all →</Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div style={{ width: '28px', height: '28px', border: '3px solid #dbeafe', borderTopColor: '#2563eb', borderRadius: '50%' }} />
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🚗</div>
            <p style={{ margin: '0 0 8px' }}>No bookings yet.</p>
            <Link to="/customer/cars" style={{ color: '#2563eb', fontSize: '13px', fontWeight: '500' }}>Book your first car →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {bookings.slice(0, 4).map(b => (
              <div key={b.bookingId} style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🚗</div>
                    <div>
                      <p style={{ fontWeight: '600', color: '#0f172a', margin: '0', fontSize: '14px' }}>{b.companyName} {b.variantName}</p>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0' }}>{b.pickupDate} → {b.returnDate}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '700', color: '#0f172a', margin: '0' }}>₹{b.totalPrice?.toLocaleString()}</p>
                    <span style={{
                      ...(STATUS_STYLE[b.status] || { background: '#f1f5f9', color: '#475569' }),
                      padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600'
                    }}>{b.status}</span>
                  </div>
                </div>

                {/* Extra details */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#64748b', marginTop: '8px', padding: '10px', background: '#f1f5f9', borderRadius: '8px' }}>
                  <span>🕐 Pickup: {b.pickupTime || '09:00 AM'}</span>
                  <span style={{color:'#ea580c'}}>⏰ Return: {b.returnTime || '06:00 PM'}</span>
                  <span>📍 {b.destination || 'Not Specified'}</span>
                  <span>📞 {b.phone || 'N/A'}</span>
                  <span>💳 {b.paymentMethod || 'CASH'}</span>
                  <span>📋 {b.totalDays} day{b.totalDays > 1 ? 's' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
