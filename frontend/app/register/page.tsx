'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '../../components/ui/ToastProvider';
import { apiPost } from '../../lib/api';
import { setRoleFromToken, setTokens } from '../../lib/auth';
import { GoogleOneTap } from '../../components/ui/GoogleOneTap';
import { GoogleSignInButton } from '../../components/ui/GoogleSignInButton';

export default function RegisterPage() {
  const [dob, setDob] = useState('');
  const { push } = useToast();
  const legalAge = Number(process.env.NEXT_PUBLIC_LEGAL_AGE || 21);
  const router = useRouter();
  const [googlePendingToken, setGooglePendingToken] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!dob) {
      push('Please provide your date of birth.');
      return;
    }
    const birth = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    const adjustedAge = m < 0 || (m === 0 && today.getDate() < birth.getDate()) ? age - 1 : age;
    if (adjustedAge < legalAge) {
      push('You must be of legal drinking age to create an account.');
      return;
    }
    try {
      const data = await apiPost<{ accessToken: string; refreshToken: string }>('/auth/register', {
        name,
        email,
        password,
        dob,
      });
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      setRoleFromToken(data.accessToken);
      push('Account created.');
    } catch {
      push('Registration failed. Check your info.');
    }
  };

  const handleGoogle = async (idToken: string) => {
    if (!dob) {
      setGooglePendingToken(idToken);
      push('Please provide your date of birth for Google sign-in.');
      return;
    }
    try {
      const data = await apiPost<{ accessToken: string; refreshToken: string }>('/auth/google', {
        idToken,
        dob,
      });
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      setRoleFromToken(data.accessToken);
      push('Signed in with Google.');
      router.push('/');
    } catch {
      push('Google sign-in failed. Please try again.');
    }
  };

  const submitGoogleDob = async () => {
    if (!googlePendingToken || !dob) {
      push('Please provide your date of birth.');
      return;
    }
    await handleGoogle(googlePendingToken);
    setGooglePendingToken(null);
  };

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-5xl items-center gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[0.9fr,1.1fr]">
      <GoogleOneTap onCredential={handleGoogle} />
      <div className="glass rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Create Account</p>
            <h2 className="display mt-2 text-2xl text-gold-200">Join Golden Barrel</h2>
          </div>
          <span className="rounded-full border border-gold-400/40 bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-gold-200">
            21+
          </span>
        </div>

        <div className="mt-6 grid gap-4">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#6f6256]">Full name</label>
            <input
              className="mt-2 w-full rounded-xl border border-black/10 bg-white/70 p-3 text-sm outline-none transition focus:border-gold-400"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
              placeholder="Create a strong password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#6f6256]">Date of birth</label>
            <input
              className="mt-2 w-full rounded-xl border border-black/10 bg-white/70 p-3 text-sm outline-none transition focus:border-gold-400"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <button
            className="w-full rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-black shadow-glow"
            onClick={handleRegister}
          >
            Create Account
          </button>
        </div>
        <div className="mt-6 border-t border-black/10 pt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6f6256]">Or continue with</p>
          <div className="mt-4">
            <GoogleSignInButton onCredential={handleGoogle} />
          </div>
        </div>
        <p className="mt-4 text-xs text-[#6f6256]">
          Already have an account? <Link href="/login" className="text-gold-200">Sign in</Link>
        </p>
      </div>

      <div className="hidden lg:block">
        <div className="glass relative overflow-hidden rounded-3xl p-10">
          <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-gold-400/20 blur-3xl" />
          <p className="text-xs uppercase tracking-[0.4em] text-[#6f6256]">Membership</p>
          <h1 className="display mt-4 text-4xl text-gold-200">Premium Access</h1>
          <p className="mt-4 text-sm text-[#4f4338]">
            Build your collection with handpicked bottles, tasting notes, and limited drops.
          </p>
          <div className="mt-6 grid gap-3 text-xs text-[#6f6256]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gold-400" />
              Personalized recommendations.
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gold-400" />
              Priority restock alerts.
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gold-400" />
              Curated collections every month.
            </div>
          </div>
        </div>
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
              value={dob}
              onChange={(e) => setDob(e.target.value)}
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
