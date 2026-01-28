'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    google?: any;
  }
}

type GoogleOneTapProps = {
  onCredential: (idToken: string) => void;
};

export function GoogleOneTap({ onCredential }: GoogleOneTapProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const [ready, setReady] = useState(false);

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
    if (!ready || !clientId || !window.google?.accounts?.id) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: any) => {
        if (response?.credential) {
          onCredential(response.credential);
        }
      },
    });
    window.google.accounts.id.prompt();
  }, [ready, clientId, onCredential]);

  return null;
}
