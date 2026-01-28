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
    PENDING: 'bg-amber-100 text-amber-700',
    PAID: 'bg-emerald-100 text-emerald-700',
    PROCESSING: 'bg-sky-100 text-sky-700',
    SHIPPED: 'bg-indigo-100 text-indigo-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-rose-100 text-rose-700',
    REFUNDED: 'bg-slate-100 text-slate-700',
  };

  const formatOrderId = (id: string) => `#${id.slice(-6).toUpperCase()}`;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
      <div className="rounded-3xl border border-gold-400/20 bg-gradient-to-br from-[#fff8eb] via-white to-[#f7efe3] p-6 sm:p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Welcome back</p>
        <h1 className="display mt-2 text-3xl">Your Dashboard</h1>
        <p className="mt-2 text-sm text-[#4f4338]">
          {profile?.name ? `${profile.name}, your recent activity is summarized below.` : 'Your recent activity is summarized below.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <span className="rounded-full border border-gold-400/40 bg-white/70 px-3 py-1 text-gold-200">
            Personalized picks
          </span>
          <span className="rounded-full border border-gold-400/40 bg-white/70 px-3 py-1 text-gold-200">
            Track orders
          </span>
          <span className="rounded-full border border-gold-400/40 bg-white/70 px-3 py-1 text-gold-200">
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
          <div key={label} className="glass rounded-2xl p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">{label}</p>
            <p className="display mt-3 text-2xl text-gold-200">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="display text-xl text-gold-200">Recent Orders</h2>
            <span className="text-xs text-[#6f6256]">Last 5</span>
          </div>
          <div className="mt-4 overflow-x-auto rounded-xl border border-black/10">
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
            <div className="rounded-xl border border-black/10 bg-white/70 px-3 py-2">
              Quick tip: Track orders from the order history page.
            </div>
            <div className="rounded-xl border border-black/10 bg-white/70 px-3 py-2">
              Reorder your favorites in one click.
            </div>
            <div className="rounded-xl border border-black/10 bg-white/70 px-3 py-2">
              Download receipts from order details.
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
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
          <div className="mt-6 rounded-xl border border-black/10 bg-white/70 p-4 text-sm text-[#4f4338]">
            <p className="text-xs uppercase tracking-[0.2em] text-[#6f6256]">Profile</p>
            <p className="mt-2 text-gold-200">{profile?.name || 'Customer'}</p>
            <p className="text-xs text-[#6f6256]">{profile?.email || 'Email not available'}</p>
          </div>
          <div className="mt-4 grid gap-2 text-xs text-[#6f6256]">
            <span className="rounded-full border border-gold-400/40 bg-white/70 px-3 py-1 text-center text-gold-200">
              Secure payments
            </span>
            <span className="rounded-full border border-gold-400/40 bg-white/70 px-3 py-1 text-center text-gold-200">
              21+ verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
