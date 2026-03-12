import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const STATUS_STYLE = {
  CONFIRMED: { background: '#dbeafe', color: '#1d4ed8' },
  PENDING:   { background: '#fef9c3', color: '#854d0e' },
  COMPLETED: { background: '#dcfce7', color: '#15803d' },
  CANCELLED: { background: '#fee2e2', color: '#b91c1c' }
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState({});
  const [collapsedCustomers, setCollapsedCustomers] = useState({});

  const load = () => {
    setLoading(true);
    bookingsAPI.getAll()
      .then(r => setBookings(r.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    try {
      await bookingsAPI.updateStatus(id, status);
      toast.success('Status updated');
      load();
    } catch { toast.error('Update failed'); }
  };

  const toggleRow = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleCustomer = (name) => setCollapsedCustomers(prev => ({ ...prev, [name]: !prev[name] }));

  // Group bookings by customer
  const filtered = bookings.filter(b =>
    `${b.customerName} ${b.companyName} ${b.variantName} ${b.destination || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, b) => {
    const key = b.customerName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' }}>All Bookings</h2>
        <p style={{ color: '#64748b', fontSize: '14px', margin: '0' }}>
          {bookings.length} total bookings across {Object.keys(grouped).length} customers
        </p>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search by customer, car, destination..."
        style={{ width: '100%', maxWidth: '400px', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', outline: 'none', marginBottom: '20px', boxSizing: 'border-box' }} />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div style={{ width: '32px', height: '32px', border: '4px solid #dbeafe', borderTopColor: '#2563eb', borderRadius: '50%' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Object.entries(grouped).map(([customerName, customerBookings]) => {
            const isCollapsed = collapsedCustomers[customerName];
            const confirmed = customerBookings.filter(b => b.status === 'CONFIRMED').length;
            const cancelled = customerBookings.filter(b => b.status === 'CANCELLED').length;
            const totalSpent = customerBookings
              .filter(b => b.status !== 'CANCELLED')
              .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

            return (
              <div key={customerName} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                {/* Customer header */}
                <div
                  onClick={() => toggleCustomer(customerName)}
                  style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: isCollapsed ? 'none' : '1px solid #e5e7eb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👤</div>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a', margin: '0' }}>{customerName}</p>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                        {customerBookings.length} booking{customerBookings.length > 1 ? 's' : ''} &nbsp;•&nbsp;
                        <span style={{ color: '#15803d' }}>{confirmed} confirmed</span> &nbsp;•&nbsp;
                        <span style={{ color: '#b91c1c' }}>{cancelled} cancelled</span> &nbsp;•&nbsp;
                        <span style={{ color: '#2563eb', fontWeight: '600' }}>Rs.{totalSpent.toLocaleString()} spent</span>
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '18px', color: '#94a3b8' }}>{isCollapsed ? '▶' : '▼'}</span>
                </div>

                {/* Bookings table */}
                {!isCollapsed && (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                          {['ID','Car','Pickup','Return','Days','Price','Destination','Status','Actions'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {customerBookings.map(b => (
                          <React.Fragment key={b.bookingId}>
                            <tr
                              onClick={() => toggleRow(b.bookingId)}
                              style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                            >
                              <td style={{ padding: '12px 16px', color: '#94a3b8', fontFamily: 'monospace', fontSize: '12px' }}>#{b.bookingId}</td>
                              <td style={{ padding: '12px 16px', fontWeight: '600', color: '#0f172a' }}>{b.companyName} {b.variantName}</td>
                              <td style={{ padding: '12px 16px', color: '#64748b', whiteSpace: 'nowrap' }}>{b.pickupDate}</td>
                              <td style={{ padding: '12px 16px', color: '#64748b', whiteSpace: 'nowrap' }}>{b.returnDate}</td>
                              <td style={{ padding: '12px 16px', color: '#64748b' }}>{b.totalDays}d</td>
                              <td style={{ padding: '12px 16px', fontWeight: '600', color: '#0f172a' }}>Rs.{b.totalPrice?.toLocaleString()}</td>
                              <td style={{ padding: '12px 16px', color: '#7c3aed', fontWeight: '500' }}>
                                {b.destination ? `📍 ${b.destination}` : <span style={{ color: '#94a3b8' }}>Not Specified</span>}
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <span style={{ ...(STATUS_STYLE[b.status] || {}), padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                                  {b.status}
                                </span>
                              </td>
                              <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                                <select value={b.status === 'CONFIRMED' ? 'CONFIRMED' : 'CANCELLED'}
                                  onChange={e => updateStatus(b.bookingId, e.target.value)}
                                  style={{ fontSize: '12px', border: '1px solid #d1d5db', borderRadius: '8px', padding: '6px 8px', background: 'white', cursor: 'pointer', outline: 'none' }}>
                                  <option value="CONFIRMED">CONFIRMED</option>
                                  <option value="CANCELLED">CANCELLED</option>
                                </select>
                              </td>
                            </tr>
                            {/* Expanded details */}
                            {expanded[b.bookingId] && (
                              <tr style={{ background: '#f8fafc' }}>
                                <td colSpan={9} style={{ padding: '14px 20px' }}>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                                    {[
                                      { label: 'Pickup Time', value: b.pickupTime || '09:00 AM', emoji: '🕐', color: '#0f172a' },
                                      { label: 'Return Time', value: b.returnTime || '06:00 PM', emoji: '⏰', color: '#ea580c' },
                                      { label: 'Destination', value: b.destination || 'Not Specified', emoji: '📍', color: '#7c3aed' },
                                      { label: 'Phone', value: b.phone || 'N/A', emoji: '📞', color: '#0f172a' },
                                      { label: 'Payment', value: b.paymentMethod || 'CASH', emoji: '💳', color: '#0f172a' },
                                      { label: 'Type', value: b.bookingType === 'sameday' ? 'Same Day' : 'Multi-Day', emoji: '📋', color: '#0f172a' },
                                    ].map(item => (
                                      <div key={item.label} style={{ background: 'white', borderRadius: '10px', padding: '10px 12px', border: '1px solid #e5e7eb' }}>
                                        <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 3px', textTransform: 'uppercase' }}>{item.label}</p>
                                        <p style={{ fontSize: '13px', fontWeight: '600', color: item.color, margin: '0' }}>{item.emoji} {item.value}</p>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
