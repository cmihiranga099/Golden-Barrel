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
  const [address, setAddress] = useState({
    label: 'Home',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: true,
  });

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        setProfile(data);
        setName(data.name || '');
        setPhone(data.phone || '');
        const first = data.addresses?.[0];
        if (first) {
          setAddress({ ...address, ...first });
        }
      })
      .catch(() => {
        push('Please sign in to view your profile.');
      });
  }, [push]);
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="display text-3xl">My Account</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h2 className="display text-xl text-gold-200">Profile</h2>
          <div className="mt-4 grid gap-3">
            <input
              className="rounded-md bg-black/40 p-3"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="rounded-md bg-black/40 p-3"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button
            className="mt-4 rounded-full border border-gold-400 px-4 py-2 text-sm text-gold-200"
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
            <Link href="/account/addresses" className="text-gold-200">Address Book</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
