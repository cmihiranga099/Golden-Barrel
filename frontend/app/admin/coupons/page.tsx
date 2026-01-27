'use client';

import { useEffect, useState } from 'react';
import { AdminGuard } from '../../../components/admin/AdminGuard';
import { apiDelete, apiGet, apiPost, apiPut } from '../../../lib/api';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [draft, setDraft] = useState({
    code: '',
    type: 'PERCENT',
    value: 10,
    minSpend: 50,
    expiresAt: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    const data = await apiGet<any[]>('/coupons');
    setCoupons(data || []);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <AdminGuard>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#6f6256]">Discounts</p>
            <h1 className="display mt-2 text-3xl">Coupons & Discounts</h1>
            <p className="mt-2 text-sm text-[#6f6256]">Create and manage promo codes.</p>
          </div>
          <button
            className="rounded-full border border-gold-400 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold-200"
            onClick={load}
          >
            Refresh
          </button>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="glass rounded-2xl p-6 shadow-sm">
            <h2 className="display text-xl text-gold-200">
              {editingId ? 'Edit Coupon' : 'Create Coupon'}
            </h2>
            <div className="mt-4 grid gap-3 text-sm">
              <input
                className="rounded-md bg-white/70 p-3 text-sm"
                placeholder="CODE"
                value={draft.code}
                onChange={(e) => setDraft({ ...draft, code: e.target.value })}
              />
              <select
                className="rounded-md bg-white/70 p-3 text-sm"
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value })}
              >
                <option value="PERCENT">Percent</option>
                <option value="FIXED">Fixed</option>
              </select>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="number"
                  className="rounded-md bg-white/70 p-3 text-sm"
                  placeholder="Value"
                  value={draft.value}
                  onChange={(e) => setDraft({ ...draft, value: Number(e.target.value) })}
                />
                <input
                  type="number"
                  className="rounded-md bg-white/70 p-3 text-sm"
                  placeholder="Min Spend"
                  value={draft.minSpend}
                  onChange={(e) => setDraft({ ...draft, minSpend: Number(e.target.value) })}
                />
              </div>
              <input
                type="date"
                className="rounded-md bg-white/70 p-3 text-sm"
                value={draft.expiresAt}
                onChange={(e) => setDraft({ ...draft, expiresAt: e.target.value })}
              />
              <button
                className="rounded-full border border-gold-400 px-4 py-2 text-sm text-gold-200"
                onClick={async () => {
                  if (editingId) {
                    await apiPut(`/coupons/${editingId}`, draft);
                  } else {
                    await apiPost('/coupons', draft);
                  }
                  setEditingId(null);
                  setDraft({ code: '', type: 'PERCENT', value: 10, minSpend: 50, expiresAt: '' });
                  await load();
                }}
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button
                  className="rounded-full border border-black/10 px-4 py-2 text-sm text-[#6f6256]"
                  onClick={() => {
                    setEditingId(null);
                    setDraft({ code: '', type: 'PERCENT', value: 10, minSpend: 50, expiresAt: '' });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="glass rounded-2xl p-6 shadow-sm">
            <h2 className="display text-xl text-gold-200">Active Coupons</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-black/10">
              <div className="grid grid-cols-[1.3fr,1fr,1fr,auto] bg-white/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#6f6256]">
                <span>Code</span>
                <span>Value</span>
                <span>Min Spend</span>
                <span className="text-right">Actions</span>
              </div>
              <div className="divide-y divide-black/10 text-sm">
                {coupons.map((coupon) => (
                  <div key={coupon._id} className="grid grid-cols-[1.3fr,1fr,1fr,auto] items-center px-4 py-3">
                    <div>
                      <p className="text-gold-200">{coupon.code}</p>
                      <p className="text-xs text-[#6f6256]">{coupon.type}</p>
                    </div>
                    <span className="text-[#4f4338]">
                      {coupon.type === 'PERCENT' ? `${coupon.value}%` : `$${coupon.value}`}
                    </span>
                    <span className="text-[#4f4338]">${coupon.minSpend}</span>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="rounded-full border border-gold-400 px-3 py-1 text-xs text-gold-200"
                        onClick={() => {
                          setEditingId(coupon._id);
                          setDraft({
                            code: coupon.code,
                            type: coupon.type,
                            value: coupon.value,
                            minSpend: coupon.minSpend,
                            expiresAt: new Date(coupon.expiresAt).toISOString().slice(0, 10),
                          });
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-xs text-[#6f6256]"
                        onClick={async () => {
                          await apiDelete(`/coupons/${coupon._id}`);
                          await load();
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {coupons.length === 0 && <p className="px-4 py-4 text-xs text-[#6f6256]">No coupons created.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
