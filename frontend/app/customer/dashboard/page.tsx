'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useToast } from '../../../components/ui/ToastProvider';
import { fetchProfile, UserProfile } from '../../../lib/profile';
import { listOrders } from '../../../lib/checkout';

export default function CustomerDashboardPage() {
  const { push } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchProfile()
      .then((data) => setProfile(data))
      .catch(() => {
        push('Please sign in to view your dashboard.');
      });
  }, [push]);

  useEffect(() => {
    listOrders()
      .then((data: any) => setOrders(data || []))
      .catch(() => setOrders([]));
  }, []);

  const latestOrder = orders[0];

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Customer</p>
          <h1 className="display mt-2 text-3xl">Dashboard</h1>
        </div>
        <Link
          href="/account"
          className="rounded-full border border-gold-400 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold-200"
        >
          Profile Settings
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h2 className="display text-xl text-gold-200">Welcome</h2>
          <p className="mt-3 text-sm text-[#4f4338]">
            {profile?.name ? `Hello ${profile.name},` : 'Hello,'} manage your orders and account activity below.
          </p>
          <div className="mt-4 grid gap-3 text-sm">
            <Link href="/products" className="text-gold-200">Continue Shopping</Link>
            <Link href="/account/orders" className="text-gold-200">Order History</Link>
            <Link href="/account/addresses" className="text-gold-200">Address Book</Link>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="display text-xl text-gold-200">Payment Details</h2>
          {latestOrder ? (
            <div className="mt-4 space-y-2 text-sm text-[#4f4338]">
              <div className="flex justify-between">
                <span>Method</span>
                <span className="text-gold-200">{latestOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="text-gold-200">{latestOrder.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Charge</span>
                <span className="text-gold-200">${Number(latestOrder.total).toFixed(2)}</span>
              </div>
              <p className="text-xs text-[#6f6256]">Based on your latest order.</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#6f6256]">No payment details yet.</p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="display text-xl text-gold-200">Recent Orders</h2>
            <Link href="/account/orders" className="text-xs text-[#6f6256]">View all</Link>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {orders.slice(0, 3).map((order) => (
              <div key={order._id} className="flex items-center justify-between rounded-xl border border-black/10 bg-white/70 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-gold-200">{order._id}</p>
                  <p className="text-xs text-[#6f6256]">{new Date(order.createdAt).toDateString()}</p>
                </div>
                <Link href={`/account/orders/${order._id}`} className="text-xs text-gold-200">
                  Details
                </Link>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-[#6f6256]">No orders yet.</p>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="display text-xl text-gold-200">Extras</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <Link href="/account/wishlist" className="text-gold-200">Wishlist</Link>
            <Link href="/account/addresses" className="text-gold-200">Address Book</Link>
            <Link href="/reviews" className="text-gold-200">Leave a Review</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
