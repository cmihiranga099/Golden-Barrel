'use client';

import { useEffect, useState } from 'react';
import { decodeJwt, getTokens } from '../../lib/auth';
import Link from 'next/link';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('gb_role');
    if (role === 'ADMIN' || role === 'STAFF') {
      setAllowed(true);
      return;
    }
    const tokens = getTokens();
    const payload = tokens?.accessToken ? decodeJwt(tokens.accessToken) : null;
    setAllowed(payload?.role === 'ADMIN' || payload?.role === 'STAFF');
  }, []);

  if (!allowed) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <p className="text-sm text-[#6f6256]">Admin access required.</p>
        <Link href="/login" className="text-sm text-gold-200">Sign in</Link>
      </div>
    );
  }

  return <>{children}</>;
}
