'use client';

import Link from 'next/link';
import { clearTokens } from '../../lib/auth';
import { useToast } from '../../components/ui/ToastProvider';

export default function AccountPage() {
  const { push } = useToast();
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="display text-3xl">My Account</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h2 className="display text-xl text-gold-200">Profile</h2>
          <div className="mt-4 grid gap-3">
            <input className="rounded-md bg-black/40 p-3" placeholder="Name" />
            <input className="rounded-md bg-black/40 p-3" placeholder="Phone" />
          </div>
          <button className="mt-4 rounded-full border border-gold-400 px-4 py-2 text-sm text-gold-200">
            Update Profile
          </button>
          <button
            className="mt-3 rounded-full border border-white/10 px-4 py-2 text-sm text-[#8c8378]"
            onClick={() => {
              clearTokens();
              push('Signed out.');
            }}
          >
            Sign Out
          </button>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="display text-xl text-gold-200">Quick Links</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <Link href="/account/orders" className="text-gold-200">Order History</Link>
            <Link href="/account/wishlist" className="text-gold-200">Wishlist</Link>
            <span className="text-[#8c8378]">Address Book (coming soon)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
