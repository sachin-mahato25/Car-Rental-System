import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import { carsAPI, adminAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const statusBadge = (s) => {
  const m = { AVAILABLE: 'badge-green', BOOKED: 'badge-yellow', MAINTENANCE: 'badge-red' };
  return <span className={m[s] || 'badge-gray'}>{s}</span>;
};

const emptyForm = { companyId:'', variantId:'', registrationNo:'', pricePerDay:'', status:'AVAILABLE', locationId:'', color:'', year:'', imageUrl:'' };

export default function AdminCars() {
  const [cars, setCars]           = useState([]);
  const [companies, setCompanies] = useState([]);
  const [variants, setVariants]   = useState([]);
  const [locations, setLocations] = useState([]);
  const [search, setSearch]       = useState('');
  const [modal, setModal]         = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [loading, setLoading]     = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [c, comp, loc] = await Promise.all([carsAPI.getAll(), adminAPI.getCompanies(), adminAPI.getLocations()]);
      setCars(c.data); setCompanies(comp.data); setLocations(loc.data);
    } catch { toast.error('Failed to load cars'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal(true); };

  const openEdit = (car) => {
    setEditing(car.carId);
    setForm({
      companyId: car.companyId, variantId: car.variantId,
      registrationNo: car.registrationNo, pricePerDay: car.pricePerDay,
      status: car.status, locationId: car.locationId || '',
      color: car.color || '', year: car.year || '', imageUrl: car.imageUrl || ''
    });
    setModal(true);
  };

  const save = async () => {
    if (!form.companyId || !form.variantId || !form.registrationNo || !form.pricePerDay) {
      toast.error('Please fill required fields'); return;
    }
    try {
      if (editing) await carsAPI.update(editing, form);
      else         await carsAPI.add(form);
      toast.success(editing ? 'Car updated!' : 'Car added!');
      setModal(false); load();
    } catch { toast.error('Operation failed'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this car?')) return;
    try { await carsAPI.delete(id); toast.success('Car deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const filtered = cars.filter(c =>
    `${c.companyName} ${c.variantName} ${c.registrationNo}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Car Fleet</h2>
          <p className="text-slate-500 mt-1">{cars.length} vehicles total</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
          <Plus size={18} /> Add Car
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search cars..." className="input-field pl-9 py-2.5" />
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Company','Variant','Reg No','Price/Day','Status','Location','Color','Year','Actions'].map(h => (
                  <th key={h} className="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? <tr><td colSpan={9} className="text-center py-16"><div className="inline-block w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></td></tr>
                : filtered.length === 0
                  ? <tr><td colSpan={9} className="text-center py-16 text-slate-400">No cars found</td></tr>
                  : filtered.map(c => (
                    <tr key={c.carId} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-800">{c.companyName}</td>
                      <td className="py-3 px-4 text-slate-600">{c.variantName}</td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-500">{c.registrationNo}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">₹{c.pricePerDay?.toLocaleString()}</td>
                      <td className="py-3 px-4">{statusBadge(c.status)}</td>
                      <td className="py-3 px-4 text-slate-500">{c.locationName || '—'}</td>
                      <td className="py-3 px-4 text-slate-500">{c.color || '—'}</td>
                      <td className="py-3 px-4 text-slate-500">{c.year || '—'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={14} /></button>
                          <button onClick={() => remove(c.carId)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{editing ? 'Edit Car' : 'Add New Car'}</h3>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Company *', name: 'companyId', type: 'select', options: companies.map(c => ({ v: c.companyId, l: c.companyName })) },
                { label: 'Reg Number *', name: 'registrationNo', placeholder: 'MH01AB1234' },
                { label: 'Price/Day (₹) *', name: 'pricePerDay', type: 'number', placeholder: '1500' },
                { label: 'Status', name: 'status', type: 'select', options: ['AVAILABLE','BOOKED','MAINTENANCE'].map(s => ({ v: s, l: s })) },
                { label: 'Location', name: 'locationId', type: 'select', options: locations.map(l => ({ v: l.locationId, l: l.locationName })) },
                { label: 'Color', name: 'color', placeholder: 'White' },
                { label: 'Year', name: 'year', type: 'number', placeholder: '2023' },
                { label: 'Image URL', name: 'imageUrl', placeholder: 'https://...' },
              ].map(({ label, name, type = 'text', placeholder, options }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                  {type === 'select'
                    ? <select name={name} value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })} className="input-field">
                        <option value="">Select...</option>
                        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                      </select>
                    : <input name={name} type={type} value={form[name]} placeholder={placeholder}
                        onChange={e => setForm({ ...form, [name]: e.target.value })} className="input-field" />
                  }
                </div>
              ))}
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-100">
              <button onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={save} className="btn-primary flex-1">{editing ? 'Update' : 'Add Car'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
