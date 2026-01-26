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
            <span className="text-[#8c8378]">Address Book</span>
          </div>
          <div className="mt-4 grid gap-2">
            <input
              className="rounded-md bg-black/40 p-3 text-sm"
              placeholder="Address label"
              value={address.label}
              onChange={(e) => setAddress({ ...address, label: e.target.value })}
            />
            <input
              className="rounded-md bg-black/40 p-3 text-sm"
              placeholder="Street address"
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
            />
            <input
              className="rounded-md bg-black/40 p-3 text-sm"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
            <input
              className="rounded-md bg-black/40 p-3 text-sm"
              placeholder="State"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
            />
            <input
              className="rounded-md bg-black/40 p-3 text-sm"
              placeholder="Postal code"
              value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
            />
            <input
              className="rounded-md bg-black/40 p-3 text-sm"
              placeholder="Country"
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
            />
            <button
              className="mt-2 rounded-full border border-gold-400 px-4 py-2 text-sm text-gold-200"
              onClick={async () => {
                try {
                  const updated = await updateProfile({ addresses: [address] });
                  setProfile(updated);
                  push('Address saved.');
                } catch {
                  push('Failed to save address.');
                }
              }}
            >
              Save Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
