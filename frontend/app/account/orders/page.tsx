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
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="display text-3xl">Order History</h1>
      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="glass flex items-center justify-between rounded-2xl p-4">
            <div>
              <p className="text-gold-200">{order._id}</p>
              <p className="text-xs text-[#8c8378]">{new Date(order.createdAt).toDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#cfc7bc]">${Number(order.total).toFixed(2)}</p>
              <p className="text-xs text-[#8c8378]">{order.status}</p>
            </div>
            <Link href={`/account/orders/${order._id}`} className="text-sm text-gold-200">
              View
            </Link>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-sm text-[#8c8378]">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
