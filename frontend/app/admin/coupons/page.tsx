'use client';

import { useEffect, useState } from 'react';
import { AdminGuard } from '../../../components/admin/AdminGuard';
import { apiDelete, apiGet, apiPost } from '../../../lib/api';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [draft, setDraft] = useState({
    code: '',
    type: 'PERCENT',
    value: 10,
    minSpend: 50,
    expiresAt: '',
  });

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
        <h1 className="display text-3xl">Coupons & Discounts</h1>
        <p className="mt-4 text-sm text-[#8c8378]">Create and manage promo codes.</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <h2 className="display text-xl text-gold-200">Create Coupon</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <input
                className="rounded-md bg-black/40 p-3 text-sm"
                placeholder="CODE"
                value={draft.code}
                onChange={(e) => setDraft({ ...draft, code: e.target.value })}
              />
              <select
                className="rounded-md bg-black/40 p-3 text-sm"
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value })}
              >
                <option value="PERCENT">Percent</option>
                <option value="FIXED">Fixed</option>
              </select>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="number"
                  className="rounded-md bg-black/40 p-3 text-sm"
                  placeholder="Value"
                  value={draft.value}
                  onChange={(e) => setDraft({ ...draft, value: Number(e.target.value) })}
                />
                <input
                  type="number"
                  className="rounded-md bg-black/40 p-3 text-sm"
                  placeholder="Min Spend"
                  value={draft.minSpend}
                  onChange={(e) => setDraft({ ...draft, minSpend: Number(e.target.value) })}
                />
              </div>
              <input
                type="date"
                className="rounded-md bg-black/40 p-3 text-sm"
                value={draft.expiresAt}
                onChange={(e) => setDraft({ ...draft, expiresAt: e.target.value })}
              />
              <button
                className="rounded-full border border-gold-400 px-4 py-2 text-sm text-gold-200"
                onClick={async () => {
                  await apiPost('/coupons', draft);
                  setDraft({ code: '', type: 'PERCENT', value: 10, minSpend: 50, expiresAt: '' });
                  await load();
                }}
              >
                Create
              </button>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="display text-xl text-gold-200">Active Coupons</h2>
            <div className="mt-4 space-y-3 text-sm">
              {coupons.map((coupon) => (
                <div key={coupon._id} className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <p className="text-gold-200">{coupon.code}</p>
                    <p className="text-xs text-[#8c8378]">
                      {coupon.type === 'PERCENT' ? `${coupon.value}%` : `$${coupon.value}`} off | Min ${coupon.minSpend}
                    </p>
                  </div>
                  <button
                    className="text-xs text-[#8c8378]"
                    onClick={async () => {
                      await apiDelete(`/coupons/${coupon._id}`);
                      await load();
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
              {coupons.length === 0 && <p className="text-[#8c8378]">No coupons created.</p>}
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
