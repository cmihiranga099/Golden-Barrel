'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '../../components/ui/ToastProvider';
import { apiPost } from '../../lib/api';
import { setRoleFromToken, setTokens } from '../../lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const { push } = useToast();

  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const data = await apiPost<{ accessToken: string; refreshToken: string }>('/auth/login', {
        email,
        password,
      });
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      setRoleFromToken(data.accessToken);
      push('Signed in.');
    } catch {
      push('Login failed. Check your credentials.');
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="glass rounded-2xl p-8">
        <h1 className="display text-2xl text-gold-200">Welcome Back</h1>
        <div className="mt-6 grid gap-4">
          <input
            className="rounded-md bg-black/40 p-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="rounded-md bg-black/40 p-3"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-black"
            onClick={handleLogin}
          >
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
