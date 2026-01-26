import Link from 'next/link';
import { ShoppingBag, User, Search } from 'lucide-react';

export function Navbar() {
  return (
    <header className="fixed top-0 z-40 w-full border-b border-white/5 bg-black/40 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="display text-2xl text-gold-200">
          Golden Barrel
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/products" className="text-sm hover:text-gold-200">Shop</Link>
          <Link href="/products?category=whisky" className="text-sm hover:text-gold-200">Whisky</Link>
          <Link href="/products?category=wine" className="text-sm hover:text-gold-200">Wine</Link>
          <Link href="/account" className="text-sm hover:text-gold-200">Account</Link>
        </div>
        <div className="flex items-center gap-4">
          <form
            action="/products"
            method="GET"
            className="hidden items-center rounded-full border border-white/10 bg-black/30 px-3 py-2 md:flex"
          >
            <Search size={16} className="text-[#8c8378]" />
            <input
              name="q"
              placeholder="Search by name or brand"
              className="ml-2 bg-transparent text-sm text-white placeholder:text-[#8c8378] outline-none"
            />
          </form>
          <Link href="/cart" className="rounded-full border border-white/10 p-2 hover:border-gold-400">
            <ShoppingBag size={18} />
          </Link>
          <Link href="/login" className="rounded-full border border-white/10 p-2 hover:border-gold-400">
            <User size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
