'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearTokens } from '../../lib/auth';

const navItems = [
  { href: '/customer/dashboard', label: 'Overview' },
  { href: '/account/orders', label: 'My Orders' },
  { href: '/account/wishlist', label: 'Wishlist' },
  { href: '/account/addresses', label: 'Addresses' },
  { href: '/account', label: 'Profile' },
];

export function CustomerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0b09] via-[#141210] to-[#1c1814]">
      <div className="mx-auto flex max-w-7xl items-start gap-6 px-6 py-10">
        <aside className="hidden w-64 flex-col rounded-3xl border border-gold-400/20 bg-night-800/90 p-6 shadow-lg md:flex">
          <p className="display text-lg text-gold-200">Customer</p>
          <nav className="mt-6 flex flex-col gap-2 text-sm">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-9 items-center justify-center rounded-full border px-3 text-[11px] uppercase tracking-[0.2em] transition ${
                    active
                      ? 'border-gold-400 bg-gold-400/10 text-gold-200 shadow-sm'
                      : 'border-white/10 text-[#b7a590] hover:border-gold-400/50 hover:text-gold-200'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={() => {
              clearTokens();
              router.push('/login');
            }}
            className="mt-4 flex h-9 items-center justify-center rounded-full border border-white/10 px-3 text-[11px] uppercase tracking-[0.2em] text-[#b7a590] transition hover:border-gold-400/50 hover:text-gold-200"
          >
            Logout
          </button>
        </aside>
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}
