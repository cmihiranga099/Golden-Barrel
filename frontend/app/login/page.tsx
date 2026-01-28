'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../components/ui/ToastProvider';
import { apiPost } from '../../lib/api';
import { decodeJwt, getTokens, setRoleFromToken, setTokens } from '../../lib/auth';
import { GoogleOneTap } from '../../components/ui/GoogleOneTap';
import { GoogleSignInButton } from '../../components/ui/GoogleSignInButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const { push } = useToast();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [googleDob, setGoogleDob] = useState('');
  const [googlePendingToken, setGooglePendingToken] = useState<string | null>(null);

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

  const handleGoogle = async (idToken: string) => {
    try {
      const data = await apiPost<{ accessToken: string; refreshToken: string }>('/auth/google', {
        idToken,
        dob: googleDob || undefined,
      });
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      setRoleFromToken(data.accessToken);
      push('Signed in with Google.');
      const payload = decodeJwt(data.accessToken);
      if (payload?.role === 'ADMIN' || payload?.role === 'STAFF') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch {
      setGooglePendingToken(idToken);
      push('First-time Google sign-in needs your date of birth.');
    }
  };

  const submitGoogleDob = async () => {
    if (!googlePendingToken || !googleDob) {
      push('Please add your date of birth.');
      return;
    }
    try {
      const data = await apiPost<{ accessToken: string; refreshToken: string }>('/auth/google', {
        idToken: googlePendingToken,
        dob: googleDob,
      });
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      setRoleFromToken(data.accessToken);
      setGooglePendingToken(null);
      push('Signed in with Google.');
      const payload = decodeJwt(data.accessToken);
      if (payload?.role === 'ADMIN' || payload?.role === 'STAFF') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch {
      push('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-5xl items-center gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[1.1fr,0.9fr]">
      <GoogleOneTap onCredential={handleGoogle} />
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
        <div className="mt-6 border-t border-black/10 pt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6f6256]">Or continue with</p>
          <div className="mt-4">
            <GoogleSignInButton onCredential={handleGoogle} />
          </div>
        </div>
        <p className="mt-4 text-xs text-[#6f6256]">
          New here? <Link href="/register" className="text-gold-200">Create an account</Link>
        </p>
      </div>
      {googlePendingToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="glass w-full max-w-sm rounded-2xl p-6">
            <h3 className="display text-xl text-gold-200">Confirm Age</h3>
            <p className="mt-2 text-sm text-[#6f6256]">
              First-time Google sign-in requires your date of birth.
            </p>
            <input
              className="mt-4 w-full rounded-xl border border-black/10 bg-white/70 p-3 text-sm outline-none transition focus:border-gold-400"
              type="date"
              value={googleDob}
              onChange={(e) => setGoogleDob(e.target.value)}
            />
            <div className="mt-4 flex gap-2">
              <button
                className="flex-1 rounded-full border border-black/10 px-4 py-2 text-sm text-[#6f6256]"
                onClick={() => setGooglePendingToken(null)}
              >
                Cancel
              </button>
              <button
                className="flex-1 rounded-full bg-gold-500 px-4 py-2 text-sm font-semibold text-black"
                onClick={submitGoogleDob}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
