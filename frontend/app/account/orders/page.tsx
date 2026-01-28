'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listOrders } from '../../../lib/checkout';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    listOrders()
      .then((data: any) => setOrders(data || []))
      .catch(() => setOrders([]));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6">
      <div className="rounded-3xl border border-gold-400/20 bg-night-900/95 p-6 shadow-lg sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b7a590]">Orders</p>
        <h1 className="display mt-2 text-3xl text-gold-200">Order History</h1>
      </div>
      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="flex flex-col gap-3 rounded-2xl border border-gold-400/20 bg-night-800/90 p-4 shadow-md sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-gold-200">#{order._id.slice(-6).toUpperCase()}</p>
              <p className="text-xs text-[#b7a590]">{new Date(order.createdAt).toDateString()}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-gold-200">${Number(order.total).toFixed(2)}</p>
              <p className="text-xs text-[#b7a590]">{order.status}</p>
            </div>
            <Link href={`/account/orders/${order._id}`} className="text-sm text-gold-200">
              View
            </Link>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-sm text-[#b7a590]">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
