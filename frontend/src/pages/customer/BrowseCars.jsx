import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const getCarImage = (companyName, variantName, imageUrl) => {
  if (imageUrl && imageUrl.trim() !== '') return imageUrl;
  const variant = (variantName || '').toLowerCase();
  const company = (companyName || '').toLowerCase();
  if (variant.includes('innova crysta')) return '/cars/innova';
  if (variant.includes('innova'))        return '/cars/innova';
  if (variant.includes('camry'))         return '/cars/camry';
  if (variant.includes('fortuner'))      return '/cars/fortuner';
  if (variant.includes('city'))          return '/cars/city';
  if (variant.includes('civic'))         return '/cars/civic';
  if (variant.includes('x5'))            return '/cars/bmwx5';
  if (variant.includes('3 series'))      return '/cars/bmw3';
  if (company.includes('bmw'))           return '/cars/bmw3';
  if (variant.includes('scorpio'))       return '/cars/scorpio';
  if (variant.includes('thar'))          return '/cars/thar';
  if (variant.includes('xuv500'))        return '/cars/xuv500';
  if (variant.includes('swift'))         return '/cars/swift';
  if (variant.includes('ertiga'))        return '/cars/ertiga';
  if (variant.includes('baleno'))        return '/cars/baleno';
  if (variant.includes('mustang'))       return '/cars/mustang';
  if (variant.includes('nexon'))         return '/cars/nexon';
  if (variant.includes('911'))           return '/cars/porsche911';
  if (company.includes('porsche'))       return '/cars/porsche911';
  if (variant.includes('rs7'))           return '/cars/audirs7';
  if (company.includes('audi'))          return '/cars/audirs7';
  if (company.includes('toyota'))        return '/cars/innova';
  if (company.includes('honda'))         return '/cars/city';
  if (company.includes('mahindra'))      return '/cars/scorpio';
  if (company.includes('maruti') || company.includes('suzuki')) return '/cars/swift';
  if (company.includes('ford'))          return '/cars/mustang';
  if (company.includes('tata'))          return '/cars/nexon';
  return null;
};

const CarImage = ({ basePath, alt }) => {
  const [src, setSrc] = useState(basePath ? basePath + '.jpeg' : null);
  const [failed, setFailed] = useState(false);
  if (!basePath || failed) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>
        🚗
      </div>
    );
  }
  return (
    <img
      src={src} alt={alt}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      onError={() => {
        if (src.endsWith('.jpeg')) setSrc(basePath + '.jpg');
        else setFailed(true);
      }}
    />
  );
};

// Unavailable Car Popup Modal
const UnavailableModal = ({ car, onClose }) => {
  if (!car) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000, padding: '20px'
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '32px',
        maxWidth: '400px', width: '100%', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'popIn 0.2s ease'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>😔</div>
        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px' }}>
          Car Not Available
        </h3>
        <p style={{ color: '#64748b', fontSize: '15px', margin: '0 0 6px' }}>
          <strong>{car.companyName} {car.variantName}</strong>
        </p>
        <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 20px' }}>
          This car is currently <span style={{ color: '#ef4444', fontWeight: '600' }}>
            {car.status === 'BOOKED' ? 'already booked' : 'under maintenance'}
          </span> and not available for booking right now.
        </p>
        <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '10px', padding: '12px', marginBottom: '20px' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#92400e' }}>
            💡 Please check back later or choose a different car from our fleet.
          </p>
        </div>
        <button onClick={onClose} style={{
          background: '#2563eb', color: 'white', border: 'none',
          padding: '12px 32px', borderRadius: '10px', fontSize: '15px',
          fontWeight: '600', cursor: 'pointer', width: '100%'
        }}>
          Browse Other Cars
        </button>
      </div>
      <style>{`@keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
};

export default function BrowseCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [unavailableCar, setUnavailableCar] = useState(null);

  useEffect(() => {
    carsAPI.getAvailable()
      .then(r => setCars(r.data))
      .catch(() => toast.error('Failed to load cars'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = cars.filter(c =>
    `${c.companyName} ${c.variantName} ${c.registrationNo}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <UnavailableModal car={unavailableCar} onClose={() => setUnavailableCar(null)} />

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' }}>Browse Cars</h2>
        <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 16px' }}>{filtered.length} cars available</p>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or registration..."
          style={{ width: '100%', maxWidth: '400px', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #dbeafe', borderTopColor: '#2563eb', borderRadius: '50%' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚗</div>
          <p style={{ color: '#64748b' }}>No cars found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filtered.map(car => {
            const imgBase = getCarImage(car.companyName, car.variantName, car.imageUrl);
            const isAvailable = car.status === 'AVAILABLE';
            return (
              <div key={car.carId} style={{
                background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb',
                overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                opacity: isAvailable ? 1 : 0.85
              }}>
                <div style={{ position: 'relative', height: '180px', background: '#f1f5f9', overflow: 'hidden' }}>
                  <CarImage basePath={imgBase} alt={`${car.companyName} ${car.variantName}`} />
                  {/* Greyed overlay for unavailable cars */}
                  {!isAvailable && (
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      background: 'rgba(0,0,0,0.35)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center'
                    }}>
                      <span style={{ background: '#ef4444', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
                        🚫 Unavailable
                      </span>
                    </div>
                  )}
                  <div style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: isAvailable ? '#dcfce7' : '#fee2e2',
                    color: isAvailable ? '#15803d' : '#b91c1c',
                    padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600'
                  }}>
                    {isAvailable ? '✓ Available' : car.status}
                  </div>
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0' }}>{car.companyName} {car.variantName}</h3>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: '#2563eb' }}>₹{car.pricePerDay?.toLocaleString()}</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>/day</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 10px', fontFamily: 'monospace' }}>{car.registrationNo}</p>
                  {car.locationName && <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px' }}>📍 {car.locationName}</p>}

                  {isAvailable ? (
                    <Link to={`/customer/book/${car.carId}`} style={{
                      display: 'block', textAlign: 'center', background: '#2563eb',
                      color: 'white', padding: '10px', borderRadius: '10px',
                      fontSize: '14px', fontWeight: '600', textDecoration: 'none'
                    }}>
                      🚗 Book Now
                    </Link>
                  ) : (
                    <button onClick={() => setUnavailableCar(car)} style={{
                      display: 'block', width: '100%', textAlign: 'center',
                      background: '#f1f5f9', color: '#94a3b8', padding: '10px',
                      borderRadius: '10px', fontSize: '14px', fontWeight: '600',
                      border: '1px solid #e5e7eb', cursor: 'pointer'
                    }}>
                      ⓘ Check Availability
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
