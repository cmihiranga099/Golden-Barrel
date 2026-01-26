'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('gb_role');
    setAllowed(role === 'ADMIN' || role === 'STAFF');
  }, []);

  if (!allowed) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <p className="text-sm text-[#8c8378]">Admin access required.</p>
        <Link href="/login" className="text-sm text-gold-200">Sign in</Link>
      </div>
    );
  }

  return <>{children}</>;
}