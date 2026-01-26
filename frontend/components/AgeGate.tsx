'use client';

import { useEffect, useState } from 'react';

export function AgeGate() {
  const [open, setOpen] = useState(false);
  const legalAge = Number(process.env.NEXT_PUBLIC_LEGAL_AGE || 21);

  useEffect(() => {
    const confirmed = localStorage.getItem('gb_age_gate');
    if (!confirmed) {
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="glass gradient-border max-w-md rounded-2xl p-8 text-center shadow-glow">
        <h2 className="display text-3xl">Age Verification</h2>
        <p className="mt-3 text-sm text-[#4f4338]">
          By entering Golden Barrel, you confirm you are at least {legalAge} years old or the legal
          drinking age in your country.
        </p>
        <button
          className="mt-6 w-full rounded-full bg-gold-500 px-6 py-3 font-semibold text-black hover:bg-gold-400"
          onClick={() => {
            localStorage.setItem('gb_age_gate', 'true');
            setOpen(false);
          }}
        >
          I confirm I am {legalAge}+
        </button>
        <p className="mt-4 text-xs text-[#6f6256]">Please drink responsibly.</p>
      </div>
    </div>
  );
}
