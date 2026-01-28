'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getOrder } from '../../../lib/checkout';

export default function CheckoutConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    if (!orderId) return;
    getOrder(orderId)
      .then((data) => setOrder(data))
      .catch(() => setOrder(null));
  }, [orderId]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
      <h1 className="display text-3xl">Order Confirmed</h1>
      <p className="mt-4 text-sm text-[#6f6256]">
        Thank you for shopping with Golden Barrel. A receipt email will be sent shortly.
      </p>
      <div className="mt-6 glass rounded-2xl p-6 text-sm">
        <p className="text-gold-200">Order ID: {orderId || 'Unavailable'}</p>
        {order && (
          <div className="mt-3 text-[#4f4338]">
            <p>Status: {order.status}</p>
            <p>Total: ${Number(order.total).toFixed(2)}</p>
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {orderId && (
          <Link
            href={`/account/orders/${orderId}`}
            className="w-full rounded-full border border-gold-400 px-4 py-2 text-center text-sm text-gold-200 sm:w-auto"
          >
            View Order
          </Link>
        )}
        <Link
          href="/products"
          className="w-full rounded-full border border-black/10 px-4 py-2 text-center text-sm text-[#6f6256] sm:w-auto"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
