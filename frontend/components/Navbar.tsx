'use client';

import Link from 'next/link';
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Navbar() {
  const [role, setRole] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('gb_role');
    setRole(stored);
  }, []);

  return (
    <header className="fixed top-0 z-40 w-full border-b border-black/10 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gold-400/40 bg-white/70 shadow-sm">
            <img src="/logo.png" alt="Golden Barrel" className="h-full w-full object-cover" />
          </span>
          <span className="display text-2xl text-gold-200">Golden Barrel</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm hover:text-gold-200">Home</Link>
          <Link href="/about" className="text-sm hover:text-gold-200">About</Link>
          <Link href="/products" className="text-sm hover:text-gold-200">Shop</Link>
          <Link href="/reviews" className="text-sm hover:text-gold-200">Reviews</Link>
          <Link href="/contact" className="text-sm hover:text-gold-200">Contact</Link>
          {role === 'CUSTOMER' && (
            <Link href="/account" className="text-sm hover:text-gold-200">Account</Link>
          )}
          {(role === 'ADMIN' || role === 'STAFF') && (
            <Link href="/admin" className="text-sm text-gold-200 hover:text-gold-200">
              Dashboard
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          <form
            action="/products"
            method="GET"
            className="hidden items-center rounded-full border border-black/10 bg-white/60 px-3 py-2 md:flex"
          >
            <Search size={16} className="text-[#6f6256]" />
            <input
              name="q"
              placeholder="Search by name or brand"
              className="ml-2 bg-transparent text-sm text-[#1f1b16] placeholder:text-[#6f6256] outline-none"
            />
          </form>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-full border border-black/10 p-2 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Link href="/cart" className="rounded-full border border-black/10 p-2 hover:border-gold-400">
            <ShoppingBag size={18} />
          </Link>
          <Link
            href={
              role === 'ADMIN' || role === 'STAFF'
                ? '/admin'
                : role
                  ? '/account'
                  : '/login'
            }
            className="rounded-full border border-black/10 p-2 hover:border-gold-400"
          >
            <User size={18} />
          </Link>
        </div>
      </div>
      <div
        className={`md:hidden ${menuOpen ? 'block' : 'hidden'} border-t border-black/10 bg-white/90 px-6 py-4`}
      >
        <form
          action="/products"
          method="GET"
          className="flex items-center rounded-full border border-black/10 bg-white/60 px-3 py-2"
        >
          <Search size={16} className="text-[#6f6256]" />
          <input
            name="q"
            placeholder="Search by name or brand"
            className="ml-2 w-full bg-transparent text-sm text-[#1f1b16] placeholder:text-[#6f6256] outline-none"
          />
        </form>
        <div className="mt-4 grid gap-3 text-sm">
          <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-gold-200">Home</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="hover:text-gold-200">About</Link>
          <Link href="/products" onClick={() => setMenuOpen(false)} className="hover:text-gold-200">Shop</Link>
          <Link href="/reviews" onClick={() => setMenuOpen(false)} className="hover:text-gold-200">Reviews</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="hover:text-gold-200">Contact</Link>
          {role === 'CUSTOMER' && (
            <Link href="/account" onClick={() => setMenuOpen(false)} className="hover:text-gold-200">
              Account
            </Link>
          )}
          {(role === 'ADMIN' || role === 'STAFF') && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="text-gold-200 hover:text-gold-200"
            >
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
