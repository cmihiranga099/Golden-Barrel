'use client';

import Link from 'next/link';

const orders = [
  { id: 'GB-1001', total: 184.5, status: 'Processing', date: '2024-05-22' },
  { id: 'GB-1002', total: 96.0, status: 'Shipped', date: '2024-05-20' },
];

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="display text-3xl">Order History</h1>
      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="glass flex items-center justify-between rounded-2xl p-4">
            <div>
              <p className="text-gold-200">{order.id}</p>
              <p className="text-xs text-[#8c8378]">{order.date}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#cfc7bc]">${order.total.toFixed(2)}</p>
              <p className="text-xs text-[#8c8378]">{order.status}</p>
            </div>
            <Link href={`/account/orders/${order.id}`} className="text-sm text-gold-200">
              View
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}