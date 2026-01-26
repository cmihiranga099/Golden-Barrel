import Link from 'next/link';
import { AdminGuard } from '../../components/admin/AdminGuard';

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="display text-3xl">Admin Overview</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[['Total Sales', '$48,320'], ['Orders', '1,124'], ['Customers', '642']].map(([label, value]) => (
          <div key={label} className="glass rounded-2xl p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8c8378]">{label}</p>
            <p className="display mt-3 text-2xl text-gold-200">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h2 className="display text-xl text-gold-200">Recent Orders</h2>
          <div className="mt-4 space-y-3 text-sm">
            {['GB-1008', 'GB-1007', 'GB-1006'].map((id) => (
              <div key={id} className="flex items-center justify-between text-[#cfc7bc]">
                <span>{id}</span>
                <span className="text-xs text-[#8c8378]">Processing</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="display text-xl text-gold-200">Low Stock Alerts</h2>
          <div className="mt-4 space-y-3 text-sm text-[#cfc7bc]">
            <div className="flex items-center justify-between">
              <span>Golden Barrel Select 4</span>
              <span className="text-xs text-[#8c8378]">4 left</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Vault Series 12</span>
              <span className="text-xs text-[#8c8378]">7 left</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/products" className="rounded-full border border-gold-400 px-4 py-2 text-sm text-gold-200">
          Manage Products
        </Link>
          <Link href="/admin/orders" className="rounded-full border border-gold-400 px-4 py-2 text-sm text-gold-200">
            Manage Orders
          </Link>
          <Link href="/admin/users" className="rounded-full border border-gold-400 px-4 py-2 text-sm text-gold-200">
            Manage Users
          </Link>
        </div>
      </div>
    </AdminGuard>
  );
}
