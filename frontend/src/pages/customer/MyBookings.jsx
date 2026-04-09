import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const STATUS_STYLE = {
  CONFIRMED: { background: '#dbeafe', color: '#1d4ed8' },
  PENDING:   { background: '#fef9c3', color: '#854d0e' },
  COMPLETED: { background: '#dcfce7', color: '#15803d' },
  CANCELLED: { background: '#fee2e2', color: '#b91c1c' }
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    bookingsAPI.getMy()
      .then(r => setBookings(r.data.sort((a, b) => b.bookingId - a.bookingId)))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await bookingsAPI.cancel(id);
      toast.success('Booking cancelled');
      load();
    } catch { toast.error('Cancellation failed'); }
  };

  return (
    <div style={{ padding: '0 4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0' }}>My Bookings</h2>
          <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>{bookings.length} total bookings</p>
        </div>
        <Link to="/customer/cars" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: '#2563eb', color: 'white', padding: '10px 16px',
          borderRadius: '10px', fontSize: '14px', fontWeight: '600', textDecoration: 'none'
        }}>
          🚗 Book a Car
        </Link>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #dbeafe', borderTopColor: '#2563eb', borderRadius: '50%' }} />
        </div>
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151' }}>No bookings yet</h3>
          <p style={{ color: '#94a3b8', marginTop: '8px' }}>Browse our fleet and make your first booking.</p>
          <Link to="/customer/cars" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '20px',
            background: '#2563eb', color: 'white', padding: '10px 20px',
            borderRadius: '10px', fontSize: '14px', fontWeight: '600', textDecoration: 'none'
          }}>🚗 Browse Cars</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookings.map(b => (
            <div key={b.bookingId} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🚗</div>
                  <div>
                    <h3 style={{ fontWeight: '700', color: '#0f172a', margin: '0', fontSize: '16px' }}>{b.companyName} {b.variantName}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: '2px 0 0', fontFamily: 'monospace' }}>Booking #{b.bookingId} • {b.registrationNo}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    ...(STATUS_STYLE[b.status] || { background: '#f1f5f9', color: '#475569' }),
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                  }}>{b.status}</span>
                  <span style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>₹{b.totalPrice?.toLocaleString()}</span>
                </div>
              </div>

              {/* Details grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', padding: '16px', background: '#f8fafc', borderRadius: '12px', marginBottom: '12px' }}>
                
                <div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 4px' }}>📅 Dates</p>
                  <p style={{ fontSize: '13px', color: '#374151', fontWeight: '500', margin: '0' }}>{b.pickupDate} → {b.returnDate}</p>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>{b.totalDays} day{b.totalDays > 1 ? 's' : ''}</p>
                </div>

                {b.pickupTime && (
                  <div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 4px' }}>🕐 Pickup Time</p>
                    <p style={{ fontSize: '13px', color: '#374151', fontWeight: '500', margin: '0' }}>{b.pickupTime}</p>
                  </div>
                )}
                {b.returnTime && (
                  <div>
                    <p style={{ fontSize: '11px', color: '#ea580c', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 4px' }}>⏰ Return By</p>
                    <p style={{ fontSize: '13px', color: '#374151', fontWeight: '500', margin: '0' }}>
                      {b.returnTime} <span style={{fontSize:'11px', color:'#ea580c', fontWeight:'600'}}>⚠️ Late = Fine</span>
                    </p>
                  </div>
                )}

                {b.destination && (
                  <div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 4px' }}>🏁 Destination</p>
                    <p style={{ fontSize: '13px', color: '#374151', fontWeight: '500', margin: '0' }}>{b.destination}</p>
                  </div>
                )}

                {b.phone && (
                  <div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 4px' }}>📞 Phone</p>
                    <p style={{ fontSize: '13px', color: '#374151', fontWeight: '500', margin: '0' }}>{b.phone}</p>
                  </div>
                )}

                {b.paymentMethod && (
                  <div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 4px' }}>💳 Payment</p>
                    <p style={{ fontSize: '13px', color: '#374151', fontWeight: '500', margin: '0' }}>{b.paymentMethod}</p>
                  </div>
                )}
              </div>

              {/* Cancel button */}
              {(b.status === 'CONFIRMED' || b.status === 'PENDING') && (
                <button onClick={() => cancel(b.bookingId)} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'none', border: '1px solid #fca5a5', color: '#dc2626',
                  padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
                  fontWeight: '500', cursor: 'pointer'
                }}>
                  ✕ Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
