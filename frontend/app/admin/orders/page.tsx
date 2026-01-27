'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPatch } from '../../../lib/api';
import { AdminGuard } from '../../../components/admin/AdminGuard';

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
    <AdminGuard>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#6f6256]">Orders</p>
            <h1 className="display mt-2 text-3xl">Orders Management</h1>
            <p className="mt-2 text-sm text-[#6f6256]">Update order statuses and payments.</p>
          </div>
          <button
            className="rounded-full border border-gold-400 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold-200"
            onClick={load}
          >
            Refresh
          </button>
        </div>

        <div className="mt-6 glass rounded-2xl p-6 shadow-sm">
          <div className="overflow-hidden rounded-xl border border-black/10">
            <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr] bg-white/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#6f6256]">
              <span>Order</span>
              <span>Total</span>
              <span>Status</span>
              <span>Payment</span>
              <span className="text-right">Actions</span>
            </div>
            <div className="divide-y divide-black/10 text-sm">
              {orders.map((order) => (
                <div key={order._id} className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr] items-center px-4 py-3">
                  <span className="truncate text-gold-200">{order._id}</span>
                  <span className="text-[#4f4338]">${Number(order.total).toFixed(2)}</span>
                  <select
                    className="rounded-md bg-white/70 p-2 text-xs"
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
                  <span className="text-xs uppercase text-[#6f6256]">
                    {order.paymentStatus || 'PENDING'}
                  </span>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="rounded-full border border-gold-400 px-3 py-1 text-xs text-gold-200"
                      onClick={async () => {
                        await apiPatch(`/orders/${order._id}/paid`, { paymentStatus: 'PAID' });
                        await load();
                      }}
                    >
                      Mark Paid
                    </button>
                    <button
                      className="rounded-full border border-black/10 px-3 py-1 text-xs text-[#6f6256]"
                      onClick={async () => {
                        await apiPatch(`/orders/${order._id}/paid`, { paymentStatus: 'REFUNDED' });
                        await load();
                      }}
                    >
                      Refund
                    </button>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="px-4 py-4 text-xs text-[#6f6256]">No orders found.</p>}
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
