'use client';

import { useEffect, useState } from 'react';
import { fetchProfile, updateProfile, Address } from '../../../lib/profile';
import { useToast } from '../../../components/ui/ToastProvider';

export default function AddressBookPage() {
  const { push } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [draft, setDraft] = useState<Address>({
    label: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false,
  });

  useEffect(() => {
    fetchProfile()
      .then((data) => setAddresses(data.addresses || []))
      .catch(() => push('Please sign in to manage addresses.'));
  }, [push]);

  const saveAddresses = async (next: Address[]) => {
    const updated = await updateProfile({ addresses: next });
    setAddresses(updated.addresses || []);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="display text-3xl">Address Book</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h2 className="display text-xl text-gold-200">Saved Addresses</h2>
          <div className="mt-4 space-y-3 text-sm">
            {addresses.map((addr, idx) => (
              <div key={idx} className="rounded-xl border border-black/10 p-3">
                <p className="text-gold-200">{addr.label || 'Address'}</p>
                <p className="text-[#4f4338]">{addr.line1}</p>
                <p className="text-[#6f6256]">
                  {addr.city}, {addr.state} {addr.postalCode}
                </p>
                <button
                  className="mt-2 text-xs text-[#6f6256]"
                  onClick={() => {
                    const next = addresses.filter((_, i) => i !== idx);
                    saveAddresses(next).catch(() => push('Failed to remove address.'));
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            {addresses.length === 0 && (
              <p className="text-[#6f6256]">No addresses saved.</p>
            )}
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="display text-xl text-gold-200">Add Address</h2>
          <div className="mt-4 grid gap-3">
            <input
              className="rounded-md bg-white/70 p-3 text-sm"
              placeholder="Label"
              value={draft.label}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
            />
            <input
              className="rounded-md bg-white/70 p-3 text-sm"
              placeholder="Street address"
              value={draft.line1}
              onChange={(e) => setDraft({ ...draft, line1: e.target.value })}
            />
            <input
              className="rounded-md bg-white/70 p-3 text-sm"
              placeholder="City"
              value={draft.city}
              onChange={(e) => setDraft({ ...draft, city: e.target.value })}
            />
            <input
              className="rounded-md bg-white/70 p-3 text-sm"
              placeholder="State"
              value={draft.state}
              onChange={(e) => setDraft({ ...draft, state: e.target.value })}
            />
            <input
              className="rounded-md bg-white/70 p-3 text-sm"
              placeholder="Postal code"
              value={draft.postalCode}
              onChange={(e) => setDraft({ ...draft, postalCode: e.target.value })}
            />
            <input
              className="rounded-md bg-white/70 p-3 text-sm"
              placeholder="Country"
              value={draft.country}
              onChange={(e) => setDraft({ ...draft, country: e.target.value })}
            />
            <button
              className="rounded-full border border-gold-400 px-4 py-2 text-sm text-gold-200"
              onClick={() => {
                const next = [...addresses, draft];
                saveAddresses(next)
                  .then(() => {
                    push('Address saved.');
                    setDraft({
                      label: '',
                      line1: '',
                      line2: '',
                      city: '',
                      state: '',
                      postalCode: '',
                      country: '',
                      isDefault: false,
                    });
                  })
                  .catch(() => push('Failed to save address.'));
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
