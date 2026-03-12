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
  if (variant.includes('amaze'))         return '/cars/amaze';
  if (variant.includes('x5'))            return '/cars/bmwx5';
  if (variant.includes('3 series'))      return '/cars/bmw3';
  if (variant.includes('5 series'))      return '/cars/bmw5';
  if (company.includes('bmw'))           return '/cars/bmw3';
  if (company.includes('mercedes'))      return '/cars/mercedes';
  if (variant.includes('scorpio'))       return '/cars/scorpio';
  if (variant.includes('thar'))          return '/cars/thar';
  if (variant.includes('xuv500'))        return '/cars/xuv500';
  if (variant.includes('xuv700'))        return '/cars/xuv700';
  if (variant.includes('xuv'))           return '/cars/xuv500';
  if (variant.includes('bolero'))        return '/cars/bolero';
  if (variant.includes('swift'))         return '/cars/swift';
  if (variant.includes('ertiga'))        return '/cars/ertiga';
  if (variant.includes('baleno'))        return '/cars/baleno';
  if (variant.includes('brezza'))        return '/cars/brezza';
  if (variant.includes('dzire'))         return '/cars/dzire';
  if (variant.includes('wagonr'))        return '/cars/wagonr';
  if (variant.includes('mustang'))       return '/cars/mustang';
  if (variant.includes('ecosport'))      return '/cars/ecosport';
  if (variant.includes('creta'))         return '/cars/creta';
  if (variant.includes('i20'))           return '/cars/i20';
  if (variant.includes('verna'))         return '/cars/verna';
  if (variant.includes('nexon'))         return '/cars/nexon';
  if (variant.includes('harrier'))       return '/cars/harrier';
  if (variant.includes('safari'))        return '/cars/safari';
  if (variant.includes('seltos'))        return '/cars/seltos';
  if (variant.includes('fortuner'))      return '/cars/fortuner';
  if (variant.includes('911'))           return '/cars/porsche911';
  if (company.includes('porsche'))       return '/cars/porsche911';
  if (variant.includes('rs7'))           return '/cars/audirs7';
  if (company.includes('audi'))          return '/cars/audirs7';
  if (company.includes('toyota'))        return '/cars/innova';
  if (company.includes('honda'))         return '/cars/city';
  if (company.includes('mahindra'))      return '/cars/scorpio';
  if (company.includes('maruti') || company.includes('suzuki')) return '/cars/swift';
  if (company.includes('ford'))          return '/cars/ecosport';
  if (company.includes('hyundai'))       return '/cars/creta';
  if (company.includes('tata'))          return '/cars/nexon';
  if (company.includes('kia'))           return '/cars/seltos';
  return null;
};

// Try .jpeg first, fallback to .jpg
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
      src={src}
      alt={alt}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      onError={() => {
        if (src.endsWith('.jpeg')) {
          setSrc(basePath + '.jpg');
        } else {
          setFailed(true);
        }
      }}
    />
  );
};

export default function BrowseCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
            return (
              <div key={car.carId} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ position: 'relative', height: '180px', background: '#f1f5f9', overflow: 'hidden' }}>
                  <CarImage basePath={imgBase} alt={`${car.companyName} ${car.variantName}`} />
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: car.status === 'AVAILABLE' ? '#dcfce7' : '#fee2e2', color: car.status === 'AVAILABLE' ? '#15803d' : '#b91c1c', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                    {car.status === 'AVAILABLE' ? '✓ Available' : car.status}
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
                  <Link to={`/customer/book/${car.carId}`} style={{ display: 'block', textAlign: 'center', background: car.status === 'AVAILABLE' ? '#2563eb' : '#e5e7eb', color: car.status === 'AVAILABLE' ? 'white' : '#94a3b8', padding: '10px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', textDecoration: 'none', pointerEvents: car.status !== 'AVAILABLE' ? 'none' : 'auto' }}>
                    {car.status === 'AVAILABLE' ? '🚗 Book Now' : 'Not Available'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
