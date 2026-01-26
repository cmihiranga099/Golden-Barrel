'use client';

import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="glass rounded-2xl p-8">
        <h1 className="display text-2xl text-gold-200">Create Account</h1>
        <div className="mt-6 grid gap-4">
          <input className="rounded-md bg-black/40 p-3" placeholder="Full name" />
          <input className="rounded-md bg-black/40 p-3" placeholder="Email" />
          <input className="rounded-md bg-black/40 p-3" placeholder="Password" type="password" />
          <input className="rounded-md bg-black/40 p-3" type="date" />
          <button className="rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-black">
            Create Account
          </button>
        </div>
        <p className="mt-4 text-xs text-[#8c8378]">
          Already have an account? <Link href="/login" className="text-gold-200">Sign in</Link>
        </p>
      </div>
    </div>
  );
}