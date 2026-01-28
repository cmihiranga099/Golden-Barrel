'use client';

import { useEffect, useState } from 'react';
import { getOrder } from '../../../../lib/checkout';

const timeline = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    getOrder(params.id)
      .then((data: any) => setOrder(data))
      .catch(() => setOrder(null));
  }, [params.id]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
      <h1 className="display text-3xl">Order {params.id}</h1>
      <div className="mt-6 glass rounded-2xl p-6">
        <h2 className="display text-xl text-gold-200">Status Timeline</h2>
        <div className="mt-4 space-y-3">
          {timeline.map((step, idx) => (
            <div key={step} className="flex items-center gap-3 text-sm">
              <div
                className={`h-2 w-2 rounded-full ${
                  order && timeline.indexOf(order.status) >= idx ? 'bg-gold-400' : 'bg-white/10'
                }`}
              />
              <span
                className={
                  order && timeline.indexOf(order.status) >= idx ? 'text-gold-200' : 'text-[#6f6256]'
                }
              >
                {step}
              </span>
            </div>
          ))}
        </div>
        {order && (
          <div className="mt-6 text-sm text-[#4f4338]">
            <p>Payment: {order.paymentStatus}</p>
            <p>Total: ${Number(order.total).toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
