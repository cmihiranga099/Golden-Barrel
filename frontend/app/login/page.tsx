'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="glass rounded-2xl p-8">
        <h1 className="display text-2xl text-gold-200">Welcome Back</h1>
        <div className="mt-6 grid gap-4">
          <input className="rounded-md bg-black/40 p-3" placeholder="Email" />
          <input className="rounded-md bg-black/40 p-3" placeholder="Password" type="password" />
          <button className="rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-black">
            Sign In
          </button>
        </div>
        <p className="mt-4 text-xs text-[#8c8378]">
          New here? <Link href="/register" className="text-gold-200">Create an account</Link>
        </p>
      </div>
    </div>
  );
}