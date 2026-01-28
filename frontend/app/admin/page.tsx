'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AdminGuard } from '../../components/admin/AdminGuard';
import { apiGet, apiPost } from '../../lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalSales: 0, orders: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [salesSeries, setSalesSeries] = useState<number[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [seeding, setSeeding] = useState(false);

  const load = async () => {
    const [report, orders, users, products] = await Promise.all([
      apiGet<any[]>('/reports/sales'),
      apiGet<any[]>('/orders'),
      apiGet<any[]>('/users'),
      apiGet<any[]>('/products?inStock=true'),
    ]);
    const data = report?.[0] || { totalSales: 0, orderCount: 0 };
    const customerCount = (users || []).filter((u) => u.role === 'CUSTOMER').length;
    setStats({
      totalSales: Number(data.totalSales || 0),
      orders: Number(data.orderCount || 0),
      customers: customerCount,
    });
    setRecentOrders((orders || []).slice(0, 5));
    setLowStock((products || []).filter((p) => p.stock <= 10).slice(0, 5));
    const totals = (orders || [])
      .slice(0, 12)
      .map((order: any) => Number(order.total || 0))
      .reverse();
    setSalesSeries(totals);
    const counts: Record<string, number> = {};
    (orders || []).forEach((order: any) => {
      const status = order.status || 'PENDING';
      counts[status] = (counts[status] || 0) + 1;
    });
    setStatusCounts(counts);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const seedSampleOrders = async () => {
    setSeeding(true);
    try {
      await apiPost('/orders/seed', { count: 12 });
      await load();
    } catch {
      // best-effort; no toast in admin overview
    } finally {
      setSeeding(false);
    }
  };

  const hasSalesData = salesSeries.length > 0;
  const hasStatusData = Object.entries(statusCounts).length > 0;
  const statusEntries: [string, number][] = Object.entries(statusCounts);

  return (
    <AdminGuard>
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#6f6256]">Dashboard</p>
            <h1 className="display mt-2 text-3xl">Admin Overview</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#6f6256]"
              onClick={seedSampleOrders}
              disabled={seeding}
            >
              {seeding ? 'Seeding...' : 'Generate Sample Orders'}
            </button>
            <Link
              href="/admin/reports"
              className="rounded-full border border-gold-400 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold-200"
            >
              View Reports
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['Total Sales', `$${stats.totalSales.toFixed(2)}`],
            ['Orders', `${stats.orders}`],
            ['Customers', `${stats.customers}`],
          ].map(([label, value]) => (
            <div key={label} className="glass rounded-2xl p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">{label}</p>
              <p className="display mt-3 text-2xl text-gold-200">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr,1fr]">
          <div className="glass rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Sales Overview</p>
                <h2 className="display mt-2 text-xl text-gold-200">Revenue Trend</h2>
              </div>
              <span className="rounded-full border border-gold-400/40 bg-white/70 px-3 py-1 text-xs text-gold-200">
                Last 12 orders
              </span>
            </div>
            <div className="mt-6 rounded-2xl border border-gold-400/20 bg-gradient-to-br from-white via-[#fff8eb] to-white p-4">
              {hasSalesData ? (
                <>
                  <div className="flex items-end justify-between text-xs text-[#6f6256]">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                  <svg viewBox="0 0 240 80" className="mt-2 h-24 w-full">
                    <defs>
                      <linearGradient id="salesLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#d4a750" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#c18f3a" stopOpacity="0.85" />
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="none"
                      stroke="url(#salesLine)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={salesSeries
                        .map((value, idx) => {
                          const x = (idx / (salesSeries.length - 1 || 1)) * 230 + 5;
                          const max = Math.max(...salesSeries, 1);
                          const y = 75 - (value / max) * 60;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                    {salesSeries.map((value, idx) => {
                      const x = (idx / (salesSeries.length - 1 || 1)) * 230 + 5;
                      const max = Math.max(...salesSeries, 1);
                      const y = 75 - (value / max) * 60;
                      return <circle key={idx} cx={x} cy={y} r="2.6" fill="#c18f3a" />;
                    })}
                  </svg>
                </>
              ) : (
                <p className="text-sm text-[#6f6256]">No sales data yet.</p>
              )}
            </div>
          </div>

          <div className="glass rounded-2xl p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Orders Status</p>
            <h2 className="display mt-2 text-xl text-gold-200">Fulfillment Mix</h2>
            <div className="mt-6 space-y-4 text-sm">
              {hasStatusData ? (
                statusEntries.map(([status, count]) => {
                  const total = statusEntries.reduce((sum, [, value]) => sum + value, 0) || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between text-xs text-[#6f6256]">
                        <span className="uppercase tracking-[0.2em]">{status}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/70">
                        <div className="h-full rounded-full bg-gold-400" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-[#6f6256]">No order data yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="display text-xl text-gold-200">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs text-[#6f6256]">View all</Link>
            </div>
            <div className="mt-4 overflow-x-auto rounded-xl border border-black/10">
              <div className="min-w-[360px]">
                <div className="grid grid-cols-[2fr,1fr] bg-white/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#6f6256]">
                  <span>Order</span>
                  <span>Status</span>
                </div>
                <div className="divide-y divide-black/10 text-sm">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="grid grid-cols-[2fr,1fr] px-4 py-3 text-[#4f4338]">
                      <span className="truncate">{order._id}</span>
                      <span className="text-xs uppercase text-[#6f6256]">{order.status}</span>
                    </div>
                  ))}
                  {recentOrders.length === 0 && (
                    <p className="px-4 py-4 text-xs text-[#6f6256]">No orders yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="display text-xl text-gold-200">Low Stock Alerts</h2>
              <Link href="/admin/products" className="text-xs text-[#6f6256]">Manage</Link>
            </div>
            <div className="mt-4 space-y-3 text-sm text-[#4f4338]">
              {lowStock.map((product) => (
                <div key={product._id} className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-white/70 px-4 py-3">
                  <span className="min-w-0 truncate">{product.name}</span>
                  <span className="rounded-full border border-gold-400/40 px-3 py-1 text-xs text-gold-200">
                    {product.stock} left
                  </span>
                </div>
              ))}
              {lowStock.length === 0 && (
                <p className="text-xs text-[#6f6256]">Inventory looks healthy.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
