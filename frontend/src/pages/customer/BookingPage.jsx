import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carsAPI, bookingsAPI } from '../../services/api';
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
  if (company.includes('mercedes'))      return '/cars/mercedes';
  if (variant.includes('scorpio'))       return '/cars/scorpio';
  if (variant.includes('thar'))          return '/cars/thar';
  if (variant.includes('xuv500'))        return '/cars/xuv500';
  if (variant.includes('xuv'))           return '/cars/xuv500';
  if (variant.includes('swift'))         return '/cars/swift';
  if (variant.includes('ertiga'))        return '/cars/ertiga';
  if (variant.includes('baleno'))        return '/cars/baleno';
  if (variant.includes('mustang'))       return '/cars/mustang';
  if (variant.includes('ecosport'))      return '/cars/ecosport';
  if (variant.includes('911'))           return '/cars/porsche911';
  if (company.includes('porsche'))       return '/cars/porsche911';
  if (variant.includes('rs7'))           return '/cars/audirs7';
  if (company.includes('audi'))          return '/cars/audirs7';
  if (variant.includes('nexon'))         return '/cars/nexon';
  if (company.includes('toyota'))        return '/cars/innova';
  if (company.includes('honda'))         return '/cars/city';
  if (company.includes('mahindra'))      return '/cars/scorpio';
  if (company.includes('maruti') || company.includes('suzuki')) return '/cars/swift';
  if (company.includes('ford'))          return '/cars/ecosport';
  return null;
};

const CarImage = ({ basePath, alt }) => {
  const [src, setSrc] = React.useState(basePath ? basePath + '.jpeg' : null);
  const [failed, setFailed] = React.useState(false);
  if (!basePath || failed) return <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>🚗</div>;
  return (
    <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
      onError={() => { if (src.endsWith('.jpeg')) { setSrc(basePath + '.jpg'); } else { setFailed(true); } }} />
  );
};

const inputStyle = {
  width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
  borderRadius: '8px', fontSize: '14px', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit', background: 'white'
};
const labelStyle = {
  display: 'block', fontSize: '13px', fontWeight: '500',
  color: '#374151', marginBottom: '6px'
};
const cardStyle = {
  background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb',
  padding: '24px', marginBottom: '20px'
};

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [bookingType, setBookingType] = useState('daily');
  const [form, setForm] = useState({
    pickupDate: '', returnDate: '',
    pickupTimeHour: '09', pickupTimeMinute: '00', pickupTimeAmPm: 'AM',
    returnTimeHour: '06', returnTimeMinute: '00', returnTimeAmPm: 'PM',
    destination: '', paymentMethod: 'CASH', phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    carsAPI.getById(id)
      .then(r => setCar(r.data))
      .catch(() => { toast.error('Car not found'); navigate('/customer/cars'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const pricePerHour = car ? Math.round(car.pricePerDay / 10) : 0;

  const getTotal = () => {
    if (bookingType === 'sameday') {
      let ph = parseInt(form.pickupTimeHour);
      let rh = parseInt(form.returnTimeHour);
      if (form.pickupTimeAmPm === 'PM' && ph !== 12) ph += 12;
      if (form.pickupTimeAmPm === 'AM' && ph === 12) ph = 0;
      if (form.returnTimeAmPm === 'PM' && rh !== 12) rh += 12;
      if (form.returnTimeAmPm === 'AM' && rh === 12) rh = 0;
      const pickMins = ph * 60 + parseInt(form.pickupTimeMinute);
      const retMins = rh * 60 + parseInt(form.returnTimeMinute);
      const diffMins = retMins - pickMins;
      const hours = diffMins > 0 ? Math.ceil(diffMins / 60) : 1;
      return { hours, days: 0, total: hours * pricePerHour };
    } else {
      if (!form.pickupDate || !form.returnDate) return { hours: 0, days: 1, total: car ? car.pricePerDay : 0 };
      const p = new Date(form.pickupDate);
      const r = new Date(form.returnDate);
      const days = Math.max(1, Math.round((r - p) / (1000 * 60 * 60 * 24)));
      return { hours: 0, days, total: days * (car ? car.pricePerDay : 0) };
    }
  };

  const submit = async () => {
    if (!form.pickupDate) { toast.error('Select pickup date'); return; }
    if (bookingType === 'daily' && !form.returnDate) { toast.error('Select return date'); return; }
    if (!form.destination) { toast.error('Enter your destination'); return; }
    if (!form.phone || form.phone.length !== 10) { toast.error('Enter valid 10-digit phone number'); return; }

    setSaving(true);
    try {
      await bookingsAPI.create({
        carId: Number(id),
        pickupDate: form.pickupDate,
        returnDate: bookingType === 'sameday' ? form.pickupDate : form.returnDate,
        pickupTime: form.pickupTimeHour + ':' + form.pickupTimeMinute + ' ' + form.pickupTimeAmPm,
        returnTime: form.returnTimeHour + ':' + form.returnTimeMinute + ' ' + form.returnTimeAmPm,
        bookingType: bookingType,
        destination: form.destination,
        paymentMethod: form.paymentMethod,
        phone: form.phone
      });
      toast.success('Booking confirmed!');
      navigate('/customer/bookings');
    } catch (err) {
      toast.error(err.response?.data || 'Booking failed');
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid #dbeafe', borderTopColor: '#2563eb', borderRadius: '50%' }} />
    </div>
  );

  const calc = getTotal();

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 16px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '14px', marginBottom: '20px', padding: '0' }}>
        Back to Cars
      </button>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>Book Your Car</h2>

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', background: '#eff6ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🚗</div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: '0' }}>{car?.companyName} {car?.variantName}</h3>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0' }}>{car?.registrationNo} • {car?.color} • {car?.year}</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <p style={{ color: '#2563eb', fontWeight: '700', margin: '0' }}>Rs.{car?.pricePerDay?.toLocaleString()} / day</p>
              <p style={{ color: '#16a34a', fontWeight: '700', margin: '0' }}>Rs.{pricePerHour} / hour</p>
            </div>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>Booking Type</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div onClick={() => setBookingType('daily')} style={{
            padding: '16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
            border: bookingType === 'daily' ? '2px solid #2563eb' : '2px solid #e5e7eb',
            background: bookingType === 'daily' ? '#eff6ff' : 'white'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>📅</div>
            <div style={{ fontWeight: '600', color: bookingType === 'daily' ? '#1d4ed8' : '#374151' }}>Multi-Day</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Different pickup and return dates</div>
            <div style={{ fontSize: '12px', color: '#2563eb', marginTop: '4px', fontWeight: '600' }}>Rs.{car?.pricePerDay?.toLocaleString()}/day</div>
          </div>
          <div onClick={() => setBookingType('sameday')} style={{
            padding: '16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
            border: bookingType === 'sameday' ? '2px solid #16a34a' : '2px solid #e5e7eb',
            background: bookingType === 'sameday' ? '#f0fdf4' : 'white'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>🕐</div>
            <div style={{ fontWeight: '600', color: bookingType === 'sameday' ? '#15803d' : '#374151' }}>Same Day</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Morning pickup, evening return</div>
            <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px', fontWeight: '600' }}>Rs.{pricePerHour}/hour</div>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>Date and Time</h3>

        {bookingType === 'daily' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Pickup Date *</label>
              <input type="date" name="pickupDate" value={form.pickupDate}
                min={new Date().toISOString().split('T')[0]} onChange={handle} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Return Date *</label>
              <input type="date" name="returnDate" value={form.returnDate}
                min={form.pickupDate || new Date().toISOString().split('T')[0]} onChange={handle} style={inputStyle} />
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Date *</label>
            <input type="date" name="pickupDate" value={form.pickupDate}
              min={new Date().toISOString().split('T')[0]} onChange={handle} style={{ ...inputStyle, maxWidth: '250px' }} />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Pickup Time *</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <select name="pickupTimeHour" value={form.pickupTimeHour} onChange={handle} style={{ ...inputStyle, width: '70px', padding: '10px 6px' }}>
                {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <select name="pickupTimeMinute" value={form.pickupTimeMinute} onChange={handle} style={{ ...inputStyle, width: '70px', padding: '10px 6px' }}>
                {['00','15','30','45'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select name="pickupTimeAmPm" value={form.pickupTimeAmPm} onChange={handle} style={{ ...inputStyle, width: '70px', padding: '10px 6px' }}>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Time to collect car from office</p>
          </div>
          <div>
            <label style={labelStyle}>Return Time *</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <select name="returnTimeHour" value={form.returnTimeHour} onChange={handle} style={{ ...inputStyle, width: '70px', padding: '10px 6px' }}>
                {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <select name="returnTimeMinute" value={form.returnTimeMinute} onChange={handle} style={{ ...inputStyle, width: '70px', padding: '10px 6px' }}>
                {['00','15','30','45'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select name="returnTimeAmPm" value={form.returnTimeAmPm} onChange={handle} style={{ ...inputStyle, width: '70px', padding: '10px 6px' }}>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <p style={{ fontSize: '11px', color: '#ea580c', marginTop: '4px' }}>Must return by this time</p>
          </div>
        </div>

        <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fff7ed', borderRadius: '10px', border: '1px solid #fed7aa' }}>
          <p style={{ fontSize: '12px', color: '#c2410c', margin: '0', fontWeight: '500' }}>
            Late return will incur a fine. Please return the car on time.
          </p>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>Destination</h3>
        <label style={labelStyle}>Where are you going? *</label>
        <input type="text" name="destination" value={form.destination} onChange={handle}
          placeholder="e.g. Puri Beach, Konark Temple" style={inputStyle} />
        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>You will pick up the car from our office</p>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>Contact</h3>
        <label style={labelStyle}>Phone Number *</label>
        <input type="tel" name="phone" value={form.phone} onChange={e => {
          const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
          setForm({ ...form, phone: val });
        }} placeholder="10-digit mobile number" maxLength={10} style={inputStyle} />
        <p style={{ fontSize: '11px', color: form.phone.length === 10 ? '#16a34a' : '#94a3b8', marginTop: '4px' }}>
          {form.phone.length}/10 digits {form.phone.length === 10 ? 'OK' : ''}
        </p>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>Payment Method</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          {[
            { value: 'CASH', label: 'Cash', desc: 'Pay on pickup' },
            { value: 'CARD', label: 'Card', desc: 'Credit/Debit' },
            { value: 'UPI',  label: 'UPI',  desc: 'GPay/PhonePe' }
          ].map(p => (
            <div key={p.value} onClick={() => setForm({ ...form, paymentMethod: p.value })}
              style={{
                padding: '14px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
                border: form.paymentMethod === p.value ? '2px solid #2563eb' : '2px solid #e5e7eb',
                background: form.paymentMethod === p.value ? '#eff6ff' : 'white'
              }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: form.paymentMethod === p.value ? '#1d4ed8' : '#374151' }}>{p.label}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...cardStyle, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af', marginBottom: '12px' }}>Price Summary</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#475569', marginBottom: '8px' }}>
          <span>Booking Type</span>
          <span style={{ fontWeight: '500' }}>{bookingType === 'sameday' ? 'Same Day (Hourly)' : 'Multi-Day'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#475569', marginBottom: '8px' }}>
          <span>Duration</span>
          <span style={{ fontWeight: '500' }}>{bookingType === 'sameday' ? calc.hours + ' hour(s)' : calc.days + ' day(s)'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#475569', marginBottom: '8px' }}>
          <span>Payment</span>
          <span style={{ fontWeight: '500' }}>{form.paymentMethod}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', color: '#1d4ed8', paddingTop: '12px', borderTop: '1px solid #bfdbfe' }}>
          <span>Total Amount</span>
          <span>Rs.{calc.total.toLocaleString()}</span>
        </div>
      </div>

      <button onClick={submit} disabled={saving} style={{
        width: '100%', padding: '14px',
        background: saving ? '#93c5fd' : '#2563eb',
        color: 'white', border: 'none', borderRadius: '12px',
        fontSize: '16px', fontWeight: '600',
        cursor: saving ? 'not-allowed' : 'pointer', marginBottom: '40px'
      }}>
        {saving ? 'Confirming...' : 'Confirm Booking - Rs.' + calc.total.toLocaleString()}
      </button>
    </div>
  );
}
