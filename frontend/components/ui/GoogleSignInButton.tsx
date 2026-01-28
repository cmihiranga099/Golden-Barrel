'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google?: any;
  }
}

type GoogleSignInButtonProps = {
  onCredential: (idToken: string) => void;
};

export function GoogleSignInButton({ onCredential }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    if (!clientId) return;
    const existing = document.getElementById('google-identity');
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.id = 'google-identity';
      script.onload = () => setReady(true);
      document.head.appendChild(script);
    } else {
      setReady(true);
    }
  }, [clientId]);

  useEffect(() => {
    if (!ready || !clientId || !buttonRef.current || !window.google?.accounts?.id) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: any) => {
        if (response?.credential) {
          onCredential(response.credential);
        }
      },
    });
    buttonRef.current.innerHTML = '';
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      width: 280,
      text: 'continue_with',
    });
  }, [ready, clientId, onCredential]);

  if (!clientId) {
    return (
      <div className="rounded-xl border border-black/10 bg-white/70 p-3 text-xs text-[#6f6256]">
        Google sign-in not configured.
      </div>
    );
  }

  return <div ref={buttonRef} className="flex justify-center" />;
}
