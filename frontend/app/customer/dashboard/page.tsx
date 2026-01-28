'use client';

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
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const lastStatus = latestOrder?.status || 'N/A';

  const statusLabels: Record<string, string> = {
    PENDING: 'Pending',
    PAID: 'Paid',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    REFUNDED: 'Refunded',
  };

  const statusTone: Record<string, string> = {
    PENDING: 'bg-amber-500/20 text-amber-200',
    PAID: 'bg-emerald-500/20 text-emerald-200',
    PROCESSING: 'bg-sky-500/20 text-sky-200',
    SHIPPED: 'bg-indigo-500/20 text-indigo-200',
    DELIVERED: 'bg-green-500/20 text-green-200',
    CANCELLED: 'bg-rose-500/20 text-rose-200',
    REFUNDED: 'bg-slate-500/20 text-slate-200',
  };

  const formatOrderId = (id: string) => `#${id.slice(-6).toUpperCase()}`;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
      <div className="rounded-3xl border border-gold-400/20 bg-night-900/95 p-6 shadow-lg sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b7a590]">Welcome back</p>
        <h1 className="display mt-2 text-3xl text-gold-200">Your Dashboard</h1>
        <p className="mt-2 text-sm text-[#d8c9b6]">
          {profile?.name ? `${profile.name}, your recent activity is summarized below.` : 'Your recent activity is summarized below.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <span className="rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 text-gold-200">
            Personalized picks
          </span>
          <span className="rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 text-gold-200">
            Track orders
          </span>
          <span className="rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 text-gold-200">
            Manage profile
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['Orders', `${totalOrders}`],
          ['Total Spend', `$${totalSpent.toFixed(2)}`],
          ['Latest Status', `${statusLabels[lastStatus] || lastStatus}`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-gold-400/20 bg-night-800/90 p-6 shadow-md">
            <p className="text-xs uppercase tracking-[0.3em] text-[#b7a590]">{label}</p>
            <p className="display mt-3 text-2xl text-gold-200">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="display text-xl text-gold-200">Recent Orders</h2>
            <span className="text-xs text-[#6f6256]">Last 5</span>
          </div>
          <div className="mt-4 overflow-x-auto rounded-xl border border-black/10 bg-white">
            <div className="min-w-[520px]">
              <div className="grid grid-cols-[1.2fr,1fr,0.8fr,1fr] bg-white/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#6f6256]">
                <span>Order</span>
                <span>Date</span>
                <span>Status</span>
                <span className="text-right">Total</span>
              </div>
              <div className="divide-y divide-black/10 text-sm">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="grid grid-cols-[1.2fr,1fr,0.8fr,1fr] items-center px-4 py-3 text-[#4f4338]">
                    <span className="truncate text-gold-200">{formatOrderId(order._id)}</span>
                    <span className="text-xs text-[#6f6256]">{new Date(order.createdAt).toDateString()}</span>
                    <span className={`inline-flex w-fit rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${statusTone[order.status] || 'bg-slate-100 text-slate-700'}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                    <span className="text-right">${Number(order.total).toFixed(2)}</span>
                  </div>
                ))}
                {orders.length === 0 && (
                  <div className="px-4 py-6 text-sm text-[#6f6256]">
                    No orders yet. Once you place an order, it will appear here.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-3 text-xs text-[#6f6256] sm:grid-cols-3">
            <div className="rounded-xl border border-black/10 bg-[#f9f6f0] px-3 py-2">
              Quick tip: Track orders from the order history page.
            </div>
            <div className="rounded-xl border border-black/10 bg-[#f9f6f0] px-3 py-2">
              Reorder your favorites in one click.
            </div>
            <div className="rounded-xl border border-black/10 bg-[#f9f6f0] px-3 py-2">
              Download receipts from order details.
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="display text-xl text-gold-200">Payment Snapshot</h2>
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
          <div className="mt-6 rounded-xl border border-black/10 bg-[#f9f6f0] p-4 text-sm text-[#4f4338]">
            <p className="text-xs uppercase tracking-[0.2em] text-[#6f6256]">Profile</p>
            <p className="mt-2 text-[#1f1b16]">{profile?.name || 'Customer'}</p>
            <p className="text-xs text-[#6f6256]">{profile?.email || 'Email not available'}</p>
          </div>
          <div className="mt-4 grid gap-2 text-xs text-[#6f6256]">
            <span className="rounded-full border border-gold-400/50 bg-gold-50 px-3 py-1 text-center text-[#8a5b1f]">
              Secure payments
            </span>
            <span className="rounded-full border border-gold-400/50 bg-gold-50 px-3 py-1 text-center text-[#8a5b1f]">
              21+ verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
