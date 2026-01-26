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