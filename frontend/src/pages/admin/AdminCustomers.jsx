import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { Search, User } from 'lucide-react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    adminAPI.getCustomers()
      .then(r => setCustomers(r.data))
      .catch(() => toast.error('Failed to load customers'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c =>
    `${c.fullName} ${c.email} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Customers</h2>
        <p className="text-slate-500 mt-1">{customers.length} registered customers</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search customers..." className="input-field pl-9 py-2.5" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading
          ? <div className="col-span-3 flex justify-center py-16"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
          : filtered.map(c => (
            <div key={c.customerId} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{c.fullName}</p>
                  <p className="text-sm text-slate-500 truncate">{c.email || 'No email'}</p>
                  <p className="text-sm text-slate-500">{c.phone || 'No phone'}</p>
                  {c.licenseNo && (
                    <p className="text-xs text-slate-400 mt-1 font-mono">License: {c.licenseNo}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
