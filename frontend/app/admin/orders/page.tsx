'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPatch } from '../../../lib/api';

const statuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  const load = async () => {
    const data = await apiGet<any[]>('/orders');
    setOrders(data || []);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="display text-3xl">Orders Management</h1>
      <p className="mt-4 text-sm text-[#8c8378]">Update order statuses and payments.</p>
      <div className="mt-6 glass rounded-2xl p-6">
        <div className="space-y-4 text-sm">
          {orders.map((order) => (
            <div key={order._id} className="grid gap-3 border-b border-white/5 pb-4 md:grid-cols-[2fr,1fr,1fr,1fr]">
              <div>
                <p className="text-gold-200">{order._id}</p>
                <p className="text-xs text-[#8c8378]">${Number(order.total).toFixed(2)}</p>
              </div>
              <select
                className="rounded-md bg-black/40 p-2"
                defaultValue={order.status}
                onChange={async (e) => {
                  await apiPatch(`/orders/${order._id}/status`, { status: e.target.value });
                  await load();
                }}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button
                className="rounded-full border border-gold-400 px-3 py-2 text-xs text-gold-200"
                onClick={async () => {
                  await apiPatch(`/orders/${order._id}/paid`, { paymentStatus: 'PAID' });
                  await load();
                }}
              >
                Mark Paid
              </button>
              <button
                className="rounded-full border border-white/10 px-3 py-2 text-xs text-[#8c8378]"
                onClick={async () => {
                  await apiPatch(`/orders/${order._id}/paid`, { paymentStatus: 'REFUNDED' });
                  await load();
                }}
              >
                Refund
              </button>
            </div>
          ))}
          {orders.length === 0 && <p className="text-[#8c8378]">No orders found.</p>}
        </div>
      </div>
    </div>
  );
}