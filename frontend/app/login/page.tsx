'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../components/ui/ToastProvider';
import { apiPost } from '../../lib/api';
import { decodeJwt, getTokens, setRoleFromToken, setTokens } from '../../lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const { push } = useToast();
  const router = useRouter();

  const [password, setPassword] = useState('');

  useEffect(() => {
    const tokens = getTokens();
    if (!tokens?.accessToken) return;
    const payload = decodeJwt(tokens.accessToken);
    if (payload?.role === 'ADMIN' || payload?.role === 'STAFF') {
      router.replace('/admin');
    } else {
      router.replace('/');
    }
  }, [router]);

  const handleLogin = async () => {
    try {
      const data = await apiPost<{ accessToken: string; refreshToken: string }>('/auth/login', {
        email,
        password,
      });
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      setRoleFromToken(data.accessToken);
      push('Signed in.');
      const payload = decodeJwt(data.accessToken);
      if (payload?.role === 'ADMIN' || payload?.role === 'STAFF') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch {
      push('Login failed. Check your credentials.');
    }
  };

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-5xl items-center gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[1.1fr,0.9fr]">
      <div className="hidden lg:block">
        <div className="glass relative overflow-hidden rounded-3xl p-10">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold-400/20 blur-3xl" />
          <p className="text-xs uppercase tracking-[0.4em] text-[#6f6256]">Golden Barrel</p>
          <h1 className="display mt-4 text-4xl text-gold-200">Welcome Back</h1>
          <p className="mt-4 text-sm text-[#4f4338]">
            Sign in to manage orders, track shipments, and unlock curated recommendations.
          </p>
          <div className="mt-6 grid gap-3 text-xs text-[#6f6256]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gold-400" />
              Premium spirits, curated daily.
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gold-400" />
              Secure checkout with Stripe or COD.
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gold-400" />
              Exclusive offers for members.
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Sign In</p>
            <h2 className="display mt-2 text-2xl text-gold-200">Account Access</h2>
          </div>
          <span className="rounded-full border border-gold-400/40 bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-gold-200">
            Secure
          </span>
        </div>

        <div className="mt-6 grid gap-4">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#6f6256]">Email</label>
            <input
              className="mt-2 w-full rounded-xl border border-black/10 bg-white/70 p-3 text-sm outline-none transition focus:border-gold-400"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#6f6256]">Password</label>
            <input
              className="mt-2 w-full rounded-xl border border-black/10 bg-white/70 p-3 text-sm outline-none transition focus:border-gold-400"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="w-full rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-black shadow-glow"
            onClick={handleLogin}
          >
            Sign In
          </button>
        </div>
        <p className="mt-4 text-xs text-[#6f6256]">
          New here? <Link href="/register" className="text-gold-200">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
