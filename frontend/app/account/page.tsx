'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { clearTokens } from '../../lib/auth';
import { useToast } from '../../components/ui/ToastProvider';
import { fetchProfile, updateProfile, UserProfile } from '../../lib/profile';

export default function AccountPage() {
  const { push } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        setProfile(data);
        setName(data.name || '');
        setPhone(data.phone || '');
      })
      .catch(() => {
        push('Please sign in to view your profile.');
      });
  }, [push]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
      <div className="rounded-3xl border border-gold-400/20 bg-night-900/95 p-6 shadow-lg sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b7a590]">Account</p>
        <h1 className="display mt-2 text-3xl text-gold-200">Profile Settings</h1>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gold-400/20 bg-night-800/90 p-6 shadow-md">
          <h2 className="display text-xl text-gold-200">Profile</h2>
          <div className="mt-4 grid gap-3">
            <input
              className="rounded-md border border-white/10 bg-night-900/80 p-3 text-[#d8c9b6] placeholder:text-[#8f7f6f]"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="rounded-md border border-white/10 bg-night-900/80 p-3 text-[#d8c9b6] placeholder:text-[#8f7f6f]"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button
            className="mt-4 w-full rounded-full border border-gold-400 px-4 py-2 text-sm text-gold-200 sm:w-auto"
            onClick={async () => {
              try {
                const updated = await updateProfile({ name, phone });
                setProfile(updated);
                push('Profile updated.');
              } catch {
                push('Update failed. Please sign in.');
              }
            }}
          >
            Update Profile
          </button>
          <button
            className="mt-3 w-full rounded-full border border-white/10 px-4 py-2 text-sm text-[#b7a590] sm:w-auto"
            onClick={() => {
              clearTokens();
              push('Signed out.');
            }}
          >
            Sign Out
          </button>
        </div>
        <div className="rounded-2xl border border-gold-400/20 bg-night-800/90 p-6 shadow-md">
          <h2 className="display text-xl text-gold-200">Quick Links</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <Link href="/customer/dashboard" className="text-gold-200">Customer Dashboard</Link>
            <Link href="/account/orders" className="text-gold-200">Order History</Link>
            <Link href="/account/wishlist" className="text-gold-200">Wishlist</Link>
            <Link href="/account/addresses" className="text-gold-200">Address Book</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
