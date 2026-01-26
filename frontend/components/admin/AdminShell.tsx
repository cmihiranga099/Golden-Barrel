'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminGuard } from './AdminGuard';
import { apiPost } from '../../lib/api';
import { clearTokens } from '../../lib/auth';

const navItems = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/products', label: 'Manage Products' },
  { href: '/admin/orders', label: 'Manage Orders' },
  { href: '/admin/users', label: 'Manage Users' },
  { href: '/admin/coupons', label: 'Manage Coupons' },
  { href: '/admin/reports', label: 'View Reports' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    try {
      await apiPost('/auth/logout');
    } catch {}
    clearTokens();
    router.push('/login');
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-white/60">
        <div className="mx-auto flex max-w-7xl gap-6 px-6 py-10">
          <aside className="glass hidden w-60 flex-col rounded-3xl p-6 md:flex">
            <p className="display text-lg text-gold-200">Admin</p>
            <nav className="mt-6 flex flex-col gap-3 text-sm">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full border px-4 py-2 text-xs ${
                      active ? 'border-gold-400 text-gold-200' : 'border-black/10 text-[#6f6256]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <button
              onClick={logout}
              className="mt-auto rounded-full border border-black/10 px-4 py-2 text-xs text-[#6f6256]"
            >
              Logout
            </button>
          </aside>
          <main className="w-full">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
