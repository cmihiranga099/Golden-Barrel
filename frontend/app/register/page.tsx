'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '../../components/ui/ToastProvider';
import { apiPost } from '../../lib/api';
import { setRoleFromToken, setTokens } from '../../lib/auth';

export default function RegisterPage() {
  const [dob, setDob] = useState('');
  const { push } = useToast();
  const legalAge = Number(process.env.NEXT_PUBLIC_LEGAL_AGE || 21);

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

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="glass rounded-2xl p-8">
        <h1 className="display text-2xl text-gold-200">Create Account</h1>
        <div className="mt-6 grid gap-4">
          <input
            className="rounded-md bg-black/40 p-3"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <input
            className="rounded-md bg-black/40 p-3"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <button
            className="rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-black"
            onClick={handleRegister}
          >
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
