'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AdminGuard } from '../../components/admin/AdminGuard';
import { apiGet } from '../../lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalSales: 0, orders: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);

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
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <AdminGuard>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#6f6256]">Dashboard</p>
            <h1 className="display mt-2 text-3xl">Admin Overview</h1>
          </div>
          <Link
            href="/admin/reports"
            className="rounded-full border border-gold-400 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold-200"
          >
            View Reports
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
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
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="display text-xl text-gold-200">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs text-[#6f6256]">View all</Link>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-black/10">
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
          <div className="glass rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="display text-xl text-gold-200">Low Stock Alerts</h2>
              <Link href="/admin/products" className="text-xs text-[#6f6256]">Manage</Link>
            </div>
            <div className="mt-4 space-y-3 text-sm text-[#4f4338]">
              {lowStock.map((product) => (
                <div key={product._id} className="flex items-center justify-between rounded-xl border border-black/10 bg-white/70 px-4 py-3">
                  <span className="truncate">{product.name}</span>
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
